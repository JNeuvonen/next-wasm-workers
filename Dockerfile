FROM node:alpine
FROM rust:latest
RUN cargo install wasm-pack
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nodejs \
    npm 


WORKDIR /app
COPY . .

RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

