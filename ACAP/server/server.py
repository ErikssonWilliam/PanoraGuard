from flask import Flask, request
 
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
 
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
