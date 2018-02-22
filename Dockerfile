FROM nginx
MAINTAINER Preston Lee
WORKDIR /usr/share/nginx/html
COPY ./build ./
