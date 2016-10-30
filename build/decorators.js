"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logAsyncError = logAsyncError;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function logAsyncError(v, key, desc) {
  var old = desc.value;
  desc.value = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var _len,
        args,
        _key,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            for (_len = _args.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = _args[_key];
            }

            _context.next = 4;
            return old.call.apply(old, [this].concat(_toConsumableArray(args)));

          case 4:
            return _context.abrupt("return", _context.sent);

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);

            console.error("[" + key + "] error");
            throw new Error(_context.t0);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 7]]);
  }));
  return desc;
}