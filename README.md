# Real-time Fitness Tracker

A web app that uses computer vision to track human pose and provide real‑time feedback for squats and push‑ups, with a 3D visualization.

## Features

- Real-time pose detection (MediaPipe Tasks)
- 3D skeleton visualization (Three.js / React Three Fiber)
- Form feedback for squats and push-ups
- Full body visibility guidance
- Modern React + Vite + Tailwind CSS stack

## Tech Stack

- React + TypeScript
- Vite (with `base` configured for GitHub Pages)
- Three.js, @react-three/fiber, @react-three/drei
- MediaPipe Tasks Vision (WASM from CDN)
- Tailwind CSS

## Prerequisites

- Node.js 18+ (recommended) and npm
- A webcam and a well‑lit environment
- Internet connectivity (models and WASM are fetched from the CDN)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/AyushCodes160/Real-Time-Fitness-Tracker-1.git
cd Real-Time-Fitness-Tracker-1
```

2. Install dependencies:
```bash
npm install
```

## Run (Development)

Start the dev server:
```bash
npm run dev
```

Then open the URL printed in the terminal. Because `vite.config.ts` sets a `base`, the local URL will look like:

- `http://localhost:<port>/Real-Time-Fitness-Tracker-1/`

Note: If port 5173 is taken, Vite will choose another port and print it.

## Build & Preview (Production)

Create a production build and preview locally:
```bash
npm run build
npm run preview
```

## Deployment (GitHub Pages)

This project is configured for GitHub Pages:

- `vite.config.ts` uses `base: '/Real-Time-Fitness-Tracker-1/'`
- `npm run deploy` publishes the `dist` folder using `gh-pages`

Deploy steps:
```bash
npm run build
npm run deploy
```

## Usage

1. Select an exercise (Squats or Push-ups)
2. Click "Start Camera" to grant camera access
3. Position yourself so your full body is visible in frame
4. Perform the exercise and read the real‑time feedback

## Troubleshooting

- Blank page at `/`:
	- Ensure you open the URL with the base path (e.g. `/Real-Time-Fitness-Tracker-1/`).
- Camera not starting:
	- Grant browser camera permission; use a secure context (localhost or HTTPS).
- No pose detected / jittery:
	- Improve lighting and ensure your full body is in view.
- WebGL issues:
	- Ensure your browser supports WebGL; try the latest Chrome.
- Models fail to load:
	- Check internet connectivity; the app fetches MediaPipe assets from a CDN.

## Privacy

Video from your webcam is processed locally in your browser. No video frames are uploaded to any server.

## Project Structure

```
src/
	components/
		ExerciseSelector.tsx       # Exercise selection UI
		PoseVisualizer.tsx         # 3D skeleton renderer
	utils/
		poseValidation.ts          # Squat & push-up form checks
	App.tsx                      # Main app logic and webcam/pose pipeline
	index.css                    # Global styles (Tailwind)
```

## Scripts

- `npm run dev`     – start Vite dev server
- `npm run build`   – type‑check and build for production
- `npm run preview` – preview the production build locally
- `npm run deploy`  – deploy `dist` to GitHub Pages

## Contributing

Issues and PRs are welcome. If you add new exercises or change the deployment base/path, remember to update `vite.config.ts` and this README.