OptiFit Web Application

Project Setup

To get started with the project, follow these steps:

	1.	Clone the Repository:
	•	git clone <repository-url>
	•	cd my-web-application
	2.	Install Dependencies:
	•	npm install
	3.	Run the Server:
	•	npm start

Running the Back-End Server

The back-end server is built using Express.js and serves the front-end files while providing a RESTful API for data management. To run the back-end server:

	1.	Ensure you have Node.js installed.
	•	You can download and install Node.js from nodejs.org.
	2.	Navigate to the project directory and install dependencies:
	•	npm install
	3.	Start the server:
	•	npm start
The server will start on http://localhost:3000.

Using the API

The back-end server provides several API endpoints to manage data and handle chat functionalities. All API requests and responses use JSON format.

API Endpoints

1. Get Data for a Specific Date

	•	Endpoint: /api/data/:date
	•	Method: GET
	•	Description: Retrieve data content and workout content for a specific date.
	•	Request Parameters:
	•	date (URL parameter): The date for which to retrieve data (format: YYYY-MM-DD).
	•	Response:
	•	200 OK: Successful retrieval of data.
	•	404 Not Found: Data for the specified date does not exist.
	•	500 Internal Server Error: Unexpected server error.

Example Request:
GET /api/data/2024-06-28 HTTP/1.1
Host: localhost:3000

Example Response:
{
“dataContent”: “Some data”,
“workoutContent”: “Some workout”
}

2. Update Data for a Specific Date

	•	Endpoint: /api/data/:date
	•	Method: PUT
	•	Description: Update the data content and workout content for a specific date.
	•	Request Parameters:
	•	date (URL parameter): The date for which to update data (format: YYYY-MM-DD).
	•	Request Body:
{
“dataContent”: “Updated data”,
“workoutContent”: “Updated workout”
}
	•	Response:
	•	200 OK: Successful update of data.
	•	400 Bad Request: Invalid request data.
	•	500 Internal Server Error: Unexpected server error.

Example Request:
PUT /api/data/2024-06-28 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
“dataContent”: “Updated data”,
“workoutContent”: “Updated workout”
}

Example Response:
{
“message”: “Data updated successfully”
}

3. Get All Chat Messages

	•	Endpoint: /api/chat
	•	Method: GET
	•	Description: Retrieve all chat messages.
	•	Response:
	•	200 OK: Successful retrieval of messages.
	•	500 Internal Server Error: Unexpected server error.

Example Request:
GET /api/chat HTTP/1.1
Host: localhost:3000

Example Response:
[
   {
      “_id”: “1”,
      “content”: “Hello, Coach!”,
      “sender”: “athlete”
   },
   {
      “_id”: “2”,
      “content”: “Hi, Athlete!”,
      “sender”: “coach”
   }
]

4. Send a Chat Message

	•	Endpoint: /api/chat
	•	Method: POST
	•	Description: Send a new chat message.
	•	Request Body:
{
   “content”: “Message content”,
   “sender”: “athlete or coach”
}
	•	Response:
	•	201 Created: Successful creation of the message.
	•	400 Bad Request: Invalid request data.
	•	500 Internal Server Error: Unexpected server error.

Example Request:
POST /api/chat HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
   “content”: “Hello, Coach!”,
   “sender”: “athlete”
}

Example Response:
{
   “message”: “Chat message created successfully”
}

5. Delete a Chat Message

	•	Endpoint: /api/chat/:id
	•	Method: DELETE
	•	Description: Delete a chat message by ID.
	•	Request Parameters:
	•	id (URL parameter): The ID of the message to delete.
	•	Response:
	•	200 OK: Successful deletion of the message.
	•	404 Not Found: Message with the specified ID does not exist.
	•	500 Internal Server Error: Unexpected server error.

Example Request:
DELETE /api/chat/1 HTTP/1.1
Host: localhost:3000

Example Response:
{
   “message”: “Chat message deleted successfully”
}
