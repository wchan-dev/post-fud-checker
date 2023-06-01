# config.py

import os
from dotenv import load_dotenv
from pathlib import Path


dotenv_path = Path("app/dotenv.env")
load_dotenv(dotenv_path=dotenv_path)

# Reddit OAUTH
CLIENT_ID = os.getenv("OAUTH_ID")
CLIENT_SECRET = os.getenv("SECRET")
PRAW_USERNAME = os.getenv("USERNAME")
PRAW_PASSWORD = os.getenv("PASSWORD")
USER_AGENT = "testscript from u/soejun-go"

DATABASE_URL = os.getenv("DATABASE_URL")
