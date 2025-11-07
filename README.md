# Test - Express.js Upload Api

An Express.js API for uploading and verifying CSV's with names and emails with Redis for storing upload status containerised with Docker. 

## Features

- Express.js API running on port 8335
- Redis for status storage (internal network only)
- Hot-reloading with `node --watch`
- Docker Compose setup for showcasing

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Build and start the containers:
```bash
docker compose up
```

2. The API will be available at `http://localhost:8335`



## Development

The current directory is mounted into the container at `/app`, so any changes you make to the code will trigger a hot-reload thanks to `node --watch`. 


## Architecture

- **Node.js**: Latest LTS version (v20) 
- **Redis**: Latest version, only accessible via internal Docker network to avoid port conflicts with anything running on localhost
- **Port**: 8335 (exposed to host)
- **Network**: Internal bridge network for service communication

