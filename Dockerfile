FROM node:20.10.0-slim

RUN apt-get update -y
RUN apt-get install -y openssl

USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]