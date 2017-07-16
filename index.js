/**
 * dependencies.
 */

const stream = require('morph-stream')


/**
 *
 */

module.exports = (middleware, type) => {
  return (...args) => {
    return stream(middleware(...args))
  }
}
