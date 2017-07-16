/**
 * Test dependencies.
 */

const test = require('tape')
const server = require('server-test')
const salute = require('..')
const concat = require('concat-stream')

test('should stream string', assert => {
  assert.plan(1)
  server((req, res) => {
    salute(() => {
      return 'hello world'
    })(req, res).pipe(concat(data => assert.equal(data.toString(), 'hello world')))
  })
})

test('should stream promise', assert => {
  assert.plan(1)
  server((req, res) => {
    salute(() => {
      return new Promise((resolve, reject) => {
        resolve('hello world')
      })
    })(req, res).pipe(concat(data => assert.equal(data.toString(), 'hello world')))
  })
})
