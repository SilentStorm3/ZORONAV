from flask import Flask, request, jsonify
import pymongo

app = Flask(__name__)

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://amourphouskitten:funnypassword@navigationapp.zdicc.mongodb.net/?retryWrites=true&w=majority&appName=NavigationApp")
db = client["Rooms"]

collections = {
    "students": db["Students"],
    "professors": db["Profs"],
    "laboratories": db["Labs"]
}

# Function to fetch a response from the appropriate collection based on user input and category
def fetch_response(user_input, category):
    collection = collections[category]
    result = collection.find_one({"Name": user_input})
    return result


# Function to find the closest matches if exact match is not found
def find_closest_matches(user_input, category):
    collection = collections[category]
    matches = collection.find({"$text": {"$search": user_input}}).limit(5)
    return [match['Name'] for match in matches]


@app.route('/process', methods=['POST'])
def process_input():
    data = request.get_json()
    user_input = data['input']
    category = data['category']
    if user_input:
        # Fetch response from the appropriate collection
        result = fetch_response(user_input, category)

        if result:
            response = {
                'Name' : result['Name'],
                'output': result['RoomNo'],
                'lat': result['Lat'],
                'long': result['Long'],
                'suggestions': ''
            }
        else:
            closest_matches = find_closest_matches(user_input, category)
            response = {
                'Name' : '',
                'output': 'Did you mean one of these?',
                'suggestions': closest_matches
            }
    else:
        #getting all responses
        collection = collections[category]
        results = collection.find()
        response = {
            'Name' : [result['Name'] for result in results],
            'output': '',
            'lat': '',
            'long': '',
        }
    # Return the response as JSON

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)