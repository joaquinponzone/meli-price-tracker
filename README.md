# Meli Price Tracker

A modern web application for monitoring and managing Mercado Libre listings, built with Next.js 15, TypeScript, and React 19.

## 🚀 Features

- Real-time Mercado Libre listing monitoring
- Automated price tracking with web scraping capabilities
- Modern and responsive UI
- Fast and efficient with Turbopack

## 🛠 Tech Stack

### Frontend
- Next.js 15.2.1 with Turbopack
- React 19.0.0
- TypeScript
- Tailwind CSS
- Lucide React for icons
- Axios for HTTP requests
- Cheerio for web scraping

## 📋 Prerequisites

- Node.js 20.x or later
- npm or bun package manager

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/meli-sentinel.git
cd meli-sentinel
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration.

## 🚀 Development

Run the development server with Turbopack:
```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📦 Available Scripts

```bash
# Development with Turbopack
npm run dev
# or
bun dev

# Production build
npm run build
# or
bun run build

# Start production server
npm run start
# or
bun start

# Lint code
npm run lint
# or
bun run lint
```

## 🏗 Project Structure

```
meli-sentinel/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   └── lib/               # Utility functions
├── public/                # Static assets
└── types/                # TypeScript type definitions
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Cheerio](https://cheerio.js.org/)
