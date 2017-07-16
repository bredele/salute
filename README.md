# Salute

[![Build Status](https://travis-ci.org/bredele/salute.svg?branch=master)](https://travis-ci.org/bredele/salute)
[![NPM](https://img.shields.io/npm/v/salute.svg?style=flat-square)](https://www.npmjs.com/package/salute)
[![Downloads](https://img.shields.io/npm/dm/salute.svg?style=flat-square)](http://npm-stat.com/charts.html?package=salute)
[![pledge](https://bredele.github.io/contributing-guide/community-pledge.svg)](https://github.com/bredele/contributing-guide/blob/master/community.md)

Salute is a high order function you can use as a middleware for your HTTP servers:
  * **Chunked encoding**: The data returned by your function is decomposed into series of chunks using [chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding). Salute automatically reduce [time to first byte](https://en.wikipedia.org/wiki/Time_To_First_Byte) and work around the v8 heap memory limit while having low memory footprint.
  * **Polymorphic**: Salute provides a single interface to process whatever data returned by your function. It even accepts promises of streams.
  * **HTTP status**: Return an [HTTP error](https://www.npmjs.com/package/http-errors) to automatically send status with custom payload through the response.

## Usage

```javascript
const salute = require('salute')
const http = require('http')
const createError = require('http-errors')


const middleware = salute((req) => {
  switch(req.url) {
    case '/stream':
      return fs.createReadStream('hello.txt')
    case '/errors':
      return createError(401, 'Please login')
    default:
      return 'hello world'
  }
})


http.createServer((req, res) => {
  middleware(req, res).pipe(res)
})
```

Salute automatically know which type of data you want to send through the response and set the appropriate content type. However, you can set the response header with a content type of your choice:

```js
salute(fn, 'csv')
```

## Installation

```shell
npm install salute --save
```

[![NPM](https://nodei.co/npm/salute.png)](https://nodei.co/npm/salute/)

## Question

For questions and feedback please use our [twitter account](https://twitter.com/bredeleca). For support, bug reports and or feature requests please make sure to read our
<a href="https://github.com/bredele/contributing-guide/blob/master/community.md" target="_blank">community guideline</a> and use the issue list of this repo and make sure it's not present yet in our reporting checklist.

## Contribution

Salute is an open source project and would not exist without its community. If you want to participate please make sure to read our <a href="https://github.com/bredele/contributing-guide/blob/master/community.md" target="_blank">guideline</a> before making a pull request. If you have any salute-related project, component or other let everyone know in our wiki.


## Licence

The MIT License (MIT)

Copyright (c) 2016 Olivier Wietrich

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
