from flask import Flask, jsonify, abort

app = Flask(__name__)

# In-memory students data store
students = [
    {
        "id": 1,
        "name": "Shivam Kapure",
        "course": "Computer Engineering",
        "year": 3
    },
    {
        "id": 2,
        "name": "Rahul Sharma",
        "course": "Information Technology",
        "year": 3
    }
]

@app.route('/', methods=['GET'])
def health_check():
    # Return service identification and status for health checks
    return jsonify({
        "service": "Student Service",
        "status": "running"
    })

@app.route('/students', methods=['GET'])
def get_students():
    # Return the list of all students
    return jsonify(students)

@app.route('/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    # Find student by ID
    student = next((s for s in students if s["id"] == student_id), None)
    if student is None:
        abort(404, description="Student not found")
    return jsonify(student)

if __name__ == '__main__':
    # Run the service on port 31782 as specified
    app.run(host='0.0.0.0', port=31782)
