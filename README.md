# 🌍 Shobaimile — Community & Volunteering Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<p align="center">
  A community-driven platform that connects people through volunteering, social activities, and meaningful community events.
</p>

<p align="center">
  <a href="https://shobaimile.vercel.app/">
    <strong>🚀 Live Demo</strong>
  </a>
</p>

---

## 📖 About The Project

**Shobaimile** is a community-focused web application designed to bring people together and encourage social engagement through volunteering and community activities.

The platform provides a convenient way for users to discover events, participate in meaningful activities, and connect with their communities.

Whether someone wants to volunteer, join a community event, or contribute to society, Shobaimile aims to make community participation easier and more accessible.

## 📸 Project Screenshots

<p align="center">
  <img src="docs/images/homepage.png" alt="Shobaimile Homepage" width="100%" />
  <br />
  <em>Homepage — Discover community activities and opportunities</em>
</p>

<p align="center">
  <img src="docs/images/events.png" alt="Shobaimile Events Page" width="100%" />
  <br />
  <em>Events — Explore upcoming community events</em>
</p>

<p align="center">
  <img src="docs/images/event-details.png" alt="Shobaimile Event Details" width="100%" />
  <br />
  <em>Event Details — View event information and participate</em>
</p>

> **Note:** Add your actual project screenshots inside `docs/images/` using the filenames shown above. You can replace or add more screenshots as needed.

## ✨ Key Features

### 👤 Authentication & User Management
- Secure user registration and login.
- Authentication using Better Auth.
- Personalized user profiles.
- Manage personal account information.

### 📅 Community Events
- Discover community events and activities.
- View detailed event information.
- Explore event dates, locations, and descriptions.
- Participate in community-driven initiatives.

### 🤝 Volunteer Opportunities
- Discover volunteering opportunities.
- Encourage social participation and community engagement.
- Connect users with meaningful activities.

### 📝 Event Registration
- Register for available events.
- Manage event participation.
- View relevant event information.

### 🛠️ Event Management
- Create and manage community events.
- Organize activities and volunteering initiatives.
- Manage event information through the platform.

### 📱 Responsive Design
- Mobile-first responsive interface.
- Optimized layouts for mobile, tablet, and desktop.
- Consistent user experience across different screen sizes.

### 🎨 Modern User Interface
- Clean and intuitive design.
- Interactive components and smooth navigation.
- Accessible and user-friendly interface.

### 🔐 Protected Routes
- Authentication-based access control.
- Protected user-specific pages.
- Secure handling of authenticated requests.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework |
| React | UI development |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive design |
| Better Auth | Authentication |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB | Database |
| Vercel | Deployment |

---

## 📂 Project Structure

```text
shobaimile-client/
│
├── public/
│   └── images/
│
├── docs/
│   └── images/
│       ├── homepage.png
│       ├── events.png
│       └── event-details.png
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── events/
│   │   ├── profile/
│   │   ├── admin/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   ├── lib/
│   └── types/
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

*This is an illustrative structure. Adjust it to match the actual project folders.*

---

## 🚀 Getting Started

Follow these steps to run Shobaimile locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- MongoDB
- Git

### 1. Clone the Repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd shobaimile-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory.

```env
NEXT_PUBLIC_API_URL=YOUR_BACKEND_API_URL
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=YOUR_SECRET_KEY
```

Configure the environment variables according to your backend and Better Auth setup.

### 5. Start the Development Server

```bash
npm run dev
```

### 6. Open the Application

Visit:

```text
http://localhost:3000
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production application |
| `npm run start` | Start the production server |
| `npm run lint` | Run lint checks |

---

## 🌐 Live Deployment

The application is deployed using Vercel.

<p align="center">
  <a href="https://shobaimile.vercel.app/">
    <img src="https://img.shields.io/badge/Visit-Shobaimile-15A1BF?style=for-the-badge&logo=vercel&logoColor=white" alt="Visit Shobaimile" />
  </a>
</p>

**Live Website:** https://shobaimile.vercel.app/

---

## 🔮 Future Improvements

- Real-time notifications for community events.
- Advanced event search and filtering.
- Event reviews and feedback.
- Enhanced volunteer activity tracking.
- Improved analytics for event organizers.
- Additional accessibility improvements.

---

## 👨‍💻 Author

Developed with ❤️ as a community-focused web application.

---

<p align="center">
  <strong>Shobaimile — Bringing Communities Together.</strong>
</p>
