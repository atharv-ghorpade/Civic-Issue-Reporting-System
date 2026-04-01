import uuid
from datetime import datetime

def generate_unique_filename(filename: str) -> str:
    extension = filename.split(".")[-1]
    unique_name = f"{uuid.uuid4().hex}_{int(datetime.now().timestamp())}.{extension}"
    return unique_name

def format_datetime(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d %H:%M:%S")
