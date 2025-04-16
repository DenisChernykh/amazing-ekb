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

    # Очистка и подготовка
    if output_file.exists():
        output_file.unlink()
        logger.info(f"Удален старый файл {output_file}")

    output_dir.mkdir(exist_ok=True)
    images_dir.mkdir(parents=True, exist_ok=True)

    # Инициализация клиента
    client = TelegramClient('tg_session', api_id, api_hash)
    await client.start()

    me = await client.get_me()
    logger.info(f"Авторизованы как: {me.first_name}")

    channel = await client.get_entity("tanya_strelchuk_blog")
    messages = await client.get_messages(channel, limit=128)

    groups = defaultdict(list)
    result = []

    for msg in messages:
        key = msg.grouped_id or msg.id
        groups[key].append(msg)

    for group in groups.values():
        main_msg = next((msg for msg in group if msg.text), None)
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
                image_paths.append(f"{image_filename}")

        # Если вообще нет текста, но есть фотки — всё равно добавим
        if main_msg or image_paths:
            simplified = {
                "id": main_msg.id if main_msg else group[0].id,
                "date": (main_msg.date if main_msg else group[0].date).isoformat(),
                "text": clean_text(main_msg.text) if main_msg else "[пусто]",
                "postLink": message_link,
                "images": image_paths
            }

            print(simplified)
            result.append(simplified)

    # Сохраняем в файл
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    logger.info(f"Данные сохранены в {output_file}")
    await client.disconnect()

if __name__ == "__main__":
    asyncio.run(main())