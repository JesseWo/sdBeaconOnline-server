FROM node:8.11
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3110
CMD npm start