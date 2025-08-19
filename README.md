A full-stack analytics dashboard for restaurant order tracking.
Frontend is built with React + Tailwind, and backend is powered by PHP.

This project allows restaurant owners to:

View/search/sort/filter restaurants.

Select a restaurant and analyze order trends.

Track daily orders, revenue, average order value, and peak hours.

See Top 3 Restaurants by Revenue within a date range.

Apply filters for restaurant, date range, amount, and order hour.

Restaurant listing with search & sort
Detailed restaurant stats dashboard
Top 3 restaurants by revenue
Filters for restaurant, date, order amount, and hour
Pagination for efficient handling

Tech Stack
Frontend: React.js, TailwindCSS
Backend: PHP (no framework)
Database: JSON datasets (restaurants.json, orders.json)

Set up Instructions 
1. git clone https://github.com/ChintutheCodeMaster/Restos.git
2. cd restaurant-dash -> npm run dev 
3. To start the backend server 
Either cd into the backend folder and run the index.php script or, 
move the folder into xampp htdocs and serve the script through the xamp server. 

## ⚙️ Setup Instructions

### 1. Clone the Repository
inside bash
git clone https://github.com/ChintutheCodeMaster/Restos.git
cd Restos

2. Run the Frontend
bash
cd src
npm install
npm run dev
This will start the React app at http://localhost:5173.

3. Run the Backend
You have two options:

Option A 
Built-in PHP server
inside bash
cd backend
php -S localhost:8000 index.php
Backend runs at http://localhost:8000.

Option B – XAMPP
Move the backend/ folder into htdocs/ (inside XAMPP installation).
Start Apache from the XAMPP Control Panel.
Access backend at http://localhost/backend/index.php.


