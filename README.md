# LearnBasicPy

LearnBasicPy is an interactive web application for learning the basics of Python programming, including database interactions with MySQL and PostgreSQL.

## Features

*   **Interactive Lessons:** Step-by-step Python tutorials.
*   **Code Editor:** Built-in CodeMirror editor to write and run Python code (simulation currently, backend execution needed).
*   **Exercises:** Practice problems for each lesson.
*   **Database Handling:** Lessons covering MySQL and PostgreSQL integration.
*   **Responsive Design:** Works on different screen sizes.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd LearnBasicPy
    ```
2.  **Create a virtual environment:**
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate # On Windows use `.venv\Scripts\activate`
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Running the Application

```bash
flask run
```

Access the application at `http://127.0.0.1:5000` in your web browser.

## Project Structure

```
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── static/
│   ├── css/            # CSS stylesheets (style.css)
│   ├── js/             # JavaScript files (main.js, lesson.js, config.json)
│   │   └── lessons/    # JSON files for each lesson
│   └── img/            # Image assets (if any)
├── templates/
│   ├── index.html      # Home page template
│   ├── lesson.html     # Lesson page template
│   └── layout.html     # Base layout template (optional)
├── .gitignore          # Files ignored by Git
└── README.md           # This file
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Python Software Foundation
- Flask Web Framework
- CodeMirror for the code editor 