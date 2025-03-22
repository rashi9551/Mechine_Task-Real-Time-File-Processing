Log Processing Microservice
This project is a Node.js microservice that processes large log files asynchronously using BullMQ and stores the results in Supabase. The system is containerized using Docker for easy deployment.

Features
File Upload: Accept log file uploads and process them asynchronously.

Queue Setup: Use BullMQ with a Redis-backed queue (log-processing-queue).

Worker: Process jobs asynchronously using streams.

Database: Store processed results in Supabase (job_status and log_stats tables).

Docker Support: Containerized setup for easy deployment.

Setup Instructions
Prerequisites
Docker

Supabase account

Redis

1. Clone the Repository
Clone the repository to your local machine:

bash
Copy
git clone https://github.com/your-username/log-processing-microservice.git
cd log-processing-microservice
2. Set Up Environment Variables
Create a .env file in the root directory and add the following variables:

Frontend Environment Variables
env
Copy
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SITE_URL=
NODE_ENV=
forwardedHost=
storage_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
Backend Environment Variables
env
Copy
# Redis configuration
REDIS_HOST=
REDIS_PORT=

# Supabase configuration
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Worker configuration
WORKER_CONCURRENCY=
ERROR_KEYWORDS=
TEST_RETRY=
3. Set Up Supabase
Create a new project in Supabase.

Create the following tables:

job_status Table
sql
Copy
CREATE TABLE job_status (
  job_id VARCHAR(36) PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  file_name TEXT,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processed_lines INT,
  valid_entries INT,
  error_count INT,
  error_message VARCHAR(255),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
log_stats Table
sql
Copy
CREATE TABLE log_stats (
  job_id VARCHAR(36) PRIMARY KEY REFERENCES job_status(job_id) NOT NULL,
  total_entries INT NOT NULL,
  level_distribution JSONB NOT NULL,
  keyword_frequency JSONB NOT NULL,
  unique_ips INT NOT NULL,
  ip_occurrences JSONB NOT NULL,
  top_ips JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
Enable Supabase Storage for file uploads.

4. Run Docker Compose
The repository includes a docker-compose.yml file. To start the application using Docker Compose, run the following command:

bash
Copy
docker-compose up --build
This will:

Build the Docker images.

Start the Node.js application and Redis containers.

Expose the application on port 3000.

Database Schema
The following tables are used in Supabase:

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
The following environment variables are required:

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
