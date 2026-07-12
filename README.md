# 🚛 TransitOps — Smart Fleet Operations Management System

> A full-stack MERN Fleet Management ERP for logistics and transportation companies — built to digitize dispatch, driver management, maintenance, and operational analytics.


🏆 **Built during a hackathon** — designed and developed under time constraints to demonstrate a production-style fleet operations platform.

---

## 🧩 Problem Statement

Logistics and transportation companies still rely heavily on manual, disconnected processes to run their fleets:

- **Manual dispatch** — trips are assigned over calls or spreadsheets, with no system-level validation of vehicle or driver readiness.
- **Poor fleet visibility** — there is no single source of truth for which vehicles are available, on a trip, or in the shop.
- **Untracked maintenance** — vehicles requiring repair are not automatically taken out of rotation, creating safety and reliability risks.
- **Fragmented driver management** — license validity, availability, and performance are tracked inconsistently, if at all.
- **Operational inefficiency** — without real-time status tracking, dispatchers make decisions on outdated or incomplete information.

These gaps lead to delayed trips, safety violations, unplanned downtime, and a lack of accountability across fleet operations.

---

## 💡 Solution

**TransitOps** centralizes fleet operations into a single ERP-style platform with enforced business rules — not just CRUD screens.

The system tracks the real-time status of every vehicle and driver, validates every dispatch against safety and capacity constraints, and automatically updates statuses as trips and maintenance events progress. This removes manual coordination overhead and prevents invalid operational states (e.g., dispatching an unavailable driver or an in-shop vehicle) before they happen.

---

## ✨ Features

### 🔐 Authentication
- JWT-based authentication
- Role-based access control (RBAC)
- Secure login with password hashing

### 🚐 Fleet Management
- Vehicle CRUD operations
- Real-time vehicle status tracking

### 🧑‍✈️ Driver Management
- Driver CRUD operations
- License management
- Safety score tracking
- Trip completion percentage

### 🗺️ Trip Management
- Dispatch trips
- Complete trips
- Automatic status updates on dispatch/completion
- Cargo capacity validation
- Driver availability validation
- License expiry validation

### 🛠️ Maintenance
- Create maintenance records
- Complete maintenance records
- Vehicle automatically enters **"In Shop"** status
- Vehicle automatically returns to **"Available"** status on completion

### 📊 Dashboard
- KPI cards
- Fleet statistics
- Recent trips overview
- Recent maintenance overview

---

## 🧠 Business Logic

TransitOps is built around enforced operational rules, not just data storage. The system actively prevents invalid fleet states:

| Rule | Enforcement |
|---|---|
| Vehicle cannot be dispatched if already on a trip | ✅ Validated at dispatch |
| Driver cannot be dispatched if unavailable | ✅ Validated at dispatch |
| Driver with an expired license cannot be assigned | ✅ Validated at dispatch |
| Cargo cannot exceed vehicle capacity | ✅ Validated at dispatch |
| Vehicle status updates automatically | ✅ On dispatch / completion / maintenance |
| Driver status updates automatically | ✅ On dispatch / completion |
| Maintenance automatically blocks vehicle dispatch | ✅ Vehicle marked "In Shop" |

This rule engine is what separates TransitOps from a basic CRUD application — it models the actual operational constraints of running a fleet.

---

## 🧰 Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

---

## 🏗️ System Architecture

```
React Frontend
      ↓
   REST APIs
      ↓
Express Backend
      ↓
 MongoDB Atlas
```

---

## 📁 Folder Structure

```
TransitOps/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── vehicleController.js
│   │   ├── driverController.js
│   │   ├── tripController.js
│   │   ├── maintenanceController.js
│   │   └── dashboardController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   ├── Driver.js
│   │   ├── Trip.js
│   │   └── Maintenance.js
│   ├── routes/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate user and issue JWT |

### Vehicles

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/vehicles` | Get all vehicles |
| POST | `/api/vehicles` | Create a vehicle |
| PUT | `/api/vehicles/:id` | Update a vehicle |
| DELETE | `/api/vehicles/:id` | Delete a vehicle |

### Drivers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/drivers` | Get all drivers |
| POST | `/api/drivers` | Create a driver |
| PUT | `/api/drivers/:id` | Update a driver |
| DELETE | `/api/drivers/:id` | Delete a driver |

### Trips

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/trips` | Get all trips |
| POST | `/api/trips` | Dispatch a new trip |
| PUT | `/api/trips/:id/complete` | Mark trip as complete |
| DELETE | `/api/trips/:id` | Delete a trip |

### Maintenance

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/maintenance` | Get all maintenance records |
| POST | `/api/maintenance` | Create a maintenance record |
| PUT | `/api/maintenance/:id/complete` | Mark maintenance as complete |
| DELETE | `/api/maintenance/:id` | Delete a maintenance record |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Get fleet KPIs and statistics |



---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd transitops
```

### 2. Install backend dependencies
```bash
cd server
npm install
```

### 3. Install frontend dependencies
```bash
cd ../client
npm install
```

### 4. Configure environment variables
Create a `.env` file inside the `server/` directory (see [Environment Variables](#-environment-variables)).

### 5. Run the backend
```bash
cd server
npm run dev
```

### 6. Run the frontend
```bash
cd client
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the `server/` directory with the following keys:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

---

## 🔄 Demo Workflow

```
Login
  ↓
Dashboard
  ↓
Vehicle Management
  ↓
Driver Management
  ↓
Dispatch Trip
  ↓
Vehicle Status Updated
  ↓
Driver Status Updated
  ↓
Complete Trip
  ↓
Maintenance
  ↓
Dashboard Updates
```

---

## 🚀 Future Enhancements

- ⛽ Fuel management
- 💰 Expense tracking
- 📑 Advanced reports
- 🔔 Notifications
- 🤖 AI-driven fleet analytics
- 📍 GPS tracking
- 🔧 Predictive maintenance

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
