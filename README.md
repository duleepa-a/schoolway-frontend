The project is hosted on : https://schoolway-frontend.vercel.app/

## Getting Started

First, run the development server:


Deployment Instructions 

Project: SchoolWay 

1. Overview
The SchoolWay System consists of two main components:
A Web Application (Frontend + Backend)


A Mobile Application (using Expo)  
The web application interacts with a cloud database hosted on Neon (NeonDB), and both platforms connect to the same backend server.

2. Prerequisites
Before setting up the system, ensure the following are installed on your machine:
Node.js (LTS version recommended)
npm (comes with Node.js)
Visual Studio Code or IntelliJ IDEA (optional but recommended)
Git
Expo Go app installed on your mobile device (downloadable from Google Play or Apple App Store)
Stable internet connection (required for NeonDB connection)


3. Running the Web Application
Step 1: Clone the Repository
Step 2: Install Dependencies
Run the following command inside the project folder:
npm install
This will install all the required Node modules.
Step 3: Start the Development Server
Run:
npm run dev
Step 4: Access the Application
Once the server starts, a local IP address (e.g., http://localhost:3000) will be displayed in the terminal.
Click or copy this URL into your browser to open the application.
The system will automatically connect to the NeonDB database—no additional setup required.

4. Running the Mobile Application
Step 1: Clone the Mobile Codebase
Step 2: Install Dependencies
Run:
npm install
Step 3: Start the Expo Development Server
Run:
npx expo start
This will:
Start the Expo development environment.
Display a QR code in the terminal or in the browser.
Step 4: Prepare the Mobile Device
Install the Expo Go app on your mobile device.
Open the Expo Go app.
Select “Scan QR Code” and scan the QR shown on your terminal.
The app will start building and open on your mobile.
Important: The web server must be running (steps in Section 3) before launching the mobile app, as the mobile app relies on it for API communication and data.

5. Database Configuration
The project uses NeonDB, a cloud-hosted PostgreSQL database.
The database is already configured in the backend environment file.
When you start the project, it automatically connects to the NeonDB instance—no manual start or configuration is required.



6. Deployment Instructions (Vercel)

Step 1: Prepare Your Project
Make sure your web application runs locally without errors.
Ensure your .env file contains the correct NeonDB credentials, GoogleMapsAPI, FirebaseAPI



Step 2: Login to Vercel
Go to https://vercel.com.
Log in or create an account.
Connect your GitHub account if not already connected.


Step 3: Import the Project
Click “New Project” in Vercel.
Select your GitHub repository containing the SchoolWay web project.
Vercel will detect the framework (or select next.js) and automatically set build settings.


Step 4: Configure Environment Variables
In the project settings on Vercel, go to Environment Variables.
Add the required variables (e.g., DATABASE_URL for NeonDB) as in the .env file.


Step 5: Deploy
Click “Deploy”.
Vercel will build and host your project.
Check for any build errors, and resolve if have any. TypeScript and linting are common.
After a few minutes, a live URL will be generated, 



