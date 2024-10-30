docker build -t frontend .
docker run --name "react" -d -p 8080:3000 --network cluster frontend