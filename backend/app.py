"""
app.py - Flask application for a chatbot and map service.

This file contains a Flask application with two endpoints: /api/chat and /api/map.
The /api/chat endpoint handles chat messages and responds with a chatbot-generated response.
The /api/map endpoint handles map requests and returns the corresponding map image filename.

Dependencies:
- flask
- flask_cors
- re

Last edited: Feb 15, 2024
"""


from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import Chatbot_model.chatbotClass as cb_module
from Map.map_dir import find_image_filename


# Initialize chatbot instance
chatbot_instance = cb_module.Chatbot()

app = Flask(__name__)
CORS(app)

def handle_chat(data):
    """
    Handles incoming chat messages and generates a chatbot response.

    Parameters:
    - data (dict): JSON data containing the user's message.

    Returns:
    - jsonify: JSON response containing the chatbot's response.
    """
    
    user_message = data.get('message')
    message = user_message.lower()
    ignore_letters = ['?', '!', ',']
    
    # Remove punctuation marks except dots in a float
    message = re.sub(r'[^0-9a-zA-Z. ]', '', message)

    # Remove specified letters
    for letter in ignore_letters:
        message = message.replace(letter, '')
    
    message = ' '.join(message.split())
    intents = chatbot_instance.predict_class(message)
    probability = float(intents[0]['probability'])
    
    if user_message:
        if probability < 0.99:
            chatbot_response = "Sorry, I cannot answer your question."
        else:
            chatbot_response = chatbot_instance.get_response(intents, cb_module.intents, message)
        return jsonify({'response': chatbot_response})



def handle_map(data):
    """
    Handles incoming map requests and finds the corresponding map image filename.

    Parameters:
    - data (dict): JSON data containing the startLoc and endLoc.

    Returns:
    - jsonify: JSON response containing the map image filename.
    """
    
    start_loc = data.get('startLoc')
    end_loc = data.get('endLoc')
    
    if start_loc and end_loc:
        file_name = find_image_filename(start_loc, end_loc)
        return jsonify({'file_name': file_name})



@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    """
    Endpoint for handling chat messages.

    Returns:
    - jsonify: JSON response containing the chatbot's response.
    """
    
    try:
        data = request.get_json()
        return handle_chat(data)
    except Exception as e:
        print(f"Error in chat_endpoint: {str(e)}")
        import traceback
        traceback.print_exc()  # Print the stack trace
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/api/map', methods=['POST'])
def map_endpoint():
    """
    Endpoint for handling map requests.

    Returns:
    - jsonify: JSON response containing the map image filename.
    """
    
    try:
        data = request.get_json()
        return handle_map(data)
    except Exception as e:
        print(f"Error in map_endpoint: {str(e)}")
        import traceback
        traceback.print_exc()  # Print the stack trace
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
