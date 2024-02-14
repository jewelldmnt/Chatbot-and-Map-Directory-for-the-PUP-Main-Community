from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS extension

import chatbotClass as cb_module

chatbot_instance = cb_module.Chatbot()

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    try:
        data = request.get_json()
        user_message = data.get('message')
        message = user_message
        intents = chatbot_instance.predict_class(message)
        probability = float(intents[0]['probability'])
        
        if probability < 0.99:
            chatbot_response = "Sorry, we cannot answer your question."
        else:
            chatbot_response = chatbot_instance.get_response(intents, cb_module.intents, message)

        return jsonify({'response': chatbot_response})

    except Exception as e:
        print(f"Error in chat_endpoint: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
