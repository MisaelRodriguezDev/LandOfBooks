from pydantic import BaseModel, HttpUrl

class GBookItem(BaseModel):
    title: str | None
    authors: list[str] | None
    published_date: str | None
    description: str | None
    info_link: HttpUrl | None
    thumbnail: HttpUrl | None


class GBookSearchResponse(BaseModel):
    totalItems: int
    results: list[GBookItem]