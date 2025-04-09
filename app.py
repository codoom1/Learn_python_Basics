from flask import Flask, render_template, request, jsonify
import subprocess
import tempfile
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/lessons/<lesson_name>')
def lesson(lesson_name):
    return render_template('lesson.html', lesson_name=lesson_name)

@app.route('/execute', methods=['POST'])
def execute_code():
    code = request.json.get('code', '')
    
    # Create a temporary file to execute the Python code
    with tempfile.NamedTemporaryFile(suffix='.py', delete=False) as temp:
        temp_name = temp.name
        temp.write(code.encode('utf-8'))
    
    try:
        # Execute the Python code
        result = subprocess.run(['python3', temp_name], 
                               capture_output=True, 
                               text=True, 
                               timeout=5)
        
        output = result.stdout
        error = result.stderr
        
        return jsonify({
            'output': output,
            'error': error,
            'success': error == ''
        })
    except subprocess.TimeoutExpired:
        return jsonify({
            'output': '',
            'error': 'Execution timed out (limit: 5 seconds)',
            'success': False
        })
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_name):
            os.remove(temp_name)

if __name__ == '__main__':
    app.run(debug=True) 