// Lesson page JavaScript with code editor and compiler integration

document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror
    const codeEditor = document.getElementById('code-editor');
    if (codeEditor) {
        const editor = CodeMirror.fromTextArea(codeEditor, {
            mode: 'python',
            theme: 'dracula',
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            autoCloseBrackets: true,
            matchBrackets: true,
            lineWrapping: true
        });

        // Setup run code button
        const runCodeBtn = document.getElementById('run-code');
        const outputArea = document.getElementById('output');
        const clearOutputBtn = document.getElementById('clear-output');

        if (runCodeBtn && outputArea) {
            runCodeBtn.addEventListener('click', function() {
                const code = editor.getValue();
                if (!code.trim()) {
                    outputArea.innerHTML = 'Please enter some code to run.';
                    return;
                }

                outputArea.innerHTML = 'Running code...';
                
                // Send code to server for execution
                fetch('/execute', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code: code })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        outputArea.innerHTML = `<span style="color: #ff5555;">${data.error}</span>`;
                    } else {
                        outputArea.innerHTML = data.output || 'Code executed successfully with no output.';
                    }
                })
                .catch(error => {
                    outputArea.innerHTML = `<span style="color: #ff5555;">Error: ${error.message}</span>`;
                });
            });
        }

        // Clear output
        if (clearOutputBtn && outputArea) {
            clearOutputBtn.addEventListener('click', function() {
                outputArea.innerHTML = '';
            });
        }
    }

    // Load lesson content based on currentLesson
    loadLessonContent();

    // Setup navigation
    setupNavigation();
});

// Load lesson content from JSON data
function loadLessonContent() {
    if (!currentLesson) return;

    // Fetch lesson content from server
    fetch(`/static/js/lessons/${currentLesson}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Lesson content not found');
            }
            return response.json();
        })
        .then(lessonData => {
            // Set lesson title
            const lessonTitle = document.getElementById('lesson-title');
            if (lessonTitle) {
                lessonTitle.textContent = lessonData.title;
            }

            // Set lesson content
            const lessonTheory = document.getElementById('lesson-theory');
            if (lessonTheory) {
                lessonTheory.innerHTML = lessonData.content;
            }

            // Set exercises
            const exercisesContainer = document.getElementById('exercises-container');
            if (exercisesContainer && lessonData.exercises) {
                exercisesContainer.innerHTML = '';
                lessonData.exercises.forEach((exercise, index) => {
                    const exerciseCard = document.createElement('div');
                    exerciseCard.className = 'exercise-card';
                    exerciseCard.innerHTML = `
                        <h3>Exercise ${index + 1}: ${exercise.title}</h3>
                        <div class="description">${exercise.description}</div>
                        <div class="hint" style="display: none;">
                            <strong>Hint:</strong> ${exercise.hint}
                        </div>
                        <button class="btn secondary show-hint">Show Hint</button>
                        <button class="btn primary try-exercise" data-code="${encodeURIComponent(exercise.startingCode)}">Try Exercise</button>
                    `;
                    exercisesContainer.appendChild(exerciseCard);
                });

                // Add event listeners to exercise buttons
                document.querySelectorAll('.show-hint').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const hint = this.parentElement.querySelector('.hint');
                        if (hint.style.display === 'none') {
                            hint.style.display = 'block';
                            this.textContent = 'Hide Hint';
                        } else {
                            hint.style.display = 'none';
                            this.textContent = 'Show Hint';
                        }
                    });
                });

                document.querySelectorAll('.try-exercise').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const startingCode = decodeURIComponent(this.getAttribute('data-code'));
                        const editor = document.querySelector('.CodeMirror').CodeMirror;
                        editor.setValue(startingCode);
                        editor.focus();
                        
                        // Scroll to editor
                        document.querySelector('.practice-section').scrollIntoView({
                            behavior: 'smooth'
                        });
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error loading lesson content:', error);
            document.getElementById('lesson-theory').innerHTML = `
                <div class="error-message">
                    <h2>Oops! Lesson content not found</h2>
                    <p>We couldn't load the lesson content. Please try again or select another lesson.</p>
                </div>
            `;
        });
}

// Setup navigation between lessons
function setupNavigation() {
    const lessons = [
        'variables', 
        'operators', 
        'conditionals', 
        'loops', 
        'functions', 
        'lists', 
        'dictionaries', 
        'recursion',
        'file_handling',
        'database_handling',
        'mysql_database',
        'postgresql_database'
    ];
    
    const currentIndex = lessons.indexOf(currentLesson);
    const prevLesson = document.getElementById('prev-lesson');
    const nextLesson = document.getElementById('next-lesson');
    
    if (currentIndex > 0) {
        prevLesson.href = `/lessons/${lessons[currentIndex - 1]}`;
    } else {
        prevLesson.classList.add('disabled');
        prevLesson.addEventListener('click', e => e.preventDefault());
    }
    
    if (currentIndex < lessons.length - 1) {
        nextLesson.href = `/lessons/${lessons[currentIndex + 1]}`;
    } else {
        nextLesson.classList.add('disabled');
        nextLesson.addEventListener('click', e => e.preventDefault());
    }
} 