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
  assert.plan(2)
  server((req, res) => {
    const input =  salute(() => {
      return 'hello world'
    })(req, res)
    input.pipe(concat(data => {
      assert.equal(res.getHeader('Content-Type'), 'text/plain; charset=utf-8')
      assert.equal(data.toString(), 'hello world')
    }))
    input.pipe(res)
  }, null, true)
})

test('should return empty string if null or undefined', assert => {
  assert.plan(2)
  server((req, res) => {
    const input =  salute(() => {})(req, res)
    input.pipe(concat(data => {
      assert.equal(data === '', true)
      assert.equal(res.statusCode, 200)
    }))
    input.pipe(res)
  }, null, true)
})


test('should transfer promise', assert => {
  assert.plan(2)
  server((req, res) => {
    const input = salute(() => {
      return new Promise((resolve, reject) => {
        resolve('hello world')
      })
    })(req, res)
    input.pipe(concat(data => {
      assert.equal(res.getHeader('Content-Type'), 'text/plain; charset=utf-8')
      assert.equal(data.toString(), 'hello world')
    }))
    input.pipe(res)
  }, null, true)
})

test('should transfer stream', assert => {
  assert.plan(1)
  server((req, res) => {
    const input = salute(() => {
      return fs.createReadStream(__dirname + '/salute.txt')
    })(req, res)
    input.pipe(concat(data => assert.equal(data.toString(), 'hello world\n')))
    input.pipe(res)
  }, null, true)
})

test('should transfer object', assert => {
  assert.plan(2)
  server((req, res) => {
    const input = salute(() => {
      return {
        name: 'hello'
      }
    })(req, res)
    input.pipe(concat(data => {
      assert.equal(res.getHeader('Content-Type'), 'application/json; charset=utf-8')
      assert.equal(data.toString(), '{"name":"hello"}')
    }))
    input.pipe(res)
  }, null, true)
})

test('should set status code if an http error is transfered', assert => {
  assert.plan(2)
  server((req, res) => {
    const input = salute(() => {
      return createError(401)
    })(req, res)
    input.on('error', err => {
      assert.equal(res.statusCode, 401)
      assert.equal(res.statusMessage , 'Unauthorized')
    })
  }, null, true)
})

test('should set status code internal error if an exception is thrown', assert => {
  assert.plan(2)
  server((req, res) => {
    const input = salute(() => {
      throw new Error('something')
    })(req, res)
    input.on('error', err => {
      assert.equal(res.statusCode, 500)
      assert.equal(res.statusMessage , 'Internal Server Error')
    })
  }, null, true)
})


// test('should set mime type', assert => {
//   assert.plan(1)
//   server((req, res) => {
//     const input = salute(() => {
//       return '<button>hello</buton>'
//     }, 'html')(req, res)
//     input.pipe(concat(data => {
//       assert.equal(res.getHeader('Content-Type'), 'text/html; charset=utf-8')
//     }))
//     input.pipe(res)
//   }, null, true)
// })
