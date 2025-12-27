# Plator 🎨

**The All-in-One Content Creation & Scheduling MicroSaaS for Creators.**

![Plator Editor](public/editor.png)

Plator is a powerful web application built with **Next.js** that empowers social media creators to design image templates, preview them across multiple platforms (Twitter/X, LinkedIn), and schedule their posts seamlessly.

## ✨ Key Features

### 1\. 🖼️ Advanced Image Editor

A fully functional browser-based graphic editor.

- **Layer Management:** Drag, drop, and reorder text and image layers.
- **Smart Cropping:** Crop images with an intuitive UI and dashed border guides.
- **Customization:** Adjust fonts, colors, shadows, borders, and apply noise/blur effects.
- **Interactivity:** Resize, rotate, and position elements freely on the canvas.

### 2\. 📱 Cross-Platform Preview

See exactly how your content will look before you post.

- **Live Preview:** Toggle between **Mobile** and **Desktop** views.
- **Multi-Platform Support:** tailored previews for **Twitter (X)**, **LinkedIn**, and **Instagram**.
- **Auto-Generated Snippets:** Visualizes text wrapping, hashtags, and media placement.

### 3\. 🚀 Seamless Publishing

- **One-Click Share:** Uses browser intents to open pre-filled compose windows for Twitter and LinkedIn simultaneously.
- **Smart Clipboard:** Automatically copies your generated image to the clipboard for easy pasting.
- **Authentication:** Secure Google Login powered by **Better Auth**.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via Neon/Supabase)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Hooks & URL State

---

## 🚀 Getting Started

Follow these steps to run Plator locally.

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL Database URL

### 1\. Clone the Repository

```bash
git clone https://github.com/yourusername/plator.git
cd plator
```

### 2\. Install Dependencies

```bash
npm install
# or
bun install
```

### 3\. Environment Setup

Create a `.env` file in the root directory and add the following keys:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@host:5432/plator?sslmode=require"

# Better Auth Secrets
BETTER_AUTH_SECRET="your_generated_secret_here"
BETTER_AUTH_URL="http://localhost:3000"

# App URL (Client)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 4\. Database Setup

Push the schema to your database.

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5\. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```bash
├── app/
│   ├── api/auth/      # Authentication routes (Better Auth)
│   ├── editor/        # Image editor page & canvas components
│   ├── preview/       # Social media preview & posting logic
│   └── scheduler/     # Scheduling dashboard
├── components/        # Shared UI components (Shadcn)
├── lib/
│   ├── auth.ts        # Auth configuration
│   ├── env.ts         # Zod environment validation
│   └── utils.ts       # Helper functions
├── prisma/
│   └── schema.prisma  # Database schema (User, Session, Account)
└── public/            # Static assets
```

---

## 🤝 Contributing

Contributions are welcome\! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the Apache 2.0 License. See LICENSE for more information.
