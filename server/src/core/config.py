from decouple import config

class Config:
    __instance = None

    PORT: int = config("PORT", cast=int)
    SECRET_KEY: str = config("SECRET_KEY")
    DB_URL: str = config("DB_URL_DEV")
    CLIENT_URL: str = config("CLIENT_URL")
    CIPHER_KEY: str = config("CIPHER_KEY")

    RECAPTCHA_SECRET_KEY: str = config("RECAPTCHA_SECRET_KEY")

    SMTP_SERVER: str = config("SMTP_SERVER")
    SMTP_PORT: int = config("SMTP_PORT")
    EMAIL_USER: str = config("EMAIL_USER")
    EMAIL_PASSWORD: str = config("EMAIL_PASSWORD")


    def __new__(cls):
        if Config.__instance is None:
            cls.__instance = super().__new__(cls)
        return cls.__instance
    
    def __setattr__(self, key, value):
        if hasattr(self, key):
            raise AttributeError(f"El atributo '{key}' no puede ser modificado")
        super().__setattr__(key, value)
    
CONFIG = Config()