
const Logger = {
  // This can be a fancy logger, but for now it's just a console logger
  log: (message, data=null) => {
    if(!data) {
      console.log(message)
    } else {
      // alternatively we could have just destructured ...arguments
      console.log(message, data);
    }
  }
}

module.exports = Logger;