import Transport from 'winston-transport'
import newrelic from 'newrelic'
import fetch from 'node-fetch'

/**
 * Class for sending logging information to Newrelic's HTTPS intakes
 * @extends Transport
 */
class NewrelicTransport extends Transport {
  /**
   * Constructor for the Newrelic Transport responsible for making
   * HTTP requests whenever log messages are received
   * @param {!Object} opts Transport options
   * @param {string} opts.apiKey The Newrelic API key
   * @param {string} [intakeRegion] The intake region to be used
   */
  constructor (opts = {}) {
    super(opts)

    if (!opts.apiKey) {
      throw new Error('Missing required option: `apiKey`')
    }
    if (opts.intakeRegion === 'eu') {
      this.apiUrl = `https://log-api.eu.newrelic.com/log/v1`
    } else {
      this.apiUrl = `https://log-api.newrelic.com/log/v1`
    }
    this.apiKey = opts.apiKey || process.env.NEW_RELIC_LICENSE_KEY
    this.appName = opts.appName || process.env.NEW_RELIC_APP_NAME
    this.level = opts.level || 'info'
  }

  /**
   * Expose the name of the Transport
   */
  get name () {
    return 'Newrelic Logs'
  }

  /**
   * Core logging method exposed to Winston
   * @param {!Object} info Information to be logged
   * @param {function} callback Continuation to respond when complete
   */
  async log (info, callback) {
    setImmediate(() => {
      this.emit('logged', info)
    })

    try {

      let traceData = newrelic.getLinkingMetadata()

      const requestBody = {
          "message": info,
          "level": this.level,
          "timestamp": Date.now(),
          ...traceData
      }

      const config = {
          method: 'POST',
          headers: {
              'Content-Type': "application/json",
              'X-License-Key': this.apiKey
          },
          body: JSON.stringify(requestBody)
      }

      const response = await fetch(this.apiUrl, config)
      if (!response.ok) throw Error(response.message);

      // const data = await response.json();
      // return data;
    } catch (err) {
      console.log(`Error clear log in new-relic ${this.appName}: ${error}`);
    } finally {
      callback()
    }
  }
}

export default NewrelicTransport