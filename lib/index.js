"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var fs_1 = __importDefault(require("fs"));
var readline_1 = __importDefault(require("readline"));
var Importer = /** @class */ (function () {
  function Importer(skip, filename, read, transform, write, flush, validate, handleError, handleException) {
    this.skip = skip;
    this.filename = filename;
    this.read = read;
    this.transform = transform;
    this.write = write;
    this.flush = flush;
    this.validate = validate;
    this.handleError = handleError;
    this.handleException = handleException;
    this.import = this.import.bind(this);
    this.transformAndWrite = this.transformAndWrite.bind(this);
    this.validateAndWrite = this.validateAndWrite.bind(this);
  }
  Importer.prototype.import = function () {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
    return __awaiter(this, void 0, void 0, function () {
      var total, success, v, lineSkiped, lastLine, i, _e, _f, _line, _g, _h, line, r, err_1, e_2_1, r, err_2, e_1_1, i, _j, _k, _line, _l, _m, line, r, err_3, e_4_1, r, err_4, e_3_1;
      return __generator(this, function (_o) {
        switch (_o.label) {
          case 0:
            total = 0;
            success = 0;
            v = this.validate;
            lineSkiped = 0;
            lastLine = '';
            if (!v) return [3 /*break*/, 32];
            i = 0;
            _o.label = 1;
          case 1:
            _o.trys.push([1, 25, 26, 31]);
            _e = __asyncValues(this.read);
            _o.label = 2;
          case 2: return [4 /*yield*/, _e.next()];
          case 3:
            if (!(_f = _o.sent(), !_f.done)) return [3 /*break*/, 24];
            _line = _f.value;
            ++lineSkiped;
            if (!(this.skip === lineSkiped)) return [3 /*break*/, 23];
            _o.label = 4;
          case 4:
            _o.trys.push([4, 12, 13, 18]);
            _g = __asyncValues(this.read);
            _o.label = 5;
          case 5: return [4 /*yield*/, _g.next()];
          case 6:
            if (!(_h = _o.sent(), !_h.done)) return [3 /*break*/, 11];
            line = _h.value;
            lastLine = line;
            total++;
            r = 0;
            _o.label = 7;
          case 7:
            _o.trys.push([7, 9, , 10]);
            return [4 /*yield*/, this.validateAndWrite(line, v, i++)];
          case 8:
            r = _o.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 10];
          case 9:
            err_1 = _o.sent();
            if (this.handleException) {
              this.handleException(line, err_1, i, this.filename);
            }
            return [3 /*break*/, 10];
          case 10: return [3 /*break*/, 5];
          case 11: return [3 /*break*/, 18];
          case 12:
            e_2_1 = _o.sent();
            e_2 = { error: e_2_1 };
            return [3 /*break*/, 18];
          case 13:
            _o.trys.push([13, , 16, 17]);
            if (!(_h && !_h.done && (_b = _g.return))) return [3 /*break*/, 15];
            return [4 /*yield*/, _b.call(_g)];
          case 14:
            _o.sent();
            _o.label = 15;
          case 15: return [3 /*break*/, 17];
          case 16:
            if (e_2) throw e_2.error;
            return [7 /*endfinally*/];
          case 17: return [7 /*endfinally*/];
          case 18:
            if (!this.flush) return [3 /*break*/, 22];
            _o.label = 19;
          case 19:
            _o.trys.push([19, 21, , 22]);
            return [4 /*yield*/, this.flush()];
          case 20:
            r = _o.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 22];
          case 21:
            err_2 = _o.sent();
            if (this.handleException) {
              this.handleException(lastLine, err_2, i, this.filename);
            }
            return [3 /*break*/, 22];
          case 22: return [3 /*break*/, 24];
          case 23: return [3 /*break*/, 2];
          case 24: return [3 /*break*/, 31];
          case 25:
            e_1_1 = _o.sent();
            e_1 = { error: e_1_1 };
            return [3 /*break*/, 31];
          case 26:
            _o.trys.push([26, , 29, 30]);
            if (!(_f && !_f.done && (_a = _e.return))) return [3 /*break*/, 28];
            return [4 /*yield*/, _a.call(_e)];
          case 27:
            _o.sent();
            _o.label = 28;
          case 28: return [3 /*break*/, 30];
          case 29:
            if (e_1) throw e_1.error;
            return [7 /*endfinally*/];
          case 30: return [7 /*endfinally*/];
          case 31: return [2 /*return*/, { total: total, success: success }];
          case 32:
            i = 0;
            _o.label = 33;
          case 33:
            _o.trys.push([33, 57, 58, 63]);
            _j = __asyncValues(this.read);
            _o.label = 34;
          case 34: return [4 /*yield*/, _j.next()];
          case 35:
            if (!(_k = _o.sent(), !_k.done)) return [3 /*break*/, 56];
            _line = _k.value;
            ++lineSkiped;
            i++;
            if (!(this.skip === lineSkiped)) return [3 /*break*/, 55];
            _o.label = 36;
          case 36:
            _o.trys.push([36, 44, 45, 50]);
            _l = __asyncValues(this.read);
            _o.label = 37;
          case 37: return [4 /*yield*/, _l.next()];
          case 38:
            if (!(_m = _o.sent(), !_m.done)) return [3 /*break*/, 43];
            line = _m.value;
            lastLine = line;
            i++;
            total++;
            r = 0;
            _o.label = 39;
          case 39:
            _o.trys.push([39, 41, , 42]);
            return [4 /*yield*/, this.transformAndWrite(line)];
          case 40:
            r = _o.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 42];
          case 41:
            err_3 = _o.sent();
            if (this.handleException) {
              this.handleException(line, err_3, i, this.filename);
            }
            return [3 /*break*/, 42];
          case 42: return [3 /*break*/, 37];
          case 43: return [3 /*break*/, 50];
          case 44:
            e_4_1 = _o.sent();
            e_4 = { error: e_4_1 };
            return [3 /*break*/, 50];
          case 45:
            _o.trys.push([45, , 48, 49]);
            if (!(_m && !_m.done && (_d = _l.return))) return [3 /*break*/, 47];
            return [4 /*yield*/, _d.call(_l)];
          case 46:
            _o.sent();
            _o.label = 47;
          case 47: return [3 /*break*/, 49];
          case 48:
            if (e_4) throw e_4.error;
            return [7 /*endfinally*/];
          case 49: return [7 /*endfinally*/];
          case 50:
            if (!this.flush) return [3 /*break*/, 54];
            _o.label = 51;
          case 51:
            _o.trys.push([51, 53, , 54]);
            return [4 /*yield*/, this.flush()];
          case 52:
            r = _o.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 54];
          case 53:
            err_4 = _o.sent();
            if (this.handleException) {
              this.handleException(lastLine, err_4, i, this.filename);
            }
            return [3 /*break*/, 54];
          case 54: return [3 /*break*/, 56];
          case 55: return [3 /*break*/, 34];
          case 56: return [3 /*break*/, 63];
          case 57:
            e_3_1 = _o.sent();
            e_3 = { error: e_3_1 };
            return [3 /*break*/, 63];
          case 58:
            _o.trys.push([58, , 61, 62]);
            if (!(_k && !_k.done && (_c = _j.return))) return [3 /*break*/, 60];
            return [4 /*yield*/, _c.call(_j)];
          case 59:
            _o.sent();
            _o.label = 60;
          case 60: return [3 /*break*/, 62];
          case 61:
            if (e_3) throw e_3.error;
            return [7 /*endfinally*/];
          case 62: return [7 /*endfinally*/];
          case 63: return [2 /*return*/, { total: total, success: success }];
        }
      });
    });
  };
  Importer.prototype.transformAndWrite = function (data) {
    return __awaiter(this, void 0, void 0, function () {
      var rs, r;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4 /*yield*/, this.transform(data)];
          case 1:
            rs = _a.sent();
            return [4 /*yield*/, this.write(rs)];
          case 2:
            r = _a.sent();
            return [2 /*return*/, r];
        }
      });
    });
  };
  Importer.prototype.validateAndWrite = function (data, validate, line) {
    return __awaiter(this, void 0, void 0, function () {
      var rs, errors, r;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4 /*yield*/, this.transform(data)];
          case 1:
            rs = _a.sent();
            return [4 /*yield*/, validate(rs)];
          case 2:
            errors = _a.sent();
            if (!(errors && errors.length > 0)) return [3 /*break*/, 3];
            if (this.handleError) {
              this.handleError(rs, errors, line, this.filename);
            }
            return [2 /*return*/, 0];
          case 3: return [4 /*yield*/, this.write(rs)];
          case 4:
            r = _a.sent();
            return [2 /*return*/, r];
        }
      });
    });
  };
  return Importer;
}());
exports.Importer = Importer;
// tslint:disable-next-line:max-classes-per-file
var ImportService = /** @class */ (function () {
  function ImportService(skip, filename, read, transformer, writer, validator, errorHandler, exceptionHandler) {
    this.skip = skip;
    this.filename = filename;
    this.read = read;
    this.transformer = transformer;
    this.writer = writer;
    this.validator = validator;
    this.errorHandler = errorHandler;
    this.exceptionHandler = exceptionHandler;
    this.import = this.import.bind(this);
    this.transformAndWrite = this.transformAndWrite.bind(this);
    this.validateAndWrite = this.validateAndWrite.bind(this);
  }
  ImportService.prototype.import = function () {
    var e_5, _a, e_6, _b, e_7, _c, e_8, _d;
    return __awaiter(this, void 0, void 0, function () {
      var total, success, v, lineSkiped, lastLine, i, _e, _f, _line, _g, _h, line, r, err_5, e_6_1, r, err_6, e_5_1, i, _j, _k, _line, _l, _m, line, r, err_7, e_8_1, r, err_8, e_7_1;
      return __generator(this, function (_o) {
        switch (_o.label) {
          case 0:
            total = 0;
            success = 0;
            v = this.validator;
            lineSkiped = 0;
            lastLine = '';
            if (!v) return [3 /*break*/, 32];
            i = 0;
            _o.label = 1;
          case 1:
            _o.trys.push([1, 25, 26, 31]);
            _e = __asyncValues(this.read);
            _o.label = 2;
          case 2: return [4 /*yield*/, _e.next()];
          case 3:
            if (!(_f = _o.sent(), !_f.done)) return [3 /*break*/, 24];
            _line = _f.value;
            ++lineSkiped;
            if (!(this.skip === lineSkiped)) return [3 /*break*/, 23];
            _o.label = 4;
          case 4:
            _o.trys.push([4, 12, 13, 18]);
            _g = __asyncValues(this.read);
            _o.label = 5;
          case 5: return [4 /*yield*/, _g.next()];
          case 6:
            if (!(_h = _o.sent(), !_h.done)) return [3 /*break*/, 11];
            line = _h.value;
            lastLine = line;
            total++;
            r = 0;
            _o.label = 7;
          case 7:
            _o.trys.push([7, 9, , 10]);
            return [4 /*yield*/, this.validateAndWrite(line, v, i++)];
          case 8:
            r = _o.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 10];
          case 9:
            err_5 = _o.sent();
            if (this.exceptionHandler) {
              this.exceptionHandler.handleException(line, err_5, i, this.filename);
            }
            return [3 /*break*/, 10];
          case 10: return [3 /*break*/, 5];
          case 11: return [3 /*break*/, 18];
          case 12:
            e_6_1 = _o.sent();
            e_6 = { error: e_6_1 };
            return [3 /*break*/, 18];
          case 13:
            _o.trys.push([13, , 16, 17]);
            if (!(_h && !_h.done && (_b = _g.return))) return [3 /*break*/, 15];
            return [4 /*yield*/, _b.call(_g)];
          case 14:
            _o.sent();
            _o.label = 15;
          case 15: return [3 /*break*/, 17];
          case 16:
            if (e_6) throw e_6.error;
            return [7 /*endfinally*/];
          case 17: return [7 /*endfinally*/];
          case 18:
            if (!this.writer.flush) return [3 /*break*/, 22];
            _o.label = 19;
          case 19:
            _o.trys.push([19, 21, , 22]);
            return [4 /*yield*/, this.writer.flush()];
          case 20:
            r = _o.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 22];
          case 21:
            err_6 = _o.sent();
            if (this.exceptionHandler) {
              this.exceptionHandler.handleException(lastLine, err_6, i, this.filename);
            }
            return [3 /*break*/, 22];
          case 22: return [3 /*break*/, 24];
          case 23: return [3 /*break*/, 2];
          case 24: return [3 /*break*/, 31];
          case 25:
            e_5_1 = _o.sent();
            e_5 = { error: e_5_1 };
            return [3 /*break*/, 31];
          case 26:
            _o.trys.push([26, , 29, 30]);
            if (!(_f && !_f.done && (_a = _e.return))) return [3 /*break*/, 28];
            return [4 /*yield*/, _a.call(_e)];
          case 27:
            _o.sent();
            _o.label = 28;
          case 28: return [3 /*break*/, 30];
          case 29:
            if (e_5) throw e_5.error;
            return [7 /*endfinally*/];
          case 30: return [7 /*endfinally*/];
          case 31: return [2 /*return*/, { total: total, success: success }];
          case 32:
            i = 0;
            _o.label = 33;
          case 33:
            _o.trys.push([33, 57, 58, 63]);
            _j = __asyncValues(this.read);
            _o.label = 34;
          case 34: return [4 /*yield*/, _j.next()];
          case 35:
            if (!(_k = _o.sent(), !_k.done)) return [3 /*break*/, 56];
            _line = _k.value;
            ++lineSkiped;
            i++;
            if (!(this.skip === lineSkiped)) return [3 /*break*/, 55];
            _o.label = 36;
          case 36:
            _o.trys.push([36, 44, 45, 50]);
            _l = __asyncValues(this.read);
            _o.label = 37;
          case 37: return [4 /*yield*/, _l.next()];
          case 38:
            if (!(_m = _o.sent(), !_m.done)) return [3 /*break*/, 43];
            line = _m.value;
            lastLine = line;
            i++;
            total++;
            r = 0;
            _o.label = 39;
          case 39:
            _o.trys.push([39, 41, , 42]);
            return [4 /*yield*/, this.transformAndWrite(line)];
          case 40:
            r = _o.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 42];
          case 41:
            err_7 = _o.sent();
            if (this.exceptionHandler) {
              this.exceptionHandler.handleException(line, err_7, i, this.filename);
            }
            return [3 /*break*/, 42];
          case 42: return [3 /*break*/, 37];
          case 43: return [3 /*break*/, 50];
          case 44:
            e_8_1 = _o.sent();
            e_8 = { error: e_8_1 };
            return [3 /*break*/, 50];
          case 45:
            _o.trys.push([45, , 48, 49]);
            if (!(_m && !_m.done && (_d = _l.return))) return [3 /*break*/, 47];
            return [4 /*yield*/, _d.call(_l)];
          case 46:
            _o.sent();
            _o.label = 47;
          case 47: return [3 /*break*/, 49];
          case 48:
            if (e_8) throw e_8.error;
            return [7 /*endfinally*/];
          case 49: return [7 /*endfinally*/];
          case 50:
            if (!this.writer.flush) return [3 /*break*/, 54];
            _o.label = 51;
          case 51:
            _o.trys.push([51, 53, , 54]);
            return [4 /*yield*/, this.writer.flush()];
          case 52:
            r = _o.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 54];
          case 53:
            err_8 = _o.sent();
            if (this.exceptionHandler) {
              this.exceptionHandler.handleException(lastLine, err_8, i, this.filename);
            }
            return [3 /*break*/, 54];
          case 54: return [3 /*break*/, 56];
          case 55: return [3 /*break*/, 34];
          case 56: return [3 /*break*/, 63];
          case 57:
            e_7_1 = _o.sent();
            e_7 = { error: e_7_1 };
            return [3 /*break*/, 63];
          case 58:
            _o.trys.push([58, , 61, 62]);
            if (!(_k && !_k.done && (_c = _j.return))) return [3 /*break*/, 60];
            return [4 /*yield*/, _c.call(_j)];
          case 59:
            _o.sent();
            _o.label = 60;
          case 60: return [3 /*break*/, 62];
          case 61:
            if (e_7) throw e_7.error;
            return [7 /*endfinally*/];
          case 62: return [7 /*endfinally*/];
          case 63: return [2 /*return*/, { total: total, success: success }];
        }
      });
    });
  };
  ImportService.prototype.transformAndWrite = function (data) {
    return __awaiter(this, void 0, void 0, function () {
      var rs, r;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4 /*yield*/, this.transformer.transform(data)];
          case 1:
            rs = _a.sent();
            return [4 /*yield*/, this.writer.write(rs)];
          case 2:
            r = _a.sent();
            return [2 /*return*/, r];
        }
      });
    });
  };
  ImportService.prototype.validateAndWrite = function (data, validator, line) {
    return __awaiter(this, void 0, void 0, function () {
      var rs, errors, r;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4 /*yield*/, this.transformer.transform(data)];
          case 1:
            rs = _a.sent();
            return [4 /*yield*/, validator.validate(rs)];
          case 2:
            errors = _a.sent();
            if (!(errors && errors.length > 0)) return [3 /*break*/, 3];
            if (this.errorHandler) {
              this.errorHandler.handleError(rs, errors, line, this.filename);
            }
            return [2 /*return*/, 0];
          case 3: return [4 /*yield*/, this.writer.write(rs)];
          case 4:
            r = _a.sent();
            return [2 /*return*/, r];
        }
      });
    });
  };
  return ImportService;
}());
exports.ImportService = ImportService;
function toString(v) {
  if (typeof v === 'string') {
    return v;
  }
  else {
    return JSON.stringify(v);
  }
}
exports.toString = toString;
// tslint:disable-next-line:max-classes-per-file
var ErrorHandler = /** @class */ (function () {
  function ErrorHandler(logError) {
    this.logError = logError;
    this.handleError = this.handleError.bind(this);
  }
  ErrorHandler.prototype.handleError = function (rs, errors, i, filename) {
    this.logError("Message is invalid: " + toString(rs) + " . Error: " + toString(errors) + " filename: " + filename + " line: " + i);
  };
  return ErrorHandler;
}());
exports.ErrorHandler = ErrorHandler;
// tslint:disable-next-line:max-classes-per-file
var ExceptionHandler = /** @class */ (function () {
  function ExceptionHandler(logError) {
    this.logError = logError;
    this.handleException = this.handleException.bind(this);
  }
  ExceptionHandler.prototype.handleException = function (rs, err, i, filename) {
    this.logError("Error to write: " + toString(rs) + " . Error: " + toString(err) + " filename: " + filename + " line: " + i);
  };
  return ExceptionHandler;
}());
exports.ExceptionHandler = ExceptionHandler;
// tslint:disable-next-line:max-classes-per-file
var Delimiter = /** @class */ (function () {
  function Delimiter(delimiter, attrs) {
    this.delimiter = delimiter;
    this.attrs = attrs;
    this.transform = this.transform.bind(this);
  }
  Delimiter.prototype.transform = function (data) {
    var keys = Object.keys(this.attrs);
    var rs = {};
    var list = data.split(this.delimiter);
    var l = Math.min(list.length, keys.length);
    for (var i = 0; i < l; i++) {
      var attr = this.attrs[keys[i]];
      var v = list[i];
      switch (attr.type) {
        case 'number':
        case 'integer':
          // tslint:disable-next-line:radix
          var parsed = parseInt(v);
          if (!isNaN(parsed) || !Number(parsed)) {
            rs[keys[i]] = parsed;
          }
          break;
        case 'datetime':
        case 'date':
          var d = new Date(v);
          if (d instanceof Date && !isNaN(d.valueOf())) {
            rs[keys[i]] = d;
          }
          break;
        case 'boolean':
          if (v === '1' || v === 'Y' || v === 'T') {
            rs[keys[i]] = true;
          }
          else if (v.length > 0) {
            rs[keys[i]] = false;
          }
          break;
        default:
          rs[keys[i]] = v;
          break;
      }
    }
    return Promise.resolve(rs);
  };
  return Delimiter;
}());
exports.Delimiter = Delimiter;
// tslint:disable-next-line:ban-types
function buildStrings(files) {
  var res = [];
  for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
    var file = files_1[_i];
    res.push(file.toString());
  }
  return res;
}
exports.buildStrings = buildStrings;
function getFiles(files, check) {
  var res = [];
  for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
    var file = files_2[_i];
    var v = check(file);
    if (v === true) {
      res.push(file);
    }
  }
  return res;
}
exports.getFiles = getFiles;
// tslint:disable-next-line:max-classes-per-file
var NameChecker = /** @class */ (function () {
  function NameChecker(prefix, suffix) {
    this.prefix = prefix;
    this.suffix = suffix;
    this.check = this.check.bind(this);
  }
  NameChecker.prototype.check = function (name) {
    if (name.startsWith(this.prefix) && name.endsWith(this.suffix)) {
      return true;
    }
    return false;
  };
  return NameChecker;
}());
exports.NameChecker = NameChecker;
function getPrefix(s, date, offset, separator) {
  if (offset !== undefined) {
    var d = addDays(date, offset);
    return s + dateToString(d, separator);
  }
  else {
    return s + dateToString(date, separator);
  }
}
exports.getPrefix = getPrefix;
function dateToString(date, separator) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var dt = date.getDate();
  if (dt < 10) {
    dt = '0' + dt.toString();
  }
  if (month < 10) {
    month = '0' + month;
  }
  if (separator !== undefined) {
    return '' + year + separator + month + separator + dt;
  }
  else {
    return '' + year + month + dt;
  }
}
exports.dateToString = dateToString;
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
exports.addDays = addDays;
function createReader(filename, options) {
  return __awaiter(this, void 0, void 0, function () {
    var c, stream, read;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          c = (options !== undefined ? options : 'utf-8');
          stream = fs_1.default.createReadStream(filename, c);
          return [4 /*yield*/, Promise.all([events_1.once(stream, 'open')])];
        case 1:
          _a.sent();
          read = readline_1.default.createInterface({ input: stream, crlfDelay: Infinity });
          return [2 /*return*/, read];
      }
    });
  });
}
exports.createReader = createReader;
