# Kindeskind - NodeJS New Message Notification Webservice
Webservice for handling telegram messenger new message events

## Prerequisites
- [docker](https://docs.docker.com/engine/installation/) installed
- [docker-compose](https://docs.docker.com/compose/install/) installed
- [telegram-cli](https://github.com/vysheng/tg) installed

## Optional: Configure Telegram to use specific account
- Launch *telegram-cli* locally for the first time and log in with your Telegram credentials
- Quit *telegram-cli* after successful log in
- Copy the content of `.telegram-cli` directory to `docker_volumes/telegram-cli` directory

## Build docker images
```
docker-compose -f docker-compose.yml build
```

## Run docker containers
```
docker-compose -f docker-compose.yml up -d
```

## Authors
- Christof Kost
- Marco Maisel
- Steffen Mauser