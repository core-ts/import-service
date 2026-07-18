import { once } from "events"
import * as fs from "fs"
import { WriteStream } from "fs"
import * as promises from "node:fs/promises"
import * as readline from "readline"

// tslint:disable-next-line:class-name
export class resources {
  static regex = /[^\d](\d{14})\.csv$/g
  static parseNumber<T>(res: T, key: string, v: string): void {
    if (v && !isNaN(v as any)) {
      const n = parseFloat(v)
      ;(res as any)[key] = n
    }
  }
  static parseDate<T>(res: T, key: string, v: string): void {
    const d = new Date(v)
    if (d instanceof Date && !isNaN(d.getTime())) {
      ;(res as any)[key] = d
    }
  }
  static parseBool<T>(res: T, key: string, v: string): void {
    if (v.length > 0) {
      ;(res as any)[key] = v === "1" || v === "Y" || v === "T"
    }
  }
}
export function getDate(fileName: string): Date | undefined {
  const r = new RegExp(resources.regex)
  const nm = r.exec(fileName)
  if (!nm || nm.length < 2) {
    return undefined
  }
  const v = nm[1]
  const ft = `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}T${v.slice(8, 10)}:${v.slice(10, 12)}:${v.slice(12, 14)}`
  const d = new Date(ft)
  const num = d.getTime()
  if (!num || isNaN(num)) {
    return undefined
  }
  return d
}
export interface SimpleMap {
  [key: string]: string | number | boolean | Date
}
export type DataType =
  | "ObjectId"
  | "date"
  | "datetime"
  | "time"
  | "boolean"
  | "number"
  | "integer"
  | "string"
  | "text"
  | "object"
  | "array"
  | "binary"
  | "primitives"
  | "booleans"
  | "numbers"
  | "integers"
  | "strings"
  | "dates"
  | "datetimes"
  | "times"

export interface Attribute {
  type?: DataType
  required?: boolean
  default?: string | number | Date | boolean
  length?: number
}
export interface Attributes {
  [key: string]: Attribute
}

export interface FixedLengthAttribute extends Attribute {
  length: number
}
export interface FixedLengthAttributes {
  [key: string]: FixedLengthAttribute
}
export interface ErrorMessage {
  field: string
  code: string
  param?: string | number | Date
  message?: string
}
export interface Result {
  total: number
  success: number
}
export interface Parser<T, S> {
  parse: (data: S) => Promise<T>
}
export interface Transformer<T, S> {
  transform: (data: S) => Promise<T>
}
export interface Validator<T> {
  validate: (data: T) => Promise<ErrorMessage[]>
}
export interface Writer<T> {
  write: (obj: T) => Promise<number>
  flush?: () => Promise<number>
}
export interface ErrHandler<T> {
  handleError(rs: T, errors: ErrorMessage[], i?: number, filename?: string): void
}
export interface ExHandler<S> {
  handleException(res: S, err: any, i?: number, filename?: string): void
}

