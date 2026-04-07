# 🧠 Neural Node: Advanced AI Model Analytics

![neural-node-banner](https://img.shields.io/badge/Neural--Node-v1.0.0-7c3aed?style=for-the-badge)
![mit-license](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![react-18](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)

**Neural Node** is a premium, high-performance web application designed for deep analysis and comparison of Hugging Face AI models. Built for the modern AI researcher, it provides a sleek, interactive environment to contrast model architectures, training datasets, and performance velocity.

---

## 🔥 Features

- ⚛️ **Neural UI**: A stunning, ultra-modern glassmorphic interface built with Framer Motion and Tailwind CSS.
- 📐 **Technical Side-by-Side**: Contrast up to 4 models simultaneously with parameter-level detail and visual charts.
- 🕵️ **Metadata Crawler**: Automatically extracts base models, architecture types, and training configuration from the HF API.
- 📊 **Visual Insights**: Use Spider (Radar) graphs to identify the best model for your specific task profile.
- 🚀 **Streamlined & Secure**: No invasive settings panels. Configure your environment variables and deploy instantly.
- 📡 **Server-Side Cache**: Intelligent 15-minute caching to ensure high availability and responsiveness.

---

## 🛠️ Architecture

### Core Stack
- **Frontend**: Vite + React 18 + TypeScript + Zustand + React Query.
- **Backend**: Node.js + Express (API Proxy Layer).
- **Styling**: Tailwind CSS + Framer Motion.
- **Charts**: Recharts.

---

## 🚦 Quick Start

### 1. Configuration
Neural Node is designed to be configured solely via environment variables for maximum security. Create a `.env` file in the `server` directory:

```env
PORT=3001
HF_API_KEY=your_hugging_face_read_token
```

### 2. Launch
```bash
# Install everything
cd server && npm install
cd ../client && npm install

# Run (Separate terminals)
npm run dev # inside server/
npm run dev # inside client/
```

Access the node at: `http://localhost:5173`

---

## 🛡️ Security
Neural Node uses a backend proxy architecture. Your Hugging Face API key is never exposed to the client or stored in the browser's local storage. Configure it once in the server environment and the app handles the rest.

---

## 📜 MIT License
See the [LICENSE](LICENSE) file for more information.

*Built for the next generation of AI development.*
