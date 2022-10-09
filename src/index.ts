import { once } from 'events';
import * as fs from 'fs';
import * as readline from 'readline';

export type DataType = 'ObjectId' | 'date' | 'datetime' | 'time'
  | 'boolean' | 'number' | 'integer' | 'string' | 'text'
  | 'object' | 'array' | 'binary'
  | 'primitives' | 'booleans' | 'numbers' | 'integers' | 'strings' | 'dates' | 'datetimes' | 'times';
export type FormatType = 'currency' | 'percentage' | 'email' | 'url' | 'phone' | 'fax' | 'ipv4' | 'ipv6';
export type MatchType = 'equal' | 'prefix' | 'contain' | 'max' | 'min'; // contain: default for string, min: default for Date, number

export interface Attribute {
  name?: string;
  field?: string;
  column?: string;
  type?: DataType;
  format?: FormatType;
  required?: boolean;
  match?: MatchType;
  default?: string | number | Date | boolean;
  key?: boolean;
  unique?: boolean;
  enum?: string[] | number[];
  q?: boolean;
  noinsert?: boolean;
  noupdate?: boolean;
  nopatch?: boolean;
  version?: boolean;
  length?: number;
  min?: number;
  max?: number;
  gt?: number;
  lt?: number;
  precision?: number;
  scale?: number;
  exp?: RegExp | string;
  code?: string;
  noformat?: boolean;
  ignored?: boolean;
  jsonField?: string;
  link?: string;
  typeof?: Attributes;
  true?: string | number;
  false?: string | number;
}
export interface Attributes {
  [key: string]: Attribute;
}

