from flask import Flask, request, jsonify

#Hanterar inte JSON-format. Ligger kvar temporärt för att hantera FrameByFrame
app = Flask(__name__)
@app.route('/camera/data', methods=['POST'])
def receive_camera_data():
    # Access form data
    topic = request.form.get('topic')
    source = request.form.get('source')
    time = request.form.get('time')
    object_type = request.form.get('type')
    score = request.form.get('score')
    
    if not topic:
        print("error No data")
        return jsonify({"error": "No data received"}), 400
    
    # Process the data as needed
    print(f"Received data: Topic={topic}, Source={source}, Time={time}, Type={object_type}, Score={score}")
 
    # Return a response
    return "Data received successfully", 200

#Hanterar alla JSON request från kameran 
@app.route('/camera/data_JSON', methods=['POST'])
def receive_camera_dataM():
    # Access JSON data
    data = request.get_json()

    # Check if the data is None or missing keys
    if not data or 'topic' not in data:
        print("Error: No data received")
        return jsonify({"error": "No data received"}), 400

    # Extract data from the JSON object
    topic = data.get('topic')
    source = data.get('source')
    timestamp = data.get('timestamp')
    object_type = data.get('type')
    score = data.get('score')

    # Process the data as needed
    print(f"Received data: Topic={topic}, Source={source}, Time={timestamp}, Type={object_type}, Score={score}")

    # Return a response
    return jsonify({"message": "Data received successfully"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
