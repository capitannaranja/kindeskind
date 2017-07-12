FROM node

# Create app directory
RUN mkdir -p /usr/src/app && mkdir /usr/src/app/logs
WORKDIR /usr/src/app

# Install app dependencies
ADD src/package.json /usr/src/app/
RUN npm install

# Bundle app source
ADD src/ /usr/src/app/

# Install telegram-cli
RUN apt-get update && apt-get -y install libreadline-dev libconfig-dev libssl-dev lua5.2 liblua5.2-dev libevent-dev libjansson-dev libpython-dev make ruby
WORKDIR /usr/src/app/tg
RUN ./configure && make
WORKDIR /usr/src/app

#EXPOSE 3000
CMD [ "npm", "run", "start-with-telegram" ]