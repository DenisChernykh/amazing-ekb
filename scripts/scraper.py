import asyncio
import logging
import os
from collections import defaultdict
from datetime import datetime
from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError
from dotenv import load_dotenv
import psycopg2

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Загружаем переменные из .env
load_dotenv()

# Настройки для подключения к Telegram
api_id = os.getenv("TG_API_ID")
api_hash = os.getenv("TG_API_HASH")

# Настройки для подключения к PostgreSQL
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# Функция для подключения к PostgreSQL
def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

# Функция для сохранения сообщения в БД
def save_message_to_db(message):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO "TelegramPost" (message_id, text, date, media_type)
            VALUES (%s, %s, %s, %s)
        """, (message["id"], message["text"], message["date"], message["media_type"]))

        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        logger.error(f"Ошибка при сохранении в БД: {repr(e)}")

# Основная асинхронная функция
async def main():
    client = None
    try:
        client = TelegramClient(
            session='tg_session',
            api_id=api_id,
            api_hash=api_hash,
            device_model="ChannelScraper",
            app_version="2.0",
            system_version="Linux",
            timeout=20,
            connection_retries=3
        )

        logger.info("Подключаемся к Telegram...")
        await client.connect()

        if not await client.is_user_authorized():
            logger.info("Требуется авторизация")
            phone = input("Введите номер телефона (+79XXXXXXXXX): ").strip()

            await client.send_code_request(phone)
            code = input("Введите код из SMS/Telegram: ").strip()

            try:
                await client.sign_in(phone=phone, code=code)
            except SessionPasswordNeededError:
                password = input("Введите пароль 2FA: ")
                await client.sign_in(password=password)

        me = await client.get_me()
        logger.info(f"Авторизованы как: {me.first_name}")

        # Получение канала
        target_channel = "tanya_strelchuk_blog"
        try:
            channel = await client.get_entity(target_channel)
            logger.info(f"Канал найден: {channel.title}")
        except Exception as e:
            logger.error(f"Ошибка поиска канала: {repr(e)}")
            return

        # Получение и группировка сообщений
        messages = await client.get_messages(channel, limit=20)
        print("\n" + "="*50 + "\nСырые данные сообщений:\n" + "="*50)
        groups = defaultdict(list)

        for msg in messages:
            key = msg.grouped_id if msg.grouped_id else msg.id
            groups[key].append(msg)

        # Обработка и вывод
        logger.info("\nПоследние 20 постов:")
        for idx, (group_id, group_msgs) in enumerate(groups.items(), 1):
            main_msg = group_msgs[0]
            media_types = set()
            text = ""

            # Сбор информации из группы сообщений
            for msg in group_msgs:
                if msg.text and not text:
                    text = msg.text
                if msg.photo:
                    media_types.add("📷 Фото")
                if msg.video:
                    media_types.add("🎥 Видео")
                if msg.document:
                    media_types.add("📎 Файл")

            # Форматирование данных
            media_type = " + ".join(media_types) if media_types else "📝 Текст"
            if len(group_msgs) > 1:
                media_type = f"📚 Альбом ({len(group_msgs)} элементов)"

            date = main_msg.date
            preview = text[:100] + "..." if text else "[нет текста]"

            # Сохраняем сообщение в БД
            save_message_to_db({
                "id": main_msg.id,
                "text": text,
                "date": date,
                "media_type": media_type
            })

            # Выводим информацию
            print(f"""
            [{idx}] {date}
            Тип: {media_type}
            Текст: {preview}
            Ссылка: https://t.me/c/{channel.id}/{main_msg.id}
            """)

    except Exception as e:
        logger.error(f"Ошибка: {repr(e)}", exc_info=True)
    finally:
        if client and client.is_connected():
            await client.disconnect()
            logger.info("Соединение закрыто")

# Запуск асинхронной функции
if __name__ == "__main__":
    asyncio.run(main())