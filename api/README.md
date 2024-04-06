# 2024_PA_ESGI
# Dev v0.0.2

# Instruction v1 :
- Run : npm install
- Run : npx prisma generate
- Create a .env
- Copy the DATABASE_URL from .env.example to .env for development environment
- Run : docker-compose build
- Run : docker-compose up
- Run : npx prisma migrate dev --name init
- Run : npx prisma migrate deploy

# Problème avec docker :
- Run : rm  ~/.docker/config.json 
- Run : docker-compose build