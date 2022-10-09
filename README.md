# import-service

### Import Flow
![Import flow](https://camo.githubusercontent.com/b8e017e6f9ffc5422ca44ad4a7f68550d64837c268a775688aca7526fc232b6a/68747470733a2f2f63646e2d696d616765732d312e6d656469756d2e636f6d2f6d61782f3830302f312a5476303545396c63764d395061544c4a2d556f4561412e706e67)

### Architecture
Based on the flow, there are 4 main components (4 main ports):
- Reader. Adapter Sample: File Reader
- Validator. Adapter Sample: Schema Validator
- Transformer. Adapter Samples: Delimiter Transformer, Fix Length Transformer
- Writer. Adapter Samples: SQL Writer, Mongo Writer
![Architecture](https://camo.githubusercontent.com/1efb95a3c10b9a156c75126f9e32ae27c931f8de3ab2fbb132d88fdf25655df2/68747470733a2f2f63646e2d696d616765732d312e6d656469756d2e636f6d2f6d61782f3830302f312a6e4d75355f6a5a4a316f6d7a494235564b354c682d772e706e67)