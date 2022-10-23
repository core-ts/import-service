"use strict";
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
const events_1 = require("events");
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
class resources {
}
exports.resources = resources;
resources.regex = /[^\d](\d{14})\.csv$/g;
function getDate(fileName) {
  const nm = resources.regex.exec(fileName);
  if (!nm || nm.length < 2) {
    return undefined;
  }
  const v = nm[1];
  const ft = `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}T${v.slice(8, 10)}:${v.slice(10, 12)}:${v.slice(12, 14)}`;
  const d = new Date(ft);
  const num = d.getTime();
  if (!num || isNaN(num)) {
    return undefined;
  }
  return d;
}
exports.getDate = getDate;
class Importer {
  constructor(skip, filename, read, transform, write, flush, handleException, validate, handleError) {
    this.skip = skip;
    this.filename = filename;
    this.read = read;
    this.transform = transform;
    this.write = write;
    this.flush = flush;
    this.handleException = handleException;
    this.validate = validate;
    this.handleError = handleError;
    this.import = this.import.bind(this);
    this.transformAndWrite = this.transformAndWrite.bind(this);
    this.validateAndWrite = this.validateAndWrite.bind(this);
  }
  async import() {
    var e_1, _a, e_2, _b;
    let total = 0;
    let success = 0;
    const v = this.validate;
    let lineSkiped = 0;
    const lastLine = '';
    if (v) {
      let i = 0;
      if (this.skip > 0) {
        try {
          for (var _c = __asyncValues(this.read), _d; _d = await _c.next(), !_d.done;) {
            const _line = _d.value;
            ++lineSkiped;
            if (this.skip === lineSkiped) {
              const r = await this.validateAndWrite(lastLine, total, v, i);
              total = r.total;
              success = r.success;
              i = r.i;
              break;
            }
          }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
          try {
            if (_d && !_d.done && (_a = _c.return)) await _a.call(_c);
          }
          finally { if (e_1) throw e_1.error; }
        }
      }
      else {
        const r = await this.validateAndWrite(lastLine, total, v, i);
        total = r.total;
        success = r.success;
        i = r.i;
      }
      return { total, success };
    }
    else {
      let i = 0;
      try {
        for (var _e = __asyncValues(this.read), _f; _f = await _e.next(), !_f.done;) {
          const _line = _f.value;
          ++lineSkiped;
          i++;
          if (this.skip) {
            if (this.skip === lineSkiped) {
              const r = await this.transformAndWrite(lastLine, total, i);
              total = r.total;
              success = r.success;
              i = r.i;
              break;
            }
          }
          else {
            const r = await this.transformAndWrite(lastLine, total, i);
            total = r.total;
            success = r.success;
            i = r.i;
            break;
          }
        }
      }
      catch (e_2_1) { e_2 = { error: e_2_1 }; }
      finally {
        try {
          if (_f && !_f.done && (_b = _e.return)) await _b.call(_e);
        }
        finally { if (e_2) throw e_2.error; }
      }
      return { total, success };
    }
  }
  async validateAndWrite(lastLine, total, validate, i) {
    var e_3, _a;
    let success = 0;
    try {
      for (var _b = __asyncValues(this.read), _c; _c = await _b.next(), !_c.done;) {
        const line = _c.value;
        lastLine = line;
        total++;
        try {
          const rs = await this.transform(line);
          const errors = await validate(rs);
          if (errors && errors.length > 0) {
            if (this.handleError) {
              this.handleError(rs, errors, i++, this.filename);
            }
          }
          else {
            const r = await this.write(rs);
            if (r > 0) {
              success = success + r;
            }
            i++;
          }
        }
        catch (err) {
          if (this.handleException) {
            this.handleException(line, err, i++, this.filename);
          }
        }
      }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
      }
      finally { if (e_3) throw e_3.error; }
    }
    if (this.flush) {
      try {
        const r = await this.flush();
        if (r > 0) {
          success = success + r;
        }
      }
      catch (err) {
        if (this.handleException) {
          this.handleException(lastLine, err, i, this.filename);
        }
      }
    }
    return { total, success, i };
  }
  async transformAndWrite(lastLine, total, i) {
    var e_4, _a;
    let success = 0;
    try {
      for (var _b = __asyncValues(this.read), _c; _c = await _b.next(), !_c.done;) {
        const line = _c.value;
        lastLine = line;
        i++;
        total++;
        try {
          const rs = await this.transform(line);
          const r = await this.write(rs);
          if (r > 0) {
            success = success + r;
          }
        }
        catch (err) {
          if (this.handleException) {
            this.handleException(line, err, i, this.filename);
          }
        }
      }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
      }
      finally { if (e_4) throw e_4.error; }
    }
    if (this.flush) {
      try {
        const r = await this.flush();
        if (r > 0) {
          success = success + r;
        }
      }
      catch (err) {
        if (this.handleException) {
          this.handleException(lastLine, err, i, this.filename);
        }
      }
    }
    return { total, success, i };
  }
}
exports.Importer = Importer;
class ImportService {
  constructor(skip, filename, read, transformer, writer, exceptionHandler, validator, errorHandler) {
    this.skip = skip;
    this.filename = filename;
    this.read = read;
    this.transformer = transformer;
    this.writer = writer;
    this.exceptionHandler = exceptionHandler;
    this.validator = validator;
    this.errorHandler = errorHandler;
    this.import = this.import.bind(this);
    this.validateAndWrite = this.validateAndWrite.bind(this);
    this.transformAndWrite = this.transformAndWrite.bind(this);
  }
  async import() {
    var e_5, _a, e_6, _b;
    let total = 0;
    let success = 0;
    const v = this.validator;
    let lineSkiped = 0;
    const lastLine = '';
    if (v) {
      let i = 0;
      if (this.skip > 0) {
        try {
          for (var _c = __asyncValues(this.read), _d; _d = await _c.next(), !_d.done;) {
            const _line = _d.value;
            ++lineSkiped;
            if (this.skip === lineSkiped) {
              const r = await this.validateAndWrite(lastLine, total, v, i);
              total = r.total;
              success = r.success;
              i = r.i;
              break;
            }
          }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
          try {
            if (_d && !_d.done && (_a = _c.return)) await _a.call(_c);
          }
          finally { if (e_5) throw e_5.error; }
        }
      }
      else {
        const r = await this.validateAndWrite(lastLine, total, v, i);
        total = r.total;
        success = r.success;
        i = r.i;
      }
      return { total, success };
    }
    else {
      let i = 0;
      try {
        for (var _e = __asyncValues(this.read), _f; _f = await _e.next(), !_f.done;) {
          const _line = _f.value;
          ++lineSkiped;
          i++;
          if (this.skip) {
            if (this.skip === lineSkiped) {
              const r = await this.transformAndWrite(lastLine, total, i);
              total = r.total;
              success = r.success;
              i = r.i;
              break;
            }
          }
          else {
            const r = await this.transformAndWrite(lastLine, total, i);
            total = r.total;
            success = r.success;
            i = r.i;
            break;
          }
        }
      }
      catch (e_6_1) { e_6 = { error: e_6_1 }; }
      finally {
        try {
          if (_f && !_f.done && (_b = _e.return)) await _b.call(_e);
        }
        finally { if (e_6) throw e_6.error; }
      }
      return { total, success };
    }
  }
  async validateAndWrite(lastLine, total, v, i) {
    var e_7, _a;
    let success = 0;
    try {
      for (var _b = __asyncValues(this.read), _c; _c = await _b.next(), !_c.done;) {
        const line = _c.value;
        lastLine = line;
        total++;
        try {
          const rs = await this.transformer.transform(line);
          const errors = await v.validate(rs);
          if (errors && errors.length > 0) {
            if (this.errorHandler) {
              this.errorHandler.handleError(rs, errors, i++, this.filename);
            }
          }
          else {
            const r = await this.writer.write(rs);
            if (r > 0) {
              success = success + r;
            }
            i++;
          }
        }
        catch (err) {
          if (this.exceptionHandler) {
            this.exceptionHandler.handleException(line, err, i++, this.filename);
          }
        }
      }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
      }
      finally { if (e_7) throw e_7.error; }
    }
    if (this.writer.flush) {
      try {
        const r = await this.writer.flush();
        if (r > 0) {
          success = success + r;
        }
      }
      catch (err) {
        if (this.exceptionHandler) {
          this.exceptionHandler.handleException(lastLine, err, i, this.filename);
        }
      }
    }
    return { total, success, i };
  }
  async transformAndWrite(lastLine, total, i) {
    var e_8, _a;
    let success = 0;
    try {
      for (var _b = __asyncValues(this.read), _c; _c = await _b.next(), !_c.done;) {
        const line = _c.value;
        lastLine = line;
        i++;
        total++;
        try {
          const rs = await this.transformer.transform(line);
          const r = await this.writer.write(rs);
          if (r > 0) {
            success = success + r;
          }
        }
        catch (err) {
          if (this.exceptionHandler) {
            this.exceptionHandler.handleException(line, err, i, this.filename);
          }
        }
      }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
      }
      finally { if (e_8) throw e_8.error; }
    }
    if (this.writer.flush) {
      try {
        const r = await this.writer.flush();
        if (r > 0) {
          success = success + r;
        }
      }
      catch (err) {
        if (this.exceptionHandler) {
          this.exceptionHandler.handleException(lastLine, err, i, this.filename);
        }
      }
    }
    return { total, success, i };
  }
}
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
function clone(obj) {
  const r = {};
  if (obj !== undefined) {
    const keys = Object.keys(obj);
    for (const key of keys) {
      r[key] = obj[key];
    }
  }
  return r;
}
class ErrorHandler {
  constructor(logError, filename, lineNumber, mp) {
    this.logError = logError;
    this.map = mp;
    this.filename = (filename && filename.length > 0 ? filename : 'filename');
    this.logFileName = (filename && filename.length > 0 ? true : false);
    this.lineNumber = (lineNumber && lineNumber.length > 0 ? lineNumber : 'lineNumber');
    this.logLineNumber = (lineNumber && lineNumber.length > 0 ? true : false);
    this.handleError = this.handleError.bind(this);
  }
  handleError(rs, err, i, filename) {
    if (this.logFileName && this.logLineNumber) {
      const ext = clone(this.map);
      if (filename !== undefined) {
        ext[this.filename] = filename;
      }
      if (i !== undefined) {
        ext[this.lineNumber] = i;
      }
      this.logError(`Message is invalid: ${toString(rs)} . Error: ${toString(err)}`, ext);
    }
    else if (this.logFileName) {
      const ext = clone(this.map);
      if (filename !== undefined) {
        ext[this.filename] = filename;
      }
      this.logError(`Message is invalid: ${toString(rs)} . Error: ${toString(err)} line: ${i}`, ext);
    }
    else if (this.logLineNumber) {
      const ext = clone(this.map);
      if (i !== undefined) {
        ext[this.lineNumber] = i;
      }
      this.logError(`Message is invalid: ${toString(rs)} . Error: ${toString(err)} filename: ${filename}`, ext);
    }
    else {
      this.logError(`Message is invalid: ${toString(rs)} . Error: ${toString(err)} filename: ${filename} line: ${i}`);
    }
  }
}
exports.ErrorHandler = ErrorHandler;
class ExceptionHandler {
  constructor(logError, filename, lineNumber, mp) {
    this.logError = logError;
    this.map = mp;
    this.filename = (filename && filename.length > 0 ? filename : 'filename');
    this.logFileName = (filename && filename.length > 0 ? true : false);
    this.lineNumber = (lineNumber && lineNumber.length > 0 ? lineNumber : 'lineNumber');
    this.logLineNumber = (lineNumber && lineNumber.length > 0 ? true : false);
    this.handleException = this.handleException.bind(this);
  }
  handleException(rs, err, i, filename) {
    if (this.logFileName && this.logLineNumber) {
      const ext = clone(this.map);
      if (filename !== undefined) {
        ext[this.filename] = filename;
      }
      if (i !== undefined) {
        ext[this.lineNumber] = i;
      }
      this.logError(`Error to write: ${toString(rs)} . Error: ${toString(err)}`, ext);
    }
    else if (this.logFileName) {
      const ext = clone(this.map);
      if (filename !== undefined) {
        ext[this.filename] = filename;
      }
      this.logError(`Error to write: ${toString(rs)} . Error: ${toString(err)} line: ${i}`, ext);
    }
    else if (this.logLineNumber) {
      const ext = clone(this.map);
      if (i !== undefined) {
        ext[this.lineNumber] = i;
      }
      this.logError(`Error to write: ${toString(rs)} . Error: ${toString(err)} filename: ${filename}`, ext);
    }
    else {
      this.logError(`Error to write: ${toString(rs)} . Error: ${toString(err)} filename: ${filename} line: ${i}`, this.map);
    }
  }
}
exports.ExceptionHandler = ExceptionHandler;
class Delimiter {
  constructor(delimiter, attrs) {
    this.delimiter = delimiter;
    this.attrs = attrs;
    this.transform = this.transform.bind(this);
    this.parse = this.parse.bind(this);
  }
  parse(data) {
    return this.transform(data);
  }
  transform(data) {
    const keys = Object.keys(this.attrs);
    let rs = {};
    const list = data.split(this.delimiter);
    const l = Math.min(list.length, keys.length);
    for (let i = 0; i < l; i++) {
      const attr = this.attrs[keys[i]];
      const v = list[i];
      rs = parse(rs, v, keys[i], attr);
    }
    return Promise.resolve(rs);
  }
}
exports.Delimiter = Delimiter;
class DelimiterTransformer extends Delimiter {
}
exports.DelimiterTransformer = DelimiterTransformer;
class DelimiterParser extends Delimiter {
}
exports.DelimiterParser = DelimiterParser;
class CSVParser extends Delimiter {
}
exports.CSVParser = CSVParser;
class FixedLengthTransformer {
  constructor(attrs) {
    this.attrs = attrs;
    this.transform = this.transform.bind(this);
    this.parse = this.parse.bind(this);
  }
  parse(data) {
    return this.transform(data);
  }
  transform(data) {
    const keys = Object.keys(this.attrs);
    let rs = {};
    let i = 0;
    for (const key of keys) {
      const attr = this.attrs[key];
      const len = attr.length ? attr.length : 10;
      const v = data.substring(i, i + len);
      rs = parse(rs, v.trim(), key, attr);
      i = i + len;
    }
    return Promise.resolve(rs);
  }
}
exports.FixedLengthTransformer = FixedLengthTransformer;
class FixedLengthParser extends FixedLengthTransformer {
}
exports.FixedLengthParser = FixedLengthParser;
function parse(rs, v, key, attr) {
  if (attr.default !== undefined && v.length === 0) {
    rs[key] = attr.default;
    return rs;
  }
  switch (attr.type) {
    case 'number':
    case 'integer':
      const parsed = parseInt(v);
      if (!isNaN(parsed) || !Number(parsed)) {
        rs[key] = parsed;
      }
      break;
    case 'datetime':
    case 'date':
      const d = new Date(v);
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
function handleNullable(obj, attrs) {
  const keys = Object.keys(obj);
  for (const key of keys) {
    const v = obj[key];
    if (v === '') {
      const attr = attrs[key];
      if (attr && !attr.required) {
        obj[key] = null;
      }
    }
  }
  return obj;
}
exports.handleNullable = handleNullable;
function buildStrings(files) {
  const res = [];
  for (const file of files) {
    res.push(file.toString());
  }
  return res;
}
exports.buildStrings = buildStrings;
function getFiles(files, check) {
  const res = [];
  for (const file of files) {
    const v = check(file);
    if (v === true) {
      res.push(file);
    }
  }
  return res;
}
exports.getFiles = getFiles;
class NameChecker {
  constructor(prefix, suffix) {
    this.prefix = prefix;
    this.suffix = suffix;
    this.check = this.check.bind(this);
  }
  check(name) {
    if (name.startsWith(this.prefix) && name.endsWith(this.suffix)) {
      return true;
    }
    return false;
  }
}
exports.NameChecker = NameChecker;
function getPrefix(s, date, offset, separator) {
  if (offset !== undefined) {
    const d = addDays(date, offset);
    return s + dateToString(d, separator);
  }
  else {
    return s + dateToString(date, separator);
  }
}
exports.getPrefix = getPrefix;
function dateToString(date, separator) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();
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
function timeToString(date, separator) {
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  if (hh < 10) {
    hh = '0' + hh.toString();
  }
  if (ss < 10) {
    ss = '0' + ss.toString();
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  if (separator !== undefined) {
    return '' + hh + separator + mm + separator + ss;
  }
  else {
    return '' + hh + mm + ss;
  }
}
exports.timeToString = timeToString;
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
exports.addDays = addDays;
async function createReader(filename, opts) {
  const c = (opts !== undefined ? opts : 'utf-8');
  const stream = fs.createReadStream(filename, c);
  await Promise.all([events_1.once(stream, 'open')]);
  const read = readline.createInterface({ input: stream, crlfDelay: Infinity });
  return read;
}
exports.createReader = createReader;
const options = { flags: 'a', encoding: 'utf-8' };
class LogWriter {
  constructor(filename, dir, opts, suffix) {
    const o = (opts ? opts : options);
    this.suffix = (suffix ? suffix : '\n');
    this.writer = createWriteStream(dir, filename, o);
    this.writer.cork();
    this.write = this.write.bind(this);
    this.flush = this.flush.bind(this);
    this.uncork = this.uncork.bind(this);
    this.end = this.end.bind(this);
  }
  write(data) {
    this.writer.write(data + this.suffix);
  }
  flush() {
    this.writer.uncork();
  }
  uncork() {
    this.writer.uncork();
  }
  end() {
    this.writer.end();
  }
}
exports.LogWriter = LogWriter;
function createWriteStream(dir, filename, opts) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (dir.endsWith('/') || dir.endsWith('\\')) {
    return fs.createWriteStream(dir + filename, opts);
  }
  else {
    return fs.createWriteStream(dir + '/' + filename, opts);
  }
}
exports.createWriteStream = createWriteStream;
