from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from src.core.database import create_db_and_tables
from src.core.config import CONFIG
from src.exceptions.exceptions import ApiError
from src.libs.logger import logger
from src.api.v1.routes import users, auth, librarian, admin, api, books

def create_app(info: dict[str, str]) -> FastAPI:
    logger.info("Iniciando aplicación.")
    app = FastAPI(
        title=info.get("title"),
        summary=info.get("summary"),
        description=info.get("description")
    )

    create_db_and_tables()

    #Manejador de errores
    @app.exception_handler(ApiError)
    def my_error_handler(request: Request, exc: ApiError):
        if exc.status == 500:
            logger.critical(f"HTTP exception {exc.message}", extra={"status": exc.status, "error_message": exc.message})
        else:
            print(exc)
            logger.error(f"HTTP exception {exc.message}", extra={"status": exc.status, "error_message": exc.message})
        return JSONResponse(
            status_code=exc.status,
            content=exc.__dict__
        )
    
    #Middlewares
    app.add_middleware(
    CORSMiddleware,
    allow_origins=[CONFIG.CLIENT_URL],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
    @app.middleware("http")
    async def log_background_tasks(request: Request, call_next):
        response = await call_next(request)
        if hasattr(request.state, "background_tasks"):
            print(f"Tareas en segundo plano registradas: {request.state.background_tasks.tasks}")
        return response


    #Rutas
    api_router = APIRouter(prefix="/api")

    api_router.include_router(users.router)
    api_router.include_router(auth.router)
    api_router.include_router(librarian.router)
    api_router.include_router(admin.router)
    api_router.include_router(api.router)
    api_router.include_router(books.router)


    app.include_router(api_router)

    return app