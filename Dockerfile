# Use Node.js official image
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Copy the rest of the app's source code
COPY . .

# Build the Next.js app
RUN pnpm run build

# Expose the port that the app will run on
EXPOSE 3000

# Command to run your app in production mode
CMD ["pnpm", "start"]
