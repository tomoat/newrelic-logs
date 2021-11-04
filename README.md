
# Newrelic Logs
NewRelic logs is a NodeJS library for send winston logs to newrelic

## Install
```console
$ npm i newrelic-winston -S
```
or
```console
$ yarn add newrelic-winston
```

## Options
- **apiKey**: Your newrelic api key *[required]*
- **appName**: The application name *[required]*
- **level**: The log level of the application or service
- **intakeRegion**: The datadog intake to use. set to `eu` to force logs to be sent to the EU specific intake

## Alternatively, you can use environment variable to pass apiKey and appName
## Add Environment Variables

```node
process.env.NEW_RELIC_LICENSE_KEY = 'my-key'
process.env.NEW_RELIC_APP_NAME =  'my-app-name'
```

## Usage
```javascript
const { createLogger } = require('winston')
const NewrelicTransport = require('newrelic-winston')

// Create a logger and consume an instance of your transport
const logger = createLogger({
  // Whatever options you need
  // Refer https://github.com/winstonjs/winston#creating-your-own-logger
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new NewrelicTransport({
        apiKey: 'YOUR_NEW_RELIC_LICENSE_KEY',
        appName: 'YOUR_APP_NAME',
        level: 'info',
    })
  )
}

```

