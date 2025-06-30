from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def update_model(model, data: dict, *, include=None):
    """Generic PATCH helper – skips keys whose value is None."""
    include = set(include or data.keys())
    for k in include:
        v = data.get(k, None)
        if v is not None:
            setattr(model, k, v)
            
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)