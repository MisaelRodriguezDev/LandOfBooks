import re

def validate_password_rules(password: str):
    """Comprueba que la contraseña cumpla con ciertas reglas de seguridad

    Args:
        password (str): La contraseña a validar

    Raises:
        ValueError: Lanza la excepción con todos las reglas incumplidas
    """
    errors = []

    rules = [
        (len(password) < 8, "La contraseña debe tener al menos 8 caracteres."),
        (not re.search(r'[A-Z]', password), "La contraseña debe contener al menos una letra mayúscula."),
        (not re.search(r'[a-z]', password), "La contraseña debe contener al menos una letra minúscula."),
        (not re.search(r'[^A-Za-z0-9]', password), "La contraseña debe contener al menos un carácter especial.")
    ]

    for condition, message in rules:
        if condition:
            errors.append(message)

    for group in re.findall(r'\d+', password):
        if any(int(a) + 1 == int(b) for a, b in zip(group, group[1:])):
            errors.append("No se permiten números consecutivos en la contraseña.")
            break

    lower_pass = password.lower()
    if any(ord(a) + 1 == ord(b) for a, b in zip(lower_pass, lower_pass[1:]) if a.isalpha() and b.isalpha()):
        errors.append("No se permiten letras consecutivas en la contraseña.")

    if errors:
        raise ValueError(errors)