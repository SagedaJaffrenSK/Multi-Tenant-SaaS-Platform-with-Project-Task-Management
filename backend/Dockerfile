FROM node:18-alpine

# ✅ ADD THIS LINE
RUN apk add --no-cache curl

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
