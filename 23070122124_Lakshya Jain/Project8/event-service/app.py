from flask import Flask, jsonify, abort

app = Flask(__name__)

# In-memory events data store
events = [
    {
        "id": 1,
        "name": "Hackathon 2026",
        "venue": "Main Auditorium",
        "date": "2026-09-15"
    },
    {
        "id": 2,
        "name": "Tech Symposium",
        "venue": "Seminar Hall",
        "date": "2026-09-20"
    }
]

@app.route('/', methods=['GET'])
def health_check():
    # Return service identification and status for health checks
    return jsonify({
        "service": "Event Service",
        "status": "running"
    })

@app.route('/events', methods=['GET'])
def get_events():
    # Return list of all events
    return jsonify(events)

@app.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    # Find event by ID
    event = next((e for e in events if e["id"] == event_id), None)
    if event is None:
        abort(404, description="Event not found")
    return jsonify(event)

if __name__ == '__main__':
    # Run the service on port 31783 as specified
    app.run(host='0.0.0.0', port=31783)
