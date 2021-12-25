FROM node:16.9.1-buster

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install ffmpeg -y
RUN apt-get install wget -y
RUN apt-get install imagemagick -y
RUN apt-get install webp -y
RUN apt-get install graphicsmagick -y
RUN rm -rf /var/lib/apt/lists/*

COPY package.json .
RUN npm install -g pm2
RUN npm install -g npm@7.24.0
RUN npm i github:adiwajshing/baileys#multi-device
RUN pm2 link qi2p56h985w78cp 4xcpf43h38k29lf

COPY . .



CMD ["npm", "start"]`
