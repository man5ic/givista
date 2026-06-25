"""
Givista AI Recommendation Microservice

Endpoints:
- GET  /health        - Health check
- POST /recommend     - Get AI-powered donor-receiver recommendations
- POST /fraud-detect  - Detect suspicious donation patterns
- POST /train         - Retrain the model
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os
from datetime import datetime
import logging

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# File paths (relative to script location)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE = os.path.join(BASE_DIR, 'model.pkl')
VECTORIZER_FILE = os.path.join(BASE_DIR, 'vectorizer.pkl')
DATA_FILE = os.path.join(BASE_DIR, 'donation_data.csv')

model_vectorizer = None
user_data = None


def create_sample_data():
    """Create sample training data if none exists."""
    sample_data = {
        'user_id': [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
        'category': ['Food', 'Clothes', 'Money', 'Blood', 'Food',
                     'Clothes', 'Money', 'Blood', 'Food', 'Clothes'],
        'location': ['New York', 'Los Angeles', 'Chicago', 'Miami', 'New York',
                     'Los Angeles', 'Chicago', 'Miami', 'New York', 'Los Angeles'],
        'urgency': ['Low', 'Medium', 'High', 'Low', 'Medium',
                    'High', 'Low', 'Medium', 'High', 'Low'],
        'donation_history': [5, 3, 10, 2, 7, 4, 8, 1, 6, 9]
    }
    df = pd.DataFrame(sample_data)
    df.to_csv(DATA_FILE, index=False)
    logger.info(f"✅ Created sample data: {DATA_FILE}")


def train_model():
    """Train the recommendation model using TF-IDF + cosine similarity."""
    global model_vectorizer, user_data

    if not os.path.exists(DATA_FILE):
        create_sample_data()

    user_data = pd.read_csv(DATA_FILE)
    user_data['features'] = (
        user_data['category'].astype(str) + ' ' +
        user_data['location'].astype(str) + ' ' +
        user_data['urgency'].astype(str)
    )

    vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
    feature_vectors = vectorizer.fit_transform(user_data['features'])
    similarity_matrix = cosine_similarity(feature_vectors)

    model_vectorizer = {
        'similarity_matrix': similarity_matrix,
        'vectorizer': vectorizer,
        'user_ids': user_data['user_id'].values
    }

    with open(MODEL_FILE, 'wb') as f:
        pickle.dump(model_vectorizer, f)
    with open(VECTORIZER_FILE, 'wb') as f:
        pickle.dump(vectorizer, f)

    logger.info("✅ Model trained and saved")


def initialize_model():
    """Initialize or load the recommendation model."""
    global model_vectorizer, user_data

    try:
        if os.path.exists(MODEL_FILE) and os.path.exists(VECTORIZER_FILE):
            with open(MODEL_FILE, 'rb') as f:
                model_vectorizer = pickle.load(f)
            logger.info("✅ Loaded existing model")
        else:
            logger.info("📊 Training new model...")
            train_model()

        if os.path.exists(DATA_FILE):
            user_data = pd.read_csv(DATA_FILE)
        else:
            create_sample_data()
            user_data = pd.read_csv(DATA_FILE)

    except Exception as e:
        logger.error(f"❌ Error initializing model: {e}")
        create_sample_data()
        train_model()


def get_recommendations(user_id, user_type, category=None, location=None, urgency=None):
    """Get AI recommendations for a user."""
    global model_vectorizer, user_data

    if model_vectorizer is None:
        initialize_model()

    try:
        query_parts = []
        if category:
            query_parts.append(str(category))
        if location:
            query_parts.append(str(location))
        if urgency:
            query_parts.append(str(urgency))
        if not query_parts:
            query_parts = ['Other']

        query_text = ' '.join(query_parts)
        vectorizer = model_vectorizer['vectorizer']
        user_ids = model_vectorizer['user_ids']

        # Rebuild features for fresh transform
        user_data['features'] = (
            user_data['category'].astype(str) + ' ' +
            user_data['location'].astype(str) + ' ' +
            user_data['urgency'].astype(str)
        )

        query_vector = vectorizer.transform([query_text])
        all_vectors = vectorizer.transform(user_data['features'].values)
        similarities = cosine_similarity(query_vector, all_vectors)[0]

        mask = user_ids != user_id
        filtered_similarities = similarities[mask]
        filtered_user_ids = user_ids[mask]

        top_indices = np.argsort(filtered_similarities)[::-1][:5]
        recommendations = []
        for idx in top_indices:
            score = float(filtered_similarities[idx])
            matched_user_id = int(filtered_user_ids[idx])
            match_details = f"Category: {category or 'Any'}, Location: {location or 'Any'}, Score: {score:.2f}"
            recommendations.append({
                'user_id': matched_user_id,
                'score': score,
                'match_details': match_details
            })

        return recommendations

    except Exception as e:
        logger.error(f"❌ Error getting recommendations: {e}")
        return [{'user_id': 1, 'score': 0.5, 'match_details': 'Default recommendation'}]


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'Givista AI Recommendation Service',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid request body'}), 400

        user_id = data.get('user_id')
        user_type = data.get('user_type')
        category = data.get('category')
        location = data.get('location')
        urgency = data.get('urgency')

        if not user_id or not user_type:
            return jsonify({'error': 'user_id and user_type are required'}), 400

        recommendations = get_recommendations(
            user_id=user_id,
            user_type=user_type,
            category=category,
            location=location,
            urgency=urgency
        )

        return jsonify({'recommendations': recommendations}), 200

    except Exception as e:
        logger.error(f"❌ Error in /recommend: {e}")
        return jsonify({'error': 'Failed to get recommendations', 'details': str(e)}), 500


@app.route('/fraud-detect', methods=['POST'])
def fraud_detect():
    """
    Detect fraudulent or suspicious donation patterns.
    
    Request body:
    {
        "user_id": 1,
        "user_type": "donor",
        "donation_count": 10,
        "average_amount": 500,
        "frequency": "daily",
        "location_changes": 2,
        "days_active": 30
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid request body'}), 400

        user_id = data.get('user_id')
        user_type = data.get('user_type')

        if not user_id or not user_type:
            return jsonify({'error': 'user_id and user_type are required'}), 400

        donation_count = data.get('donation_count', 0)
        average_amount = data.get('average_amount', 0)
        frequency = data.get('frequency', 'unknown')
        location_changes = data.get('location_changes', 0)
        days_active = data.get('days_active', 0)

        fraud_score = 0.0
        red_flags = []

        if frequency == 'daily' and donation_count > 5:
            fraud_score += 0.15
            red_flags.append("Unusually high frequency of donations")

        if average_amount > 10000:
            fraud_score += 0.2
            red_flags.append("Very high donation amounts")

        if location_changes > 3 and days_active < 30:
            fraud_score += 0.15
            red_flags.append("Frequent location changes in short timeframe")

        if days_active < 7 and donation_count > 10:
            fraud_score += 0.2
            red_flags.append("New user with unusually high activity")

        if fraud_score >= 0.7:
            risk_level = "high"
            recommendation = "reject"
        elif fraud_score >= 0.4:
            risk_level = "medium"
            recommendation = "review"
        else:
            risk_level = "low"
            recommendation = "approve"

        return jsonify({
            'is_suspicious': fraud_score >= 0.4,
            'fraud_score': round(fraud_score, 2),
            'risk_level': risk_level,
            'red_flags': red_flags,
            'recommendation': recommendation,
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"❌ Error in /fraud-detect: {e}")
        return jsonify({'error': 'Failed to detect fraud', 'details': str(e)}), 500


@app.route('/train', methods=['POST'])
def train():
    try:
        train_model()
        return jsonify({
            'message': 'Model retrained successfully',
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"❌ Error in /train: {e}")
        return jsonify({'error': 'Failed to train model', 'details': str(e)}), 500


if __name__ == '__main__':
    logger.info("🚀 Starting Givista AI Service...")
    initialize_model()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
