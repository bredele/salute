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
    if (value instanceof Error) status(res, value.statusCode)
    return stream(value)
  }
}
