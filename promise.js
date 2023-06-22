function Promise(executor) {
  this.state = 'pending'
  this.result = null
  const self = this
  function resolve(data) {
    if(self.state !== 'pending') return
    self.state = 'fulfilled'
    self.result = data
  }
  function reject(data) {
    if(self.state !== 'pending') return
    self.state = 'rejected'
    self.result = data
  }
  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

Promise.prototype.then = function(onResolved, onRejected){
  if(this.state === 'fulfilled') {
    onResolved(this.result)
  }
  if(this.state === 'rejected') {
    onRejected(this.result)
  }
}