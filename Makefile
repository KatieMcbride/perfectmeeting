
# make

ssh:
	docker exec -it $(docker container ls -qf "name=perfectmeeting_client") /bin/sh
