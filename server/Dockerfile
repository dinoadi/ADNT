FROM node:20-bullseye

# Install Chrome dependencies required by Puppeteer
RUN apt-get update && apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libglib2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxrandr2 \
  libxrender1 \
  libxshmfence1 \
  libxss1 \
  libxtst6 \
  xdg-utils \
  wget \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json from server
COPY package*.json ./

# Install dependencies (prod only)
RUN npm ci --omit=dev

# Copy all server files
COPY . .

ENV NODE_ENV=production
ENV PUPPETEER_SKIP_DOWNLOAD=false

EXPOSE 3000

CMD ["npm", "start"]
