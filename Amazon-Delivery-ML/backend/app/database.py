import sqlite3
from datetime import datetime
from pathlib import Path
import json

from .config import HISTORY_DB_PATH


def _get_conn() -> sqlite3.Connection:
    Path(HISTORY_DB_PATH).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(HISTORY_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = _get_conn()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS prediction_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            created_at TEXT NOT NULL,
            request_payload TEXT NOT NULL,
            prediction_label TEXT NOT NULL,
            prediction_id INTEGER NOT NULL,
            confidence REAL NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


def insert_history(
    username: str,
    request_payload: dict,
    prediction_label: str,
    prediction_id: int,
    confidence: float,
) -> None:
    conn = _get_conn()
    conn.execute(
        """
        INSERT INTO prediction_history
        (username, created_at, request_payload, prediction_label, prediction_id, confidence)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            username,
            datetime.utcnow().isoformat(),
            json.dumps(request_payload),
            prediction_label,
            prediction_id,
            confidence,
        ),
    )
    conn.commit()
    conn.close()


def fetch_history(limit: int = 100) -> list[dict]:
    conn = _get_conn()
    rows = conn.execute(
        """
        SELECT id, username, created_at, request_payload, prediction_label, prediction_id, confidence
        FROM prediction_history
        ORDER BY id DESC
        LIMIT ?
        """,
        (limit,),
    ).fetchall()
    conn.close()

    output = []
    for row in rows:
        output.append(
            {
                "id": row["id"],
                "username": row["username"],
                "created_at": row["created_at"],
                "request_payload": json.loads(row["request_payload"]),
                "prediction_label": row["prediction_label"],
                "prediction_id": row["prediction_id"],
                "confidence": row["confidence"],
            }
        )
    return output
