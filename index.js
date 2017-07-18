/**
 * dependencies.
 */

const stream = require('morph-stream')
const status = require('response-status')
const lookup = require('mime-types').contentType
const toString = Object.prototype.toString


/**
 * Create an HTTP request/response middlware which
 * chunk any type of value returned as well as set
 * the response content type.
 *
 * @param {Function} middleware
 * @param {String?} type
 * @api public
 */

module.exports = (middleware, type) => {
  return (req, res, ...args) => {
    const value = middleware(req, res, ...args)
    return stream(Promise.resolve(value).then(val => {
      if (val instanceof Error) {
        status(res, val.statusCode)
      } else {
        res.setHeader('Content-Type', mime(val, type))
        return val
      }
    }, reason => status(res, reason.statusCode)))
  }
}



/**
 * Return full content type header given a value or a content-type.
 *
 * @param {Any} value
 * @param {String} foce
 * @return {String} (default text/plain)
 * @api public
 */

function mime (value, force) {
  if (force) return lookup(force) || lookup('text')
  const type = toString.call(value)
  if (type === '[object Object]') return lookup('json')
  return lookup('text')
}
