import os
from flask import Flask, request, jsonify
import openai
import requests
from io import BytesIO
from flask_cors import CORS
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.url_map.strict_slashes = False
CORS(app)  # Enable CORS for all routes

# Get API keys from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EVERY_ORG_API_KEY = os.getenv("EVERY_ORG_API_KEY")

openai.api_key = OPENAI_API_KEY
# Mock function to simulate GPT-based nonprofit suggestions
def get_nonprofit_suggestions(user_input):
    """
    Use GPT to process user input and return nonprofit suggestions.
    Replace this with your actual GPT logic.
    """
    try:
        # GPT prompt to extract cause category
        system_prompt = (
            "You are a helpful assistant that extracts a clean, concise cause category "
            "from a user's donation interest. Return only the keyword or short phrase "
            "for search. No commentary or explanations."
        )

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"I want to donate. {user_input}"}
            ],
            temperature=0.3
        )

        # Extract cause category
        cause_category = response.choices[0].message.content.strip()

        # Mock nonprofit suggestions based on the cause category
        # Replace this with an actual API call to Every.org or another service
        suggestions = [
            {"id": "1", "name": f"{cause_category} Nonprofit A", "description": f"Support {cause_category} initiatives."},
            {"id": "2", "name": f"{cause_category} Nonprofit B", "description": f"Help {cause_category} causes."},
            {"id": "3", "name": f"{cause_category} Nonprofit C", "description": f"Donate to {cause_category} projects."}
        ]

        return suggestions

    except Exception as e:
        return [{"error": str(e)}]





# ✨ Step 1: GPT to extract clean cause category
def gpt_parse_cause(user_input):
    system_prompt = (
        "You are a helpful assistant that extracts a clean, concise cause category "
        "from a user's donation interest. Return only the keyword or short phrase "
        "for search. No commentary or explanations."
    )

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"I want to donate. {user_input}"}
        ],
        temperature=0.3
    )

    return response['choices'][0]['message']['content'].strip()

# ✨ Step 2: GPT-generated donation blurb
def generate_gpt_blurb(name, description):
    prompt = f"Write a short, friendly, 2-sentence blurb encouraging a user to donate to this nonprofit:\nName: {name}\nDescription: {description}"
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        return description

# ✨ Step 3: Fetch nonprofits and build QR
def get_nonprofit(cause_term):
    url = f"https://partners.every.org/v0.2/search/{cause_term}"
    params = {
        "apiKey": EVERY_ORG_API_KEY,
        "take": 3
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()

        if "nonprofits" not in data or len(data["nonprofits"]) == 0:
         return []

 # Build a list of nonprofits
        nonprofits = []
        for org in data["nonprofits"]:
            print(org)
            name = org.get("name", "Unnamed")
            ein  = org.get("ein", "No EIN")  # Use EIN as the unique ID
            desc = org.get("description", "No description.")
            slug = org.get("slug", "")
            link = f"https://www.every.org/{slug}"
            summary = generate_gpt_blurb(name, desc)

            nonprofits.append({
                "name": name,
                "description": summary,
                "link": link,
                "id": slug
            })

        return nonprofits
    except Exception as e:
        return f"Error fetching nonprofits: {str(e)}", None

# Define API route
@app.route('/api/gpt-nonprofits', methods=['POST'], strict_slashes=False)
def suggest_nonprofits():
    """
    API endpoint to get nonprofit suggestions based on user input.
    """
    try:
        # Get user input from the request
        data = request.json
        user_input = data.get('query', '')

        # Validate input
        if not user_input:
            return jsonify({"error": "Query is required"}), 400

        cause_term = gpt_parse_cause(user_input)
        recommendations = get_nonprofit(cause_term)
        # Get nonprofit suggestions
        # suggestions = get_nonprofit_suggestions(user_input)

        # Return suggestions as JSON
        return jsonify(recommendations)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(port=5001, debug=True)