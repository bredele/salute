/**
 * Test dependencies.
 */

const test = require('tape')
const server = require('server-test')
const salute = require('..')
const concat = require('concat-stream')
const fs = require('fs')

test('should transfer string', assert => {
  assert.plan(1)
  server((req, res) => {
    salute(() => {
      return 'hello world'
    })(req, res).pipe(concat(data => assert.equal(data.toString(), 'hello world')))
  })
})

test('should transfer promise', assert => {
  assert.plan(1)
  server((req, res) => {
    salute(() => {
      return new Promise((resolve, reject) => {
        resolve('hello world')
      })
    })(req, res).pipe(concat(data => assert.equal(data.toString(), 'hello world')))
  })
})

test('should transfer stream', assert => {
  assert.plan(1)
  server((req, res) => {
    salute(() => {
      return fs.createReadStream(__dirname + '/salute.txt')
    })(req, res).pipe(concat(data => assert.equal(data.toString(), 'hello world')))
  })
})
