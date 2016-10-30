'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHttpsAgent = createHttpsAgent;
exports.createHttpAgent = createHttpAgent;

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * https://nodejs.org/api/https.html#https_https_globalagent
 * @param {String} ca - file location
 * @param {String} key - file location
 * @param {String} cert - file location, x509 certificate
 * @returns {https.Agent}
 */
function createHttpsAgent(_ref) {
  var ca = _ref.ca,
      key = _ref.key,
      cert = _ref.cert,
      rest = _objectWithoutProperties(_ref, ['ca', 'key', 'cert']);

  console.log('rest', rest);
  var opts = {};
  if (ca) {
    opts.ca = _fs2.default.readFileSync(ca);
  }
  if (key) {
    opts.key = _fs2.default.readFileSync(key);
  }
  if (cert) {
    opts.cert = _fs2.default.readFileSync(cert);
  }
  return new _https2.default.Agent(opts);
}

function createHttpAgent(opts) {
  return new _http2.default.Agent(opts);
}