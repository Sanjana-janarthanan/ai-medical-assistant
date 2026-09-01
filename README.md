# AI Medical Assistant

An AI-powered medical assistant web application designed to help users manage their health information, understand symptoms, organize medical documents, track medications, and interact with an AI assistant through a secure and user-friendly interface.

> ⚠️ **Disclaimer:** This application is intended for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.

---

##  Live Demo

**Live Project:** Coming soon

**GitHub Repository:**
https://github.com/Sanjana-janarthanan/ai-medical-assistant

---

##  Overview

The **AI Medical Assistant** is a full-stack web application that combines AI capabilities with personal health-data management.

The application provides users with a centralized platform where they can:

* Interact with an AI medical assistant
* Check and understand symptoms
* Manage their health profile
* Track medications
* Upload and manage medical documents
* View a health summary
* Maintain conversations with the AI assistant

The project is built using **Next.js, TypeScript, Prisma, PostgreSQL, and Clerk authentication**.

---

##  Features

###  AI Medical Assistant

Users can communicate with an AI-powered assistant to ask health-related questions and receive informational responses.

###  Symptom Checker

Users can enter their symptoms and receive AI-assisted guidance based on the information provided.

> The symptom checker is intended as an informational tool and does not provide a medical diagnosis.

###  Health Profile

Users can maintain personal health information that can be used to provide more contextual assistance.

###  Medication Management

Users can add and manage medication information, helping them keep their medications organized.

###  Medical Documents

Users can upload and manage medical documents through the application.

###  Health Summary

The application provides a centralized view of the user's available health information.

###  Conversation History

AI conversations are stored so users can maintain and revisit previous interactions.

###  Authentication

User authentication and account management are handled using Clerk.

---

##  Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* TypeScript

### Database

* PostgreSQL
* Prisma ORM
* Neon PostgreSQL

### Authentication

* Clerk

### AI

* AI-powered medical assistant API

### Development Tools

* Node.js
* npm
* Git
* GitHub
* VS Code

---

##  Project Architecture

```text
AI Medical Assistant
│
├── Frontend
│   ├── Dashboard
│   ├── AI Assistant
│   ├── Symptom Checker
│   ├── Health Summary
│   ├── Medications
│   ├── Medical Documents
│   └── Profile
│
├── Backend
│   └── Next.js API Routes
│       ├── Assistant API
│       ├── Conversations API
│       ├── Health Summary API
│       ├── Medical Documents API
│       ├── Medications API
│       ├── Profile API
│       └── Symptoms API
│
├── Authentication
│   └── Clerk
│
└── Database
    ├── PostgreSQL
    └── Prisma ORM
```

---

##  Project Structure

```text
ai-medical-assistant/
│
├── app/
│   ├── api/
│   │   ├── assistant/
│   │   ├── conversations/
│   │   ├── health-summary/
│   │   ├── medical-documents/
│   │   ├── medications/
│   │   ├── profile/
│   │   └── symptoms/
│   │
│   ├── assistant/
│   ├── dashboard/
│   ├── health-summary/
│   ├── medical-documents/
│   ├── medications/
│   ├── profile/
│   ├── sign-in/
│   ├── sign-up/
│   └── symptoms/
│
├── lib/
│   └── prisma.ts
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── prisma.config.ts
├── proxy.ts
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sanjana-janarthanan/ai-medical-assistant.git
```

### 2. Navigate into the project

```bash
cd ai-medical-assistant
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root.

Example:

```env
DATABASE_URL="your_postgresql_connection_string"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

# Add your AI provider/API configuration here
```

> Never commit `.env` or `.env.local` files to GitHub.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Apply database migrations

```bash
npx prisma migrate dev
```

### 7. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

##  Database

The project uses **PostgreSQL** with **Prisma ORM**.

The database currently contains models supporting:

* Patient profiles
* Conversations
* Messages
* Medications
* Medical documents

Database migrations are stored inside:

```text
prisma/migrations/
```

---

##  Security

The project uses environment variables for sensitive configuration.

The following files are intentionally excluded from Git:

```text
.env
.env.local
node_modules/
.next/
app/generated/
.clerk/
```

API keys, authentication secrets, and database credentials should never be committed to the repository.

---

##  Development

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## 🔮 Future Enhancements

Planned improvements include:

* Voice-based medical assistant
* Improved symptom analysis workflow
* Medication reminders
* Medical document text extraction
* OCR for uploaded medical reports
* AI-powered health insights
* Appointment management
* Doctor consultation integration
* Improved conversation history
* Enhanced dashboard analytics
* Mobile-responsive improvements
* Production deployment
* Improved medical safety guardrails

---

##  Medical Disclaimer

This project is an AI-based educational and informational application.

It should **not** be used as a replacement for a qualified doctor, emergency medical service, diagnosis, prescription, or professional medical treatment.

Users should consult a qualified healthcare professional for medical decisions.

---

##  Author

**Sanjana Janarthanan**

Computer Science Engineering Student

GitHub:
https://github.com/Sanjana-janarthanan

---

