# async-depth-first

Depth first traversal for recursive, asynchronous execution.

[![Build Status](https://travis-ci.org/cshum/async-depth-first.svg?branch=master)](https://travis-ci.org/cshum/async-depth-first)

```bash
npm install async-depth-first
```

```js
var a = async()
a.defer(function (cb) {
  console.log('1')
  a.defer(function (cb) {
    console.log('1.1')
    a.defer(function (cb) {
      console.log('1.1.1')
      cb()
    })
    cb()
  })
  a.defer(function (cb) {
    console.log('1.2')
    cb()
  })
  cb()
})
a.defer(function (cb) {
  console.log('2')
  cb()
})
a.done(function (err) {
  console.log('done')
})

/* Outputs
1
1.1
1.1.1
1.2
2
done
*/
```

## License

MIT
