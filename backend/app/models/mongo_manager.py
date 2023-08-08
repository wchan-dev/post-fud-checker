from pymongo import MongoClient
import os
from dotenv import load_dotenv
from pathlib import Path


class MongoManager:
    _client = None

    @classmethod
    def get_client(cls):
        if cls._client is None:
            current_dir = Path(__file__).parent
            root_dir = current_dir.parent.parent
            env_path = root_dir / ".env"
            load_dotenv(dotenv_path=env_path)
            cls._client = MongoClient(
                host=os.environ.get("MONGO_HOST"),
                port=int(os.environ.get("MONGO_PORT")),
                username=os.environ.get("MONGO_USERNAME"),
                password=os.environ.get("MONGO_PASSWORD"),
                authSource="admin",
            )
        return cls._client

    @staticmethod
    def get_database(db_name):
        client = MongoManager.get_client()
        return client[db_name]
