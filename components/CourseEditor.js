class CourseEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
                
                :root {
                    --coursera-blue: #0056d2;
                    --coursera-blue-dark: #00419e;
                }
                
                /* Global full-width enforcement */
                * {
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                }
                
                .screen {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    background-color: #f5f5f5;
                    color: #2d2d2d;
                    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
                    overflow-x: hidden;
                }
                
                .header {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #e5e7eb;
                    background-color: #ffffff;
                    padding: 1rem;
                    box-sizing: border-box;
                }
                
                .back-button {
                    color: #374151;
                    text-decoration: none;
                    font-size: 1.5rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    transition: background-color 0.2s ease;
                }
                
                .back-button:hover {
                    background-color: #f3f4f6;
                }
                
                .header h1 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #374151;
                    margin: 0;
                }
                
                .header-spacer {
                    width: 2.5rem;
                }
                
                .main-content {
                    flex: 1;
                    width: 100%;
                    padding: 1rem;
                    overflow-y: auto;
                    box-sizing: border-box;
                }
                
                @media (min-width: 768px) {
                    .main-content {
                        padding: 1.5rem;
                    }
                }
                
                .content-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                
                .section {
                    background-color: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    padding: 1.5rem;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                
                .section h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #111827;
                    margin: 0 0 1rem 0;
                    letter-spacing: -0.025em;
                }
                
                .upload-area {
                    border: 2px dashed #d1d5db;
                    border-radius: 0.5rem;
                    padding: 3rem 1.5rem;
                    text-align: center;
                    background-color: #f9fafb;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                
                .upload-area:hover {
                    border-color: var(--coursera-blue);
                    background-color: #f0f4ff;
                }
                
                .upload-area.dragover {
                    border-color: var(--coursera-blue);
                    background-color: #f0f4ff;
                }
                
                .upload-icon {
                    font-size: 3rem;
                    color: #9ca3af;
                    margin-bottom: 1rem;
                }
                
                .upload-text {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.5rem;
                }
                
                .upload-subtext {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin-bottom: 1rem;
                }
                
                .file-input {
                    display: none;
                }
                
                .choose-file-btn {
                    background-color: #ffffff;
                    color: var(--coursera-blue);
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .choose-file-btn:hover {
                    background-color: #f9fafb;
                    border-color: var(--coursera-blue);
                }
                
                .form-group {
                    margin-bottom: 1.5rem;
                }
                
                .form-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #374151;
                }
                
                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    font-size: 1rem;
                    color: #111827;
                    background-color: #ffffff;
                    box-sizing: border-box;
                    transition: all 0.2s ease;
                }
                
                .form-input:focus {
                    outline: none;
                    border-color: var(--coursera-blue);
                    box-shadow: 0 0 0 1px var(--coursera-blue);
                }
                
                .form-input::placeholder {
                    color: #9ca3af;
                }
                
                .form-textarea {
                    min-height: 6rem;
                    resize: vertical;
                }
                
                .form-select {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    font-size: 1rem;
                    color: #111827;
                    background-color: #ffffff;
                    box-sizing: border-box;
                    cursor: pointer;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
                    background-position: right 0.5rem center;
                    background-repeat: no-repeat;
                    background-size: 1.5em 1.5em;
                    padding-right: 2.5rem;
                }
                
                .form-select:focus {
                    outline: none;
                    border-color: var(--coursera-blue);
                    box-shadow: 0 0 0 1px var(--coursera-blue);
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                @media (min-width: 640px) {
                    .form-row {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                
                .toggle-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                }
                
                .toggle-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #374151;
                }
                
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 3rem;
                    height: 1.5rem;
                }
                
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                
                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #d1d5db;
                    transition: 0.3s;
                    border-radius: 1.5rem;
                }
                
                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 1.25rem;
                    width: 1.25rem;
                    left: 0.125rem;
                    bottom: 0.125rem;
                    background-color: white;
                    transition: 0.3s;
                    border-radius: 50%;
                }
                
                .toggle-switch input:checked + .toggle-slider {
                    background-color: var(--coursera-blue);
                }
                
                .toggle-switch input:checked + .toggle-slider:before {
                    transform: translateX(1.5rem);
                }
                
                .footer {
                    position: sticky;
                    bottom: 0;
                    width: 100%;
                    border-top: 1px solid #e5e7eb;
                    background-color: #ffffff;
                    padding: 1rem;
                    box-sizing: border-box;
                }
                
                .save-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--coursera-blue);
                    color: #ffffff;
                    border: none;
                    border-radius: 0.375rem;
                    padding: 0.75rem 1.25rem;
                    font-size: 1rem;
                    font-weight: 600;
                    letter-spacing: 0.025em;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    gap: 0.5rem;
                }
                
                .save-btn:hover {
                    background-color: var(--coursera-blue-dark);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 86, 210, 0.3);
                }
                
                .save-btn:disabled {
                    background-color: #9ca3af;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                
                .save-btn .loading {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .status-message {
                    margin-top: 0.5rem;
                    text-align: center;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                
                .status-success {
                    color: #059669;
                }
                
                .status-error {
                    color: #dc2626;
                }
                
                .status-info {
                    color: #2563eb;
                }
            </style>
            <div class="screen">
                <div class="header">
                    <a href="#" class="back-button">
                        <span class="material-symbols-outlined">arrow_back_ios_new</span>
                    </a>
                    <h1>Edit Course</h1>
                    <div class="header-spacer"></div>
                </div>
                <div class="main-content">
                    <div class="content-wrapper">
                        <section>
                            <h2>Course Content</h2>
                            <div class="upload-area" id="upload-area">
                                <span class="material-symbols-outlined upload-icon">upload_file</span>
                                <p class="upload-text">Upload PDF</p>
                                <p class="upload-subtext">Drag & drop or click to select a file</p>
                                <input type="file" class="file-input" id="file-input" accept=".pdf">
                                <button class="choose-file-btn" id="choose-file-btn">Choose File</button>
                            </div>
                        </section>
                        
                        <section>
                            <h2>Course Details</h2>
                            <div class="form-group">
                                <label class="form-label" for="course-title">Course Title</label>
                                <input type="text" class="form-input" id="course-title" placeholder="e.g. Introduction to Astrophysics">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="course-description">Description</label>
                                <textarea class="form-input form-textarea" id="course-description" placeholder="Provide a brief summary of the course." rows="4"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="course-tags">Tags / Categories</label>
                                <input type="text" class="form-input" id="course-tags" placeholder="e.g., Science, Physics, Beginner">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="ai-model">AI Model</label>
                                    <select class="form-select" id="ai-model">
                                        <option>GPT-4o (Recommended)</option>
                                        <option>DeepSeek</option>
                                        <option>Llama 3</option>
                                        <option>Claude 3 Sonnet</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <div class="toggle-container">
                                        <span class="toggle-label">Visibility</span>
                                        <div class="toggle-switch">
                                            <input type="checkbox" id="visibility-toggle">
                                            <span class="toggle-slider"></span>
                                        </div>
                                    </div>
                                    <span class="text-sm text-gray-600" id="visibility-label">Draft</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div class="footer">
                    <button class="save-btn" id="save-btn">
                        <span class="material-symbols-outlined">publish</span>
                        Save & Publish
                    </button>
                    <div class="status-message" id="status-message"></div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        const backButton = this.shadowRoot.querySelector('.back-button');
        const uploadArea = this.shadowRoot.querySelector('#upload-area');
        const fileInput = this.shadowRoot.querySelector('#file-input');
        const chooseFileBtn = this.shadowRoot.querySelector('#choose-file-btn');
        const saveBtn = this.shadowRoot.querySelector('#save-btn');
        const visibilityToggle = this.shadowRoot.querySelector('#visibility-toggle');
        const visibilityLabel = this.shadowRoot.querySelector('#visibility-label');

        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('navigate', { 
                bubbles: true, 
                composed: true, 
                detail: { screen: 'manage-courses' } 
            }));
        });

        chooseFileBtn.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });

        visibilityToggle.addEventListener('change', (e) => {
            visibilityLabel.textContent = e.target.checked ? 'Published' : 'Draft';
        });

        saveBtn.addEventListener('click', () => {
            this.saveCourse();
        });
    }

    handleFileSelect(file) {
        if (file.type === 'application/pdf') {
            const uploadArea = this.shadowRoot.querySelector('#upload-area');
            uploadArea.innerHTML = `
                <div class="upload-icon">✅</div>
                <div class="upload-text">${file.name}</div>
                <div class="upload-subtext">PDF uploaded successfully</div>
            `;
            uploadArea.style.borderColor = '#10B981';
            uploadArea.style.backgroundColor = '#ECFDF5';
        } else {
            alert('Please select a PDF file.');
        }
    }

    async saveCourse() {
        const saveBtn = this.shadowRoot.querySelector('#save-btn');
        const statusMessage = this.shadowRoot.querySelector('#status-message');
        
        // Get form data
        const title = this.shadowRoot.querySelector('#course-title').value.trim();
        const description = this.shadowRoot.querySelector('#course-description').value.trim();
        const tags = this.shadowRoot.querySelector('#course-tags').value.trim();
        const visibility = this.shadowRoot.querySelector('#visibility-toggle').checked ? 'published' : 'draft';
        const aiModel = this.shadowRoot.querySelector('#ai-model').value;
        const fileInput = this.shadowRoot.querySelector('#file-input');
        const file = fileInput.files[0];

        // Validation
        if (!title) {
            this.showStatus('Please enter a course title.', 'error');
            return;
        }

        if (!file) {
            this.showStatus('Please upload a PDF file.', 'error');
            return;
        }

        // Show loading state
        this.setButtonLoading(true);
        this.showStatus('Saving course...', 'info');

        try {
            // Prepare course data
            const courseData = {
                title,
                description,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                visibility,
                aiModel,
                file: file,
                courseId: this.courseId || null
            };

            // Save course via API
            const result = await this.saveCourseToAPI(courseData);
            
            if (result.success) {
                this.showStatus('Course saved and published successfully!', 'success');
                
                // Navigate back after success
                setTimeout(() => {
                    this.dispatchEvent(new CustomEvent('navigate', { 
                        bubbles: true, 
                        composed: true, 
                        detail: { screen: 'manage-courses' } 
                    }));
                }, 2000);
            } else {
                throw new Error(result.message || 'Failed to save course');
            }
        } catch (error) {
            console.error('Save course error:', error);
            this.showStatus(`Failed to save course: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(false);
        }
    }

    async saveCourseToAPI(courseData) {
        const formData = new FormData();
        formData.append('title', courseData.title);
        formData.append('description', courseData.description);
        formData.append('tags', JSON.stringify(courseData.tags));
        formData.append('visibility', courseData.visibility);
        formData.append('aiModel', courseData.aiModel);
        formData.append('pdf', courseData.file);
        
        if (courseData.courseId) {
            formData.append('courseId', courseData.courseId);
        }

        const response = await fetch('/api/admin/courses', {
            method: courseData.courseId ? 'PUT' : 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    setButtonLoading(loading) {
        const saveBtn = this.shadowRoot.querySelector('#save-btn');
        const icon = saveBtn.querySelector('.material-symbols-outlined');
        
        if (loading) {
            saveBtn.disabled = true;
            icon.textContent = 'refresh';
            icon.classList.add('loading');
            saveBtn.innerHTML = `
                <span class="material-symbols-outlined loading">refresh</span>
                Publishing...
            `;
        } else {
            saveBtn.disabled = false;
            icon.textContent = 'publish';
            icon.classList.remove('loading');
            saveBtn.innerHTML = `
                <span class="material-symbols-outlined">publish</span>
                Save & Publish
            `;
        }
    }

    showStatus(message, type) {
        const statusMessage = this.shadowRoot.querySelector('#status-message');
        statusMessage.textContent = message;
        statusMessage.className = `status-message status-${type}`;
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.textContent = '';
                statusMessage.className = 'status-message';
            }, 5000);
        }
    }
}

customElements.define('course-editor', CourseEditor);