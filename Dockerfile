FROM node:16-alpine3.11
RUN addgroup app && adduser -S -G app app 
USER app
WORKDIR /app
RUN mkdir data
COPY package*.json .
USER root
RUN npm i
USER app
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD [ "npm","start" ]
ENTRYPOINT [ "npm","start" ]
