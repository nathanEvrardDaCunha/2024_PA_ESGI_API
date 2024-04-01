# 2024_PA_ESGI
# Dev v0.0.1

# Instruction v1 :
- Run : npm install
- Run : prisma generate
- Create a .env
- Copy the DATABASE_URL from .env.example to .env for development environment
- Run : docker-compose build
- Run : docker-compose up
- Run : prisma migrate dev --name init
- Run : prisma migrate deploy