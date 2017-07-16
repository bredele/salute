/**
 * dependencies.
 */

const stream = require('morph-stream')
const status = require('response-status')

/**
 *
 */

module.exports = (middleware, type) => {
  return (req, res, ...args) => {
    const value = middleware(req, res, ...args)
    res.setHeader('Content-Type', mime(typeof value))
    if (value instanceof Error) status(res, value.statusCode)
    return stream(value)
  }
}



function mime (type) {
  if (type === 'object') return 'application/json'
  return 'text/plain'
}
