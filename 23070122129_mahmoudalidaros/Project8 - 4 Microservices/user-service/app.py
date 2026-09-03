from flask import Flask, jsonify

app = Flask(__name__)

# Sample users data
SAMPLE_USERS = [
    {
        "user_id": 1,
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "role": "admin"
    },
    {
        "user_id": 2,
        "name": "Bob Smith",
        "email": "bob@example.com",
        "role": "user"
    },
    {
        "user_id": 3,
        "name": "Charlie Brown",
        "email": "charlie@example.com",
        "role": "user"
    }
]

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(SAMPLE_USERS)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "User Service is running"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)