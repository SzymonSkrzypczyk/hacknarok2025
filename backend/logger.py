import json
from pathlib import Path
import logging

LOG_FILE = Path(__file__).parent / "logs" / "api.log"
UVICORN_LOG_FILE = Path(__file__).parent / "logs" / "uvicorn.log"
LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

logger = logging.getLogger("uvicorn")
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())
# file handler
file_handler = logging.FileHandler(str(LOG_FILE))
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

logger.addHandler(file_handler)
logger.propagate = False

log_config = json.load((Path(__file__).parent / "logging_config.json").open("r", encoding="utf-8"))
