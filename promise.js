function Promise(executor) {
  this.state = 'pending'
  this.result = null

  const self = this
  function resolve(data) {
    self.state = 'fulfilled'
    self.result = data
  }
  function reject(data) {
    self.state = 'rejected'
    self.result = data
  }

  executor(resolve, reject)
}

Promise.prototype.then = function(onResolved, onRejected){

}