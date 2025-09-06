# AURA Learn - AI-Powered Learning Platform

## Overview

AURA Learn is a web-based platform that allows students to learn from course materials with the assistance of an AI tutor. The application has two main user roles: administrators and students.

- **Administrators** can upload course materials in PDF format, which are then processed and stored in the application's database. This allows for easy management and updating of the course content.
- **Students** can browse the available courses, select one to study, and interact with an AI tutor to ask questions and get explanations about the course material.

## Features

### Core Functionality

- **User Roles:** The application distinguishes between administrators and students, providing different functionalities for each role.
- **Course Management:** Administrators can create, read, and manage courses.
- **PDF Upload and Parsing:** Course materials are uploaded as PDF files, which are then parsed to extract the text content.
- **AI-Powered Chat:** Students can chat with an AI tutor that has access to the course material, providing a personalized and interactive learning experience.
- **Local Data Storage:** The application uses IndexedDB to store course data and chat messages locally in the browser, ensuring a fast and responsive user experience.

### Technical Details

- **Frontend:** The application is built using modern, framework-less web technologies:
    - **Web Components:** The UI is built with reusable and encapsulated Web Components, promoting a modular and maintainable codebase.
    - **ES Modules:** The JavaScript code is organized into modules, making it easy to manage dependencies and reuse code.
    - **IndexedDB:** All application data, including courses and chat messages, is stored locally in the browser's IndexedDB, allowing for offline access and a more responsive UI.
- **Backend:** The AI tutor is powered by a simple Node.js server that uses the Google AI SDK to generate responses:
    - **Express.js:** The server is built with Express.js, a popular and minimalist web framework for Node.js.
    - **Google AI SDK:** The server uses the Google AI SDK to interact with the Gemini-Pro model, which generates the AI tutor's responses.

## Design and Styling

- **Modern and Clean UI:** The application features a modern and clean user interface with a dark theme, providing a visually appealing and easy-to-use experience.
- **Responsive Design:** The application is designed to be responsive and work on a variety of screen sizes, from mobile devices to desktop computers.
- **Customizable Theme:** The application uses CSS variables for styling, making it easy to customize the color scheme and other visual elements.

## Current Implementation Plan

This is the initial version of the AURA Learn application. The following steps have been completed:

1. **Project Setup:** The basic project structure has been created, including the `index.html`, `style.css`, and `main.js` files.
2. **Web Components:** The core UI components have been created as Web Components:
    - `LandingLogin`: The initial screen that allows users to select their role.
    - `MyCourses`: The screen where students can browse and select courses.
    - `CourseChat`: The chat interface where students interact with the AI tutor.
    - `ManageCourses`: The screen where administrators can manage courses.
    - `CourseEditor`: The screen where administrators can upload and create new courses.
3. **Database:** The IndexedDB database has been implemented in the `db.js` file, providing a simple and efficient way to store and retrieve application data.
4. **Backend Server:** A Node.js server has been created to power the AI tutor, using Express.js and the Google AI SDK.
5. **Environment Configuration:** The `.idx/dev.nix` file has been configured to install the necessary dependencies and run the application server.
