import { addCourse } from '../db.js';

class CourseEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .screen {
                    padding: 20px;
                    box-sizing: border-box;
                }
                .header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .header a {
                    color: var(--primary-text-color);
                    text-decoration: none;
                    margin-right: 20px;
                }
                .form-section {
                    margin-bottom: 20px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    color: var(--secondary-text-color);
                }
                input,
                textarea,
                select {
                    width: 100%;
                    background-color: var(--input-background);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 10px;
                    color: var(--primary-text-color);
                    box-sizing: border-box;
                }
                .upload-zone {
                    border: 2px dashed var(--border-color);
                    border-radius: 8px;
                    padding: 40px 20px;
                    text-align: center;
                    cursor: pointer;
                }
                .save-button {
                    background-color: var(--accent-color);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 15px;
                    width: 100%;
                    cursor: pointer;
                    font-size: 16px;
                }
            </style>
            <div class="screen">
                <div class="header">
                    <a href="#" class="back-button">&larr;</a>
                    <h2>New Course</h2>
                </div>
                <div class="upload-zone">
                    <p>Drag and drop a PDF here</p>
                    <button id="browse-files">Browse Files</button>
                    <input type="file" id="file-input" accept=".pdf" style="display: none;">
                </div>
                <div class="form-section">
                    <label for="title">Course Title</label>
                    <input type="text" id="title" placeholder="e.g. Introduction to Physics">
                </div>
                <div class="form-section">
                    <label for="description">Description</label>
                    <textarea id="description" rows="3" placeholder="A brief summary of what this course is about."></textarea>
                </div>
                <div class="form-section">
                    <label for="tags">Tags/Categories</label>
                    <input type="text" id="tags" placeholder="Add tags like 'Science', 'Beginner'">
                </div>
                <button class="save-button">Save & Publish</button>
            </div>
        `;
        this.file = null;
    }

    connectedCallback() {
        // Set the workerSrc for pdf.js to match the library version
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js`;

        const backButton = this.shadowRoot.querySelector('.back-button');
        const uploadZone = this.shadowRoot.querySelector('.upload-zone');
        const fileInput = this.shadowRoot.querySelector('#file-input');
        const browseButton = this.shadowRoot.querySelector('#browse-files');
        const saveButton = this.shadowRoot.querySelector('.save-button');

        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('navigate', { bubbles: true, composed: true, detail: { screen: 'manage-courses' } }));
        });

        browseButton.addEventListener('click', () => fileInput.click());

        uploadZone.addEventListener('dragover', (event) => {
            event.preventDefault();
            uploadZone.style.backgroundColor = '#333';
        });

        uploadZone.addEventListener('dragleave', (event) => {
            event.preventDefault();
            uploadZone.style.backgroundColor = 'transparent';
        });

        uploadZone.addEventListener('drop', (event) => {
            event.preventDefault();
            uploadZone.style.backgroundColor = 'transparent';
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (event) => {
            if (event.target.files.length > 0) {
                this.handleFile(event.target.files[0]);
            }
        });

        saveButton.addEventListener('click', () => this.saveCourse());
    }

    handleFile(file) {
        if (file.type === 'application/pdf') {
            this.file = file;
            const uploadZone = this.shadowRoot.querySelector('.upload-zone p');
            uploadZone.textContent = `File selected: ${file.name}`;
            this.shadowRoot.querySelector('#title').value = file.name.replace('.pdf', '');
        } else {
            alert('Only PDF files are allowed.');
        }
    }

    async saveCourse() {
        if (!this.file || !this.db) {
            alert('Please select a PDF file and ensure the database is connected.');
            return;
        }

        const title = this.shadowRoot.querySelector('#title').value;
        const description = this.shadowRoot.querySelector('#description').value;
        const tags = this.shadowRoot.querySelector('#tags').value;

        if (!title || !description) {
            alert('Please fill out the title and description.');
            return;
        }

        // Extract text from PDF
        const textContent = await this.extractTextFromPDF(this.file);

        const newCourse = {
            title,
            description,
            tags: tags.split(',').map(tag => tag.trim()),
            textContent,
            created: new Date()
        };

        await addCourse(this.db, newCourse);

        this.dispatchEvent(new CustomEvent('navigate', { bubbles: true, composed: true, detail: { screen: 'manage-courses' } }));
    }

    async extractTextFromPDF(file) {
        const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file));
        const pdf = await loadingTask.promise;
        let textContent = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map(item => item.str).join(' ');
        }
        return textContent;
    }
}

customElements.define('course-editor', CourseEditor);
