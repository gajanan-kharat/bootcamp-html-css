# # Use a lightweight Node image
# FROM node:20-slim

# # Set workdir
# WORKDIR /app

# # Copy backend package.json and install deps
# COPY backend/package*.json ./
# RUN npm ci --only=production

# # Copy backend source
# COPY backend/. .

# # Copy static frontend (so Express can serve it)
# COPY frontend/public ./../frontend/public

# # Expose backend port
# EXPOSE 3000

# # Start the app
# CMD ["node", "src/server.js"]
