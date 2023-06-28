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

Promise.prototype.then = function(onResolved, onRejected = r => { throw r }){
  return new Promise((resovle, reject) => {
    const self = this
    // 执行then函数时，promise的状态已经改变（同步）
    if(this.state === 'fulfilled') {
      try {
        const result = onResolved(this.result)
        if(result instanceof Promise) {
          result.then(v =>{
            resovle(v)
          }, r => {
            reject(r)
          })
        } else {
          resovle(result)
        }
      } catch (error) {
        reject(error)
      }
    }
    if(this.state === 'rejected') {
      try {
        const result = onRejected(this.result)
        if(result instanceof Promise) {
          result.then(v => {
            resovle(v)
          }, r => {
            reject(r)
          })
        } else {
          resovle(result)
        }
      } catch (error) {
        reject(error)
      }
    }
    // 执行器函数异步改变promise状态
    if(this.state === 'pending') {
      this.cb.push({
        onResolved: function(){
          try {
            const result = onResolved(self.result)
            if(result instanceof Promise) {
              result.then(v =>{
                resovle(v)
              }, r => {
                reject(r)
              })
            } else {
              resovle(result)
            }
          } catch (error) {
            reject(error)
          }
        },
        onRejected: function() {
          try {
            const result = onRejected(self.result)
            if(result instanceof Promise) {
              result.then(v => {
                resovle(v)
              }, r => {
                reject(r)
              })
            } else {
              resovle(result)
            }
          } catch (error) {
            reject(error)
          }
        }
      })
    }
  })
}

Promise.prototype.catch = function(onRejected) {
  return this.then(undefined, onRejected)
}

Promise.resolve = function(value) {
  return new Promise((resolve, reject) => {
    if(value instanceof Promise) {
      value.then(v => {
        resolve(v)
      }, r => {
        reject(r)
      })
    } else {
      resolve(value)
    }
  })
}

Promise.reject = function(value) {
  return new Promise((_, reject) => {
    reject(value)
  })
}

Promise.reject = function(value) {
  return new Promise((resolve, reject) => {
    reject(value)
  })
}

Promise.all = function(iterable) {
  if(!(iterable instanceof Array)) {
    throw new TypeError('parms must be Array!')
  }
  return new Promise((resolve, reject) => {
    let count = 0
    const resultArr = []
    for(const [index, item] of iterable.entries()) {
      if(item instanceof Promise) {
        item.then(v => {
          count++
          resultArr[index] = v
          if(iterable.length === count) {
            resolve(resultArr)
          }
        }, r => {
          count++
          resultArr[index] = r
          if(iterable.length === count) {
            resolve(resultArr)
          }
        })
      } else {
        count++
        resultArr[index] = item
        if(iterable.length === count) {
          resolve(resultArr)
        }
      }
    }
  })
}

Promise.race = function(iterable) {
  if(!(iterable instanceof Array)) {
    throw new TypeError('params must be Array!')
  }
  return new Promise((resolve, reject) => {
    for(const item of iterable) {
      if(item instanceof Promise) {
        item.then(v => {
          resolve(v)
        }, r => {
          reject(r)
        })
      } else {
        resolve(item)
      }
    }
  })
}

Promise.allSettled = function(iterable) {
  if(!(iterable instanceof Array)) {
    throw new TypeError('params must be Array!')
  }
  return new Promise((resolve, reject) => {
    let count = 0
    const resultArr = []
    for(const [index, item] of iterable.entries()) {
      if(item instanceof Promise) {
        item.then(v => {
          count++
          resultArr[index] = {
            status: 'fulfilled',
            value: v
          }
          if(iterable.length === count) {
            resolve(resultArr)
          }
        }, r => {
          count++
          resultArr[index] = {
            status: 'rejected',
            reason: r
          }
          if(iterable.length === count) {
            resolve(resultArr)
          }
        })
      } else {
        count++
        resultArr[index] = {
          status: 'fulfilled',
          value: item
        }
        if(iterable.length === count) {
          resolve(resultArr)
        }
      }
    }
  })
}