export interface ErrorMessage {
  field: string;
  code: string;
  param?: string | number | Date;
  message?: string;
}
export interface Result {
  total: number;
  success: number;
}
interface TmpResult {
  total: number;
  success: number;
  i: number;
}
export interface Transformer<T> {
  transform: (data: string) => Promise<T>;
}
export interface Validator<T> {
  validate: (data: T) => Promise<ErrorMessage[]>;
}
export interface Writer<T> {
  write: (obj: T) => Promise<number>;
  flush?: () => Promise<number>;
}
export interface ErrHandler<T> {
  handleError(rs: T, errors: ErrorMessage[], i?: number, filename?: string): void;
}
export interface ExHandler {
  handleException(rs: string, err: any, i?: number, filename?: string): void;
}
export interface ImportManager {
  filename: string;
  read: readline.Interface;
  import(): Promise<Result>;
}
export class Importer<T> {
  constructor(
    public skip: number,
    public filename: string,
    public read: readline.Interface,
    public transform: (data: string) => Promise<T>,
    public write: (obj: T) => Promise<number>,
    public flush?: () => Promise<number>,
    public validate?: ((obj: T) => Promise<ErrorMessage[]>),
    public handleError?: (rs: T, errors: ErrorMessage[], i?: number, filename?: string) => void,
    public handleException?: (rs: string, err: any, i?: number, filename?: string) => void,
  ) {
    this.import = this.import.bind(this);
    this.transformAndWrite = this.transformAndWrite.bind(this);
    this.validateAndWrite = this.validateAndWrite.bind(this);
  }
  async import(): Promise<Result> {
    let total = 0;
    let success = 0;
    const v = this.validate;
    let lineSkiped = 0;
    const lastLine = '';
    if (v) {
      let i = 0;
      if (this.skip > 0) {
        for await (const _line of this.read) {
          ++lineSkiped;
          if (this.skip === lineSkiped) {
            const r = await this.validateAndWrite(lastLine, total, v, i);
            total = r.total;
            success = r.success;
            i = r.i;
            break;
          }
        }
      } else {
        const r = await this.validateAndWrite(lastLine, total, v, i);
        total = r.total;
        success = r.success;
        i = r.i;
      }
      return { total, success };
    } else {
      let i = 0;
      for await (const _line of this.read) {
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
        } else {
          const r = await this.transformAndWrite(lastLine, total, i);
          total = r.total;
          success = r.success;
          i = r.i;
          break;
        }
      }
      return { total, success };
    }
  }
  private async validateAndWrite(lastLine: string, total: number, validate: ((obj: T) => Promise<ErrorMessage[]>), i: number): Promise<TmpResult> {
    let success = 0;
    for await (const line of this.read) {
      lastLine = line;
      total++;
      try {
        const rs: T = await this.transform(line);
        const errors = await validate(rs);
        if (errors && errors.length > 0) {
          if (this.handleError) {
            this.handleError(rs, errors, i++, this.filename);
          }
        } else {
          const r = await this.write(rs);
          if (r > 0) {
            success = success + r;
          }
          i++;
        }
      } catch (err) {
        if (this.handleException) {
          this.handleException(line, err, i++, this.filename);
        }
      }
    }
    if (this.flush) {
      try {
        const r = await this.flush();
        if (r > 0) {
          success = success + r;
        }
      } catch (err) {
        if (this.handleException) {
          this.handleException(lastLine, err, i, this.filename);
        }
      }
    }
    return { total, success, i };
  }
  private async transformAndWrite(lastLine: string, total: number, i: number): Promise<TmpResult> {
    let success = 0;
    for await (const line of this.read) {
      lastLine = line;
      i++;
      total++;
      try {
        const rs: T = await this.transform(line);
        const r = await this.write(rs);
        if (r > 0) {
          success = success + r;
        }
      } catch (err) {
        if (this.handleException) {
          this.handleException(line, err, i, this.filename);
        }
      }
    }
    if (this.flush) {
      try {
        const r = await this.flush();
        if (r > 0) {
          success = success + r;
        }
      } catch (err) {
        if (this.handleException) {
          this.handleException(lastLine, err, i, this.filename);
        }
      }
    }
    return { total, success, i };
  }
}
// tslint:disable-next-line:max-classes-per-file
export class ImportService<T> {
  constructor(
    public skip: number,
    public filename: string,
    public read: readline.Interface,
    public transformer: Transformer<T>,
    public writer: Writer<T>,
    public validator?: Validator<T>,
    public errorHandler?: ErrHandler<T>,
    public exceptionHandler?: ExHandler,
  ) {
    this.import = this.import.bind(this);
    this.validateAndWrite = this.validateAndWrite.bind(this);
    this.transformAndWrite = this.transformAndWrite.bind(this);
  }
  async import(): Promise<Result> {
    let total = 0;
    let success = 0;
    const v = this.validator;
    let lineSkiped = 0;
    const lastLine = '';
    if (v) {
      let i = 0;
      if (this.skip > 0) {
        for await (const _line of this.read) {
          ++lineSkiped;
          if (this.skip === lineSkiped) {
            const r = await this.validateAndWrite(lastLine, total, v, i);
            total = r.total;
            success = r.success;
            i = r.i;
            break;
          }
        }
      } else {
        const r = await this.validateAndWrite(lastLine, total, v, i);
        total = r.total;
        success = r.success;
        i = r.i;
      }
      return { total, success };
    } else {
      let i = 0;
      for await (const _line of this.read) {
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
        } else {
          const r = await this.transformAndWrite(lastLine, total, i);
          total = r.total;
          success = r.success;
          i = r.i;
          break;
        }
      }
      return { total, success };
    }
  }
  private async validateAndWrite(lastLine: string, total: number, v: Validator<T>, i: number): Promise<TmpResult> {
    let success = 0;
    for await (const line of this.read) {
      lastLine = line;
      total++;
      try {
        const rs: T = await this.transformer.transform(line);
        const errors = await v.validate(rs);
        if (errors && errors.length > 0) {
          if (this.errorHandler) {
            this.errorHandler.handleError(rs, errors, i++, this.filename);
          }
        } else {
          const r = await this.writer.write(rs);
          if (r > 0) {
            success = success + r;
          }
          i++;
        }
      } catch (err) {
        if (this.exceptionHandler) {
          this.exceptionHandler.handleException(line, err, i++, this.filename);
        }
      }
    }
    if (this.writer.flush) {
      try {
        const r = await this.writer.flush();
        if (r > 0) {
          success = success + r;
        }
      } catch (err) {
        if (this.exceptionHandler) {
          this.exceptionHandler.handleException(lastLine, err, i, this.filename);
        }
      }
    }
    return { total, success, i };
  }
  private async transformAndWrite(lastLine: string, total: number, i: number): Promise<TmpResult> {
    let success = 0;
    for await (const line of this.read) {
      lastLine = line;
      i++;
      total++;
      try {
        const rs: T = await this.transformer.transform(line);
        const r = await this.writer.write(rs);
        if (r > 0) {
          success = success + r;
        }
      } catch (err) {
        if (this.exceptionHandler) {
          this.exceptionHandler.handleException(line, err, i, this.filename);
        }
      }
    }
    if (this.writer.flush) {
      try {
        const r = await this.writer.flush();
        if (r > 0) {
          success = success + r;
        }
      } catch (err) {
        if (this.exceptionHandler) {
          this.exceptionHandler.handleException(lastLine, err, i, this.filename);
        }
      }
    }
    return { total, success, i };
  }
}
export function toString(v: any): string {
  if (typeof v === 'string') {
    return v;
  } else {
    return JSON.stringify(v);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class ErrorHandler<T> {
  constructor(private logError: (obj: string) => void) {
    this.handleError = this.handleError.bind(this);
  }
  handleError(rs: T, errors: ErrorMessage[], i?: number, filename?: string): void {
    this.logError(`Message is invalid: ${toString(rs)} . Error: ${toString(errors)} filename: ${filename} line: ${i}`);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class ExceptionHandler {
  constructor(private logError: (obj: string) => void) {
    this.handleException = this.handleException.bind(this);
  }
  handleException(rs: string, err: any, i?: number, filename?: string): void {
    this.logError(`Error to write: ${toString(rs)} . Error: ${toString(err)} filename: ${filename} line: ${i}`);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class Delimiter<T> {
  constructor(private delimiter: string, private attrs: Attributes) {
    this.transform = this.transform.bind(this);
  }
  transform(data: string): Promise<T> {
    const keys = Object.keys(this.attrs);
    let rs: any = {};
    const list: string[] = data.split(this.delimiter);
    const l = Math.min(list.length, keys.length);
    for (let i = 0; i < l; i++) {
      const attr = this.attrs[keys[i]];
      const v = list[i];
      rs = parse(rs, v, keys[i], attr.type);
    }
    return Promise.resolve(rs);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class FixedLengthTransformer<T> {
  constructor(private attrs: Attributes) {
    this.transform = this.transform.bind(this);
  }
  transform(data: string): Promise<T> {
    const keys = Object.keys(this.attrs);
    let rs: any = {};
    let i = 0;
    for (const key of keys) {
      const attr = this.attrs[key];
      const len = attr.length ? attr.length : 10;
      const v = data.substring(i, i + len);
      rs = parse(rs, v.trim(), key, attr.type);
      i = i + len;
    }
    return Promise.resolve(rs);
  }
}
export function parse(rs: any, v: string, key: string, type?: DataType): any {
  switch (type) {
    case 'number':
    case 'integer':
      // tslint:disable-next-line:radix
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
      } else if (v.length > 0) {
        rs[key] = false;
      }
      break;
    default:
      rs[key] = v;
      break;
  }
  return rs;
}
// tslint:disable-next-line:ban-types
export function buildStrings(files: String[]): string[] {
  const res: string[] = [];
  for (const file of files) {
    res.push(file.toString());
  }
  return res;
}
export function getFiles(files: string[], check: (s: string) => boolean): string[] {
  const res: string[] = [];
  for (const file of files) {
    const v = check(file);
    if (v === true) {
      res.push(file);
    }
  }
  return res;
}
// tslint:disable-next-line:max-classes-per-file
export class NameChecker {
  constructor(private prefix: string, private suffix: string) {
    this.check = this.check.bind(this);
  }
  check(name: string): boolean {
    if (name.startsWith(this.prefix) && name.endsWith(this.suffix)) {
      return true;
    }
    return false;
  }
}
export function getPrefix(s: string, date: Date, offset?: number, separator?: string): string {
  if (offset !== undefined) {
    const d = addDays(date, offset);
    return s + dateToString(d, separator);
  } else {
    return s + dateToString(date, separator);
  }
}
export function dateToString(date: Date, separator?: string): string {
  const year = date.getFullYear();
  let month: number | string = date.getMonth() + 1;
  let dt: number | string = date.getDate();

  if (dt < 10) {
    dt = '0' + dt.toString();
  }
  if (month < 10) {
    month = '0' + month;
  }
  if (separator !== undefined) {
    return '' + year + separator + month + separator + dt;
  } else {
    return '' + year + month + dt;
  }
}
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
export async function createReader(filename: string, options?: BufferEncoding): Promise<readline.Interface> {
  const c = (options !== undefined ? options : 'utf-8');
  const stream = fs.createReadStream(filename, c);
  await Promise.all([once(stream, 'open')]);
  const read = readline.createInterface({ input: stream, crlfDelay: Infinity });
  return read;
}
