from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "ML Recommendation Service is running..."

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    # Logic for recommendation goes here
    return jsonify({"recommendations": ["Movie 1", "Movie 2", "Movie 3"]})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
