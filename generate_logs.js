const fs = require('fs');
const path = require('path');

// Function to generate a random log entry
function generateLogEntry() {
    const logLevels = ["ERROR", "INFO", "CRITICAL", "WARN", "DEBUG"];
    const messages = {
        "ERROR": ["Database connection error", "Database timeout", "Authentication failed"],
        "INFO": ["User login successful", "Transaction rollback", "Database query completed"],
        "CRITICAL": ["Service unavailable", "Resource locked"],
        "WARN": ["Memory usage high", "API rate limit exceeded", "Invalid request parameters"],
        "DEBUG": ["Request timeout", "Authentication failed"]
    };

    // Randomly select a log level and corresponding message
    const logLevel = logLevels[Math.floor(Math.random() * logLevels.length)];
    const message = messages[logLevel][Math.floor(Math.random() * messages[logLevel].length)];

    // Generate random metadata
    const metadata = {
        userId: Math.floor(Math.random() * 9000) + 1000,
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        requestId: `req-${Math.random().toString(36).substring(2, 6)}${Math.random().toString(36).substring(2, 6)}`,
        duration: logLevel === "ERROR" || logLevel === "INFO" || logLevel === "CRITICAL" ? Math.floor(Math.random() * 9000) + 1000 : undefined,
        status: logLevel === "ERROR" || logLevel === "CRITICAL" || logLevel === "WARN" ? [200, 404, 500, 503, 429, 423][Math.floor(Math.random() * 6)] : undefined
    };

    // Remove undefined fields from metadata
    Object.keys(metadata).forEach(key => metadata[key] === undefined && delete metadata[key]);

    // Generate a random timestamp within the last 30 days
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();
    const timestampStr = `[${timestamp.replace('T', ' ').replace('Z', '')}]`;

    // Format the log entry
    const logEntry = `${timestampStr} ${logLevel} ${message} ${JSON.stringify(metadata)}\n`;
    return logEntry;
}

// Function to generate a 10MB log file
function generateLogFile(filePath, targetSizeMB) {
    const targetSizeBytes = targetSizeMB * 1024 * 1024; // Convert MB to bytes
    const stream = fs.createWriteStream(filePath, { flags: 'a' });

    function write() {
        let ok = true;
        while (ok && stream.bytesWritten < targetSizeBytes) {
            const logEntry = generateLogEntry();
            ok = stream.write(logEntry);
        }
        if (stream.bytesWritten < targetSizeBytes) {
            stream.once('drain', write);
        } else {
            stream.end();
            console.log(`10MB log file generated successfully at ${filePath}`);
        }
    }

    write();
}

// Generate the log file
const filePath = path.join(__dirname, '10mb_log_file.log');
generateLogFile(filePath, 10);