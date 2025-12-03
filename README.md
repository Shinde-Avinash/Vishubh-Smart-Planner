# Vishubh Scheduling Companion

An AI-driven productivity and scheduling web application.

## Prerequisites

- Node.js
- MySQL

## Setup

1.  **Database**:
    - Create a MySQL database named `vishubh_db`.
    - Update `server/.env` with your database credentials.

2.  **Backend**:
    ```bash
    cd server
    npm install
    npm start
    ```
    The server runs on `http://localhost:5000`.

3.  **Frontend**:
    ```bash
    cd client
    npm install
    npm run dev
    ```
    The frontend runs on `http://localhost:5173`.

## Features Implemented So Far

- Project Initialization (Frontend + Backend)
- User Authentication (Login, Register, JWT)
