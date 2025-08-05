from fastapi import APIRouter, Query
from src.services.api import google_books
from src.schemas.gbooks import GBookSearchResponse

router = APIRouter(tags=['API'])

@router.get("/search-google-books", response_model=GBookSearchResponse)
async def search(q: str = Query()):
    response = await google_books(q)
    return response