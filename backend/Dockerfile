FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    poppler-utils \
    libvips-dev \
    qpdf \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV PORT=5001
EXPOSE 5001

CMD ["node", "src/index.js"]
