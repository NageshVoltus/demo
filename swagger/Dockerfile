FROM node:8

# Create app directory
RUN mkdir -p /usr/src/swagger 
WORKDIR /usr/src/swagger

# Bundle app source
COPY . /usr/src/swagger

# Install app dependencies
RUN  npm install

# RUN npm install newrelic

# COPY newrelic.js /usr/src/ApiGateway/node_modules/newrelic/

EXPOSE 5001 
CMD [ "node", "app.js"]
