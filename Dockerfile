FROM node:18

RUN mkdir -p /opt/seasonedShows/seasoned_api

WORKDIR /opt/seasonedShows

COPY seasoned_api/ seasoned_api
COPY package.json .

RUN apt update
RUN apt install node-pre-gyp -y
RUN yarn
RUN cp seasoned_api/conf/development.json.example seasoned_api/conf/development.json

EXPOSE 31459

CMD ["yarn", "start"]

LABEL org.opencontainers.image.source https://github.com/kevinmidboe/seasoned
