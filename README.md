# 🚀 WebSocket Server

A real-time WebSocket server implementation built with **Spring Boot** and **Java** for handling bidirectional communication between clients and server.

## Features

- Real-time bidirectional communication
- Multiple client connection support
- 📡 Message broadcasting capabilities
- Connection state management
- Error handling and reconnection logic
- Lightweight and performant
- Cross-platform compatibility
- Secure WebSocket connections

## 🛠️ Tech Stack

- **Java** (Version 11 or higher)
- **Spring Boot** (Version 2.x/3.x)
- **Java WebSockets**
- **StompJs** (React library for client-side)
- **Maven** (Build tool)
- **Docker** (Containerization)

## Prerequisites

Before running this project, make sure you have the following installed:

- Java JDK 11 or higher
- Maven 3.6+ 
- Docker (for containerization)
- Your favorite IDE (IntelliJ IDEA, Eclipse, VS Code)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/Ccode0078/Websocket-server.git
cd Websocket-server
```

2. Install dependencies:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

## Usage

### Starting the Server

```bash
mvn spring-boot:run
```

The server will start on `http://localhost:8080` by default.

### Configuration

Configure the server in `application.properties` or `application.yml`:

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/

# WebSocket Configuration
websocket.max-sessions=100
websocket.buffer-size=8192
websocket.idle-timeout=300000

# Logging
logging.level.com.yourpackage=DEBUG
```

### Client Connection with StompJs (React)

Connect to the WebSocket server using StompJs in your React application:

```javascript
import { Client } from '@stomp/stompjs';

const client = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    onConnect: (frame) => {
        console.log('Connected to WebSocket server');
        
        // Subscribe to messages
        client.subscribe('/topic/messages', (message) => {
            console.log('Received:', message.body);
        });
    },
    onDisconnect: () => {
        console.log('Disconnected from WebSocket server');
    },
    onStompError: (error) => {
        console.error('WebSocket error:', error);
    }
});

// Activate the client
client.activate();

// Send a message
const sendMessage = (messageContent) => {
    client.publish({
        destination: '/app/chat',
        body: JSON.stringify({
            content: messageContent,
            timestamp: new Date().toISOString()
        })
    });
};
```

## API Reference

### WebSocket Endpoints

- `GET /ws` - Main WebSocket connection endpoint
- `GET /ws/info` - WebSocket server information

### WebSocket Events

#### Server to Client

- `CONNECTION_ESTABLISHED` - Fired when a new client connects
- `MESSAGE_RECEIVED` - Fired when a message is received
- `NOTIFICATION` - Server notifications
- `ERROR` - Error messages

#### Client to Server

- `SEND_MESSAGE` - Send a message to the server
- `STATUS_REQUEST` - Request server status

### Message Format

Messages should be sent in JSON format:

```json
{
    "type": "MESSAGE",
    "content": "Your message content",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "userId": "user123",
    "metadata": {
        "priority": "HIGH"
    }
}
```

## 📁 Project Structure

```
Websocket-server/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── yourpackage/
│   │   │           ├── WebSocketServerApplication.java
│   │   │           ├── config/
│   │   │           │   └── WebSocketConfig.java
│   │   │           ├── controller/
│   │   │           │   └── WebSocketController.java
│   │   │           ├── handler/
│   │   │           │   └── WebSocketHandler.java
│   │   │           ├── service/
│   │   │           │   └── MessageService.java
│   │   │           └── model/
│   │   │               └── Message.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   └── test/
│       └── java/
├── Dockerfile
├── pom.xml
├── .gitignore
└── README.md
```

## Testing

Run the test suite:

```bash
mvn test
```

Run tests with coverage:

```bash
mvn test jacoco:report
```

## Development

### Running in Development Mode

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Code Quality

This project uses Maven plugins for code quality:

```bash
# Run Checkstyle
mvn checkstyle:check

# Run SpotBugs
mvn spotbugs:check

# Run PMD
mvn pmd:check
```

## 🐳 Deployment

### Using Docker

1. Build the Docker image:
```bash
docker build -t websocket-server .
```

2. Run the container:
```bash
docker run -p 8080:8080 websocket-server
```

### JAR Deployment

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/websocket-server-1.0.0.jar
```

### Cloud Deployment

Deploy to various cloud platforms:
- **AWS**: Elastic Beanstalk, EC2
- **Azure**: App Service
- **Google Cloud**: App Engine
- **Heroku**: Git-based deployment

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
- Spring Boot WebSocket implementation
- Multi-client support
- Message broadcasting
- StompJs React integration
- Docker containerization

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/Ccode0078/Websocket-server/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible about the issue

---




