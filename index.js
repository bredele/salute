/**
 * dependencies.
 */

const stream = require('morph-stream')
const error = require('response-status')
const lookup = require('mime-types').contentType
const toString = Object.prototype.toString



/**
 * Expose salute.
 */

module.exports = salute


/**
 * Create an HTTP request/response middlware which
 * chunk any type of value returned as well as set
 * the response content type.
 *
 * @param {Function} cb
 * @api public
 */

function salute (cb) {
  return (req, res, ...args) => {
    var value = null
    try {
      value = cb(req, res, ...args)
    } catch (e) {
      value = e
    }
    return stream(Promise.resolve(value).then(type(res)))
      .on('error', status(res))
  }
}


/**
 * Set response content type header.
 *
 * @param {Object} response
 * @return {Function}
 * @api private
 */

function type (response) {
  return value => {
    if (!(value instanceof Error)) {
      response.setHeader(
        'Content-Type',
        lookup(toString.call(value) === '[object Object]' ? 'json' : 'text')
      )
    }
    return value
  }
}


/**
 * Set response status code and message.
 *
 * @param {Object} response
 * @return {Function}
 * @api private
 */

function status (res) {
  return err => {
    const code = err.statusCode
    error(res, code || 500)
    if (!code) console.log(err)
  }
}


/*
 * Expose content type lookup for convenience.
 */

salute.mime = lookup
