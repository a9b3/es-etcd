'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _helpers = require('./helpers.js');

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function instantiateAxiosInstance(_ref) {
  var agentOpts = _ref.agentOpts,
      opts = _ref.opts;

  var config = {};
  var httpAgentDefaultConfig = {
    keepAlive: true
  };
  if (agentOpts) {
    config.httpsAgent = (0, _helpers.createHttpsAgent)(Object.assign({}, httpAgentDefaultConfig, agentOpts));
  } else {
    config.httpAgent = (0, _helpers.createHttpAgent)(Object.assign({}, httpAgentDefaultConfig));
  }

  config = Object.assign({}, config, opts);

  return _axios2.default.create(config);
}

/*
 * https://coreos.com/etcd/docs/latest/v2/api.html
 */

var EsEtcd = function () {

  /*
   * opts: {
   *   scheme,
   *   host,
   *   port,
   *   agentOpts: {
   *     ca,
   *     cert,
   *     key,
   *   },
   * }
   */
  function EsEtcd(args) {
    _classCallCheck(this, EsEtcd);

    this._scheme = null;
    this._host = null;
    this._port = null;
    this._version = '2';
    this._axiosInstance = null;

    (0, _invariant2.default)(args.scheme, '\'scheme\' must be provided');
    (0, _invariant2.default)(args.host, '\'host\' must be provided');
    (0, _invariant2.default)(args.port, '\'port\' must be provided');

    this.configure(args);
  }

  /*
   * Use this instead of axios directly, this instance will be configured with
   * htpsAgent if ca, cert, or key is specified in configure()
   */


  _createClass(EsEtcd, [{
    key: 'configure',
    value: function configure(_ref2) {
      var scheme = _ref2.scheme,
          host = _ref2.host,
          port = _ref2.port,
          _ref2$version = _ref2.version,
          version = _ref2$version === undefined ? this._version : _ref2$version,
          agentOpts = _ref2.agentOpts;

      this._scheme = scheme;
      this._host = host;
      this._port = port;
      this._version = version;

      if (this._axiosInstance) {
        delete this._axiosInstance;
      }

      this._axiosInstance = instantiateAxiosInstance({
        agentOpts: agentOpts
      });
    }
  }, {
    key: '_getBaseUrl',
    value: function _getBaseUrl() {
      return this._scheme + '://' + this._host + ':' + this._port;
    }
  }, {
    key: '_getKeyUrl',
    value: function _getKeyUrl() {
      return this._getBaseUrl() + '/v' + this._version + '/keys';
    }

    /*
     * Response:
     *
     * node: {
     *   key: '/hi',
     *   value: 'hi',
     *   modifiedIndex: 4,
     *   createdIndex: 4,
     * }
     *
     * node: {
     *   key: '/hi',
     *   dir: true,
     *   nodes: [node],
     *   modifiedIndex: 4,
     *   createdIndex: 4,
     * }
     *
     * {
     *   action: 'get',
     *   node,
     * }
     */

  }, {
    key: 'get',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(key, opts) {
        var url, _ref4, node;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = this._getKeyUrl() + '/' + key + '?' + _querystring2.default.stringify(opts);
                _context.next = 3;
                return this._axiosInstance.get(url);

              case 3:
                _ref4 = _context.sent;
                node = _ref4.data.node;
                return _context.abrupt('return', node);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x, _x2) {
        return _ref3.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: 'set',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(key, value) {
        var _ref6, data;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this._axiosInstance.put(this._getKeyUrl() + '/' + key, _querystring2.default.stringify({ value: value }));

              case 2:
                _ref6 = _context2.sent;
                data = _ref6.data;
                return _context2.abrupt('return', data);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function set(_x3, _x4) {
        return _ref5.apply(this, arguments);
      }

      return set;
    }()
  }, {
    key: 'rm',
    value: function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(key, opts) {
        var url, _ref8, data;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                url = this._getKeyUrl() + '/' + key + '?' + _querystring2.default.stringify(opts);
                _context3.next = 3;
                return this._axiosInstance.delete(url);

              case 3:
                _ref8 = _context3.sent;
                data = _ref8.data;
                return _context3.abrupt('return', data);

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function rm(_x5, _x6) {
        return _ref7.apply(this, arguments);
      }

      return rm;
    }()

    // with tail call optimization this can be recursive

  }, {
    key: '_watch',
    value: function () {
      var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(key, cb, setCancel) {
        var opts, url, _ref10, data;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                opts = {
                  recursive: true,
                  wait: true
                };
                url = this._getKeyUrl() + '/' + key + '?' + _querystring2.default.stringify(opts);
                _context4.next = 5;
                return this._axiosInstance.get(url, {
                  cancelToken: new _axios.CancelToken(setCancel)
                });

              case 5:
                _ref10 = _context4.sent;
                data = _ref10.data;


                cb(data);
                return _context4.abrupt('return', this._watch(key, cb, setCancel));

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4['catch'](0);

                if (_axios2.default.isCancel(_context4.t0)) {
                  _context4.next = 15;
                  break;
                }

                throw new Error(_context4.t0);

              case 15:
                return _context4.abrupt('return');

              case 16:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 11]]);
      }));

      function _watch(_x7, _x8, _x9) {
        return _ref9.apply(this, arguments);
      }

      return _watch;
    }()
  }, {
    key: 'watch',
    value: function watch(key, cb) {
      var cancel = function cancel() {};
      this._watch(key, cb, function (c) {
        return cancel = c;
      });
      return function () {
        return cancel();
      };
    }
  }, {
    key: 'mkdir',
    value: function () {
      var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(key) {
        var _ref12, data;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this._axiosInstance.put(this._getKeyUrl() + '/' + key, _querystring2.default.stringify({ dir: true }));

              case 2:
                _ref12 = _context5.sent;
                data = _ref12.data;
                return _context5.abrupt('return', data);

              case 5:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function mkdir(_x10) {
        return _ref11.apply(this, arguments);
      }

      return mkdir;
    }()

    /**
     * Response:
     * {
     *  etcdserver: '3.0.0',
     *  etcdcluster: '3.0.0'
     * }
     */

  }, {
    key: 'version',
    value: function () {
      var _ref13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        var _ref14, data;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this._axiosInstance.get(this._getBaseUrl() + '/version');

              case 2:
                _ref14 = _context6.sent;
                data = _ref14.data;
                return _context6.abrupt('return', data);

              case 5:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function version() {
        return _ref13.apply(this, arguments);
      }

      return version;
    }()
  }, {
    key: 'statsLeader',
    value: function () {
      var _ref15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        var _ref16, data;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this._axiosInstance.get(this._getBaseUrl() + '/v' + this._version + '/stats/leader');

              case 2:
                _ref16 = _context7.sent;
                data = _ref16.data;
                return _context7.abrupt('return', data);

              case 5:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function statsLeader() {
        return _ref15.apply(this, arguments);
      }

      return statsLeader;
    }()
  }, {
    key: 'statsSelf',
    value: function () {
      var _ref17 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        var _ref18, data;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this._axiosInstance.get(this._getBaseUrl() + '/v' + this._version + '/stats/self');

              case 2:
                _ref18 = _context8.sent;
                data = _ref18.data;
                return _context8.abrupt('return', data);

              case 5:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function statsSelf() {
        return _ref17.apply(this, arguments);
      }

      return statsSelf;
    }()
  }]);

  return EsEtcd;
}();

exports.default = EsEtcd;