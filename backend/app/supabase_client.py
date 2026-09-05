import os
import threading

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

_thread_local = threading.local()


def get_supabase_client() -> Client:
    client = getattr(_thread_local, "client", None)
    if client is None:
        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        client = create_client(url, key)
        _thread_local.client = client
    return client
