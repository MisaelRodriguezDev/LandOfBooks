import random

def barcode_generator(prefix: str = "978", length: int = 13) -> str:
    """
    Genera un código de barras numérico tipo EAN-13 (sin validar el dígito de control).

    Args:
        prefix (str): prefix inicial del código, típicamente '978' para libros.
        length (int): length total del código. Por defecto, 13 (EAN-13).

    Returns:
        str: Código de barras generado como cadena.
    """
    if len(prefix) >= length:
        raise ValueError("El prefix es demasiado largo para la length total del código.")

    body = ''.join(str(random.randint(0, 9)) for _ in range(length - len(prefix)))
    return prefix + body

if __name__ == "__main__":
    print(barcode_generator())