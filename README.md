## как поднять продукт

bash(```make db-init```

## настройка .env

# Database Settings
DB_HOST=crm-postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=crm_it_school

KEYCLOAK_URL = http://crm-keycloak:8080
KEYCLOAK_REALM = my-crm-realm
KEYCLOAK_CLIENT_ID = nestjs-backend


# Redis Settings
REDIS_HOST=http://crm-redis
REDIS_PORT=6379

MINIO_ENDPOINT = http://crm-minio
MINIO_PORT = 9000
MINIO_BUCKET = backend
MINIO_USE_SSL = false
MINIO_ACCESS_KEY = minioadmin
MINIO_SECRET_KEY = minioadmin

# # App / Dev Settings
APP_PORT=3000
HOST_PORT=3000
APP_DOMAIN=localhost
