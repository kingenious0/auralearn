# AuraLearn Chat App Blueprint

## Overview

AuraLearn is an interactive, AI-powered learning platform designed to help users create, manage, and study their own courses. At its core, the application provides a conversational interface where users can "chat" with their course material, making learning more engaging and intuitive. The AI acts as a personal tutor, answering questions based on the content of the user's own courses.

## Features & Design

This section details all the implemented styles, designs, and features of the AuraLearn application.

### Application Architecture

*   **Frontend:** A single-page application (SPA) built with modern, framework-less web standards.
*   **Web Components:** The UI is constructed using custom elements for modularity and encapsulation (e.g., `landing-login`, `my-courses`, `course-editor`, `course-chat`).
*   **Backend:** A serverless function (`/api/chat.js`) hosted on Vercel handles the AI chat logic.
*   **Database:** IndexedDB is used on the client-side to store course data and chat history, providing a robust offline experience.

### Visual Design

*   **Theme:** A modern, dark theme is used throughout the application, with a clean and spacious layout.
*   **Color Palette:**
    *   `--background-color`: `#1E1E1E` (Dark background)
    *   `--surface-color`: `#2D2D2D` (Slightly lighter surfaces)
    *   `--primary-text-color`: `#FFFFFF` (White text)
    *   `--secondary-text-color`: `#A0A0A0` (Grey for secondary text)
    *   `--accent-color`: `#007BFF` (Blue for interactive elements)
    *   `--border-color`: `#3D3D3D` (Subtle borders)
*   **Typography:** A clean, sans-serif font is used for readability.
*   **Interactivity:** Buttons and inputs have clear hover and focus states.

### Core Components & Features

1.  **`landing-login` Component:**
    *   The initial screen of the application.
    *   Prompts the user for their name and provides a button to enter the main app.

2.  **`my-courses` Component:**
    *   Displays a list of the user's created courses.
    *   Each course in the list shows the course title and a snippet of the content.
    *   Provides options to start a chat session for a course or edit/delete a course.
    *   Includes a button to navigate to the course creation screen.

3.  **`manage-courses` Component (`course-editor`):
    *   Allows users to create new courses or edit existing ones.
    *   Provides a form with fields for the course title and the main course content.
    *   Includes a "Save Course" button to persist the changes to the database.

4.  **`course-chat` Component:**
    *   The main chat interface for interacting with a course.
    *   Displays the course title in the header.
    *   Shows a stream of messages between the user and the AI tutor.
    *   Provides a text input field and a send button for the user to ask questions.
    *   User messages are styled on the right, and AI messages on the left.

### Backend & AI Integration

*   **`server.js`:** A Node.js Express server is set up for local development, but the core AI logic resides in the serverless function.
*   **`/api/chat.js` (Vercel Serverless Function):**
    *   The primary backend endpoint for the chat.
    *   It's configured to use Google's Vertex AI (with Gemini) when deployed to Vercel.
    *   It can also be configured to use a local AI model for offline development.
    *   It receives the user's message and the course content (as context) and returns the AI's response.

## Current Goal: Finalize and Test Chat Functionality

The immediate objective is to ensure the end-to-end chat functionality is working correctly. All the foundational components on the frontend and backend are in place.

### Plan

1.  **Configuration:** The Vercel environment has been successfully configured with the `AI_PROVIDER` set to `vertex` and the `GOOGLE_PROJECT_ID` set to `aura-learn-3ac56`.
2.  **Testing:** The next step is to perform a full end-to-end test of the chat feature:
    *   Create a new course.
    *   Start a chat session for that course.
    *   Send a message and verify that a response from the AI is received and displayed correctly.
3.  **Validation:** Based on the test results, we will confirm that the integration with the Vertex AI backend is successful and the chat is fully operational.
