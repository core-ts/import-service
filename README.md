# import-service

> A high-performance, streaming data import framework for Node.js and TypeScript.

`import-service` is a lightweight and extensible framework for building enterprise-grade data import applications. It provides a modular pipeline for reading, transforming, validating, and writing data while maintaining constant memory usage through asynchronous streaming.

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

Unlike traditional CSV parsers, **import-service is not limited to a specific file format**. It is designed as a general-purpose import framework that supports CSV, fixed-length files, and any custom data source that can be exposed as an `AsyncIterable`.

The framework separates each stage of the import process into independent components, allowing developers to customize every part of the pipeline without modifying the framework itself.

## Detailed Flow
![Import flow with data validation](https://cdn-images-1.medium.com/max/800/1*RK_Wzee40zyMBPKogtat7Q.png)

### Examples:
- [import-sample](https://github.com/typescript-sample/import-sample): import a fix-length file to MySql.
- [import-csv-sample](https://github.com/typescript-sample/import-csv-sample): import a CSV file to MySql.

---

# Why import-service?

Most Node.js import libraries focus on parsing a particular file format.

For example:

```
CSV File
    │
    ▼
CSV Parser
    │
    ▼
 Objects
```

However, real-world enterprise import applications involve much more than parsing.

Typical import workflows include:

* Reading large files
* Converting raw values into domain objects
* Validating business rules
* Writing to destination
  * Writing to databases
  * Calling REST APIs
* Recording rejected records
* Logging import progress
* Handling unexpected exceptions
* Processing millions of records efficiently

`import-service` provides a complete framework for building these workflows.

---

# Features

## Streaming Processing

Process files using `AsyncIterable` without loading the entire file into memory.

* Constant memory usage
* Suitable for very large files
* Supports millions of records

---

## Generic Import Pipeline

The framework separates importing into independent stages.

```
 Reader
    │
    ▼
Transformer
    │
    ▼
Validator (Optional)
    │
    ▼
  Writer
```

Each stage can be replaced independently.

---

## Multiple File Formats

Built-in support for:

* CSV
* Fixed-Length Files

The architecture also allows custom formats such as:

* JSON
* XML
* Excel
* Avro
* Parquet
* Custom text formats

---

## Automatic Type Conversion

Convert raw string values into strongly typed objects.

Supported types include:

* string
* number
* integer
* boolean
* date
* datetime

---

## Validation Pipeline

Validation is completely optional.

When enabled:

```
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
```

When disabled:

```
 Reader
    │
    ▼
Transformer
    │
    ▼
 Writer
```

The framework automatically selects the appropriate execution pipeline before processing begins.

---

## Pluggable Components

Every stage can be customized.

* Reader
* Parser
* Transformer
* Validator
* Writer
* Error Handler
* Exception Handler

No component depends on a particular database or file format.

---

## Progress Reporting

Monitor long-running imports.

Example:

```
Importing customers.csv...

Processed 10,000 records...
Processed 20,000 records...
Processed 30,000 records...
```

The reporting interval is configurable.

---

## Enterprise Error Handling

Validation failures and unexpected exceptions are handled independently.

Validation Errors

```
Transformer
     │
     ▼
 Validator
     │
     ▼
Error Handler
```

Runtime Exceptions

```
  Reader
Transformer
  Writer
    │
    ▼
Exception Handler
```

This allows applications to distinguish invalid data from system failures.

---

## Buffered Logging

Built-in buffered logging improves performance during long-running imports while reducing unnecessary disk writes.

---

## TypeScript First

Designed specifically for TypeScript.

* Strong typing
* Generic interfaces
* Async/await
* Modern ES modules

---

## Zero Runtime Dependencies

The framework has no unnecessary runtime dependencies, making it lightweight and easy to integrate into existing applications.

---

# Installation

```bash
npm install import-service
```

---

# Architecture

The framework is built around a modular processing pipeline.

```
   AsyncIterable
         │
         ▼
    Transformer
         │
         ▼
     Validator (Optional)
         │
         ▼
       Writer
         │
         ▼
       Flush
```

Each component has a single responsibility.

| Component   | Responsibility                    |
| ----------- | --------------------------------- |
| Reader      | Reads records from any source     |
| Transformer | Converts raw records into objects |
| Validator   | Validates business rules          |
| Writer      | Persists data                     |
| Flush       | Completes pending writes          |

Because every stage is independent, applications can replace only the components they need.

---

# Processing Pipeline

A typical import workflow looks like this.

```
       File
         │
         ▼
      Reader
         │
         ▼
    AsyncIterable
         │
         ▼
    Transformer
         │
         ▼
    Domain Object
         │
         ▼
     Validator (Optional)
         │
         ▼
       Writer
         │
         ▼
      Database
```

The framework itself does not assume any storage technology.

A writer may send data to:

* SQL databases
* MongoDB
* Redis
* REST APIs
* Message queues
* Cloud services
* Another file
* Any custom destination

---

# Design Philosophy

`import-service` is designed around several core principles.

## Streaming First

Every record is processed individually using `AsyncIterable`.

This keeps memory usage constant regardless of file size.

---

## Separation of Concerns

Reading, transformation, validation, writing, and logging are independent responsibilities.

Each component can evolve independently.

---

## Extensibility

The framework depends on abstractions rather than implementations.

Applications can replace any stage without modifying the framework.

---

## Performance

The framework is optimized for processing very large datasets.

Instead of checking whether validation exists for every record, the execution path is selected once before processing begins.

Validation enabled:

```
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
```

Validation disabled:

```
 Reader
    │
    ▼
Transformer
    │
    ▼
  Writer
```

This avoids unnecessary conditional checks inside the hot processing loop while keeping each execution path specialized for its task.

---

# Quick Start

The simplest import application consists of four steps.

1. Create a reader.
2. Transform each record.
3. Write the result.
4. Execute the importer.

```ts
const importer = new Importer(
    1,
    "customers.csv",
    reader,
    transformer,
    writer,
    writer.flush
)

const result = await importer.import()
```

Example result:

```ts
{
    total: 100000,
    success: 99987
}
```

---

# Two Programming Models

The framework provides two APIs.

## Importer

A lightweight functional API.

Ideal for:

* Scripts
* Scheduled jobs
* Serverless functions
* Small applications
* Javascript or GO developers

---

## ImportService

An object-oriented API based on strategy interfaces.

Ideal for:

* Enterprise applications
* Dependency Injection
* Unit testing
* Large project
* Java developers

Both APIs share the same processing pipeline while supporting different development styles.

---

# Readers

The framework processes data from any source that implements `AsyncIterable`.

This design makes `import-service` independent of file formats, storage systems, and transport protocols.

Typical readers include:

* CSV files
* Fixed-length files
* Database cursors
* REST APIs
* Message queues
* Cloud storage
* Custom readers

```
 CSV File
      │
      ▼
 CSV Reader
      │
      ▼
AsyncIterable
```

```
Database Cursor
      │
      ▼
AsyncIterable
```

```
  REST API
      │
      ▼
AsyncIterable
```

Every reader produces the same output type:

```ts
AsyncIterable<S>
```

Once data becomes an `AsyncIterable`, the remainder of the import pipeline is identical.

This makes the framework highly reusable.

---

# Importer

`Importer` is the lightweight functional API.

Instead of implementing multiple interfaces, applications simply provide functions.

```ts
const importer = new Importer(
    skip,
    filename,
    reader,
    transform,
    write,
    flush,
    handleException,
    logInfo,
    progressSize,
    validate,
    handleError
)
```

This API is ideal for:

* Scheduled jobs
* Small applications
* Scripts
* CLI tools
* Serverless functions

Because it only requires functions, it has very little setup code.

---

## Import Flow

Without validation

```
  Read
    │
    ▼
Transform
    │
    ▼
  Write
```

With validation

```
  Read
    │
    ▼
Transform
    │
    ▼
Validate
    │
    ▼
  Write
```

The execution path is selected once before processing begins.

---

# ImportService

`ImportService` provides the same functionality using strategy interfaces.

```ts
const service = new ImportService(
    skip,
    filename,
    reader,
    transformer,
    writer,
    exceptionHandler,
    logInfo,
    progressSize,
    validator,
    errorHandler
)
```

This API is recommended for:

* Enterprise applications
* Layered architecture
* Dependency Injection
* Unit testing
* Large development teams

Each responsibility is implemented as an independent service.

---

# Strategy Interfaces

The framework depends on abstractions instead of concrete implementations.

```
  Reader

    ↓

Transformer

    ↓

 Validator

    ↓

  Writer
```

Each interface has a single responsibility.

---

## Transformer

Transforms raw input into a domain object.

```ts
interface Transformer<T, S> {
    transform(data: S): Promise<T>
}
```

Examples:

* CSV row → Customer
* Fixed-length record → Product
* JSON → Order
* XML → Employee

---

## Parser

A parser converts raw data into a strongly typed object.

```ts
interface Parser<T, S> {
    parse(data: S): Promise<T>
}
```

Built-in parsers include:

* CSVParser
* FixedLengthParser

Applications can implement their own parsers for any format.

---

## Validator

Validates business rules.

```ts
interface Validator<T> {
    validate(data: T): Promise<ErrorMessage[]>
}
```

Typical validation includes:

* Required fields
* Duplicate records
* Business rules
* Data consistency
* Referential integrity

Validation is completely optional.

---

## Writer

Persists imported data.

```ts
interface Writer<T> {
    write(data: T): Promise<number>

    flush?(): Promise<number>
}
```

A writer may store data in:

* SQL databases
* MongoDB
* Redis
* REST APIs
* Kafka
* RabbitMQ
* Files
* Cloud services

The framework is storage-independent.

---

## ErrorHandler

Processes validation failures.

```ts
interface ErrorHandler<T> {
    handleError(
        data: T,
        errors: ErrorMessage[]
    ): Promise<void>
}
```

Typical implementations:

* Error log
* CSV reject file
* Database table
* Monitoring system

---

## ExceptionHandler

Processes unexpected runtime errors.

```ts
interface ExceptionHandler<S> {
    handleException(
        data: S,
        error: any
    ): Promise<void>
}
```

Examples:

* Database connection failure
* Network timeout
* Unexpected parser exception
* Invalid file format

Validation errors and runtime exceptions are intentionally handled separately.

---

# CSV Support

The framework includes built-in support for CSV files.

```
CSV File
    │
    ▼
CSV Reader
    │
    ▼
CSV Parser
    │
    ▼
 Customer
```

or

```
CSV File
    │
    ▼
CSV Reader
    │
    ▼
CSV Transformer
    │
    ▼
 Customer
```

Both APIs integrate seamlessly with the import pipeline.

---

## CSVParser

`CSVParser` converts CSV rows into strongly typed objects.

```ts
const parser = new CSVParser<Customer>(attributes)

const customer = await parser.parse(record)
```

---

## CSVTransformer

`CSVTransformer` implements the `Transformer` interface.

```ts
const transformer = new CSVTransformer<Customer>(attributes)
```

This allows CSV records to be used directly with `ImportService`.

---

# CSV Attributes

CSV parsing is driven by attribute definitions.

Example:

```ts
const attributes = {
    id: {
        type: "string"
    },
    name: {
        type: "string"
    },
    age: {
        type: "integer"
    },
    active: {
        type: "boolean"
    },
    salary: {
        type: "number"
    },
    birthday: {
        type: "date"
    }
}
```

Attributes define how each field should be converted.

---

# Automatic Type Conversion

The framework automatically converts string values into strongly typed properties.

Supported types include:

* string
* number
* integer
* boolean
* date
* datetime

Example CSV

```csv
1001,John,true,30,1500.75,2025-01-01
```

becomes

```ts
{
    id: "1001",
    name: "John",
    active: true,
    age: 30,
    salary: 1500.75,
    birthday: new Date(...)
}
```

No manual conversion code is required.

---

# Fixed-Length Support

In addition to CSV, the framework provides first-class support for fixed-length files.

```
Fixed-Length File
        │
        ▼
FixedLength Reader
        │
        ▼
FixedLength Parser
        │
        ▼
     Customer
```

or

```
Fixed-Length File
        │
        ▼
FixedLength Reader
        │
        ▼
FixedLength Transformer
        │
        ▼
     Customer
```

The processing pipeline is identical to CSV.

Only the parser changes.

---

# FixedLengthParser

```ts
const parser =
    new FixedLengthParser<Customer>(attributes)
```

Converts fixed-length records into strongly typed objects.

---

# FixedLengthTransformer

```ts
const transformer =
    new FixedLengthTransformer<Customer>(attributes)
```

Integrates fixed-length records directly into the import pipeline.

---

# FixedLengthAttributes

Fixed-length parsing uses a dedicated metadata model.

```ts
const attributes = {
    id: {
        type: "string",
        length: 10
    },

    name: {
        type: "string",
        length: 40
    },

    age: {
        type: "integer",
        length: 3
    },

    salary: {
        type: "number",
        length: 12
    }
}
```

Unlike CSV attributes, every field specifies its length.

Separating `FixedLengthAttributes` from CSV attributes provides:

* Better compile-time safety
* Cleaner APIs
* Clearer intent
* Independent evolution of file formats

Each format has its own metadata model while sharing the same import architecture.

---

# CSVFieldParser

CSV values are converted using `CSVFieldParser`.

It is responsible for converting individual field values according to their attribute definitions.

Examples include:

* String
* Number
* Integer
* Boolean
* Date
* DateTime

---

# FixedLengthFieldParser

Fixed-length records use a dedicated `FixedLengthFieldParser`.

Although it performs similar type conversions, it is separated from `CSVFieldParser` so each format can evolve independently.

Future enhancements such as alignment, padding, packed decimal formats, or custom encodings can be added without affecting CSV processing.

---

# Validation

Validation is an optional stage of the import pipeline.

When validation is enabled, every transformed object is validated before it is written.

```text
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
```

When validation is not required, the framework automatically switches to a dedicated execution pipeline.

```text
  Reader
    │
    ▼
Transformer
    │
    ▼
  Writer
```

This keeps the processing pipeline simple and avoids unnecessary work during large imports.

---

## Creating a Validator

A validator implements the `Validator<T>` interface.

```ts
class CustomerValidator implements Validator<Customer> {

    async validate(customer: Customer): Promise<ErrorMessage[]> {
        const errors: ErrorMessage[] = []

        if (!customer.name) {
            errors.push({
                field: "name",
                code: "required",
                message: "Customer name is required."
            })
        }

        if (customer.age < 18) {
            errors.push({
                field: "age",
                code: "invalid",
                message: "Customer must be at least 18 years old."
            })
        }

        return errors
    }

}
```

Returning an empty array indicates that the record is valid.

---

## Validation Flow

```text
 Record
    ↓
Transformer
    ↓
 Validator
    ↓
  Valid ?
    ├── Yes → Writer
    └── No  → ErrorHandler
```

This separation allows invalid records to be processed without interrupting the import.

---

# Error Handling

Business validation failures are handled by an `ErrorHandler`.

```ts
class CustomerErrorHandler
implements ErrorHandler<Customer> {

    async handleError(
        customer: Customer,
        errors: ErrorMessage[]
    ): Promise<void> {

        console.log(customer)
        console.log(errors)

    }

}
```

Typical implementations include:

* Reject files
* Error tables
* Audit logs
* Monitoring systems
* Notification services

Validation errors do not stop the import process.

---

# Exception Handling

Unexpected runtime failures are handled independently from validation errors.

Examples include:

* File access errors
* Network failures
* Database exceptions
* Parser exceptions
* Unexpected runtime errors

```text
  Reader

    ↓

Transformer

    ↓

  Writer

    ↓

ExceptionHandler
```

---

## Creating an ExceptionHandler

```ts
class CustomerExceptionHandler
implements ExceptionHandler<string[]> {

    async handleException(
        record: string[],
        error: any
    ): Promise<void> {

        console.error(error)

    }

}
```

Separating validation failures from runtime exceptions allows applications to respond appropriately to each type of problem.

---

# Progress Reporting

Large imports can take several minutes or even hours.

The framework provides configurable progress reporting so operators can monitor long-running jobs.

Example output:

```text
Import started...

Processed 10,000 records...
Processed 20,000 records...
Processed 30,000 records...
Processed 40,000 records...

Import completed.
```

The reporting interval is configurable.

```ts
const progressSize = 10000
```

Applications may choose any interval depending on file size and operational requirements.

Typical values:

| Records | Usage              |
| ------- | ------------------ |
| 1,000   | Development        |
| 10,000  | Production         |
| 100,000 | Very large imports |

---

# Logging

`import-service` includes a buffered log writer for high-throughput import jobs.

Unlike writing directly to a file for every record, buffered logging reduces disk I/O and improves performance.

Typical uses include:

* Validation failures
* Runtime exceptions
* Rejected records
* Import summaries
* Audit logs

Example:

```ts
const logger = new LogWriter(
    "customers-error.log",
    "./logs"
)
```

---

# Utility Functions

The framework includes utility functions commonly required by import applications.

## File Utilities

* Create readers
* Create write streams
* Create directories

---

## Filename Utilities

Utilities for working with import filenames.

Examples include:

* Extract dates
* Validate filename patterns
* Read filename prefixes

Example:

```text
customers_20250101.csv
```

↓

```text
Date: 2025-01-01
Prefix: customers
```

---

## Date Utilities

Functions for working with dates.

Examples include:

* Parse dates
* Format dates
* ISO conversion
* Date arithmetic

---

## Parsing Utilities

Common parsing helpers.

Examples include:

* Number parsing
* Integer parsing
* Date parsing
* Nullable values

---

## Object Utilities

Utilities for working with imported objects.

Examples include:

* Nullable handling
* Date normalization
* Object formatting

---

# Performance

`import-service` is designed for processing very large datasets.

The framework emphasizes predictable performance while maintaining a clean programming model.

Performance features include:

* Streaming with `AsyncIterable`
* Constant memory usage
* Buffered logging
* Configurable progress reporting
* Minimal object allocation
* Zero runtime dependencies

---

## Specialized Execution Paths

Rather than checking whether validation exists for every record, the framework selects the execution pipeline once before processing begins.

Validation enabled

```text
 Reader

    ↓

Transformer

    ↓

 Validator

    ↓

  Writer
```

Validation disabled

```text
 Reader

    ↓

Transformer

    ↓

  Writer
```

This avoids repeated conditional checks inside the hot processing loop while keeping each execution path specialized.

Although this approach introduces additional implementation code, it minimizes work performed for every imported record, making it better suited for processing hundreds of thousands or millions of records.

---

## Constant Memory Usage

Records are processed one at a time.

```text
  File

    ↓

 Reader

    ↓

One Record

    ↓

Transformer

    ↓

  Writer
```

The framework never loads the entire file into memory.

Memory consumption remains nearly constant regardless of file size.

---

# Design Principles

The architecture follows several fundamental design principles.

## Single Responsibility Principle

Every component has exactly one responsibility.

* Reader
* Transformer
* Validator
* Writer
* ErrorHandler
* ExceptionHandler

---

## Pipeline Architecture

Each stage performs one task before passing the result to the next stage.

```text
 Reader

    ↓

Transformer

    ↓

 Validator

    ↓

  Writer
```

---

## Strategy Pattern

Applications provide implementations for the required interfaces.

This allows each stage to be replaced independently.

---

## Streaming First

Every processing stage is built around `AsyncIterable`.

Streaming enables:

* Large file imports
* Constant memory usage
* Better scalability

---

## Extensibility

The framework depends on abstractions instead of implementations.

Applications can easily support:

* New file formats
* New storage technologies
* New validation rules
* Custom writers
* Custom logging

without changing the framework itself.

---

# Example Architectures

## Import CSV into PostgreSQL

```text
 CSV File
     ↓
 CSV Reader
     ↓
CSVTransformer
     ↓
 Validator
     ↓
PostgreSQL Writer
```

---

## Import Fixed-Length File into MySQL

```text
  Fixed-Length File
         ↓
  FixedLengthReader
         ↓
FixedLengthTransformer
         ↓
     Validator
         ↓
    MySQL Writer
```

---

## Import CSV into MongoDB

```text
  CSV File
      ↓
CSVTransformer
      ↓
MongoDB Writer
```

---

## Import CSV through a REST API

```text
  CSV File
      ↓
CSVTransformer
      ↓
 REST Writer
      ↓
Remote Service
```

The framework is independent of the destination system.

---

# Ecosystem

`import-service` is designed to work with other TypeScript libraries.

Typical data pipeline:

```text
CSV / Fixed-Length
       ↓
 import-service
       ↓
    sql-core
       ↓
   mysql2-core
```

or

```text
     CSV
      ↓
import-service
      ↓
 mysql2-core
      ↓
  Database
```

or

```text
     CSV
      ↓
import-service
      ↓
   REST API
```

The writer determines where imported data is sent.

---

# Roadmap

Future enhancements may include:

* Excel support
* JSON support
* XML support
* Avro support
* Parquet support
* Batch writers
* Parallel processing
* Import statistics
* Progress callbacks
* Import cancellation
* Resume interrupted imports

---

# Ecosystem Integration

This sample demonstrates how several [**core-ts**](https://github.com/core-ts) libraries work together.

| Library                                                            | Purpose                             |
|--------------------------------------------------------------------|-------------------------------------|
| [`config-plus`](https://www.npmjs.com/package/config-plus)         | Configuration management            |
| [`logger-core`](https://www.npmjs.com/package/logger-core)         | Structured logging                  |
| [`validation-core`](https://www.npmjs.com/package/validation-core) | High-performance validation library |
| [`import-service`](https://www.npmjs.com/package/import-service)   | Streaming import framework          |
| [`sql-core`](https://www.npmjs.com/package/sql-core)               | SQL abstraction                     |
| [`mysql2-core`](https://www.npmjs.com/package/mysql2-core)         | MySQL implementation                |
| [`postgres-kit`](https://www.npmjs.com/package/postgres-kit)       | PostgreSQL implementation           |
| [`mongodb-kit`](https://www.npmjs.com/package/mongodb-kit)         | Generic MongoDB repositories        |



Each library focuses on a single responsibility.

That demonstrates the intended layering very well.

---

# Contributing

Contributions, bug reports, feature requests, and pull requests are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Add or update tests.
5. Submit a pull request.

---

# License

MIT License.

---

# Conclusion

`import-service` is more than a CSV parser.

It is a high-performance, streaming import framework that separates reading, transformation, validation, writing, and error handling into independent, reusable components.

Whether importing thousands of records from a CSV file or millions of records from multiple data sources, `import-service` provides a flexible, extensible, and performance-oriented architecture for building enterprise-grade data import applications.
