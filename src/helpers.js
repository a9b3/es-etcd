import https from 'https'
import http from 'http'
import fs from 'fs'

/**
 * https://nodejs.org/api/https.html#https_https_globalagent
 * @param {String} ca - file location
 * @param {String} key - file location
 * @param {String} cert - file location, x509 certificate
 * @returns {https.Agent}
 */
export function createHttpsAgent({ ca, key, cert, ...rest }) {
  console.log('rest', rest)
  const opts = {}
  if (ca) {
    opts.ca = fs.readFileSync(ca)
  }
  if (key) {
    opts.key = fs.readFileSync(key)
  }
  if (cert) {
    opts.cert = fs.readFileSync(cert)
  }
  return new https.Agent(opts)
}

export function createHttpAgent(opts) {
  return new http.Agent(opts)
}
