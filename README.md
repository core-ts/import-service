# import-service

## Import flow
### Import flow without data validation
![Import flow without data validation](https://camo.githubusercontent.com/dcfdb7bd09705f148dea989fe5921e0bc0c02780f5296d70c350fda8b5db3242/68747470733a2f2f63646e2d696d616765732d312e6d656469756d2e636f6d2f6d61782f3830302f312a75384869556b326c41456467633350416d5f737675412e706e67)
### Import flow with data validation
![Import flow with data validation](https://camo.githubusercontent.com/2021d4866008fc6cb1fdd126d7a8a50c2d294b52315f902dbe81675bf5eeda0a/68747470733a2f2f63646e2d696d616765732d312e6d656469756d2e636f6d2f6d61782f3830302f312a524b5f577a656534307a794d42504b6f6774617437512e706e67)

## Architecture
Based on the flow, there are 4 main components (4 main ports):
- Reader. Adapter Sample: File Reader
- Validator. Adapter Sample: Schema Validator
- Transformer. Adapter Samples: Delimiter Transformer, Fix Length Transformer
- Writer. Adapter Samples: Mongo Writer, SQL Writer (insert, update, upsert...)
![Architecture](https://camo.githubusercontent.com/1efb95a3c10b9a156c75126f9e32ae27c931f8de3ab2fbb132d88fdf25655df2/68747470733a2f2f63646e2d696d616765732d312e6d656469756d2e636f6d2f6d61782f3830302f312a6e4d75355f6a5a4a316f6d7a494235564b354c682d772e706e67)
