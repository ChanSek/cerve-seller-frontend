# Stage 1: Build seller frontend (CRA)
FROM node:18 AS seller-builder

ARG REACT_APP_BASE_URL
ARG REACT_APP_FIREBASE_API_KEY
ARG REACT_APP_FIREBASE_AUTH_DOMAIN

ENV REACT_APP_BASE_URL ${REACT_APP_BASE_URL}
ENV REACT_APP_FIREBASE_API_KEY ${REACT_APP_FIREBASE_API_KEY}
ENV REACT_APP_FIREBASE_AUTH_DOMAIN ${REACT_APP_FIREBASE_AUTH_DOMAIN}

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run-script build

# Stage 2: Build Claw marketing website (Vite)
FROM node:18 AS claw-builder

WORKDIR /app/claw
COPY claw/package.json claw/package-lock.json* ./
RUN npm install
COPY claw/ .
RUN npm run build

# Stage 3: Build Cerve root marketing website (Vite)
FROM node:18 AS website-builder

WORKDIR /app/website
COPY website/package.json website/package-lock.json* ./
RUN npm install
COPY website/ .
RUN npm run build

# Stage 4: nginx for serving all apps
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
# Copy seller frontend
COPY --from=seller-builder /app/build ./seller
# Copy claw website
COPY --from=claw-builder /app/claw/dist ./claw
# Copy root marketing website
COPY --from=website-builder /app/website/dist ./website
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]
