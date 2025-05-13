# python3 scripts/loging.py для запуска скрипта
import asyncio
import logging
import os
import json
from pathlib import Path
from telethon import TelegramClient
from telethon.tl.types import MessageMediaPhoto
from dotenv import load_dotenv
from collections import defaultdict

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Загружаем переменные из .env
load_dotenv()

api_id = os.getenv("TG_API_ID")
api_hash = os.getenv("TG_API_HASH")

def clean_text(text):
    """Очищает текст от лишних переносов строк и пробелов"""
    if not text:
        return "[пусто]"
    return ' '.join(text.replace('\n', ' ').split())

async def main():
    # Пути
    output_dir = Path("scripts")
    output_file = output_dir / "messages.json"
    images_dir = Path("public") / "images"

    output_dir.mkdir(exist_ok=True)
    images_dir.mkdir(parents=True, exist_ok=True)

    # Загрузка существующих данных, если файл есть
    existing_data = []
    existing_ids = set()
    if output_file.exists():
        with open(output_file, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
            for msg in existing_data:
                existing_ids.add(msg['id'])
                # Добавим также ID всех изображений, если они есть
                if 'images' in msg:
                    for img in msg['images']:
                        try:
                            img_id = int(img.replace('.jpg', ''))
                            existing_ids.add(img_id)
                        except ValueError:
                            continue
        logger.info(f"Загружено {len(existing_data)} существующих сообщений")

    # Инициализация клиента
    client = TelegramClient('user_session', api_id, api_hash)
    await client.start()

    me = await client.get_me()
    logger.info(f"Авторизованы как: {me.first_name}")

    channel = await client.get_entity("tanya_strelchuk_blog")
    messages = await client.get_messages(channel, limit=128)

    groups = defaultdict(list)
    new_messages = []

    # Группируем сообщения
    for msg in messages:
        key = msg.grouped_id or msg.id
        groups[key].append(msg)

    # Обрабатываем только новые сообщения
    for group in groups.values():
        group_ids = {msg.id for msg in group}

        # Пропускаем группу, если хотя бы одно сообщение уже было сохранено
        if group_ids & existing_ids:
            continue

        main_msg = next((msg for msg in group if msg.text), None)
        group_id = main_msg.id if main_msg else group[0].id

        message_link = None
        if main_msg:
            message_link = f"https://t.me/c/{channel.id}/{main_msg.id}"

        # Список фото
        image_paths = []
        for msg in group:
            if msg.media and isinstance(msg.media, MessageMediaPhoto):
                image_filename = f"{msg.id}.jpg"
                image_full_path = images_dir / image_filename
                await client.download_media(msg.media, file=image_full_path)
                image_paths.append(image_filename)

        # Если вообще нет текста, но есть фотки — всё равно добавим
        if main_msg or image_paths:
            simplified = {
                "id": group_id,
                "date": (main_msg.date if main_msg else group[0].date).isoformat(),
                "text": clean_text(main_msg.text) if main_msg else "[пусто]",
                "postLink": message_link,
                "images": image_paths
            }

            logger.info(f"Добавлено новое сообщение ID: {group_id}")
            new_messages.append(simplified)

            # Добавим ID текущей группы в existing_ids, чтобы избежать повторов
            existing_ids.update(group_ids)

    # Объединяем старые и новые сообщения (новые в начало)
    if new_messages:
        updated_data = new_messages + existing_data
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, ensure_ascii=False, indent=2)
        logger.info(f"Добавлено {len(new_messages)} новых сообщений, всего {len(updated_data)}")
    else:
        logger.info("Новых сообщений не найдено")

    await client.disconnect()

if __name__ == "__main__":
    asyncio.run(main())