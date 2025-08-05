from http.client import HTTPException
import httpx
from src.schemas.gbooks import GBookItem, GBookSearchResponse

GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"


async def google_books(q: str):
    params = {"q": q}

    async with httpx.AsyncClient() as client:
        response = await client.get(GOOGLE_BOOKS_API_URL, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Error al conectarse con Google Books API")

    data = response.json()
    books: list[GBookItem] = []

    for item in data.get("items", []):
        volume_info = item.get("volumeInfo", {})
        image_links = volume_info.get("imageLinks", {})

        books.append(GBookItem(
            title=volume_info.get("title"),
            authors=volume_info.get("authors"),
            published_date=volume_info.get("publishedDate"),
            description=volume_info.get("description"),
            info_link=volume_info.get("infoLink"),
            thumbnail=image_links.get("thumbnail")
        ))

    return GBookSearchResponse(
        totalItems=data.get("totalItems", 0),
        results=books
    )