// tslint:disable-next-line:max-classes-per-file
export class Importer<T, S> {
  constructor(
    protected skip: number,
    protected filename: string,
    public read: AsyncIterable<S>,
    protected transform: (data: S) => Promise<T>,
    protected write: (obj: T) => Promise<number>,
    protected flush?: () => Promise<number>,
    protected handleException?: (res: S, err: any, i?: number, filename?: string) => void,
    protected validate?: (obj: T) => Promise<ErrorMessage[]>,
    protected handleError?: (res: T, errors: ErrorMessage[], i?: number, filename?: string) => void,
  ) {
    this.import = this.import.bind(this)
    this.transformAndWrite = this.transformAndWrite.bind(this)
    this.validateAndWrite = this.validateAndWrite.bind(this)
  }
  async import(): Promise<Result> {
    let total = 0
    let success = 0
    const v = this.validate
    if (v) {
      let i = 0
      if (this.skip > 0) {
        for await (const _line of this.read) {
          if (i >= this.skip) {
            const r = await this.validateAndWrite(_line, v, i)
            total = total + 1
            success = success + r
          }
          i++
        }
        if (this.flush) {
          await this.flush()
        }
      }
      return { total, success }
    } else {
      let i = 0
      for await (const _line of this.read) {
        if (i >= this.skip) {
          const r = await this.transformAndWrite(_line, i)
          total = total + 1
          success = success + r
        }
        i++
      }
      if (this.flush) {
        await this.flush()
      }
      return { total, success }
    }
  }
  private async validateAndWrite(line: S, validate: (obj: T) => Promise<ErrorMessage[]>, i: number): Promise<number> {
    try {
      const res: T = await this.transform(line)
      const errors = await validate(res)
      if (errors && errors.length > 0) {
        if (this.handleError) {
          this.handleError(res, errors, i++, this.filename)
        }
        return 0
      } else {
        const r = await this.write(res)
        return r > 0 ? 1 : 0
      }
    } catch (err) {
      if (this.handleException) {
        this.handleException(line, err, i++, this.filename)
      }
      return 0
    }
  }
  private async transformAndWrite(line: S, i: number): Promise<number> {
    try {
      const rs: T = await this.transform(line)
      const r = await this.write(rs)
      return r > 0 ? 1 : 0
    } catch (err) {
      if (this.handleException) {
        this.handleException(line, err, i, this.filename)
      }
      return 0
    }
  }
}
// tslint:disable-next-line:max-classes-per-file
export class ImportService<T, S> {
  constructor(
    protected skip: number,
    protected filename: string,
    public read: AsyncIterable<S>,
    protected transformer: Transformer<T, S>,
    protected writer: Writer<T>,
    protected exceptionHandler?: ExHandler<S>,
    protected validator?: Validator<T>,
    protected errorHandler?: ErrHandler<T>,
  ) {
    this.import = this.import.bind(this)
    this.validateAndWrite = this.validateAndWrite.bind(this)
    this.transformAndWrite = this.transformAndWrite.bind(this)
  }
  async import(): Promise<Result> {
    let total = 0
    let success = 0
    const v = this.validator
    if (v) {
      let i = 0
      if (this.skip > 0) {
        for await (const _line of this.read) {
          if (i >= this.skip) {
            const r = await this.validateAndWrite(_line, v, i)
            total = total + 1
            success = success + r
          }
          i++
        }
        if (this.writer.flush) {
          await this.writer.flush()
        }
      }
      return { total, success }
    } else {
      let i = 0
      for await (const _line of this.read) {
        if (i >= this.skip) {
          const r = await this.transformAndWrite(_line, i)
          total = total + 1
          success = success + r
        }
        i++
      }
      if (this.writer.flush) {
        await this.writer.flush()
      }
      return { total, success }
    }
  }
  private async validateAndWrite(line: S, v: Validator<T>, i: number): Promise<number> {
    try {
      const res: T = await this.transformer.transform(line)
      const errors = await v.validate(res)
      if (errors && errors.length > 0) {
        if (this.errorHandler) {
          this.errorHandler.handleError(res, errors, i++, this.filename)
        }
        return 0
      } else {
        const r = await this.writer.write(res)
        return r > 0 ? 1 : 0
      }
    } catch (err) {
      if (this.exceptionHandler) {
        this.exceptionHandler.handleException(line, err, i++, this.filename)
      }
      return 0
    }
  }
  private async transformAndWrite(line: S, i: number): Promise<number> {
    try {
      const rs: T = await this.transformer.transform(line)
      const r = await this.writer.write(rs)
      return r > 0 ? 1 : 0
    } catch (err) {
      if (this.exceptionHandler) {
        this.exceptionHandler.handleException(line, err, i, this.filename)
      }
      return 0
    }
  }
}
export function toString(v: any): string {
  if (typeof v === "string") {
    return v
  } else {
    return JSON.stringify(v)
  }
}
function clone(obj: any): any {
  const r: any = {}
  if (obj !== undefined) {
    const keys = Object.keys(obj)
    for (const key of keys) {
      r[key] = (obj as any)[key]
    }
  }
  return r
}
// tslint:disable-next-line:max-classes-per-file
export class ErrorHandler<T> {
  constructor(
    public logError: (obj: string, m?: SimpleMap) => void,
    filename?: string,
    lineNumber?: string,
    mp?: SimpleMap,
    prefix?: string,
  ) {
    this.map = mp
    this.prefix = prefix && prefix.length > 0 ? prefix : "Message is invalid: "
    this.filename = filename && filename.length > 0 ? filename : "filename"
    this.logFileName = filename && filename.length > 0 ? true : false
    this.lineNumber = lineNumber && lineNumber.length > 0 ? lineNumber : "lineNumber"
    this.logLineNumber = lineNumber && lineNumber.length > 0 ? true : false
    this.handleError = this.handleError.bind(this)
  }
  prefix: string
  map?: SimpleMap
  filename: string
  lineNumber: string
  private logFileName: boolean
  private logLineNumber: boolean
  handleError(rs: T, err: ErrorMessage[], i?: number, filename?: string): void {
    if (this.logFileName && this.logLineNumber) {
      const ext = clone(this.map)
      if (filename !== undefined) {
        ext[this.filename] = filename
      }
      if (i !== undefined) {
        ext[this.lineNumber] = i
      }
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)}`, ext)
    } else if (this.logFileName) {
      const ext = clone(this.map)
      if (filename !== undefined) {
        ext[this.filename] = filename
      }
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)} line: ${i}`, ext)
    } else if (this.logLineNumber) {
      const ext = clone(this.map)
      if (i !== undefined) {
        ext[this.lineNumber] = i
      }
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)} filename: ${filename}`, ext)
    } else {
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)} filename: ${filename} line: ${i}`)
    }
  }
}
// tslint:disable-next-line:max-classes-per-file
export class ExceptionHandler<S> {
  constructor(
    public logError: (obj: string, m?: SimpleMap) => void,
    filename?: string,
    lineNumber?: string,
    mp?: SimpleMap,
    prefix?: string,
  ) {
    this.map = mp
    this.prefix = prefix && prefix.length > 0 ? prefix : "Error to write: "
    this.filename = filename && filename.length > 0 ? filename : "filename"
    this.logFileName = filename && filename.length > 0 ? true : false
    this.lineNumber = lineNumber && lineNumber.length > 0 ? lineNumber : "lineNumber"
    this.logLineNumber = lineNumber && lineNumber.length > 0 ? true : false
    this.handleException = this.handleException.bind(this)
  }
  prefix: string
  map?: SimpleMap
  filename: string
  lineNumber: string
  private logFileName: boolean
  private logLineNumber: boolean
  handleException(rs: S, err: any, i?: number, filename?: string): void {
    if (this.logFileName && this.logLineNumber) {
      const ext = clone(this.map)
      if (filename !== undefined) {
        ext[this.filename] = filename
      }
      if (i !== undefined) {
        ext[this.lineNumber] = i
      }
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)}`, ext)
    } else if (this.logFileName) {
      const ext = clone(this.map)
      if (filename !== undefined) {
        ext[this.filename] = filename
      }
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)} line: ${i}`, ext)
    } else if (this.logLineNumber) {
      const ext = clone(this.map)
      if (i !== undefined) {
        ext[this.lineNumber] = i
      }
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)} filename: ${filename}`, ext)
    } else {
      this.logError(`${this.prefix}${toString(rs)} . Error: ${toString(err)} filename: ${filename} line: ${i}`, this.map)
    }
  }
}
// tslint:disable-next-line:max-classes-per-file
export class CSVTransformer<T> {
  constructor(attributes: Attributes) {
    this.transform = this.transform.bind(this)
    this.fieldParsers = createCSVFieldParsers(attributes)
  }
  protected fieldParsers: ICSVFieldParser<T>[]
  transform(data: string[]): Promise<T> {
    let res: any = {}
    const l = Math.min(data.length, this.fieldParsers.length)
    for (let i = 0; i < l; i++) {
      const parser = this.fieldParsers[i]
      parser.parse(res, parser.name, data[i])
    }
    return Promise.resolve(res)
  }
}
// tslint:disable-next-line:max-classes-per-file
export class CSVParser<T> {
  constructor(attributes: Attributes) {
    this.parse = this.parse.bind(this)
    this.fieldParsers = createCSVFieldParsers(attributes)
  }
  protected fieldParsers: ICSVFieldParser<T>[]
  parse(data: string[]): Promise<T> {
    let res: any = {}
    const l = Math.min(data.length, this.fieldParsers.length)
    for (let i = 0; i < l; i++) {
      const parser = this.fieldParsers[i]
      parser.parse(res, parser.name, data[i])
    }
    return Promise.resolve(res)
  }
}
export interface ICSVFieldParser<T> {
  name: string
  parse(data: T, key: string, v: string): void
}
export function createCSVFieldParsers<T>(attrs: Attributes): ICSVFieldParser<T>[] {
  const parsers: ICSVFieldParser<T>[] = []
  for (const key in attrs) {
    const attr = attrs[key]
    const parser = new CSVFieldParser<T>(key)

    if (attr.type === "number" || attr.type === "integer") {
      parser.parse = resources.parseNumber
    } else if (attr.type === "datetime" || attr.type === "date") {
      parser.parse = resources.parseDate
    } else if (attr.type === "boolean") {
      parser.parse = resources.parseBool
    }

    parsers.push(parser)
  }

  return parsers
}
export class CSVFieldParser<T> implements ICSVFieldParser<T> {
  constructor(public name: string) {}
  parse(res: T, key: string, v: string): void {
    ;(res as any)[key] = v
  }
}

// tslint:disable-next-line:max-classes-per-file
export class FixedLengthTransformer<T> {
  constructor(attributes: FixedLengthAttributes) {
    this.transform = this.transform.bind(this)
    this.fieldParsers = createFixedLengthFieldParsers(attributes)
  }
  protected fieldParsers: IFixedLengthFieldParser<T>[]
  transform(data: string): Promise<T> {
    let res: any = {}
    const l = this.fieldParsers.length
    for (let i = 0; i < l; i++) {
      const parser = this.fieldParsers[i]
      const len = parser.length ? parser.length : 10
      const v = data.substring(i, i + len)
      parser.parse(res, parser.name, v.trim())
    }
    return Promise.resolve(res)
  }
}

// tslint:disable-next-line:max-classes-per-file
export class FixedLengthParser<T> {
  constructor(attributes: FixedLengthAttributes) {
    this.parse = this.parse.bind(this)
    this.fieldParsers = createFixedLengthFieldParsers(attributes)
  }
  protected fieldParsers: IFixedLengthFieldParser<T>[]
  parse(data: string): Promise<T> {
    let res: any = {}
    const l = this.fieldParsers.length
    for (let i = 0; i < l; i++) {
      const parser = this.fieldParsers[i]
      const len = parser.length ? parser.length : 10
      const v = data.substring(i, i + len)
      parser.parse(res, parser.name, v.trim())
    }
    return Promise.resolve(res)
  }
}
export interface IFixedLengthFieldParser<T> {
  name: string
  length: number
  parse(data: T, key: string, v: string): void
}

export function createFixedLengthFieldParsers<T>(attrs: FixedLengthAttributes): IFixedLengthFieldParser<T>[] {
  const parsers: IFixedLengthFieldParser<T>[] = []
  for (const key in attrs) {
    const attr = attrs[key]
    const parser = new FixedLengthFieldParser<T>(key, attr.length)

    if (attr.type === "number" || attr.type === "integer") {
      parser.parse = resources.parseNumber
    } else if (attr.type === "datetime" || attr.type === "date") {
      parser.parse = resources.parseDate
    } else if (attr.type === "boolean") {
      parser.parse = resources.parseBool
    }

    parsers.push(parser)
  }

  return parsers
}
export class FixedLengthFieldParser<T> implements IFixedLengthFieldParser<T> {
  constructor(
    public name: string,
    public length: number,
  ) {}

  parse(res: T, key: string, v: string): void {
    ;(res as any)[key] = v
  }
}

export function handleNullable(obj: any, attrs: Attributes): any {
  const keys = Object.keys(obj)
  for (const key of keys) {
    const v = obj[key]
    if (v === "") {
      const attr = attrs[key]
      if (attr && !attr.required) {
        obj[key] = null
      }
    }
  }
  return obj
}
// tslint:disable-next-line:ban-types
export function buildStrings(files: String[]): string[] {
  const res: string[] = []
  for (const file of files) {
    res.push(file.toString())
  }
  return res
}
export function getFiles(files: string[], check: (s: string) => boolean): string[] {
  const res: string[] = []
  for (const file of files) {
    const v = check(file)
    if (v === true) {
      res.push(file)
    }
  }
  return res
}
// tslint:disable-next-line:max-classes-per-file
export class NameChecker {
  constructor(
    private prefix: string,
    private suffix: string,
  ) {
    this.check = this.check.bind(this)
  }
  check(name: string): boolean {
    if (name.startsWith(this.prefix) && name.endsWith(this.suffix)) {
      return true
    }
    return false
  }
}
export function getPrefix(s: string, date: Date, offset?: number, separator?: string): string {
  if (offset !== undefined) {
    const d = addDays(date, offset)
    return s + dateToString(d, separator)
  } else {
    return s + dateToString(date, separator)
  }
}
export function dateToString(date: Date, separator?: string): string {
  const year = date.getFullYear().toString()
  let month: number | string = date.getMonth() + 1
  let dt: number | string = date.getDate()

  if (dt < 10) {
    dt = "0" + dt.toString()
  }
  if (month < 10) {
    month = "0" + month
  }
  if (separator !== undefined) {
    return year + separator + month + separator + dt
  } else {
    return year + month + dt
  }
}
export function timeToString(date: Date, separator?: string): string {
  let hh: number | string = date.getHours()
  let mm: number | string = date.getMinutes()
  let ss: number | string = date.getSeconds()
  if (hh < 10) {
    hh = "0" + hh.toString()
  }
  if (ss < 10) {
    ss = "0" + ss.toString()
  }
  if (mm < 10) {
    mm = "0" + mm
  }
  if (separator !== undefined) {
    return hh.toString() + separator + mm + separator + ss
  } else {
    return hh.toString() + mm + ss
  }
}
export function toISOString(d: Date): string {
  const s = `${dateToString(d, "-")}T${timeToString(d, ":")}.${getMilliseconds(d)}${getTimezone(d)}`
  return s
}
export function getTimezone(d: Date): string {
  const t = d.getTimezoneOffset() / 60
  const p = d.getTimezoneOffset() % 60
  if (t > 0) {
    return t > -10 ? "-0" + Math.abs(t) + ":00" : "-" + Math.abs(t) + ":" + getMinutes(p)
  } else {
    return t < 9 ? "+0" + Math.abs(t) + ":00" : Math.abs(t).toString() + ":" + getMinutes(p)
  }
}
export function getMinutes(p: number): string {
  const x = Math.abs(p)
  return x >= 10 ? x.toString() : "0" + x
}
export function getMilliseconds(d: Date): string {
  const m = d.getMilliseconds()
  if (m >= 100) {
    return m.toString()
  } else if (m >= 10) {
    return "0" + m
  } else {
    return "00" + m
  }
}
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
export function getFields(attrs: Attributes, t: string): string[] {
  const fis: string[] = []
  const keys = Object.keys(attrs)
  for (const key of keys) {
    const attr = attrs[key]
    if (attr.type === t) {
      fis.push(key)
    }
  }
  return fis
}
export function reformatDates(obj: any, ignores: string[]): any {
  const keys = Object.keys(obj)
  for (const key of keys) {
    const v = obj[key]
    if (v instanceof Date && !isNaN(v.getTime())) {
      if (!ignores.includes(key)) {
        obj[key] = toISOString(v)
      }
    }
  }
  return obj
}
export function mkdirSync(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}
export async function createReader(filename: string, opts?: BufferEncoding): Promise<AsyncIterable<string>> {
  const c: BufferEncoding = opts !== undefined ? opts : "utf-8"
  const stream = fs.createReadStream(filename, c)
  await Promise.all([once(stream, "open")])
  const read = readline.createInterface({ input: stream, crlfDelay: Infinity })
  return read
}
export interface StreamOptions {
  flags?: string | undefined
  encoding?: BufferEncoding | undefined
  fd?: number | promises.FileHandle | undefined
  mode?: number | undefined
  autoClose?: boolean | undefined
  /**
   * @default false
   */
  emitClose?: boolean | undefined
  start?: number | undefined
  highWaterMark?: number | undefined
}
const options: StreamOptions = { flags: "a", encoding: "utf-8" }
// tslint:disable-next-line:max-classes-per-file
export class LogWriter {
  private writer: WriteStream
  suffix: string
  constructor(filename: string, dir: string, opts?: BufferEncoding | StreamOptions, suffix?: string) {
    const o = opts ? opts : options
    this.suffix = suffix ? suffix : "\n"
    this.writer = createWriteStream(dir, filename, o)
    this.writer.cork()
    this.write = this.write.bind(this)
    this.flush = this.flush.bind(this)
    this.uncork = this.uncork.bind(this)
    this.end = this.end.bind(this)
  }
  write(data: string): void {
    this.writer.write(data + this.suffix)
  }
  flush(): void {
    this.writer.uncork()
  }
  uncork(): void {
    this.writer.uncork()
  }
  end(): void {
    this.writer.end()
  }
}
export function createWriteStream(dir: string, filename: string, opts?: BufferEncoding | StreamOptions): WriteStream {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (dir.endsWith("/") || dir.endsWith("\\")) {
    return fs.createWriteStream(dir + filename, opts)
  } else {
    return fs.createWriteStream(dir + "/" + filename, opts)
  }
}
export function parseNum(s?: string): number | undefined {
  if (!s || s.length === 0) {
    return undefined
  }
  const n = parseFloat(s)
  return isNaN(n) ? undefined : n
}
export function parseNumber(s: string | undefined, d: number): number {
  if (!s || s.length === 0) {
    return d
  }
  const n = parseFloat(s)
  return isNaN(n) ? d : n
}
export function parseDate(s: string | undefined, undefinedIfInvalid?: boolean): Date | undefined {
  if (!s || s.length === 0) {
    return undefined
  }
  const d = new Date(s)
  if (d instanceof Date && !isNaN(d.getTime())) {
    return d
  } else {
    return undefinedIfInvalid ? undefined : d
  }
}
