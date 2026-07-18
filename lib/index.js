var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { once } from "events";
import * as fs from "fs";
import * as readline from "readline";
export class resources {
  static parseNumber(res, key, v) {
    if (v && !isNaN(v)) {
      const n = parseFloat(v);
      res[key] = n;
    }
  }
  static parseDate(res, key, v) {
    const d = new Date(v);
    if (d instanceof Date && !isNaN(d.getTime())) {
      ;
      res[key] = d;
    }
  }
  static parseBool(res, key, v) {
    if (v.length > 0) {
      ;
      res[key] = v === "1" || v === "Y" || v === "T";
    }
  }
}
resources.regex = /[^\d](\d{14})\.csv$/g;
export function getDate(fileName) {
  const r = new RegExp(resources.regex);
  const nm = r.exec(fileName);
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
export class Importer {
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
  import() {
    var e_1, _a, e_2, _b;
    return __awaiter(this, void 0, void 0, function* () {
      let total = 0;
      let success = 0;
      const v = this.validate;
      if (v) {
        let i = 0;
        if (this.skip > 0) {
          try {
            for (var _c = __asyncValues(this.read), _d; _d = yield _c.next(), !_d.done;) {
              const _line = _d.value;
              if (i >= this.skip) {
                const r = yield this.validateAndWrite(_line, v, i);
                total = total + 1;
                success = success + r;
              }
              i++;
            }
          }
          catch (e_1_1) { e_1 = { error: e_1_1 }; }
          finally {
            try {
              if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
          }
          if (this.flush) {
            yield this.flush();
          }
        }
        return { total, success };
      }
      else {
        let i = 0;
        try {
          for (var _e = __asyncValues(this.read), _f; _f = yield _e.next(), !_f.done;) {
            const _line = _f.value;
            if (i >= this.skip) {
              const r = yield this.transformAndWrite(_line, i);
              total = total + 1;
              success = success + r;
            }
            i++;
          }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
          try {
            if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
          }
          finally { if (e_2) throw e_2.error; }
        }
        if (this.flush) {
          yield this.flush();
        }
        return { total, success };
      }
    });
  }
  validateAndWrite(line, validate, i) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const res = yield this.transform(line);
        const errors = yield validate(res);
        if (errors && errors.length > 0) {
          if (this.handleError) {
            this.handleError(res, errors, i++, this.filename);
          }
          return 0;
        }
        else {
          const r = yield this.write(res);
          return r > 0 ? 1 : 0;
        }
      }
      catch (err) {
        if (this.handleException) {
          this.handleException(line, err, i++, this.filename);
        }
        return 0;
      }
    });
  }
  transformAndWrite(line, i) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const rs = yield this.transform(line);
        const r = yield this.write(rs);
        return r > 0 ? 1 : 0;
      }
      catch (err) {
        if (this.handleException) {
          this.handleException(line, err, i, this.filename);
        }
        return 0;
      }
    });
  }
}
export class ImportService {
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
  import() {
    var e_3, _a, e_4, _b;
    return __awaiter(this, void 0, void 0, function* () {
      let total = 0;
      let success = 0;
      const v = this.validator;
      if (v) {
        let i = 0;
        if (this.skip > 0) {
          try {
            for (var _c = __asyncValues(this.read), _d; _d = yield _c.next(), !_d.done;) {
              const _line = _d.value;
              if (i >= this.skip) {
                const r = yield this.validateAndWrite(_line, v, i);
                total = total + 1;
                success = success + r;
              }
              i++;
            }
          }
          catch (e_3_1) { e_3 = { error: e_3_1 }; }
          finally {
            try {
              if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
          }
          if (this.writer.flush) {
            yield this.writer.flush();
          }
        }
        return { total, success };
      }
      else {
        let i = 0;
        try {
          for (var _e = __asyncValues(this.read), _f; _f = yield _e.next(), !_f.done;) {
            const _line = _f.value;
            if (i >= this.skip) {
              const r = yield this.transformAndWrite(_line, i);
              total = total + 1;
              success = success + r;
            }
            i++;
          }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
          try {
            if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
          }
          finally { if (e_4) throw e_4.error; }
        }
        if (this.writer.flush) {
          yield this.writer.flush();
        }
        return { total, success };
      }
    });
  }
  validateAndWrite(line, v, i) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const res = yield this.transformer.transform(line);
        const errors = yield v.validate(res);
        if (errors && errors.length > 0) {
          if (this.errorHandler) {
            this.errorHandler.handleError(res, errors, i++, this.filename);
          }
          return 0;
        }
        else {
          const r = yield this.writer.write(res);
          return r > 0 ? 1 : 0;
        }
      }
      catch (err) {
        if (this.exceptionHandler) {
          this.exceptionHandler.handleException(line, err, i++, this.filename);
        }
        return 0;
      }
    });
  }
  transformAndWrite(line, i) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const rs = yield this.transformer.transform(line);
        const r = yield this.writer.write(rs);
        return r > 0 ? 1 : 0;
      }
      catch (err) {
        if (this.exceptionHandler) {
          this.exceptionHandler.handleException(line, err, i, this.filename);
        }
        return 0;
      }
    });
  }
}
export function toString(v) {
  if (typeof v === "string") {
    return v;
  }
  else {
    return JSON.stringify(v);
  }
}
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
export class ErrorHandler {
  constructor(logError, filename, lineNumber, mp, prefix) {
    this.logError = logError;
    this.map = mp;
    this.prefix = prefix && prefix.length > 0 ? prefix : "Message is invalid: ";
    this.filename = filename && filename.length > 0 ? filename : "filename";
    this.logFileName = filename && filename.length > 0 ? true : false;
    this.lineNumber = lineNumber && lineNumber.length > 0 ? lineNumber : "lineNumber";
    this.logLineNumber = lineNumber && lineNumber.length > 0 ? true : false;
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
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)}`, ext);
    }
    else if (this.logFileName) {
      const ext = clone(this.map);
      if (filename !== undefined) {
        ext[this.filename] = filename;
      }
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)} line: ${i}`, ext);
    }
    else if (this.logLineNumber) {
      const ext = clone(this.map);
      if (i !== undefined) {
        ext[this.lineNumber] = i;
      }
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)} filename: ${filename}`, ext);
    }
    else {
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)} filename: ${filename} line: ${i}`);
    }
  }
}
export class ExceptionHandler {
  constructor(logError, filename, lineNumber, mp, prefix) {
    this.logError = logError;
    this.map = mp;
    this.prefix = prefix && prefix.length > 0 ? prefix : "Error to write: ";
    this.filename = filename && filename.length > 0 ? filename : "filename";
    this.logFileName = filename && filename.length > 0 ? true : false;
    this.lineNumber = lineNumber && lineNumber.length > 0 ? lineNumber : "lineNumber";
    this.logLineNumber = lineNumber && lineNumber.length > 0 ? true : false;
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
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)}`, ext);
    }
    else if (this.logFileName) {
      const ext = clone(this.map);
      if (filename !== undefined) {
        ext[this.filename] = filename;
      }
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)} line: ${i}`, ext);
    }
    else if (this.logLineNumber) {
      const ext = clone(this.map);
      if (i !== undefined) {
        ext[this.lineNumber] = i;
      }
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)} filename: ${filename}`, ext);
    }
    else {
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)} filename: ${filename} line: ${i}`, this.map);
    }
  }
}
export class CSVTransformer {
  constructor(attributes) {
    this.transform = this.transform.bind(this);
    this.fieldParsers = createCSVFieldParsers(attributes);
  }
  transform(data) {
    let res = {};
    const l = Math.min(data.length, this.fieldParsers.length);
    for (let i = 0; i < l; i++) {
      const parser = this.fieldParsers[i];
      parser.parse(res, parser.name, data[i]);
    }
    return Promise.resolve(res);
  }
}
export class CSVParser {
  constructor(attributes) {
    this.parse = this.parse.bind(this);
    this.fieldParsers = createCSVFieldParsers(attributes);
  }
  parse(data) {
    let res = {};
    const l = Math.min(data.length, this.fieldParsers.length);
    for (let i = 0; i < l; i++) {
      const parser = this.fieldParsers[i];
      parser.parse(res, parser.name, data[i]);
    }
    return Promise.resolve(res);
  }
}
export function createCSVFieldParsers(attrs) {
  const parsers = [];
  for (const key in attrs) {
    const attr = attrs[key];
    const parser = new CSVFieldParser(key);
    if (attr.type === "number" || attr.type === "integer") {
      parser.parse = resources.parseNumber;
    }
    else if (attr.type === "datetime" || attr.type === "date") {
      parser.parse = resources.parseDate;
    }
    else if (attr.type === "boolean") {
      parser.parse = resources.parseBool;
    }
    parsers.push(parser);
  }
  return parsers;
}
export class CSVFieldParser {
  constructor(name) {
    this.name = name;
  }
  parse(res, key, v) {
    ;
    res[key] = v;
  }
}
export class FixedLengthTransformer {
  constructor(attributes) {
    this.transform = this.transform.bind(this);
    this.fieldParsers = createFixedLengthFieldParsers(attributes);
  }
  transform(data) {
    let res = {};
    const l = this.fieldParsers.length;
    for (let i = 0; i < l; i++) {
      const parser = this.fieldParsers[i];
      const len = parser.length ? parser.length : 10;
      const v = data.substring(i, i + len);
      parser.parse(res, parser.name, v.trim());
    }
    return Promise.resolve(res);
  }
}
export class FixedLengthParser {
  constructor(attributes) {
    this.parse = this.parse.bind(this);
    this.fieldParsers = createFixedLengthFieldParsers(attributes);
  }
  parse(data) {
    let res = {};
    const l = this.fieldParsers.length;
    for (let i = 0; i < l; i++) {
      const parser = this.fieldParsers[i];
      const len = parser.length ? parser.length : 10;
      const v = data.substring(i, i + len);
      parser.parse(res, parser.name, v.trim());
    }
    return Promise.resolve(res);
  }
}
export function createFixedLengthFieldParsers(attrs) {
  const parsers = [];
  for (const key in attrs) {
    const attr = attrs[key];
    const parser = new FixedLengthFieldParser(key, attr.length);
    if (attr.type === "number" || attr.type === "integer") {
      parser.parse = resources.parseNumber;
    }
    else if (attr.type === "datetime" || attr.type === "date") {
      parser.parse = resources.parseDate;
    }
    else if (attr.type === "boolean") {
      parser.parse = resources.parseBool;
    }
    parsers.push(parser);
  }
  return parsers;
}
export class FixedLengthFieldParser {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
  parse(res, key, v) {
    ;
    res[key] = v;
  }
}
export function handleNullable(obj, attrs) {
  const keys = Object.keys(obj);
  for (const key of keys) {
    const v = obj[key];
    if (v === "") {
      const attr = attrs[key];
      if (attr && !attr.required) {
        obj[key] = null;
      }
    }
  }
  return obj;
}
export function buildStrings(files) {
  const res = [];
  for (const file of files) {
    res.push(file.toString());
  }
  return res;
}
export function getFiles(files, check) {
  const res = [];
  for (const file of files) {
    const v = check(file);
    if (v === true) {
      res.push(file);
    }
  }
  return res;
}
export class NameChecker {
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
export function getPrefix(s, date, offset, separator) {
  if (offset !== undefined) {
    const d = addDays(date, offset);
    return s + dateToString(d, separator);
  }
  else {
    return s + dateToString(date, separator);
  }
}
export function dateToString(date, separator) {
  const year = date.getFullYear().toString();
  let month = date.getMonth() + 1;
  let dt = date.getDate();
  if (dt < 10) {
    dt = "0" + dt.toString();
  }
  if (month < 10) {
    month = "0" + month;
  }
  if (separator !== undefined) {
    return year + separator + month + separator + dt;
  }
  else {
    return year + month + dt;
  }
}
export function timeToString(date, separator) {
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  if (hh < 10) {
    hh = "0" + hh.toString();
  }
  if (ss < 10) {
    ss = "0" + ss.toString();
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (separator !== undefined) {
    return hh.toString() + separator + mm + separator + ss;
  }
  else {
    return hh.toString() + mm + ss;
  }
}
export function toISOString(d) {
  const s = `${dateToString(d, "-")}T${timeToString(d, ":")}.${getMilliseconds(d)}${getTimezone(d)}`;
  return s;
}
export function getTimezone(d) {
  const t = d.getTimezoneOffset() / 60;
  const p = d.getTimezoneOffset() % 60;
  if (t > 0) {
    return t > -10 ? "-0" + Math.abs(t) + ":00" : "-" + Math.abs(t) + ":" + getMinutes(p);
  }
  else {
    return t < 9 ? "+0" + Math.abs(t) + ":00" : Math.abs(t).toString() + ":" + getMinutes(p);
  }
}
export function getMinutes(p) {
  const x = Math.abs(p);
  return x >= 10 ? x.toString() : "0" + x;
}
export function getMilliseconds(d) {
  const m = d.getMilliseconds();
  if (m >= 100) {
    return m.toString();
  }
  else if (m >= 10) {
    return "0" + m;
  }
  else {
    return "00" + m;
  }
}
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
export function getFields(attrs, t) {
  const fis = [];
  const keys = Object.keys(attrs);
  for (const key of keys) {
    const attr = attrs[key];
    if (attr.type === t) {
      fis.push(key);
    }
  }
  return fis;
}
export function reformatDates(obj, ignores) {
  const keys = Object.keys(obj);
  for (const key of keys) {
    const v = obj[key];
    if (v instanceof Date && !isNaN(v.getTime())) {
      if (!ignores.includes(key)) {
        obj[key] = toISOString(v);
      }
    }
  }
  return obj;
}
export function mkdirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}
export function createReader(filename, opts) {
  return __awaiter(this, void 0, void 0, function* () {
    const c = opts !== undefined ? opts : "utf-8";
    const stream = fs.createReadStream(filename, c);
    yield Promise.all([once(stream, "open")]);
    const read = readline.createInterface({ input: stream, crlfDelay: Infinity });
    return read;
  });
}
const options = { flags: "a", encoding: "utf-8" };
export class LogWriter {
  constructor(filename, dir, opts, suffix) {
    const o = opts ? opts : options;
    this.suffix = suffix ? suffix : "\n";
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
export function createWriteStream(dir, filename, opts) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (dir.endsWith("/") || dir.endsWith("\\")) {
    return fs.createWriteStream(dir + filename, opts);
  }
  else {
    return fs.createWriteStream(dir + "/" + filename, opts);
  }
}
export function parseNum(s) {
  if (!s || s.length === 0) {
    return undefined;
  }
  const n = parseFloat(s);
  return isNaN(n) ? undefined : n;
}
export function parseNumber(s, d) {
  if (!s || s.length === 0) {
    return d;
  }
  const n = parseFloat(s);
  return isNaN(n) ? d : n;
}
export function parseDate(s, undefinedIfInvalid) {
  if (!s || s.length === 0) {
    return undefined;
  }
  const d = new Date(s);
  if (d instanceof Date && !isNaN(d.getTime())) {
    return d;
  }
  else {
    return undefinedIfInvalid ? undefined : d;
  }
}
