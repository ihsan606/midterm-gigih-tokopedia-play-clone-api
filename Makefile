dc-up-mongodb:
	docker compose up mongodb -d
dc-build:
	docker compose up -d
dc-rebuild:
	docker stop tokped-play-backend || true
	docker rm tokped-play-backend || true
	docker image rm tokped-play-api || true
	docker build -t tokped-play-api .
	docker-compose up backend-app -d
dc-rebuild-tail:
	docker stop tokped-play-backend || true
	docker rm tokped-play-backend || true
	docker image rm tokped-play-api || true
	docker build -t tokped-play-api .
	docker run --name tokped-play-backend -p 3000:3000 -d tokped-play-api
	docker container logs -f tokped-play-backend

dc-tail-log:
	docker container logs -f tokped-play-backend

dc-run:
	docker run --name tokped-play-backend -p 3000:3000 -d tokped-play-api
