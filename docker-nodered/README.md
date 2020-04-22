Build the docker image
docker build -t nodered-ml5 -f docker-nodered/Dockerfile .

Run the docker container with static self-signed certififcate
docker run -it -p 1880:1880 nodered-ml5

Run the docker container with automatic created certificate
docker run -it -p 1880:1880 -p 80:80 -e EMAIL=mail@example.com -e LETSENCRYPTDOMAIN=example.com --entrypoint /bin/bash nodered-ml5 -c /usr/src/node-red/start.sh

