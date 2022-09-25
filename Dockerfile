FROM node:18
LABEL org.opencontainers.image.source https://github.com/kevinmidboe/seasonedShows

RUN mkdir -p /opt/seasonedShows/src

WORKDIR /opt/seasonedShows

COPY src/ src
COPY configurations/ configurations
COPY package.json .
COPY yarn.lock .

RUN apt update
RUN apt install node-pre-gyp -y
RUN yarn
RUN cp configurations/development.json.example configurations/production.json

EXPOSE 31459

CMD ["yarn", "start"]
