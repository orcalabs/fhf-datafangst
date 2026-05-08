FROM node:24-alpine AS builder

WORKDIR /app

COPY fhf-datafangst-client/package*.json .
RUN npm ci

COPY fhf-datafangst-client .
RUN npm run build

FROM nginx:alpine
COPY dockerfiles/fhf-datafangst-client/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
