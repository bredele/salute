/**
 * dependencies.
 */

const stream = require('morph-stream')
const status = require('response-status')
const lookup = require('mime-types').contentType
const toString = Object.prototype.toString

/**
 *
 */

module.exports = (middleware, type) => {
  return (req, res, ...args) => {
    const value = middleware(req, res, ...args)
    res.setHeader('Content-Type', mime(value, type))
    if (value instanceof Error) status(res, value.statusCode)
    return stream(value)
  }
}



function mime (value, force) {
  if (force) return lookup(force) || 'text/plain'
  const type = toString.call(value)
  if (type === '[object Object]') return lookup('json')
  return lookup('text')
}
