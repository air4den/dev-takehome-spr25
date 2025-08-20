# Checklist

<!-- Make sure you fill out this checklist with what you've done before submitting! -->

- [✅] Read the README [please please please]
- [✅] Something cool!
- [✅] Back-end
  - [✅] Minimum Requirements
    - [✅] Setup MongoDB database
    - [✅] Setup item requests collection
    - [✅] `PUT /api/request`
    - [✅] `GET /api/request?page=_`
  - [✅] Main Requirements
    - [✅] `GET /api/request?status=pending`
    - [✅] `PATCH /api/request`
  - [✅] Above and Beyond
    - [✅] Batch edits
    - [✅] Batch deletes
- [✅] Front-end
  - [✅] Minimum Requirements
    - [✅] Dropdown component
    - [✅] Table component
    - [✅] Base page [table with data]
    - [✅] Table dropdown interactivity
  - [✅] Main Requirements
    - [✅] Pagination
    - [✅] Tabs
  - [] Above and Beyond
    - [] Batch edits
    - [] Batch deletes

# Notes

## Basic API Endpoints

### `PUT /api/request`
Creates a new item request.

**Request Body:**
```json
{
  "requestorName": "Jane Doe",
  "itemRequested": "Flashlights"
}
```

**Response:**
- Status: 201 Created
- Body: Success message

**Features:**
- Automatically sets creation date and last edited date to current timestamp
- Sets status to "pending" by default
- Validates requestor name (3-30 characters) and item requested (2-100 characters)

### `GET /api/request`
Retrieves paginated requests.

**Query Parameters:**
- `page` (optional): Page number (defaults to 1)
- `status` (optional): Filter by status (pending, completed, approved, rejected)

**Examples:**
- `GET /api/request` - Get first page of all requests
- `GET /api/request?page=2` - Get second page of all requests
- `GET /api/request?status=pending` - Get first page of pending requests

**Response:**
- Status: 200 OK
- Body: Array of requests with pagination metadata

**Features:**
- Pagination with configurable page size
- Status filtering

### `PATCH /api/request`
Updates the status of a specific request.

**Request Body:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "status": "approved"
}
```

**Response:**
- Status: 200 OK
- Body: Success message

**Features:**
- Updates request status
- Updates last edited date
- Validates request ID and status values

## Batch Operations

### `PATCH /api/request/batch`
Batch updates requests by requestor name.

**Request Body:**
```json
{
  "requestorName": "Josh Forden",
  "newStatus": "approved"
}
```

**Response:**
- Status: 200 OK
- Body: Success message with update count and details

**Features:**
- Updates all requests matching the requestor name (case-insensitive)
- Automatically updates last edited date for all affected requests
- Validates that the requestor name exists before proceeding
- Returns count of updated requests

### `DELETE /api/request/batch`
Batch deletes requests by requestor name.

**Request Body:**
```json
{
  "requestorName": "John Doe"
}
```

**Response:**
- Status: 200 OK
- Body: Success message with delete count and details

**Features:**
- Deletes all requests matching the requestor name (case-insensitive partial match)
- Validates that the requestor name exists before proceeding
- Returns count of deleted requests

## Error Handling

All endpoints return consistent error responses:

**400 Bad Request (Invalid Input):**
```json
{
  "message": "Invalid input was received."
}
```

**500 Internal Server Error:**
```json
{
  "message": "An unknown error occurred."
}
```

## Data Validation

- **Requestor Name**: Required, 3-30 characters
- **Item Requested**: Required, 2-100 characters
- **Status**: Must be one of: `pending`, `completed`, `approved`, `rejected`
- **Page Parameter**: Must be a valid positive integer
- **Requestor Name (Batch)**: Must exist in database for batch operations
