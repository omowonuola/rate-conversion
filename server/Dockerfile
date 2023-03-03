FROM node:alpine

# Set the working directory

ENV APP_PATH=/usr/src/app NPM_CONFIG_LOGLEVEL=warn

WORKDIR $APP_PATH
COPY . $APP_PATH

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Set the environment variables
ENV NODE_ENV=production

# Expose the port that the application will run on
EXPOSE 6000

# Start the application
CMD [ "npm", "run", "start:dev" ]
