var test = require('tape')
var async = require('./')

test('depth first sequence', function (t) {
  var q = async()
  var seq = []
  q.defer(function (cb) {
    seq.push('1')
    q.defer(function (cb) {
      seq.push('1.1')
      q.defer(function (cb) {
        seq.push('1.1.1')
        cb()
      })
      cb()
    })
    q.defer(function (cb) {
      seq.push('1.2')
      cb()
    })
    cb()
  })
  q.defer(function (cb) {
    seq.push('2')
    q.defer(function (cb) {
      seq.push('2.1')
      cb()
    })
    q.defer(function (cb) {
      seq.push('2.2')
      cb()
    })
    cb()
  })
  q.defer(function (cb) {
    seq.push('3')
    cb()
  })
  q.done(function (err) {
    t.notOk(err)
    t.deepEqual(seq, [
      '1', '1.1', '1.1.1', '1.2', '2', '2.1', '2.2', '3'
    ], 'depth first traversal')
    t.end()
  })
})

test('error', function (t) {
  var q = async()
  var seq = []
  q.defer(function (cb) {
    seq.push('1')
    q.defer(function (cb) {
      seq.push('1.1')
      q.defer(function (cb) {
        seq.push('1.1.1')
        cb()
      })
      cb()
    })
    q.defer(function (cb) {
      seq.push('1.2')
      cb()
    })
    cb()
  })
  q.defer(function (cb) {
    seq.push('2')
    q.defer(function (cb) {
      seq.push('2.1')
      cb('boooom')
    })
    q.defer(function (cb) {
      seq.push('2.2')
      cb()
    })
    cb()
  })
  q.defer(function (cb) {
    seq.push('3')
    cb()
  })
  q.done(function (err) {
    t.equal(err, 'boooom', 'error return')
    t.deepEqual(seq, [
      '1', '1.1', '1.1.1', '1.2', '2', '2.1'
    ], 'partial traversal')
    t.end()
  })
})
