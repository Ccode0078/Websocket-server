# WebSocket Server

A real-time WebSocket server implementation for handling bidirectional communication between clients and server.

## Features

- Real-time bidirectional communication
- Multiple client connection support
- Message broadcasting capabilities
- Connection state management
- Error handling and reconnection logic
- Lightweight and performant

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (version 14.x or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Ccode0078/Websocket-server.git
cd Websocket-server
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Usage

### Starting the Server

```bash
npm start
# or
node server.js
```

The server will start on `http://localhost:3000` by default.

### Configuration

You can configure the server by modifying the following environment variables:

```bash
PORT=3000                    # Server port
HOST=localhost              # Server host
MAX_CONNECTIONS=100         # Maximum concurrent connections
```

### Client Connection

Connect to the WebSocket server using JavaScript:

```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = function(event) {
    console.log('Connected to WebSocket server');
};

ws.onmessage = function(event) {
    console.log('Received:', event.data);
};

ws.onclose = function(event) {
    console.log('Disconnected from WebSocket server');
};

ws.onerror = function(error) {
    console.error('WebSocket error:', error);
};

// Send a message
ws.send('Hello Server!');
```

## API Reference

### WebSocket Events

#### Server to Client

- `connection` - Fired when a new client connects
- `message` - Fired when a message is received from a client
- `close` - Fired when a client disconnects
- `error` - Fired when an error occurs

#### Client to Server

- `message` - Send a message to the server
- `ping` - Send a ping to check connection status

### Message Format

Messages should be sent in JSON format:

```json
{
    "type": "message",
    "data": "Your message content",
    "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Project Structure

```
Websocket-server/
├── src/
│   ├── server.js           # Main server file
│   ├── handlers/           # Message handlers
│   │   └── messageHandler.js
│   ├── utils/              # Utility functions
│   │   └── logger.js
│   └── config/             # Configuration files
│       └── config.js
├── public/                 # Static files (if any)
├── tests/                  # Test files
├── package.json
├── .gitignore
└── README.md
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Development

### Running in Development Mode

```bash
npm run dev
```

This will start the server with hot reloading enabled.

### Code Style

This project uses ESLint for code linting. Run the linter:

```bash
npm run lint
```

Fix linting issues automatically:

```bash
npm run lint:fix
```

## Deployment

### Using Docker

1. Build the Docker image:
```bash
docker build -t websocket-server .
```

2. Run the container:
```bash
docker run -p 3000:3000 websocket-server
```

### Using PM2

```bash
npm install -g pm2
pm2 start server.js --name websocket-server
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0 (Current)
- Initial release
- Basic WebSocket server implementation
- Multi-client support
- Message broadcasting

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/Ccode0078/Websocket-server/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible about the issue

## Acknowledgments

- Thanks to all contributors who have helped improve this project
- Built with [ws](https://github.com/websockets/ws) WebSocket library (if applicable)

---

**Note:** Replace the placeholder content above with your actual implementation details, including specific features, configuration options, and usage examples that match your WebSocket server implementation.
