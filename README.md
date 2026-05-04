# 🎓 RMS — Registration Management System

> A robust application to automate and manage the student registration process for **STEAM Higher Education Institute**.

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white)
![Thymeleaf](https://img.shields.io/badge/Thymeleaf-005F0F?style=for-the-badge&logo=thymeleaf&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)
![Lombok](https://img.shields.io/badge/Lombok-BC4521?style=for-the-badge&logo=lombok&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [License](#-license)

---

## 🌐 Overview

**RMS (Registration Management System)** is a full-stack web application built with **Spring Boot** and **jQuery** that simplifies and automates the student registration workflow at STEAM Higher Education Institute. It provides a centralised platform for managing courses, batches, student enrollments, payments, attendance, and academic performance.

---

## ✨ Features

| Module | Description |
|---|---|
| 👨‍🎓 **Student Management** | Register, view, and edit student profiles |
| 📚 **Course Management** | Create and manage courses and their modules/lessons |
| 🗂️ **Batch Management** | Allocate students to batches with day plans and lecture rooms |
| 📝 **Registration** | Handle new registrations and track registration status |
| 💳 **Payment & Installments** | Record payments, manage installment plans, and track dues |
| 📅 **Attendance Tracking** | Mark and view attendance per batch/student |
| 📊 **Marks & Exams** | Record marks, manage exam attempts, and validate results |
| 👥 **Employee & Lecturer** | Manage staff, lecturers, designations, and commission rates |
| 🔐 **User & Role Management** | Role-based access control with configurable privileges |
| 📧 **Email Notifications** | Automated emails via Gmail SMTP (OTP, notifications) |
| 🔑 **Password Reset** | Secure OTP-based password reset flow |
| 📈 **Reports** | Batch, income, attendance, marks, student, and due reports |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Language** | Java 17 |
| **Framework** | Spring Boot 3.2.1 |
| **Security** | Spring Security |
| **Persistence** | Spring Data JPA (Hibernate) |
| **View Layer** | Thymeleaf + jQuery |
| **Database** | MySQL |
| **Build Tool** | Gradle |
| **Utilities** | Lombok, Spring Boot DevTools |
| **Mail** | Spring Boot Mail (Gmail SMTP) |

---

## 📁 Project Structure

```
rms/
├── src/
│   ├── main/
│   │   ├── java/lk/steam/rms/
│   │   │   ├── RmsApplication.java       # Application entry point
│   │   │   ├── config/                   # Security & web configuration
│   │   │   ├── controller/               # MVC controllers
│   │   │   ├── dao/                      # Spring Data JPA repositories
│   │   │   ├── entity/                   # JPA entity classes
│   │   │   └── service/                  # Business logic & mail service
│   │   └── resources/
│   │       ├── application.properties    # App configuration
│   │       ├── static/                   # CSS, JS, images
│   │       └── templates/                # Thymeleaf HTML templates
│   └── test/                             # Unit & integration tests
├── build.gradle                          # Gradle build script
├── settings.gradle
└── gradlew / gradlew.bat                 # Gradle wrapper
```

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher — [Download](https://adoptium.net/)
- **MySQL 8.x** — [Download](https://dev.mysql.com/downloads/)
- **Git** — [Download](https://git-scm.com/)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/eamalindu/rms.git
cd rms
```

### 2. Set up the database

Log into MySQL and create the database:

```sql
CREATE DATABASE steam;
```

### 3. Configure the application

Edit `src/main/resources/application.properties` and update the database credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/steam
spring.datasource.username=<your-mysql-username>
spring.datasource.password=<your-mysql-password>
```

Also update the mail configuration with your Gmail credentials (see [Configuration](#-configuration)).

### 4. Build and run

```bash
# On Linux/macOS
./gradlew bootRun

# On Windows
gradlew.bat bootRun
```

The application will start at **http://localhost:8080** by default.

---

## ⚙️ Configuration

Key settings in `src/main/resources/application.properties`:

| Property | Default | Description |
|---|---|---|
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/steam` | MySQL connection URL |
| `spring.datasource.username` | `root` | MySQL username |
| `spring.datasource.password` | `12345` | MySQL password |
| `server.servlet.session.timeout` | `15m` | Session timeout duration |
| `server.port` | `8080` | Server port (uncomment to change) |
| `spring.mail.username` | — | Gmail address for sending emails |
| `spring.mail.password` | — | Gmail app password |

> ⚠️ **Security Note:** Never commit real credentials to version control. Use environment variables or a secrets manager in production.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ for <strong>STEAM Higher Education Institute</strong>
</div>
