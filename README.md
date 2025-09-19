# 🚗 Car Location Backend

![GitHub repo size](https://img.shields.io/github/repo-size/clementR97/CarLocationBackend)
![GitHub stars](https://img.shields.io/github/stars/clementR97/CarLocationBackend?style=social)
![GitHub forks](https://img.shields.io/github/forks/clementR97/CarLocationBackend?style=social)

This project is a car rental app consisting of **two parts**:  

1. **Frontend** : [Angular](https://github.com/clementR97/frontendCarRent.git)Angular Application for users and admin on this repository.  
2. **Backend** : Node.js API to manage car data, reservations and users on this repository.

---
## Table of contents
- [Description](#description)
- [Features](#features)
- [Technologies used](#technologies-used)  
- [Installation](#installation)  
- [Configuration](#configuration)  
- [Launch the application](#launch-the_application)
- [API Endpoints](#endpoints)
- [Licence](#licence)
  
---
## Description
This is the **backend API** for the Car Location project.  
It handles **cars, reservations, and user management**.  

The backend is built with **Node.js, Express, and MongoDB**, and integrates **Supabase** for authentication and user management.  

---

## 📌 Features
- Manage **cars** (CRUD operations)  
- Manage **reservations** (CRUD operations)  
- **User authentication & authorization** via **Supabase**  
- Secure API with middleware and validation  

---

## 🛠️ Technologies used

- **Node.js**  
- **Express.js**  
- **MongoDB**  
- **Supabase** (Auth & user management)  

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/clementR97/CarLocationBackend.git
cd CarLocationBackend
npm install
```
## 📝 Configuration

Create a .env file with your configuration:
```bash
export const environment = {
    production: false,
    supabase: {
      url: 'your project supabase url',
      anonKey:'your project supabase annonKey',      
    }
  };

  export const ApiUrl = {
    production: false,
    ApiUrl : 'http://localhost:3000'
  }
```

## ▶️ Launch the application

```bash
npm run dev
```

## 🚀 API Endpoints
Cars

GET /api/cars → Get all cars

POST /api/cars → Add a new car

PUT /api/cars/:id → Update car details

DELETE /api/cars/:id → Delete a car


Reservations

GET /api/reservations → Get all reservations

POST /api/reservations → Create a reservation

DELETE /api/reservations/:id → Cancel reservation


Users (via Supabase)

POST /auth/signup → Register user

POST /auth/login → Login user

GET /auth/me → Get current user profile

## Licence
Ce projet est sous licence MIT.



