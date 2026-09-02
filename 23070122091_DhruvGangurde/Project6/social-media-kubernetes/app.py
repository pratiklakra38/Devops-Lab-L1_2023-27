from flask import Flask, jsonify
import math

app = Flask(__name__)


@app.route("/")
def home():
    return jsonify({
        "application": "Social Media Backend",
        "status": "Running on Kubernetes",
        "message": "Welcome to Social Media Infrastructure Demo"
    })


@app.route("/feed")
def feed():
    # CPU-intensive work to demonstrate autoscaling
    result = 0
    for i in range(500000):
        result += math.sqrt(i)

    return jsonify({
        "posts": [
            {"user": "Dhruv", "post": "Learning Kubernetes"},
            {"user": "Alex", "post": "Autoscaling is working"},
            {"user": "Sam", "post": "Cloud infrastructure demo"}
        ]
    })


@app.route("/health")
def health():
    return jsonify({"status": "healthy"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)