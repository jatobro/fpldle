<div align="center">

# FPLdle

**Guess the daily Fantasy Premier League player in 10 tries!**

A daily Wordle-inspired guessing game for Fantasy Premier League (FPL) enthusiasts. Test your knowledge of Premier League players by guessing attributes like position, team, price, form, and more.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📸 Preview

<!-- Add a screenshot or GIF of the game here -->

## 🎮 How to Play

1. **Guess a Player**: Type any Premier League player's name to make your first guess
2. **Analyze Feedback**: After each guess, you'll see how your guess compares to the target player:
   - 🟢 **Green** = Correct attribute
   - 🟡 **Yellow** = Close (within range)
   - 🔴 **Red** = Incorrect
3. **Use Arrows**: For numeric attributes (price, form, points, selected by), arrows indicate if the target is ↑ higher or ↓ lower
4. **Win or Lose**: You have 10 attempts to identify the mystery player

### Attributes

| Attribute | Close Range |
|-----------|-------------|
| Position | Adjacent position (e.g., DEF ↔ MID) |
| Team | Exact match only |
| Price | Within £0.5m |
| Form | Within 1.0 |
| Points | Within 10 points |
| Selected By | Within 5% |

## ✨ Features

- **Daily Puzzles**: New mystery player every day
- **Deterministic Selection**: Same player for everyone based on date
- **Real-Time Data**: Uses official FPL API data
- **Persistent Stats**: Track your performance across sessions
  - Games played & won
  - Win percentage
  - Current & max streak
  - Average guesses
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Smart Search**: Fuzzy search with player filtering
- **Local Storage**: Your progress is saved automatically

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- pnpm (recommended), npm, or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/fpldle.git
cd fpldle
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.local.example .env.local
```

4. **Run the development server**

```bash
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

## 🛠️ Development

### Available Scripts

```bash
# Start development server (port 3002)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Fetch latest FPL data
pnpm fetch:data
```

### Project Structure

```
fpldle/
├── app/                    # Next.js app router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── error.tsx          # Error boundary
├── components/            # React components
│   ├── game-client.tsx    # Main game component
│   ├── player-search.tsx  # Player search with fuzzy filtering
│   ├── game-finished-card.tsx  # Results display
│   ├── stats-display.tsx  # Statistics display
│   └── ui/                # shadcn/ui components
├── lib/                   # Core logic
│   ├── game.ts            # Game mechanics & comparison
│   ├── data.ts            # Data fetching & caching
│   ├── storage.ts         # Local storage utilities
│   ├── hooks.ts           # React hooks
│   ├── consts.ts          # Constants & config
│   ├── definitions.ts     # TypeScript types
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## 🏗️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Hugeicons](https://hugeicons.com/)
- **Search**: [Fuse.js](https://fusejs.io/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📊 Data Sources

Player data is fetched from the official [Fantasy Premier League API](https://fantasy.premierleague.com/api/bootstrap-static/):
- Player names & IDs
- Positions (GK, DEF, MID, FWD)
- Teams
- Prices
- Form ratings
- Total points
- Selection percentage

## 🎯 Game Logic

### Player Selection

A deterministic algorithm ensures all players see the same daily mystery player:

1. Generate a seed from the current date (YYYY-MM-DD)
2. Use the seed to initialize a PRNG (sfc32)
3. Select a random player ID from active players
4. Return the corresponding player

### Comparison Rules

```typescript
// Example: Price comparison
- Exact match → Green (correct)
- Within £0.5m → Yellow (close)
- More than £0.5m → Red (incorrect) with arrow
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Run `pnpm lint` before committing
- Test thoroughly before submitting PRs
- Update documentation as needed

## 📝 Roadmap

- [ ] Leaderboards
- [ ] Share results to social media
- [ ] Dark mode toggle
- [ ] Multiple difficulty levels
- [ ] Historical puzzles
- [ ] Player comparison view

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Wordle](https://www.nytimes.com/games/wordle) for the inspiration
- [Fantasy Premier League](https://fantasy.premierleague.com/) for the API
- [shadcn](https://ui.shadcn.com/) for the beautiful UI components
- [Vercel](https://vercel.com/) for hosting Next.js applications

---

<div align="center">

**Made with ❤️ for FPL fans**

[Back to top](#fpldle)

</div>
