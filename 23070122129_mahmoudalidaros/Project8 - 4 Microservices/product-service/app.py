from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/products', methods=['GET'])
def get_products():
    products = [
        {"id": 1, "name": "Laptop", "price": 999.99, "description": "High-performance laptop"},
        {"id": 2, "name": "Mouse", "price": 29.99, "description": "Wireless computer mouse"},
        {"id": 3, "name": "Keyboard", "price": 79.99, "description": "Mechanical gaming keyboard"}
    ]
    return jsonify(products)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Product Service is running"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)