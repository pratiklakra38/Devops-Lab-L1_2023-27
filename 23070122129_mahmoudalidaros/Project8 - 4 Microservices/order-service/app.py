from flask import Flask, jsonify

app = Flask(__name__)

# Sample orders data
SAMPLE_ORDERS = [
    {
        "order_id": 1,
        "product": "Laptop",
        "quantity": 2,
        "customer": "Alice Johnson",
        "status": "completed"
    },
    {
        "order_id": 2,
        "product": "Smartphone",
        "quantity": 1,
        "customer": "Bob Smith",
        "status": "pending"
    },
    {
        "order_id": 3,
        "product": "Headphones",
        "quantity": 3,
        "customer": "Charlie Brown",
        "status": "shipped"
    }
]

@app.route('/orders', methods=['GET'])
def get_orders():
    return jsonify(SAMPLE_ORDERS)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Order Service is running"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)