import uvicorn
from src.core.config import CONFIG
from src.app import create_app

title = "Gestor de biblioteca LandOfBooks."
summary = "API para las operaciones de LandOfBooks."
description = """
Backend de LandOfBooks desarrollado con FastAPI y sqlmodel.
"""

info = {
    "title": title,
    "summary": summary,
    "description": description
}

app = create_app(info)

config = {
        'app': 'main:app',
        'port': int(CONFIG.PORT)
    }

if __name__ == "__main__":
    if CONFIG.ENVIRONMENT == 'dev':
        config.update({
            "ssl_keyfile": CONFIG._CERT_KEY,
            "ssl_certfile": CONFIG._CERT_FILE
        })
    else: 
        config.update({
            'host': '0.0.0.0'
        })
    uvicorn.run(**config)