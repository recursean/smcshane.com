/**
 * Print message with timestamp
 * 
 * @param {*} message Message to print
 */
 function logMessage(message) {
    console.log(`${new Date()}: ${message}`)
}

module.exports = logMessage