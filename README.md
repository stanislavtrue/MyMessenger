[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=32&pause=1000&center=true&width=435&lines=SignalR+Messenger)](https://git.io/typing-svg)

A real-time messaging application inspired by modern messengers. The project consists of a React frontend and an ASP.NET Core backend with real-time communication powered by SignalR.
## Features
* **Authentication** - user registration, login, JWT access tokens and refresh tokens.
* **Real-time messaging** - instant message delivery using SignalR.
* **Chat rooms** - retrieve and participate in chat conversations.
* **Online presence** - track users' online status and connections.
* **Read receipts** - mark messages as read.
* **Typing indicators** - see when another user is typing.
* **Reactions** - react to messages.
* **Message management** - delete messages for yourself or for everyone.
* **Pinned messages** - pin and unpin messages in chats.
## Tech Stack
### Backend
* C#
* .NET / ASP.NET Core Web API
* SignalR
* Entity Framework Core
* PostgreSQL
* Redis
* JWT Authentication
### Frontend
* React
* JavaScript
* Vite
* SignalR Client
## Architecture
The application follows a layered architecture on the backend, separating business logic, domain models, infrastructure and data persistence.
```bash
Chat
|
├── Backend
|   ├── Chat.API
|   ├── Chat.Application
|   ├── Chat.Domain
|   ├── Chat.Infrastructure
|   ├── Chat.Persistence
|   └── Chat.Application.Tests
|
├── Frontend
|   └── React + Vite
|
└── docs
    ├── architecture.md
    ├── features.md
    ├── database.md
    ├── authentication.md
    ├── api.md
    ├── realtime.md
    └── development.md
```
## Backend
The backend is divided into several projects:
|**Project**|**Responsibility**|
|---|---|
|Chat.API|REST API endpoints, SignalR Hub and application configuration|
|Chat.Application|Application services, business use cases and interfaces|
|Chat.Domain|Domain entities and core business models|
|Chat.Infrastructure|External services and infrastructure implementations|
|Chat.Persistence|Database context, repositories and data access|
|Chat.Application.Tests|Unit tests for application logic|
## Real-time communication
SignalR is used for real-time features such as:
* Sending and receiving messages.
* Updating read receipts.
* Typing indicators.
* Message reactions.
* Message deletion and pinning.
* User presence updates.
## Getting Started
See the [Development Guide](docs/development.md) for installation, configuration, database setup, and instructions for running the application.
## Documentation
* [Architecture](docs/architecture.md)
* [Features](docs/features.md)
* [Database Design](docs/database.md)
* [Authentication](docs/authentication.md)
* [REST API](docs/api.md)
* [Real-time Communication](docs/realtime.md)
* [Development Guide](docs/development.md)
## Project Status
This project is being developed as a personal learning project to explore full-stack application development, backend architecture, authentication and real-time communication.
