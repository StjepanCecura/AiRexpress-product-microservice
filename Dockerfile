FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm ci
COPY . ./
EXPOSE 4001