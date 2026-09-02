import os
import requests
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify

app = Flask(__name__)
# Secret key for Flask flash messages
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "campus-secret-key-12345")

# Environment configurations from ConfigMap / Secret
ENVIRONMENT = os.environ.get("ENVIRONMENT", "development")
STUDENT_SERVICE_URL = os.environ.get("STUDENT_SERVICE_URL", "http://localhost:31782").rstrip('/')
EVENT_SERVICE_URL = os.environ.get("EVENT_SERVICE_URL", "http://localhost:31783").rstrip('/')
REGISTRATION_SERVICE_URL = os.environ.get("REGISTRATION_SERVICE_URL", "http://localhost:31784").rstrip('/')

# Demonstration Database Credentials (loaded from Secrets)
DB_USER = os.environ.get("DATABASE_USERNAME", "N/A")
DB_PASS = os.environ.get("DATABASE_PASSWORD", "N/A")

def get_service_status(url):
    """Utility function to check health status of a backend service."""
    try:
        response = requests.get(url, timeout=2)
        if response.status_code == 200:
            data = response.json()
            return "UP", data.get("status", "running")
        return "DOWN", f"HTTP {response.status_code}"
    except Exception as e:
        return "DOWN", str(e)

@app.route("/", methods=["GET"])
def index():
    # Check the health of backend services
    student_status, student_info = get_service_status(STUDENT_SERVICE_URL)
    event_status, event_info = get_service_status(EVENT_SERVICE_URL)
    reg_status, reg_info = get_service_status(REGISTRATION_SERVICE_URL)

    # Initialize data containers
    students_list = []
    events_list = []
    registrations_list = []

    # Fetch Students if service is UP
    if student_status == "UP":
        try:
            r = requests.get(f"{STUDENT_SERVICE_URL}/students", timeout=2)
            if r.status_code == 200:
                students_list = r.json()
        except Exception:
            pass

    # Fetch Events if service is UP
    if event_status == "UP":
        try:
            r = requests.get(f"{EVENT_SERVICE_URL}/events", timeout=2)
            if r.status_code == 200:
                events_list = r.json()
        except Exception:
            pass

    # Fetch Registrations if service is UP
    if reg_status == "UP":
        try:
            r = requests.get(f"{REGISTRATION_SERVICE_URL}/registrations", timeout=2)
            if r.status_code == 200:
                registrations_list = r.json()
        except Exception:
            pass

    # Map IDs to names for displaying registrations nicely
    student_map = {s["id"]: s["name"] for s in students_list}
    event_map = {e["id"]: e["name"] for e in events_list}
    
    formatted_registrations = []
    for reg in registrations_list:
        s_name = student_map.get(reg.get("student_id"), f"Unknown Student (ID: {reg.get('student_id')})")
        e_name = event_map.get(reg.get("event_id"), f"Unknown Event (ID: {reg.get('event_id')})")
        formatted_registrations.append({
            "id": reg.get("id"),
            "student_name": s_name,
            "event_name": e_name
        })

    return render_template(
        "index.html",
        environment=ENVIRONMENT,
        db_user=DB_USER,
        db_pass=DB_PASS,
        student_status=student_status,
        event_status=event_status,
        reg_status=reg_status,
        students=students_list,
        events=events_list,
        registrations=formatted_registrations
    )

@app.route("/register", methods=["POST"])
def register_student():
    student_id = request.form.get("student_id")
    event_id = request.form.get("event_id")

    if not student_id or not event_id:
        flash("Student and Event selections are required!", "danger")
        return redirect(url_for("index"))

    # POST payload to the registration service
    payload = {
        "student_id": int(student_id),
        "event_id": int(event_id)
    }

    try:
        r = requests.post(f"{REGISTRATION_SERVICE_URL}/registrations", json=payload, timeout=2)
        if r.status_code == 201:
            flash("Student successfully registered for the event!", "success")
        else:
            err_msg = r.json().get("description", "Unknown error")
            flash(f"Registration failed: {err_msg}", "danger")
    except Exception as e:
        flash(f"Error connecting to Registration Service: {str(e)}", "danger")

    return redirect(url_for("index"))

# Add simple healthcheck endpoint for frontend
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"})

if __name__ == "__main__":
    # The Frontend Service listens on port 31781
    app.run(host="0.0.0.0", port=31781)
