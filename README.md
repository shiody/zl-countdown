# Zhen Li Countdown Timer

An elegant, fullscreen ambient countdown application built specifically for the Zhen Li Seventh-day Adventist Church Communication Department. 

Designed with modern **Material Design 3 (M3)** components, smooth animations, and a focus-enhancing interface, this application serves as a beautiful visual timer for Sabbath School discussions or general events.

## Features
- **Ambient UI:** Full-screen frosted glass aesthetic powered by a customizable background image.
- **Dynamic Typography:** Uses `Plus Jakarta Sans` for clean, massive tabular digits.
- **Audio Notifications:** Automatic alerts at the 10-minute and 5-minute marks.
- **Background Music:** Soothing background music auto-plays after the 5-minute warning, with manual toggle controls.
- **Fullscreen API:** Native one-click fullscreen support to hide browser chrome during presentations.
- **Offline Ready:** Fonts are bundled locally, requiring no external Google Fonts requests.

## Project Structure

This project is built using **Svelte 5** (Runes mode) and **Tailwind CSS v4** via Vite.

```text
zl-countdown/
├── src/
│   ├── app.css              # Global Tailwind v4 styles & Font imports
│   ├── app.html             # Main HTML entry point
│   ├── lib/
│   │   ├── components/      # Reusable Material 3 UI Components
│   │   │   ├── Button.svelte
│   │   │   ├── Card.svelte
│   │   │   ├── Dialog.svelte
│   │   │   ├── ProgressIndicator.svelte
│   │   │   └── TimePicker.svelte
│   │   └── utils/
│   │       └── audio.ts     # Audio logic for MP3s (BGM, Chimes)
│   └── routes/
│       ├── +layout.svelte   # Base SvelteKit layout
│       └── +page.svelte     # Main Timer Application Logic & UI
├── static/
│   └── audio/               # Place your custom .mp3 files here!
│       ├── 10m.mp3
│       ├── 5m.mp3
│       ├── 0m.mp3
│       └── bgm.mp3
├── package.json
├── svelte.config.js
├── tailwind.config.js
└── vite.config.ts
```

## Customizing Assets
To customize the visual and audio assets, simply replace the corresponding files located in the `static/` directory. The application will automatically pick up the new files.

### Background Image
- Drop your custom image into `static/images/bg.jpg`. It will be automatically used as the fullscreen ambient background. A 16:9 aspect ratio is recommended.

### Notification Sounds
- `static/audio/10m.mp3`: Plays when 10 minutes remain.
- `static/audio/5m.mp3`: Plays when 5 minutes remain.
- `static/audio/0m.mp3`: Plays when the timer hits zero.
- `static/audio/bgm.mp3`: Loops continuously after the 5-minute mark.

## Developing Locally

Install dependencies and start the development server:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` to view it in the browser.

---

## Publishing to Vercel

SvelteKit applications are incredibly easy to deploy to Vercel because they use `@sveltejs/adapter-auto` by default, which detects Vercel and configures the build automatically.

### Option 1: Deploy via Vercel Dashboard (Recommended)
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Log into [Vercel](https://vercel.com).
3. Click **Add New** > **Project**.
4. Import your Git repository.
5. Vercel will automatically detect that it is a SvelteKit framework.
6. Leave the Build and Output Settings as default.
7. Click **Deploy**.

### Option 2: Deploy via Vercel CLI
If you prefer deploying directly from your terminal:
1. Install the Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```
2. Run the deployment command from the root of your project:
   ```bash
   vercel
   ```
3. Follow the prompts to log in and link your project.
4. To deploy to production, run:
   ```bash
   vercel --prod
   ```
