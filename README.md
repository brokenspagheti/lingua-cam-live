# LinguaCam Live

LinguaCam Live is a professional OBS overlay suite featuring AI-translated global captions, unified dynamic chat, and interactive stream widgets. Designed with modern web technologies, it provides a seamless and visually stunning experience for language-inclusive live streams.

## Features
- **Real-Time Translated Captions**: Uses Lingo.dev API to provide low-latency translations directly on your stream overlay.
- **Unified Chat (Danmu)**: Fluid, wave-based chat movement that integrates directly with YouTube Live Chat.
- **Multilingual Support**: Real-time translations handle numerous languages.
- **Stream Widgets & FX**: Includes interactive elements like Soundboards, Cinematic FX filters, Quick Chat buttons, and Emote Pop reactions.
- **Vercel Ready**: Fully serverless architecture for easy and free deployment on Vercel.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Output your YouTube Live Data API Key and Lingo.dev API Key directly in the UI.

### Installation

1. Copy the environment variables template:
   ```bash
   cp .env.local.example .env.local
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage
Simply click on the **Setup APIs** button in the Control Center to input your API keys securely. Your keys are stored locally within your browser using `localStorage` and sent safely to the stateless backend for translation purposes. Ensure you have given permission for Camera and Microphone access.

> Note: Make sure to keep your API keys private!

## Deployment
This project is fully compatible with Vercel's serverless infrastructure. Simply connect your GitHub repository to Vercel and it will automatically build and deploy.
