from flask import Flask, request, jsonify
from flask_cors import CORS
import Chatbot_model.chatbotClass as cb_module
from Map.map_dir import find_image_filename

chatbot_instance = cb_module.Chatbot()

app = Flask(__name__)
CORS(app)

def handle_chat(data):
    user_message = data.get('message')
    message = user_message
    intents = chatbot_instance.predict_class(message)
    probability = float(intents[0]['probability'])
    
    if user_message:
        if probability < 0.99:
            chatbot_response = "Sorry, we cannot answer your question."
        else:
            chatbot_response = chatbot_instance.get_response(intents, cb_module.intents, message)
        return jsonify({'response': chatbot_response})

def handle_map(data):
    start_loc = data.get('startLoc')
    end_loc = data.get('endLoc')
    
    if start_loc and end_loc:
        file_name = find_image_filename(start_loc, end_loc)
        return jsonify({'file_name': file_name})

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
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
