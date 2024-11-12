docker build -t frontend .
docker run -d --name "react" --env-file .env -p 8080:3000 frontend