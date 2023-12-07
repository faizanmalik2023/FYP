from flask import Flask, jsonify,  request, send_file
from werkzeug.utils import secure_filename
import os
from inference import process_image  # Make sure to import the function
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Allow files up to 16 MB

@app.route('/predict', methods=['POST'])
def predict():
   
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    

    # Process the image and get the result path
    result_path = process_image(filepath)
    
    # # Send the result image back to the client
    return send_file(result_path, mimetype='image/png')
    #return jsonify({'message': 'Reached the server'}), 200

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)
