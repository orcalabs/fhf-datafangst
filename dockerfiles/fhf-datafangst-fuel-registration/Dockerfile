FROM node:24-alpine AS builder

WORKDIR /app

COPY fhf-datafangst-fuel-registration/package*.json .
RUN npm ci

COPY fhf-datafangst-fuel-registration .
RUN npm run build
RUN npm run compress

FROM nginx:alpine
COPY dockerfiles/fhf-datafangst-fuel-registration/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html
