"""
This script is designed for training a neural network using intents from a JSON file.
The neural network is built using Keras and utilizes tokenization, lemmatization, and bag-of-words
techniques for natural language processing. The trained model is then saved for later use.

Dependencies:
- nltk (Natural Language Toolkit)
- keras
- numpy
- json
- pickle
- random

Usage:
1. Ensure 'intents.json' is present and contains the necessary data for training.
2. Execute the script to train the neural network.
3. The trained model is saved as 'Seri_model.h5', and word and class information is stored in 'words.pkl' and 'classes.pkl'.

Note: Adjustments to hyperparameters or file paths may be required based on your specific use case.
"""


from random import shuffle
from json import loads
from pickle import dump
from numpy import array
from nltk import word_tokenize
from nltk.stem import WordNetLemmatizer
from keras.models import Sequential
from keras.layers import Dense, Dropout
from keras.optimizers.legacy import SGD

# Instantiate the lemmatizer
lemmatizer = WordNetLemmatizer()

# storing the json file as a dictionary
intents = loads(open('chatbot_model/intents.json').read())

# Define lists to hold words, classes, and documents
words = []
classes = []
documents = []
ignore_letters = ['?', '!', '.', ',']

# Iterate over the intents and their patterns to build the word list and documents list
for intent in intents['intents']:
    for pattern in intent['patterns']:
        word_list = word_tokenize(pattern)
        words.extend(word_list)
        documents.append((word_list, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

# Lemmatize the words and remove duplicates
words = sorted(list(set(lemmatizer.lemmatize(word.lower()) for word in words if word not in ignore_letters)))

# Sort the classes
classes = sorted(list(set(classes)))

# Save the words and classes as binary files
dump(words, open('chatbot_model/words.pkl', 'wb'))
dump(classes, open('chatbot_model/classes.pkl', 'wb'))

# Convert the documents to training data
training = []
output_empty = [0] * len(words)

for document in documents:
    word_patterns = document[0]
    word_patterns = [lemmatizer.lemmatize(word.lower()) for word in word_patterns]
    bag = [1 if word in word_patterns else 0 for word in words]

    output_row = list(output_empty)
    output_row[classes.index(document[1])] = 1
    training.append([bag, output_row])

# Shuffle and convert the training data to arrays
shuffle(training)
training = array(training)
train_x = list(training[:, 0])
train_y = list(training[:, 1])

# Define the neural network model
model = Sequential()
model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(train_y[0]), activation='softmax'))

# Compile the model
sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

# Train the model
hist = model.fit(array(train_x), array(train_y), epochs=200, batch_size=5, verbose=1)

# Save the model
model.save('chatbot_model/pbot.h5', hist)
print("Done")
for index, word in enumerate(words):
    print(f"Index {index}: {word}")