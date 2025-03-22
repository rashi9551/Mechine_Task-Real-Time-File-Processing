Log Processing Microservice
Description
This project is a Node.js microservice that processes large log files asynchronously using BullMQ and stores the results in Supabase. It features a hierarchical structure for managing log processing jobs and provides real-time updates via WebSocket.

Steps to Run This Project
Install dependencies:

bash
Copy
npm install
Set up environment variables:

Create a .env file in the root directory.

Add the required environment variables (see Environment Variables below).

Start the server:

bash
Copy
npm start
Run Docker Compose (if using Docker):

bash
Copy
docker-compose up --build
Execute database migrations (if applicable):

bash
Copy
npm run migrations
API Documentation
You can find the API documentation at: API Documentation

Database Design
job_status Table
Stores the status and metadata of each job.

Column	Type	Description
job_id	VARCHAR(36)	Unique job ID.
user_id	UUID	User ID (references auth.users).
file_name	TEXT	Name of the uploaded file.
status	TEXT	Job status (pending, processing, completed, failed).
processed_lines	INT	Number of lines processed.
valid_entries	INT	Number of valid log entries.
error_count	INT	Number of errors encountered.
error_message	VARCHAR(255)	Error message (if any).
started_at	TIMESTAMPTZ	Timestamp when the job started.
completed_at	TIMESTAMPTZ	Timestamp when the job completed.
failed_at	TIMESTAMPTZ	Timestamp when the job failed.
created_at	TIMESTAMPTZ	Timestamp when the job was created.
log_stats Table
Stores the processed log data.

Column	Type	Description
job_id	VARCHAR(36)	Job ID (references job_status).
total_entries	INT	Total number of log entries.
level_distribution	JSONB	Distribution of log levels.
keyword_frequency	JSONB	Frequency of keywords.
unique_ips	INT	Number of unique IPs.
ip_occurrences	JSONB	Occurrences of each IP.
top_ips	JSONB	Top IPs by occurrence.
created_at	TIMESTAMPTZ	Timestamp when the stats were created.
Environment Variables
Frontend
Variable	Description
NEXT_PUBLIC_SUPABASE_URL	Supabase project URL.
NEXT_PUBLIC_SUPABASE_ANON_KEY	Supabase anonymous key.
SITE_URL	Frontend URL (default: http://localhost:3000).
NODE_ENV	Node environment (default: development).
forwardedHost	Forwarded host (optional).
storage_URL	Supabase storage URL.
UPSTASH_REDIS_REST_URL	Upstash Redis REST URL.
UPSTASH_REDIS_REST_TOKEN	Upstash Redis REST token.
Backend
Variable	Description
REDIS_HOST	Redis host (default: localhost).
REDIS_PORT	Redis port (default: 6379).
SUPABASE_URL	Supabase project URL.
SUPABASE_ANON_KEY	Supabase anonymous key.
WORKER_CONCURRENCY	Number of concurrent jobs (default: 4).
ERROR_KEYWORDS	Comma-separated list of error keywords.
TEST_RETRY	Enable test retry mode (default: false).
