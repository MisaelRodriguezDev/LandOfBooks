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