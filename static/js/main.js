// Common JavaScript functionality for the entire site

document.addEventListener('DOMContentLoaded', function() {
    // Newsletter subscription
    setupNewsletterForm();
    
    // Mobile navigation
    setupMobileNavigation();
    
    // Modal functionality
    setupModals();
    
    // Code editor
    setupCodeEditor();
    
    // Exercise functionality
    setupExercises();
    
    // Lesson sidebar
    setupSidebarHighlight();
});

function setupModals() {
    console.log('Setting up modals for content loading and backdrop click...');
    
    // Get modal elements
    const aboutModal = document.getElementById('aboutModal');
    const contactModal = document.getElementById('contactModal');
    
    console.log('About modal found:', !!aboutModal);
    console.log('Contact modal found:', !!contactModal);
    
    // Apply initial display none if not already set by CSS (as a fallback)
    if (aboutModal && getComputedStyle(aboutModal).display !== 'none') {
        aboutModal.style.display = 'none';
        console.log('Forcing aboutModal display: none');
    }
    if (contactModal && getComputedStyle(contactModal).display !== 'none') {
        contactModal.style.display = 'none';
        console.log('Forcing contactModal display: none');
    }
    
    // Load config data and populate modals
    fetch('/static/js/config.json')
        .then(response => {
            console.log('Config fetch response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(config => {
            console.log('Config loaded successfully');
            
            // Setup About modal content
            if (aboutModal) {
                try {
                    const aboutContent = aboutModal.querySelector('#aboutContent');
                    aboutContent.querySelector('.modal-header h2').textContent = config.about.title;
                    aboutContent.querySelector('.description').textContent = config.about.description;
                    
                    const featuresGrid = aboutContent.querySelector('.features-grid');
                    featuresGrid.innerHTML = config.about.features.map(feature => `
                        <div class="feature-item">
                            <h4>${feature.title}</h4>
                            <p>${feature.description}</p>
                        </div>
                    `).join('');
                    
                    aboutContent.querySelector('.mission p').textContent = config.about.mission;
                    console.log('About modal content set up successfully');
                } catch (error) {
                    console.error('Error setting up about modal content:', error);
                }
            }
            
            // Setup Contact modal content
            if (contactModal) {
                try {
                    const contactContent = contactModal.querySelector('#contactContent');
                    contactContent.querySelector('.modal-header h2').textContent = config.contact.title;
                    contactContent.querySelector('.description').textContent = config.contact.description;
                    
                    // Setup contact links
                    const emailLink = contactContent.querySelector('.email-link');
                    emailLink.href = `mailto:${config.contact.info.email}`;
                    emailLink.textContent = config.contact.info.email;
                    
                    const githubLink = contactContent.querySelector('.github-link');
                    githubLink.href = config.contact.info.github;
                    githubLink.textContent = 'GitHub Profile';
                    
                    const linkedinLink = contactContent.querySelector('.linkedin-link');
                    linkedinLink.href = config.contact.info.linkedin;
                    linkedinLink.textContent = 'LinkedIn Profile';
                    
                    // Setup support info
                    contactContent.querySelector('.hours').textContent = config.contact.support.hours;
                    contactContent.querySelector('.response-time').textContent = config.contact.support.response_time;
                    console.log('Contact modal content set up successfully');
                } catch (error) {
                    console.error('Error setting up contact modal content:', error);
                }
            }
        })
        .catch(error => {
            console.error('Error loading config:', error);
        });
    
    // REMOVED: Onclick handlers for trigger links (handled by inline HTML onclick)
    
    // REMOVED: Onclick handlers for close buttons (handled by inline HTML onclick)
    
    // Keep: Close on outside (backdrop) click
    window.onclick = function(e) {
        console.log('Window click detected. Target:', e.target);
        if (e.target.classList.contains('modal')) {
            console.log('Clicked directly on modal backdrop. Closing modal:', e.target.id);
            e.target.style.display = 'none';
        } 
        // Check if the click was on an inline trigger link - if so, do nothing here
        else if (e.target.closest('a[onclick*="Modal"]')) {
             console.log('Click was on an inline trigger link. Allowing inline onclick to handle it.');
        }
        // Check if the click was on an inline close button - if so, do nothing here
        else if (e.target.closest('.close[onclick*="Modal"]')) {
             console.log('Click was on an inline close button. Allowing inline onclick to handle it.');
        }
        else {
             console.log('Click was not on backdrop, trigger, or close button.');
        }
    };
    
    // Keep: Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.onsubmit = function(e) {
            e.preventDefault();
            console.log('Contact form submitted');
            const formData = {
                name: this.querySelector('#name').value,
                email: this.querySelector('#email').value,
                message: this.querySelector('#message').value
            };
            
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
            if (contactModal) contactModal.style.display = 'none';
            return false;
        };
    } else {
        console.warn('Contact form not found');
    }
}

function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.footer-newsletter form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
}

function setupMobileNavigation() {
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    if (header && nav) {
        header.insertBefore(navToggle, nav);
        
        navToggle.addEventListener('click', function() {
            const navUl = nav.querySelector('ul');
            if (navUl) {
                navUl.classList.toggle('show');
            }
        });
        
        document.addEventListener('click', function(e) {
            const navUl = nav.querySelector('ul');
            if (navUl && navUl.classList.contains('show') && !nav.contains(e.target) && e.target !== navToggle) {
                navUl.classList.remove('show');
            }
        });
    }
}

function setupCodeEditor() {
    const codeEditor = document.getElementById('code-editor');
    let editor;
    
    if (codeEditor) {
        editor = CodeMirror.fromTextArea(codeEditor, {
            mode: 'python',
            theme: 'dracula',
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            autoCloseBrackets: true,
            matchBrackets: true,
            styleActiveLine: true
        });
        
        const runCodeBtn = document.getElementById('run-code');
        const resetCodeBtn = document.getElementById('reset-code');
        const outputDiv = document.getElementById('code-output');
        const defaultCode = editor.getValue();
        
        if (runCodeBtn && outputDiv) {
            runCodeBtn.addEventListener('click', function() {
                const code = editor.getValue();
                try {
                    outputDiv.innerHTML = `<span style="color: #50fa7b;">Running code...</span><br>
                    <span style="color: #f8f8f2;">This is a simulation. In a real application, the Python code would be executed on a server.</span><br><br>
                    <span style="color: #8be9fd;">Code submitted:</span><br>
                    <pre style="color: #f8f8f2;">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
                } catch (error) {
                    outputDiv.innerHTML = `<span style="color: #ff5555;">Error:</span> ${error.message}`;
                }
            });
        }
        
        if (resetCodeBtn && defaultCode) {
            resetCodeBtn.addEventListener('click', function() {
                editor.setValue(defaultCode);
                if (outputDiv) {
                    outputDiv.innerHTML = '';
                }
            });
        }
    }
}

function setupExercises() {
    const showHintBtns = document.querySelectorAll('.show-hint-btn');
    
    showHintBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const hintDiv = this.parentElement.querySelector('.hint');
            
            if (hintDiv) {
                hintDiv.style.display = hintDiv.style.display === 'none' || hintDiv.style.display === '' ? 'block' : 'none';
                this.textContent = hintDiv.style.display === 'none' || hintDiv.style.display === '' ? 'Show Hint' : 'Hide Hint';
            }
        });
    });
}

function setupSidebarHighlight() {
    const sidebarLinks = document.querySelectorAll('.lesson-sidebar ul li a');
    const currentPath = window.location.pathname;
    
    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
} 