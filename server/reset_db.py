import time
from sqlalchemy import text
from app.core.database import engine, Base
import app.models

print("Dropping active connections...")
with engine.connect() as conn:
    conn.execute(text("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'civic-issues' AND pid <> pg_backend_pid();"))
    conn.commit()
    time.sleep(1)

print("Dropping schema...")
with engine.connect() as conn:
    conn.execute(text("DROP SCHEMA public CASCADE;"))
    conn.execute(text("CREATE SCHEMA public;"))
    conn.execute(text("GRANT ALL ON SCHEMA public TO postgres;"))
    conn.execute(text("GRANT ALL ON SCHEMA public TO public;"))
    conn.commit()

print("Recreating tables...")
Base.metadata.create_all(bind=engine)
print("Done!")
