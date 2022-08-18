FROM node:18

RUN mkdir -p /opt/seasonedShows/seasoned_api

WORKDIR /opt/seasonedShows

COPY seasoned_api/ seasoned_api
COPY package.json .

RUN apt update
RUN apt install node-pre-gyp -y
RUN yarn
RUN cp configurations/development.json.example configurations/development.json

EXPOSE 31459

CMD ["yarn", "start"]

LABEL org.opencontainers.image.source https://github.com/kevinmidboe/seasoned
