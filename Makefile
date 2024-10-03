build-all:
	docker run --rm -ti \
		-v ${PWD}:/project \
		-v ${PWD}/dist:/project/dist \
		electronuserland/builder:wine \
		/bin/bash -c "npm install && npm run build:all"