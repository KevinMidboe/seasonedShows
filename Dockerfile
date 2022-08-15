FROM node:18

RUN mkdir -p /opt/seasonedShows

WORKDIR /opt/seasonedShows

COPY seasoned_api/ .

RUN apt update
RUN apt install node-pre-gyp -y
RUN yarn
RUN cp conf/development.json.example conf/development.json

# Replace with external redis
RUN apt install redis-server systemctl -y
RUN systemctl enable redis-server

EXPOSE 31459

CMD ["yarn", "start"]

LABEL org.opencontainers.image.source https://github.com/kevinmidboe/seasoned
