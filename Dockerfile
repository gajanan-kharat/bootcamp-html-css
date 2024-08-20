# Base Image
FROM node:16-alpine

# Install Node.js and npm
RUN apk add --no-cache nodejs npm 

# Set Working Directory
WORKDIR /

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install dependencies including express and MongoDB
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Start the application
CMD ["node", "index.js"]
