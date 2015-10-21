var semaphore = require('sema')

function Async () {
  this._q = this._q || [semaphore(1)]
  this._error = null
}

Async.prototype.defer = function (fn) {
  var self = this
  var sema = this._q[this._q.length - 1]
  sema.take(function () {
    // error block queue
    if (self._error) return sema.leave()
    self._q.push(semaphore(1))
    fn(function (err) {
      if (err) self._error = err
      var sema2 = self._q.pop()
      sema2.take(function () {
        sema2.leave()
        sema.leave()
      })
    })
  })
  return this
}

Async.prototype.done = function (fn) {
  var self = this
  var sema = this._q[0]
  sema.take(function () {
    fn(self._error)
    sema.leave()
  })
  return this
}

module.exports = Async
