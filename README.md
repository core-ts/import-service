# import-service

A lightweight, streaming, extensible **TypeScript import framework** for building data import pipelines.

Unlike traditional CSV libraries that only parse files, **Import Service** provides a complete import pipeline:

```text
  Reader
     │
     ▼
Transformer
     │
     ▼
 Validator (optional)
     │
     ▼
   Writer
     │
     ▼
 Destination
```

It is designed for importing data from **CSV**, **fixed-length files**, **delimited text**, **Excel**, **databases**, **queues**, or any custom data source.

## Detailed Flow
![Import flow with data validation](https://cdn-images-1.medium.com/max/800/1*RK_Wzee40zyMBPKogtat7Q.png)

---

# Features

- Streaming import using `AsyncIterable`
- Generic type-safe pipeline
- CSV transformer
- Fixed-length record transformer
- Custom delimiter support
- Optional validation
- Pluggable writers
- Configurable exception handling
- Configurable validation error handling
- Automatic type conversion
- Customizable primitive parsers
- Large file friendly
- Zero framework dependency

---

# Installation

```bash
npm install import-service
```

or

```bash
yarn add import-service
```

---

# Architecture

```text
                AsyncIterable
                      │
                      ▼
                ImportService
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
   Transformer     Validator     Writer
         │            │            │
         └────────────┴────────────┘
                      │
                 Error Handler
```


Every component is independent.

### Ports and adapters architecture

![Hexagonal Architecture](https://cdn-images-1.medium.com/max/800/1*nMu5_jZJ1omzIB5VK5Lh-w.png)

---

# Quick Example

```typescript
const reader = await createReader("customers.csv")

const importer = new Importer(
    1,
    "customers.csv",
    reader,
    transformer.transform,
    writer.write
)

const result = await importer.import()

console.log(result)
```

### Examples:
- [import-sample](https://github.com/typescript-sample/import-sample): import a fix-length file to MySql.
- [import-csv-sample](https://github.com/typescript-sample/import-csv-sample): import a CSV file to MySql.
---

# Using ImportService

`ImportService` follows an object-oriented style similar to Java dependency injection.

```typescript
const service = new ImportService(
    1,
    "customers.csv",
    reader,
    transformer,
    writer,
    exceptionHandler,
    validator,
    errorHandler
)

await service.import()
```

---

# Using Importer

`Importer` is a lightweight functional API inspired by JavaScript and Go.

```typescript
const importer = new Importer(
    1,
    filename,
    reader,
    transformer.transform,
    writer.write,
    writer.flush,
    handleException,
    validate,
    handleError
)

await importer.import()
```

Choose the API that best matches your programming style.

---

# CSV Transformer

Define a schema.

```typescript
const attributes = {
    id: {
        type: "number"
    },
    name: {
        type: "string"
    },
    birthday: {
        type: "date"
    },
    active: {
        type: "boolean"
    }
}
```

Create a transformer.

```typescript
const transformer = new CSVTransformer<Customer>(attributes)
```

Each row becomes

```typescript
{
    id: 1,
    name: "John",
    birthday: Date,
    active: true
}
```

---

# Fixed-Length Files

```
000001John Smith         19880101Y
```

Define field lengths.

```typescript
const attrs = {
    id: {
        type: "number",
        length: 6
    },
    name: {
        type: "string",
        length: 20
    },
    birthday: {
        type: "date",
        length: 8
    },
    active: {
        type: "boolean",
        length: 1
    }
}
```

Then

```typescript
const transformer = new FixedLengthTransformer<Customer>(attrs)
```

---

# Validation

Validation is optional.

```typescript
class CustomerValidator implements Validator<Customer> {
    async validate(customer) {
        const errors = []
        if (!customer.name) {
            errors.push({
                field: "name",
                code: "required"
            })
        }
        return errors
    }

}
```

---

# Writer

```typescript
class CustomerWriter implements Writer<Customer> {
    async write(customer) {
        await repository.save(customer)
        return 1
    }
}
```

---

# Exception Handling

```typescript
class ImportExceptionHandler implements ExHandler<string[]> {
    handleException(data, err) {
        console.error(err)
    }
}
```

Exceptions are separated from validation errors.

---

# Validation Error Handling

```typescript
class ValidationHandler implements ErrHandler<Customer> {
    handleError(customer, errors) {
        console.log(errors)
    }
}
```

---

# Custom Primitive Parsers

The framework provides default parsers for:

- number
- date
- boolean

These parsers are replaceable.

## Boolean

Default values:

```
1
Y
T
```

become

```
true
```

You can replace the parser globally.

```typescript
resources.parseBool = (res, key, value) => {
    res[key] = value === "true" || value === "TRUE"
}
```

---

## Number

```typescript
resources.parseNumber = (res, key, value) => {
    res[key] = Number(value.replace(",", "."))
}
```

---

## Date

```typescript
resources.parseDate = (res, key, value) => {
    res[key] = dayjs(value, "DD/MM/YYYY").toDate()
}
```

No framework modification is required.

---

# Reading Files

```typescript
const reader = await createReader("customers.csv")
```

The reader returns an `AsyncIterable`, allowing the framework to process very large files without loading them entirely into memory.

---

# Logging

The library provides

```typescript
LogWriter
```

for efficient buffered log writing.

```typescript
const writer =
    new LogWriter(
        "error.log",
        "./logs"
    )
```

---

# Built-in Utilities

The library also includes helper functions for:

- File readers
- Date formatting
- ISO date conversion
- Filename checking
- Nullable handling
- File discovery
- Directory creation

---

# Why Import Service?

Most Node.js libraries only parse CSV files.

```text
CSV
 │
 ▼
Object
```

Import Service handles the complete import workflow.

```text
File
 │
 ▼
Reader
 │
 ▼
Transformer
 │
 ▼
Validator
 │
 ▼
Writer
 │
 ▼
Database
```

It separates responsibilities, making every stage reusable and independently testable.

---

# Design Goals

- Streaming first
- Generic
- Type-safe
- Framework independent
- High performance
- Easily testable
- Extensible
- Familiar to both Java and JavaScript developers

---

# License

MIT License.