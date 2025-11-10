# CSV Upload & Email Validation API

An Express.js API for uploading and verifying CSV files with names and emails. Performs asynchronous email validation with concurrency limiting and stores upload status in Redis. Containerised with Docker.

## Considerations
- Although not mentioned in requirements, names are being checked to see if they exist, further validation could be added depending on requirements.
- Streaming of CSV happens twice to count the total rows before processing, because the example status response showed a requirement for the percentage completed. We could change this to not be aware of the total rows and simply show completed rows, if this would be enough to meet requirements.
- Changed the mockValidateEmail to use setTimeout from nodes built in timers/promises package to follow consistent async/await pattern.
- Used vitest instead of jest for more stable ES module support 

## Features

- CSV file upload with validation
- Asynchronous email validation (max 5 concurrent)
- Progress tracking for uploads
- Rate limiting (10 requests/minute)
- Redis for persistent status storage
- Stream-based CSV parsing for memory efficiency
- Unit and integration tests

## Quick Start

1. Build and start the containers:
```bash
make
```

2. The API will be available at `http://localhost:8335`

## Make Commands

The project includes a Makefile for common tasks:

```bash
# Start the application 
make

#rebuild in case of npm changes
make build 

# Stop containers
make down

# Restart containers
make restart

# View application logs
make logs

# Run tests
make test

# Run linter
make lint

# Run tests in watch mode
make test-watch

# Run tests with coverage
make test-coverage

# Stop containers and remove volumes
make clean
```

## API Endpoints

### Upload CSV File

**POST** `/upload`

Upload a CSV file for processing. Returns immediately with an upload ID whilst processing continues asynchronously.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Field name: `file`
- File format: CSV with `name` and `email` columns

**Example CSV:**
```csv
name,email
John Doe,john@example.com
Jane Smith,jane@example.com
```

**Response (202 Accepted):**
```json
{
  "uploadId": "abc123-def456",
  "message": "File uploaded successfully. Processing started."
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8335/upload \
  -F "file=@users.csv"
```

### Check Upload Status

**GET** `/status/:uploadId`

Check the processing status of an uploaded file.

**Response:**
```json
{
  "uploadId": "abc123-def456",
  "status": "completed",
  "totalRecords": 10,
  "processedRecords": 9,
  "failedRecords": 1,
  "progress": "100%",
  "details": [
    {
      "name": "Jane Smith",
      "email": "invalid-email",
      "error": "Invalid email format"
    }
  ]
}
```

**Example Request:**
```bash
curl http://localhost:8335/status/abc123-def456
```

## Development

### Local Development

The current directory is mounted into the container at `/app`, so any changes you make to the code will trigger a hot-reload with `node --watch`.

If you make changes to installed modules, rebuild the container using 

```bash
make build
```
as this is not loaded from the host machine

## Architecture

1. File uploaded via POST `/upload`
2. File validated (CSV, max 5MB by default can be changed in config)
3. Upload ID generated and returned immediately
4. Background processing starts:
   - CSV parsed using streams
   - Email validation for each record (max 5 concurrent)
   - Progress tracked in memory with Redis as backup
5. Status available via GET `/status/:uploadId`


### Network

Redis is only accessible via the internal Docker network to avoid port conflicts with localhost services.

## Testing

The project includes comprehensive tests:

- **Unit tests**: Email validation, CSV parsing, upload processing
- **Integration tests**: API endpoints
- **Test fixtures**: Sample CSV files

Run tests with:
```bash
make test
# or
npm test
```

For watch mode:
```bash
make test-watch
```

For coverage:
```bash
make test-coverage
```

