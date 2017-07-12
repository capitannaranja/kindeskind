# Kindeskind - Amazon Alexa Skill

## Prerequisites
- Amazon AWS Account
- Amazon Developer Account

## Installation

### Amazon AWS Lambda
- Create Amazon Lambda function with `Alexa Skills Kit` as trigger and `NodeJS 6.10` as Runtime.
- Keep Handler as `index.handler` and add a new role for `lambda_basic_execution` 
- Set `Timeout` in *Advanced Settings* to at least `15` seconds

### Amazon Alexa Skill
- Create Alexa Skill in *Amazon Developer Console*
- Copy content of `InteractionModel.json` into your Amazon Skill InteractionModel
- Set Service Endpoint Type to `AWS Lambda ARN` and insert your lambda function's ARN

For further guides and tutorials for setting up Lambda and the Alexa Skill visit the [Amazon Developer Alexa Blog](https://developer.amazon.com/de/blogs/post/txdjws16kupvko/new-alexa-skills-kit-template:-build-a-trivia-skill-in-under-an-hour)

### Run Alexa Skill on Alexa-enabled Device
- Install *Alexa Voice Service* on a Raspberry Pi according to this [installation guide](https://github.com/alexa/alexa-avs-sample-app/wiki/Raspberry-Pi)
- Run the companion service
```
cd /home/pi/alexa-avs-sample-app/samples/companionService && npm start
```
- Run the AVS Java client
```
cd /home/pi/alexa-avs-sample-app/samples/javaclient && mvn exec:exec
```
- Run the wake word agent (we use [Sensory](https://github.com/Sensory/alexa-rpi))
```
cd /home/pi/alexa-avs-sample-app/samples/wakeWordAgent/src && ./wakeWordAgent -e sensory
```
- Start [OpenHab](../openhab)
``` 
./start.sh
```

## Authors
- Christof Kost
- Marco Maisel
- Steffen Mauser
