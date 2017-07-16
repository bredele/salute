/**
 * Test dependencies.
 */

const test = require('tape')
const server = require('server-test')
const salute = require('..')
const concat = require('concat-stream')
const fs = require('fs')
const createError = require('http-errors')


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
    })(req, res).pipe(concat(data => assert.equal(data.toString(), 'hello world\n')))
  })
})


test('should transfer object', assert => {
  assert.plan(2)
  server((req, res) => {
    salute(() => {
      return {
        name: 'hello'
      }
    })(req, res).pipe(concat(data => assert.equal(data.toString(), '{"name":"hello"}')))
    assert.equal(res.getHeader('Content-Type'), 'application/json')
  })
})

test('should set status code if an http error is transfered', assert => {
  assert.plan(2)
  server((req, res) => {
    salute(() => {
      return createError(401)
    })(req, res)
    assert.equal(res.statusCode, 401)
    assert.equal(res.statusMessage , 'Unauthorized')
  })
})
