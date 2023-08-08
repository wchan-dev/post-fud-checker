from app import create_app
from app.models.mongo_manager import MongoManager

app = create_app()


MongoManager.get_client()
MongoManager.get_database("sentiment_db_v1")


if __name__ == "__main__":
    app.run(debug=True)
