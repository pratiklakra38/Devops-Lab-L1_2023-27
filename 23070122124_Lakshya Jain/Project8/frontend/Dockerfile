# Use a lightweight python image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements.txt first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port 31781 as required for the Frontend Service
EXPOSE 31781

# Start the Flask app
CMD ["python", "app.py"]
