/**
 * dependencies.
 */

const stream = require('morph-stream')
const status = require('response-status')
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
 * @param {Function} middleware
 * @api public
 */

function salute (middleware) {
  return (req, res, ...args) => {
    const value = middleware(req, res, ...args)
    return stream(Promise.resolve(value).then(val => {
      if (!(val instanceof Error)) {
        res.setHeader(
          'Content-Type',
          lookup(toString.call(val) === '[object Object]' ? 'json' : 'text')
        )
      }
      return val
    })).on('error', err => {
      status(res, err.statusCode)
    })
  }
}


/*
 * Expose content type lookup for convenience.
 */

salute.mime = lookup
