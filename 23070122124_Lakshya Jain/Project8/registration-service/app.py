from flask import Flask, jsonify, request, abort

app = Flask(__name__)

# In-memory registrations store
registrations = [
    {
        "id": 1,
        "student_id": 1,
        "event_id": 1
    }
]
next_registration_id = 2

@app.route('/', methods=['GET'])
def health_check():
    # Return service identification and status for health checks
    return jsonify({
        "service": "Registration Service",
        "status": "running"
    })

@app.route('/registrations', methods=['GET'])
def get_registrations():
    # Return list of all registrations
    return jsonify(registrations)

@app.route('/registrations', methods=['POST'])
def add_registration():
    global next_registration_id
    
    # Check if request has JSON body
    if not request.is_json:
        abort(400, description="Request body must be JSON")
        
    data = request.get_json()
    student_id = data.get("student_id")
    event_id = data.get("event_id")
    
    # Simple validation
    if student_id is None or event_id is None:
        abort(400, description="student_id and event_id are required fields")
        
    # Create new registration object
    new_reg = {
        "id": next_registration_id,
        "student_id": int(student_id),
        "event_id": int(event_id)
    }
    
    registrations.append(new_reg)
    next_registration_id += 1
    
    return jsonify({
        "message": "Registration successful",
        "registration": new_reg
    }), 201

if __name__ == '__main__':
    # Run the service on port 31784 as specified
    app.run(host='0.0.0.0', port=31784)
