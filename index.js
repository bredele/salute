/**
 * dependencies.
 */

const stream = require('morph-stream')
const status = require('response-status')
const lookup = require('mime-types')
const toString = Object.prototype.toString

/**
 *
 */

module.exports = (middleware, type) => {
  return (req, res, ...args) => {
    const value = middleware(req, res, ...args)
    res.setHeader('Content-Type', mime(value))
    if (value instanceof Error) status(res, value.statusCode)
    return stream(value)
  }
}



function mime (value) {
  const type = toString.call(value)
  if (type === '[object Object]') return 'application/json'
  return 'text/plain'
}
