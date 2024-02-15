"""
Chatbot Module

This module defines a simple chatbot class that uses natural language processing
and a pre-trained model to understand and respond to user input.

Dependencies:
- random.choice
- json.loads
- pickle.load
- numpy.array
- time.strftime
- nltk.word_tokenize
- nltk.stem.WordNetLemmatizer
- keras.models.load_model

Files Required:
- intents.json: JSON file containing intents for the chatbot
- words.pkl: Pickle file containing words used for training the model
- classes.pkl: Pickle file containing classes used for training the model
- pbot.h5: Keras model file for the chatbot

Usage:
1. Instantiate the Chatbot class.
2. Use the predict_class method to predict the intent of a given sentence.
3. Use the get_response method to get a response based on the predicted intent.

Last edited: Feb 15, 2024
"""



from random import choice
from json import loads
from pickle import load
from numpy import array
from time import strftime
from nltk import word_tokenize
from nltk.stem import WordNetLemmatizer
from keras.models import load_model
from Chatbot_model.Responses import Response


# lemmatizer instantiation
lemmatizer = WordNetLemmatizer()

# storing the json file as a dictionary
intents = loads(open('backend\Chatbot_model\intents.json').read())

# storing the data into its variable
words = load(open('backend\Chatbot_model\words.pkl', 'rb'))
classes = load(open('backend\Chatbot_model\classes.pkl', 'rb'))
model = load_model('backend\Chatbot_model\pbot.h5')


# lemmatizing the sentence
class Chatbot():
    def __init__(self):
        pass

    def clean_up_sentence(self, sentence):
        """
        Tokenize and lemmatize the input sentence.

        Args:
        - sentence (str): Input sentence.

        Returns:
        - sentence_words (list): List of words in the sentence after lemmatization.
        """
        sentence_words = word_tokenize(sentence)
        sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
        
        return sentence_words


    def bag_of_words(self, sentence):
        """
        Convert a sentence into a bag of words using 0's and 1's representation.

        Args:
        - sentence (str): Input sentence.

        Returns:
        - numpy.array: Array representing the bag of words.
        """
        sentence_words = self.clean_up_sentence(sentence)
        bag = [0] * len(words)
        for w in sentence_words:
            for i, word in enumerate(words):
                if word == w:
                    bag[i] = 1
        return array(bag)


    def predict_class(self, sentence):
        """
        Predict the intent of the given sentence.

        Args:
        - sentence (str): Input sentence.

        Returns:
        - return_list(list): List of dictionaries containing intent and probability.
        """
        bow = self.bag_of_words(sentence)
        res = model.predict(array([bow]))[0]
        ERROR_THRESHOLD = 0.25
        # storing [index, class]
        results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]

        # sorting the probability in reverse order: highest probability first
        results.sort(key=lambda x: x[1], reverse=True)
        self.return_list = []
        for r in results:
            self.return_list.append({'intent': classes[r[0]], 'probability': str(r[1])})
        return self.return_list

    
    def get_response(self, intent_list, intent_json, user_query):
        """
        Get a response based on the predicted intent.

        Args:
        - intent_list (list): List of dictionaries containing intent and probability.
        - intent_json (dict): Dictionary containing intents and responses.

        Returns:
        - result (str): Response generated based on the predicted intent.
        """
        response = Response()
        self.result = ''
        tag = intent_list[0]['intent']
        list_of_intents = intent_json['intents']

        for i in list_of_intents:
            if tag == 'date':
                self.result = response.get_date_response()
                break

            elif tag == 'time':
                self.result = response.get_time_response()
                break
            
            elif tag == 'sge':
                self.result = response.get_specific_grade_equivalency_response(user_query)
                break
            
            elif tag == 'ge':
                self.result = "1.0: 97-100 Excellent\n1.25: 94-96 Excellent\n1.5: 91-93 Very Good\n1.75: 88-90 Very Good\n2.0: 85-87 Good\n2.25: 82-84 Good\n2.5: 79-81 Satisfactory\n2.75: 76-78 Satisfactory\n3.0: 75 Passing\n5.0: 65-74 Failure\nInc.: Incomplete\nW: Withdrawn"
                
            elif tag == 'dean':
                self.result = response.get_dean_response(user_query)
            
            elif i['tag'] == tag:
                self.result = choice(i['responses'])
                break
        return self.result
