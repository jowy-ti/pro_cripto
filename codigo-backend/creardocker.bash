docker build -t backend .
docker run -d --name "back" --env-file .env --network cluster -p 8081:5000 backend