var semaphore = require('sema')

function Async () {
  if (!(this instanceof Async)) return new Async()
  this._q = [semaphore()]
  this._error = null
}

Async.prototype.defer = function (fn) {
  var self = this
  var sema = this._q[this._q.length - 1]
  sema.acquire(function () {
    // error block queue
    if (self._error) return sema.release()
    var nested = semaphore()
    self._q.push(nested)
    fn(function (err) {
      if (err) self._error = err
      nested.acquire(function () {
        nested.release()
        self._q.pop()
        sema.release()
      })
    })
  })
}

Async.prototype.done = function (fn) {
  var self = this
  var sema = this._q[0]
  sema.acquire(function () {
    fn(self._error)
    sema.release()
  })
}

module.exports = Async
