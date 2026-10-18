
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)


def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database="campus_lost_found"
    )


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No registration data received"}), 400

    full_name = data.get("full_name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not full_name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    hashed_password = generate_password_hash(password)
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        sql = """
            INSERT INTO users (full_name, email, password)
            VALUES (%s, %s, %s)
        """

        cursor.execute(sql, (full_name, email, hashed_password))
        connection.commit()

        return jsonify({
            "message": "Registration successful!"
        }), 201

    except mysql.connector.IntegrityError:
        return jsonify({
            "error": "This email is already registered."
        }), 409

    except mysql.connector.Error:
        app.logger.exception("Database error during registration")
        return jsonify({
            "error": "A database error occurred."
        }), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No login data received"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required."
        }), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        sql = """
            SELECT user_id, full_name, email, password, role
            FROM users
            WHERE email = %s
        """

        cursor.execute(sql, (email,))
        user = cursor.fetchone()

        if user and check_password_hash(user[3], password):
            return jsonify({
                "message": "Login successful!",
                "user": {
                    "user_id": user[0],
                    "full_name": user[1],
                    "email": user[2],
                    "role": user[4]
                }
            }), 200

        return jsonify({
            "error": "Invalid email or password."
        }), 401

    except mysql.connector.Error:
        app.logger.exception("Database error during login")
        return jsonify({
            "error": "A database error occurred."
        }), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


@app.route("/api/items", methods=["POST"])
def create_item():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No item data received"}), 400

    item_name = data.get("item_name", "").strip()
    category = data.get("category", "").strip()
    colour = data.get("colour", "").strip()
    description = data.get("description", "").strip()
    location = data.get("location", "").strip()
    date_lost_found = data.get("date_lost_found", "").strip()
    item_type = data.get("item_type", "").strip().lower()

    try:
        user_id = int(data.get("user_id"))
    except (TypeError, ValueError):
        return jsonify({"error": "A valid user ID is required"}), 400

    if user_id <= 0:
        return jsonify({"error": "A valid user ID is required"}), 400

    if not all([
        item_name, category, location,
        date_lost_found, item_type
    ]):
        return jsonify({"error": "Please fill in all required fields"}), 400

    if item_type not in ("lost", "found"):
        return jsonify({
            "error": "Item type must be lost or found"
        }), 400

    try:
        from datetime import date
        date.fromisoformat(date_lost_found)
    except ValueError:
        return jsonify({
            "error": "Date must use YYYY-MM-DD format"
        }), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        sql = """
            INSERT INTO items (
                user_id,
                item_name,
                category,
                colour,
                description,
                location,
                date_lost_found,
                item_type
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            user_id,
            item_name,
            category,
            colour or None,
            description or None,
            location,
            date_lost_found,
            item_type
        )

        cursor.execute(sql, values)
        connection.commit()

        return jsonify({
            "message": "Item reported successfully!",
            "item_id": cursor.lastrowid
        }), 201

    except mysql.connector.IntegrityError:
        if connection and connection.is_connected():
            connection.rollback()

        return jsonify({
            "error": "The user does not exist or the item data violates a database constraint."
        }), 400

    except mysql.connector.Error:
        if connection and connection.is_connected():
            connection.rollback()

        app.logger.exception("Database error while creating item")
        return jsonify({
            "error": "A database error occurred."
        }), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


@app.route('/api/items', methods=['GET'])
def get_items():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT item_id, user_id, item_name, category, colour,
                   description, location, date_lost_found,
                   item_type, status, photo_path, created_at
            FROM items
            ORDER BY created_at DESC
        """)

        items = cursor.fetchall()

        # Convert MySQL date values to JSON-compatible strings.
        for item in items:
            for field in ('date_lost_found', 'created_at'):
                if item[field] is not None:
                    item[field] = item[field].isoformat()

        return jsonify(items), 200

    except mysql.connector.Error:
        app.logger.exception("Database error while retrieving items")
        return jsonify({"error": "Could not retrieve items"}), 500

    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()


@app.route('/api/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT item_id, user_id, item_name, category, colour,
                   description, location, date_lost_found,
                   item_type, status, photo_path, created_at
            FROM items
            WHERE item_id = %s
        """, (item_id,))

        item = cursor.fetchone()

        if item is None:
            return jsonify({"error": "Item not found"}), 404

        for field in ('date_lost_found', 'created_at'):
            if item[field] is not None:
                item[field] = item[field].isoformat()

        return jsonify(item), 200

    except mysql.connector.Error:
        app.logger.exception("Database error while retrieving item")
        return jsonify({"error": "Could not retrieve item"}), 500

    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()


if __name__ == "__main__":
    app.run(debug=True)
