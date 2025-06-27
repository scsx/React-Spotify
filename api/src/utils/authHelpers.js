const crypto = require('crypto')

/**
 * Generates a random string of a given length.
 * @param {number} length
 * @returns {string}
 */
const generateRandomString = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

/**
 * Hashes a plain string using SHA256.
 * @param {string} plain
 * @returns {Buffer}
 */
const sha256 = (plain) => {
  const encoder = new TextEncoder() // TextEncoder is a global, no need to import
  const data = encoder.encode(plain)
  return crypto.createHash('sha256').update(data).digest()
}

/**
 * Encodes a buffer into Base64 URL format.
 * @param {Buffer} input
 * @returns {string}
 */
const base64encode = (input) => {
  return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

module.exports = {
  generateRandomString,
  sha256,
  base64encode,
}
