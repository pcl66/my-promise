function Promise(executor) {
  this.state = 'pending'
  this.result = undefined
  this.cb = []
  const self = this
  function resolve(data) {
    // 状态只能修改一次
    if(self.state !== 'pending') return
    self.state = 'fulfilled'
    self.result = data
    self.cb.forEach(v => {
      v.onResolved(data)
    })
  }
  function reject(data) {
    // 状态只能修改一次
    if(self.state !== 'pending') return
    self.state = 'rejected'
    self.result = data
    self.cb.forEach(v => {
      v.onRejected(data)
    })
  }
  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

Promise.prototype.then = function(onResolved, onRejected){
  return new Promise((resolve, reject) => {
    // 执行then函数时，promise的状态已经改变（同步）
    if(this.state === 'fulfilled') {
      onResolved(this.result)
    }
    if(this.state === 'rejected') {
      onRejected(this.result)
    }
    // 执行器函数异步改变promise状态
    if(this.state === 'pending') {
      this.cb.push({
        onResolved,
        onRejected
      })
    }
  })
}