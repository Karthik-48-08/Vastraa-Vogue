# 👗 Vastraa Vogue – Online Custom Clothing Store
**Your Style, Your Size, Delivered.**

Vastraa Vogue is a full-stack custom clothing e-commerce platform developed using the **MERN stack (MongoDB, Express.js, React.js, and Node.js)**. It provides customers with an online shopping experience where they can explore clothing collections, customize their clothing preferences, provide precise body measurements, and manage their orders.

The platform also provides administrative functionalities for managing products and customer orders through a role-based dashboard.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Modules](#-project-modules)
- [Installation and Setup](#-installation-and-setup)
- [Environment Variables](#-environment-variables)
- [Application Workflow](#-application-workflow)
- [Security and Validation](#-security-and-validation)
- [Future Enhancements](#-future-enhancements)

---

## 🚀 Overview

Traditional online clothing platforms primarily offer predefined sizes such as S, M, L, and XL. However, these standard sizes may not provide the perfect fit for every customer.

**Vastraa Vogue addresses this problem by introducing clothing customization and personalized measurement collection into the online shopping experience.**

Customers can:
- Explore men's and women's clothing collections.
- Browse and filter available products.
- Select clothing products and customize their preferences.
- Enter personalized body measurements.
- Add products to their shopping cart.
- Authenticate and manage their accounts.
- Place and manage orders.

Administrators can manage products and monitor customer orders through a dedicated dashboard.

---

## ✨ Key Features

### 👤 Customer Features

- **User Authentication:** Secure registration and login functionality using JWT-based authentication.
- **Product Browsing:** Explore different men's and women's clothing collections.
- **Product Filtering:** Filter and discover products using reusable React components.
- **Clothing Customization:** Personalize clothing selections according to customer preferences.
- **Custom Measurements:** Collect individual body measurements to provide a personalized clothing experience.
- **Shopping Cart:** Add, view, and manage selected products.
- **Order Management:** Place orders and manage order information.

### 🛠️ Admin Features

- **Admin Dashboard:** Centralized interface for administrative operations.
- **Product Management:** Add, update, and manage clothing products.
- **Order Management:** View and manage customer orders.
- **Role-Based Access Control:** Restrict administrative functionalities based on user roles.

### 🔐 Validation and Security

- JWT-based authentication.
- Role-based authorization.
- Input validation for customer information.
- Indian mobile number and PIN code validation using regular expressions.
- Protected access to administrative operations.

---

## 💻 Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| CSS | UI styling and responsive layouts |
| Node.js | Backend runtime environment |
| Express.js | REST API development |
| MongoDB | Database management |
| JWT | Authentication |
| JavaScript | Application logic |
| REST APIs | Frontend-backend communication |

---

## 🏗️ System Architecture

The application follows a client-server architecture using the MERN stack.

```text
              CUSTOMER / ADMIN
                     |
                     v
             REACT.JS FRONTEND
                     |
             HTTP / REST APIs
                     |
                     v
          NODE.JS + EXPRESS SERVER
                     |
          AUTHENTICATION & BUSINESS
                  LOGIC
                     |
                     v
                MONGODB
                     |
          USERS | PRODUCTS | ORDERS
```

### Architecture Components

1. **Frontend Layer:** React.js handles the user interface, navigation, product displays, cart operations, and admin dashboard.
2. **API Layer:** REST APIs enable communication between the frontend and backend.
3. **Backend Layer:** Node.js and Express.js handle business logic, authentication, authorization, and order operations.
4. **Database Layer:** MongoDB stores user information, product details, and order-related data.

---

## 📦 Project Modules

| Module | Description |
|---|---|
| Authentication | User registration, login, and JWT authentication |
| Product Management | Product listing, filtering, and administration |
| Customization | Clothing preferences and measurement collection |
| Shopping Cart | Cart management and product selection |
| Order Management | Order placement and administration |
| Admin Dashboard | Role-based administrative operations |

---

## ⚙️ Installation and Setup

Follow these steps to run the application locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm (Node Package Manager)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

```bash
cd Vastraa-Vogue
```

### 2. Install Backend Dependencies

Navigate to the backend directory:

```bash
cd backend
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file inside the backend directory.

Refer to the environment variable section below.

### 4. Start the Backend Server

```bash
npm start
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start the React Application

```bash
npm start
```

The application will generally be accessible at:

```text
http://localhost:3000
```

*Note: The commands and directory names should match your actual project configuration.*

---

## 🔑 Environment Variables

Create a `.env` file in the backend directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

**Important:** Never commit your `.env` file or expose database credentials and authentication secrets in a public repository.

---

## 🔄 Application Workflow

1. **User Registration:** Customers create an account and authenticate.
2. **Browse Collections:** Customers explore available men's and women's clothing.
3. **Product Selection:** Customers select products based on their preferences.
4. **Customization:** Customers provide personalized clothing preferences and body measurements.
5. **Cart Management:** Selected products are added to the shopping cart.
6. **Order Processing:** Customers proceed with the order placement process.
7. **Admin Management:** Administrators manage products and customer orders through the dashboard.

---

## 🔒 Security and Validation

The application incorporates authentication and validation mechanisms to improve security and data accuracy.

- JWT-based authentication for user sessions.
- Role-based access control for administrative features.
- Input validation for user registration and customer information.
- Regular-expression-based validation for Indian mobile numbers and PIN codes.
- Backend-side validation for incoming requests.

---

## 🔮 Future Enhancements

The following features can further improve the platform:

- Integration with secure payment gateways.
- AI-powered clothing recommendations.
- Virtual try-on functionality using computer vision.
- Order tracking and real-time notifications.
- Cloud-based image storage and optimization.
- Enhanced analytics for administrators.
- Automated testing and production monitoring.

---

## 🎯 Project Highlights

- Developed a full-stack custom clothing e-commerce application using the MERN stack.
- Implemented authentication and role-based access control.
- Built reusable React components for product browsing and filtering.
- Developed REST APIs for communication between frontend and backend.
- Introduced personalized clothing customization and measurement collection.
- Designed an administrative dashboard for product and order management.

---

## 👨‍💻 Developed By

**Karthik Chukkala**

Artificial Intelligence & Data Science  
Chaitanya Bharathi Institute of Technology (CBIT)

---

⭐ If you find this project interesting, consider giving the repository a star!

**Vastraa Vogue – Your Style, Your Size, Delivered.**