/**
 * Test dependencies.
 */

const test = require('tape')
const server = require('server-test')
const salute = require('..')
const concate = require('concat-stream')

test('should stream string', assert => {
  assert.plan(1)
  server((req, res) => {
    salute(() => {
      return 'hello world'
    })(req, res).pipe(concat(data => assert.equal(data, 'hello world')))
  })
})
