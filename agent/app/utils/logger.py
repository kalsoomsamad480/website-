import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s [agent] %(message)s")


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
