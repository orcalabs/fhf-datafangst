FROM node:20-alpine AS builder

WORKDIR /app

COPY fhf-datafangst-client/package*.json .
RUN npm ci

COPY fhf-datafangst-client .
RUN npm run build
RUN npm run compress

FROM nginx:alpine
COPY dockerfiles/fhf-datafangst-client/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html
