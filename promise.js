function Promise(executor) {
  function resolve(data) {

  }
  function reject(data) {

  }

  executor(resolve, reject)
}

Promise.prototype.then = function(onResolved, onRejected){

}