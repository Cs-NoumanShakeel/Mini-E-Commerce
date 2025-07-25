README.txt

E-Commerce Full Stack Project Setup Instructions

This guide will help you set up the full stack e-commerce project that includes both frontend and backend components.

1. Project Structure
Create a main folder and place the following two folders inside it (from the GitHub repo):

Frontend

Backend

2. Set Up Virtual Environment (Windows)
Navigate to the main folder and create a virtual environment:


python -m venv env

Activate the environment:

.\env\Scripts\Activate.ps1

3. Install Backend Dependencies
In the activated virtual environment, install required Python packages using:


pip install -r requirements.txt
Ensure requirements.txt is located in the main directory or adjust the path accordingly.

4. Setting Up Vite (Frontend)
Navigate to the frontend folder:


cd frontend

Install Vite:


npm install vite --save-dev

If there are conflicts or missing configurations, do the following:

Remove the current frontend folder temporarily.

Create a new Vite project:


npm create vite@latest

When prompted, enter the project name as frontend.

Choose React and JavaScript options.

Once the Vite project is generated:

Copy the src folder from the GitHub frontend folder into the newly created Vite frontend folder (overwrite if needed).

Ensure vite.config.js and index.html are correctly set up.

5. Backend Setup
From the terminal, navigate to the backend folder:


cd backend

Run the following commands to set up the database:


py manage.py makemigrations
py manage.py migrate
py manage.py runserver

This will start your Django server. Copy the local server address shown in the terminal (e.g., http://127.0.0.1:8000).

6. Configure Frontend Environment
In the frontend directory, create a .env file and add:


API_VITE_URL="http://127.0.0.1:8000"

(Replace with your actual backend server URL if different.)

7. Install Frontend Dependencies
Still inside the frontend folder, install the necessary packages:


npm install axios react-router-dom jwt-decode

8. Run the Frontend
In the same frontend folder:


npm run dev

Click the local dev link shown in the terminal to open the React app in your browser.

Final Note:
Run backend and frontend in separate terminals.

Ensure both are active to fully use the application.