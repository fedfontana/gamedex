MYSQL_ROOT_PASSWORD=example
MYSQL_DATABASE=gamedex
MYSQL_USER=gamedex
MYSQL_PASSWORD=gamedex_password
MYSQL_CONTAINER_NAME=db

.PHONY: up restore dump
up:
	docker run --name $(MYSQL_CONTAINER_NAME) \
		-v mysql_data:/var/lib/mysql \
		-e MYSQL_ROOT_PASSWORD=$(MYSQL_ROOT_PASSWORD) \
		-e MYSQL_DATABASE=$(MYSQL_DATABASE) \
		-e MYSQL_USER=$(MYSQL_USER) \
		-e MYSQL_PASSWORD=$(MYSQL_PASSWORD) \
		-p 3306:3306 \
		-d mysql:8

down:
	docker stop $(MYSQL_CONTAINER_NAME)
	docker rm $(MYSQL_CONTAINER_NAME)

dump: 
	docker exec $(MYSQL_CONTAINER_NAME) \
		sh -c 'exec mysqldump --all-databases -uroot -p$(MYSQL_ROOT_PASSWORD)' > $(PWD)/dump.sql

restore: dump.sql
	docker exec -i $(MYSQL_CONTAINER_NAME) \ 
		sh -c 'exec mysql -uroot -p$(MYSQL_ROOT_PASSWORD)' < $(PWD)/dump.sql
