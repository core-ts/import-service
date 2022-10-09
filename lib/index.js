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
var __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var fs = __importStar(require("fs"));
var readline = __importStar(require("readline"));
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
    var e_1, _a, e_2, _b;
    return __awaiter(this, void 0, void 0, function () {
      var total, success, v, lineSkiped, lastLine, i, _c, _d, _line, r, e_1_1, r, i, _e, _f, _line, r, r, e_2_1;
      return __generator(this, function (_g) {
        switch (_g.label) {
          case 0:
            total = 0;
            success = 0;
            v = this.validate;
            lineSkiped = 0;
            lastLine = '';
            if (!v) return [3 /*break*/, 17];
            i = 0;
            if (!(this.skip > 0)) return [3 /*break*/, 14];
            _g.label = 1;
          case 1:
            _g.trys.push([1, 7, 8, 13]);
            _c = __asyncValues(this.read);
            _g.label = 2;
          case 2: return [4 /*yield*/, _c.next()];
          case 3:
            if (!(_d = _g.sent(), !_d.done)) return [3 /*break*/, 6];
            _line = _d.value;
            ++lineSkiped;
            if (!(this.skip === lineSkiped)) return [3 /*break*/, 5];
            return [4 /*yield*/, this.validateAndWrite(lastLine, total, v, i)];
          case 4:
            r = _g.sent();
            total = r.total;
            success = r.success;
            i = r.i;
            return [3 /*break*/, 6];
          case 5: return [3 /*break*/, 2];
          case 6: return [3 /*break*/, 13];
          case 7:
            e_1_1 = _g.sent();
            e_1 = { error: e_1_1 };
            return [3 /*break*/, 13];
          case 8:
            _g.trys.push([8, , 11, 12]);
            if (!(_d && !_d.done && (_a = _c.return))) return [3 /*break*/, 10];
            return [4 /*yield*/, _a.call(_c)];
          case 9:
            _g.sent();
            _g.label = 10;
          case 10: return [3 /*break*/, 12];
          case 11:
            if (e_1) throw e_1.error;
            return [7 /*endfinally*/];
          case 12: return [7 /*endfinally*/];
          case 13: return [3 /*break*/, 16];
          case 14: return [4 /*yield*/, this.validateAndWrite(lastLine, total, v, i)];
          case 15:
            r = _g.sent();
            total = r.total;
            success = r.success;
            i = r.i;
            _g.label = 16;
          case 16: return [2 /*return*/, { total: total, success: success }];
          case 17:
            i = 0;
            _g.label = 18;
          case 18:
            _g.trys.push([18, 27, 28, 33]);
            _e = __asyncValues(this.read);
            _g.label = 19;
          case 19: return [4 /*yield*/, _e.next()];
          case 20:
            if (!(_f = _g.sent(), !_f.done)) return [3 /*break*/, 26];
            _line = _f.value;
            ++lineSkiped;
            i++;
            if (!this.skip) return [3 /*break*/, 23];
            if (!(this.skip === lineSkiped)) return [3 /*break*/, 22];
            return [4 /*yield*/, this.transformAndWrite(lastLine, total, i)];
          case 21:
            r = _g.sent();
            total = r.total;
            success = r.success;
            i = r.i;
            return [3 /*break*/, 26];
          case 22: return [3 /*break*/, 25];
          case 23: return [4 /*yield*/, this.transformAndWrite(lastLine, total, i)];
          case 24:
            r = _g.sent();
            total = r.total;
            success = r.success;
            i = r.i;
            return [3 /*break*/, 26];
          case 25: return [3 /*break*/, 19];
          case 26: return [3 /*break*/, 33];
          case 27:
            e_2_1 = _g.sent();
            e_2 = { error: e_2_1 };
            return [3 /*break*/, 33];
          case 28:
            _g.trys.push([28, , 31, 32]);
            if (!(_f && !_f.done && (_b = _e.return))) return [3 /*break*/, 30];
            return [4 /*yield*/, _b.call(_e)];
          case 29:
            _g.sent();
            _g.label = 30;
          case 30: return [3 /*break*/, 32];
          case 31:
            if (e_2) throw e_2.error;
            return [7 /*endfinally*/];
          case 32: return [7 /*endfinally*/];
          case 33: return [2 /*return*/, { total: total, success: success }];
        }
      });
    });
  };
  Importer.prototype.validateAndWrite = function (lastLine, total, validate, i) {
    var e_3, _a;
    return __awaiter(this, void 0, void 0, function () {
      var success, _b, _c, line, rs, errors, r, err_1, e_3_1, r, err_2;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            success = 0;
            _d.label = 1;
          case 1:
            _d.trys.push([1, 13, 14, 19]);
            _b = __asyncValues(this.read);
            _d.label = 2;
          case 2: return [4 /*yield*/, _b.next()];
          case 3:
            if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 12];
            line = _c.value;
            lastLine = line;
            total++;
            _d.label = 4;
          case 4:
            _d.trys.push([4, 10, , 11]);
            return [4 /*yield*/, this.transform(line)];
          case 5:
            rs = _d.sent();
            return [4 /*yield*/, validate(rs)];
          case 6:
            errors = _d.sent();
            if (!(errors && errors.length > 0)) return [3 /*break*/, 7];
            if (this.handleError) {
              this.handleError(rs, errors, i++, this.filename);
            }
            return [3 /*break*/, 9];
          case 7: return [4 /*yield*/, this.write(rs)];
          case 8:
            r = _d.sent();
            if (r > 0) {
              success = success + r;
            }
            i++;
            _d.label = 9;
          case 9: return [3 /*break*/, 11];
          case 10:
            err_1 = _d.sent();
            if (this.handleException) {
              this.handleException(line, err_1, i++, this.filename);
            }
            return [3 /*break*/, 11];
          case 11: return [3 /*break*/, 2];
          case 12: return [3 /*break*/, 19];
          case 13:
            e_3_1 = _d.sent();
            e_3 = { error: e_3_1 };
            return [3 /*break*/, 19];
          case 14:
            _d.trys.push([14, , 17, 18]);
            if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 16];
            return [4 /*yield*/, _a.call(_b)];
          case 15:
            _d.sent();
            _d.label = 16;
          case 16: return [3 /*break*/, 18];
          case 17:
            if (e_3) throw e_3.error;
            return [7 /*endfinally*/];
          case 18: return [7 /*endfinally*/];
          case 19:
            if (!this.flush) return [3 /*break*/, 23];
            _d.label = 20;
          case 20:
            _d.trys.push([20, 22, , 23]);
            return [4 /*yield*/, this.flush()];
          case 21:
            r = _d.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 23];
          case 22:
            err_2 = _d.sent();
            if (this.handleException) {
              this.handleException(lastLine, err_2, i, this.filename);
            }
            return [3 /*break*/, 23];
          case 23: return [2 /*return*/, { total: total, success: success, i: i }];
        }
      });
    });
  };
  Importer.prototype.transformAndWrite = function (lastLine, total, i) {
    var e_4, _a;
    return __awaiter(this, void 0, void 0, function () {
      var success, _b, _c, line, rs, r, err_3, e_4_1, r, err_4;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            success = 0;
            _d.label = 1;
          case 1:
            _d.trys.push([1, 10, 11, 16]);
            _b = __asyncValues(this.read);
            _d.label = 2;
          case 2: return [4 /*yield*/, _b.next()];
          case 3:
            if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 9];
            line = _c.value;
            lastLine = line;
            i++;
            total++;
            _d.label = 4;
          case 4:
            _d.trys.push([4, 7, , 8]);
            return [4 /*yield*/, this.transform(line)];
          case 5:
            rs = _d.sent();
            return [4 /*yield*/, this.write(rs)];
          case 6:
            r = _d.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 8];
          case 7:
            err_3 = _d.sent();
            if (this.handleException) {
              this.handleException(line, err_3, i, this.filename);
            }
            return [3 /*break*/, 8];
          case 8: return [3 /*break*/, 2];
          case 9: return [3 /*break*/, 16];
          case 10:
            e_4_1 = _d.sent();
            e_4 = { error: e_4_1 };
            return [3 /*break*/, 16];
          case 11:
            _d.trys.push([11, , 14, 15]);
            if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 13];
            return [4 /*yield*/, _a.call(_b)];
          case 12:
            _d.sent();
            _d.label = 13;
          case 13: return [3 /*break*/, 15];
          case 14:
            if (e_4) throw e_4.error;
            return [7 /*endfinally*/];
          case 15: return [7 /*endfinally*/];
          case 16:
            if (!this.flush) return [3 /*break*/, 20];
            _d.label = 17;
          case 17:
            _d.trys.push([17, 19, , 20]);
            return [4 /*yield*/, this.flush()];
          case 18:
            r = _d.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 20];
          case 19:
            err_4 = _d.sent();
            if (this.handleException) {
              this.handleException(lastLine, err_4, i, this.filename);
            }
            return [3 /*break*/, 20];
          case 20: return [2 /*return*/, { total: total, success: success, i: i }];
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
    this.validateAndWrite = this.validateAndWrite.bind(this);
    this.transformAndWrite = this.transformAndWrite.bind(this);
  }
  ImportService.prototype.import = function () {
    var e_5, _a, e_6, _b;
    return __awaiter(this, void 0, void 0, function () {
      var total, success, v, lineSkiped, lastLine, i, _c, _d, _line, r, e_5_1, r, i, _e, _f, _line, r, r, e_6_1;
      return __generator(this, function (_g) {
        switch (_g.label) {
          case 0:
            total = 0;
            success = 0;
            v = this.validator;
            lineSkiped = 0;
            lastLine = '';
            if (!v) return [3 /*break*/, 17];
            i = 0;
            if (!(this.skip > 0)) return [3 /*break*/, 14];
            _g.label = 1;
          case 1:
            _g.trys.push([1, 7, 8, 13]);
            _c = __asyncValues(this.read);
            _g.label = 2;
          case 2: return [4 /*yield*/, _c.next()];
          case 3:
            if (!(_d = _g.sent(), !_d.done)) return [3 /*break*/, 6];
            _line = _d.value;
            ++lineSkiped;
            if (!(this.skip === lineSkiped)) return [3 /*break*/, 5];
            return [4 /*yield*/, this.validateAndWrite(lastLine, total, v, i)];
          case 4:
            r = _g.sent();
            total = r.total;
            success = r.success;
            i = r.i;
            return [3 /*break*/, 6];
          case 5: return [3 /*break*/, 2];
          case 6: return [3 /*break*/, 13];
          case 7:
            e_5_1 = _g.sent();
            e_5 = { error: e_5_1 };
            return [3 /*break*/, 13];
          case 8:
            _g.trys.push([8, , 11, 12]);
            if (!(_d && !_d.done && (_a = _c.return))) return [3 /*break*/, 10];
            return [4 /*yield*/, _a.call(_c)];
          case 9:
            _g.sent();
            _g.label = 10;
          case 10: return [3 /*break*/, 12];
          case 11:
            if (e_5) throw e_5.error;
            return [7 /*endfinally*/];
          case 12: return [7 /*endfinally*/];
          case 13: return [3 /*break*/, 16];
          case 14: return [4 /*yield*/, this.validateAndWrite(lastLine, total, v, i)];
          case 15:
            r = _g.sent();
            total = r.total;
            success = r.success;
            i = r.i;
            _g.label = 16;
          case 16: return [2 /*return*/, { total: total, success: success }];
          case 17:
            i = 0;
            _g.label = 18;
          case 18:
            _g.trys.push([18, 27, 28, 33]);
            _e = __asyncValues(this.read);
            _g.label = 19;
          case 19: return [4 /*yield*/, _e.next()];
          case 20:
            if (!(_f = _g.sent(), !_f.done)) return [3 /*break*/, 26];
            _line = _f.value;
            ++lineSkiped;
            i++;
            if (!this.skip) return [3 /*break*/, 23];
            if (!(this.skip === lineSkiped)) return [3 /*break*/, 22];
            return [4 /*yield*/, this.transformAndWrite(lastLine, total, i)];
          case 21:
            r = _g.sent();
            total = r.total;
            success = r.success;
            i = r.i;
            return [3 /*break*/, 26];
          case 22: return [3 /*break*/, 25];
          case 23: return [4 /*yield*/, this.transformAndWrite(lastLine, total, i)];
          case 24:
            r = _g.sent();
            total = r.total;
            success = r.success;
            i = r.i;
            return [3 /*break*/, 26];
          case 25: return [3 /*break*/, 19];
          case 26: return [3 /*break*/, 33];
          case 27:
            e_6_1 = _g.sent();
            e_6 = { error: e_6_1 };
            return [3 /*break*/, 33];
          case 28:
            _g.trys.push([28, , 31, 32]);
            if (!(_f && !_f.done && (_b = _e.return))) return [3 /*break*/, 30];
            return [4 /*yield*/, _b.call(_e)];
          case 29:
            _g.sent();
            _g.label = 30;
          case 30: return [3 /*break*/, 32];
          case 31:
            if (e_6) throw e_6.error;
            return [7 /*endfinally*/];
          case 32: return [7 /*endfinally*/];
          case 33: return [2 /*return*/, { total: total, success: success }];
        }
      });
    });
  };
  ImportService.prototype.validateAndWrite = function (lastLine, total, v, i) {
    var e_7, _a;
    return __awaiter(this, void 0, void 0, function () {
      var success, _b, _c, line, rs, errors, r, err_5, e_7_1, r, err_6;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            success = 0;
            _d.label = 1;
          case 1:
            _d.trys.push([1, 13, 14, 19]);
            _b = __asyncValues(this.read);
            _d.label = 2;
          case 2: return [4 /*yield*/, _b.next()];
          case 3:
            if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 12];
            line = _c.value;
            lastLine = line;
            total++;
            _d.label = 4;
          case 4:
            _d.trys.push([4, 10, , 11]);
            return [4 /*yield*/, this.transformer.transform(line)];
          case 5:
            rs = _d.sent();
            return [4 /*yield*/, v.validate(rs)];
          case 6:
            errors = _d.sent();
            if (!(errors && errors.length > 0)) return [3 /*break*/, 7];
            if (this.errorHandler) {
              this.errorHandler.handleError(rs, errors, i++, this.filename);
            }
            return [3 /*break*/, 9];
          case 7: return [4 /*yield*/, this.writer.write(rs)];
          case 8:
            r = _d.sent();
            if (r > 0) {
              success = success + r;
            }
            i++;
            _d.label = 9;
          case 9: return [3 /*break*/, 11];
          case 10:
            err_5 = _d.sent();
            if (this.exceptionHandler) {
              this.exceptionHandler.handleException(line, err_5, i++, this.filename);
            }
            return [3 /*break*/, 11];
          case 11: return [3 /*break*/, 2];
          case 12: return [3 /*break*/, 19];
          case 13:
            e_7_1 = _d.sent();
            e_7 = { error: e_7_1 };
            return [3 /*break*/, 19];
          case 14:
            _d.trys.push([14, , 17, 18]);
            if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 16];
            return [4 /*yield*/, _a.call(_b)];
          case 15:
            _d.sent();
            _d.label = 16;
          case 16: return [3 /*break*/, 18];
          case 17:
            if (e_7) throw e_7.error;
            return [7 /*endfinally*/];
          case 18: return [7 /*endfinally*/];
          case 19:
            if (!this.writer.flush) return [3 /*break*/, 23];
            _d.label = 20;
          case 20:
            _d.trys.push([20, 22, , 23]);
            return [4 /*yield*/, this.writer.flush()];
          case 21:
            r = _d.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 23];
          case 22:
            err_6 = _d.sent();
            if (this.exceptionHandler) {
              this.exceptionHandler.handleException(lastLine, err_6, i, this.filename);
            }
            return [3 /*break*/, 23];
          case 23: return [2 /*return*/, { total: total, success: success, i: i }];
        }
      });
    });
  };
  ImportService.prototype.transformAndWrite = function (lastLine, total, i) {
    var e_8, _a;
    return __awaiter(this, void 0, void 0, function () {
      var success, _b, _c, line, rs, r, err_7, e_8_1, r, err_8;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            success = 0;
            _d.label = 1;
          case 1:
            _d.trys.push([1, 10, 11, 16]);
            _b = __asyncValues(this.read);
            _d.label = 2;
          case 2: return [4 /*yield*/, _b.next()];
          case 3:
            if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 9];
            line = _c.value;
            lastLine = line;
            i++;
            total++;
            _d.label = 4;
          case 4:
            _d.trys.push([4, 7, , 8]);
            return [4 /*yield*/, this.transformer.transform(line)];
          case 5:
            rs = _d.sent();
            return [4 /*yield*/, this.writer.write(rs)];
          case 6:
            r = _d.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 8];
          case 7:
            err_7 = _d.sent();
            if (this.exceptionHandler) {
              this.exceptionHandler.handleException(line, err_7, i, this.filename);
            }
            return [3 /*break*/, 8];
          case 8: return [3 /*break*/, 2];
          case 9: return [3 /*break*/, 16];
          case 10:
            e_8_1 = _d.sent();
            e_8 = { error: e_8_1 };
            return [3 /*break*/, 16];
          case 11:
            _d.trys.push([11, , 14, 15]);
            if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 13];
            return [4 /*yield*/, _a.call(_b)];
          case 12:
            _d.sent();
            _d.label = 13;
          case 13: return [3 /*break*/, 15];
          case 14:
            if (e_8) throw e_8.error;
            return [7 /*endfinally*/];
          case 15: return [7 /*endfinally*/];
          case 16:
            if (!this.writer.flush) return [3 /*break*/, 20];
            _d.label = 17;
          case 17:
            _d.trys.push([17, 19, , 20]);
            return [4 /*yield*/, this.writer.flush()];
          case 18:
            r = _d.sent();
            if (r > 0) {
              success = success + r;
            }
            return [3 /*break*/, 20];
          case 19:
            err_8 = _d.sent();
            if (this.exceptionHandler) {
              this.exceptionHandler.handleException(lastLine, err_8, i, this.filename);
            }
            return [3 /*break*/, 20];
          case 20: return [2 /*return*/, { total: total, success: success, i: i }];
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
      rs = parse(rs, v, keys[i], attr.type);
    }
    return Promise.resolve(rs);
  };
  return Delimiter;
}());
exports.Delimiter = Delimiter;
// tslint:disable-next-line:max-classes-per-file
var FixedLengthTransformer = /** @class */ (function () {
  function FixedLengthTransformer(attrs) {
    this.attrs = attrs;
    this.transform = this.transform.bind(this);
  }
  FixedLengthTransformer.prototype.transform = function (data) {
    var keys = Object.keys(this.attrs);
    var rs = {};
    var i = 0;
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
      var key = keys_1[_i];
      var attr = this.attrs[key];
      var len = attr.length ? attr.length : 10;
      var v = data.substring(i, i + len);
      rs = parse(rs, v.trim(), key, attr.type);
      i = i + len;
    }
    return Promise.resolve(rs);
  };
  return FixedLengthTransformer;
}());
exports.FixedLengthTransformer = FixedLengthTransformer;
function parse(rs, v, key, type) {
  switch (type) {
    case 'number':
    case 'integer':
      // tslint:disable-next-line:radix
      var parsed = parseInt(v);
      if (!isNaN(parsed) || !Number(parsed)) {
        rs[key] = parsed;
      }
      break;
    case 'datetime':
    case 'date':
      var d = new Date(v);
      if (d instanceof Date && !isNaN(d.valueOf())) {
        rs[key] = d;
      }
      break;
    case 'boolean':
      if (v === '1' || v === 'Y' || v === 'T') {
        rs[key] = true;
      }
      else if (v.length > 0) {
        rs[key] = false;
      }
      break;
    default:
      rs[key] = v;
      break;
  }
  return rs;
}
exports.parse = parse;
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
          stream = fs.createReadStream(filename, c);
          return [4 /*yield*/, Promise.all([events_1.once(stream, 'open')])];
        case 1:
          _a.sent();
          read = readline.createInterface({ input: stream, crlfDelay: Infinity });
          return [2 /*return*/, read];
      }
    });
  });
}
exports.createReader = createReader;
