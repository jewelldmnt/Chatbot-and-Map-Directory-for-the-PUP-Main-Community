import Chatbot_model.chatbotClass as cb_module
import re

chatbot_instance = cb_module.Chatbot()

while True:
    message = input("\nEnter your message: ").lower()

    if not message:
        print("Please enter a message.")
        continue
    
    ignore_letters = ['?', '!', ',']

    # Remove punctuation marks except dots in a float
    message = re.sub(r'[^0-9a-zA-Z. ]', '', message)

    # Remove specified letters
    for letter in ignore_letters:
        message = message.replace(letter, '')

    message = ' '.join(message.split())

    intents = chatbot_instance.predict_class(message)
    probability = float(intents[0]['probability'])
    
    if probability < 0.99:
        response = "Sorry, I cannot answer your question."
    else:
        response = chatbot_instance.get_response(intents, cb_module.intents, message)
    
    print("Response:")
    print(response)
