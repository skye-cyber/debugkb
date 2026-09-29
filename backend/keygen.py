import secrets

for name in ("AES_SECRET_KEY", "SECRET_KEY", "JWT_SECRET_KEY"):
    print(f"{name}={secrets.token_hex(32)}")
