# Peer Card Generator

Generate beautiful, shareable cards showcasing your Peer Protocol maker stats. Features custom PP Valve typography, gradient effects for high-volume makers, and one-click sharing to Twitter.

## Features

- 🎨 **Custom Design**: PP Valve font with uppercase styling
- 📊 **Maker Stats**: Display volume, profit, deposits, currency, and platform
- 🖼️ **Profile Pictures**: Automatically fetches Twitter profile pictures
- 🌈 **Gradient Effects**: Special gradient border for makers with $100k+ volume
- 📱 **Shareable**: Download as PNG or share directly to Twitter
- 🔗 **ENS Support**: Works with both Ethereum addresses and ENS names

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/zkp2p/peer-tcg.git
cd peer-tcg

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. Enter your **Twitter username** (without @)
2. Enter your **wallet address** or **ENS name** (e.g., `0x...` or `name.eth`)
3. Toggle **"Show address on card"** if you want the address displayed
4. Click **"GENERATE MY CARD!"**
5. Download as PNG or share to Twitter

## How It Works

- Fetches your Twitter profile picture via [unavatar.io](https://unavatar.io)
- Resolves ENS names to addresses using Viem
- Queries Peer Protocol maker stats from the Hyperindex GraphQL API
- Generates a card with your stats and profile picture
- Allows you to download or share your card

## Card Features

### Stats Displayed

- **Volume**: Total amount taken (USDC)
- **Profit**: Realized profit in USD
- **Deposits**: Number of fulfilled intents
- **Currency**: Most used currency
- **Platform**: Most used payment method

### Special Effects

Makers with **$100,000+** volume get:
- Gradient border (red to yellow)
- Glow effect
- Gradient text for volume amount

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Viem** - Ethereum library for ENS resolution
- **html-to-image** - Card export functionality
- **PP Valve Font** - Custom typography

## Project Structure

```
peer-card/
├── public/
│   ├── fonts/          # PP Valve font files
│   └── vite.svg
├── src/
│   ├── api.js          # GraphQL API client
│   ├── ens.js          # ENS resolution
│   ├── App.jsx         # Main application
│   ├── App.css         # Component styles
│   ├── index.css       # Global styles & font declarations
│   └── main.jsx        # Entry point
├── package.json
└── README.md
```

## Deployment

This project is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel for automatic deployments.

### Manual Deployment

If auto-deployment isn't working, you can trigger a redeploy by:

```bash
# Create an empty commit
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

Or manually trigger from the Vercel dashboard.

## License

This project is private and proprietary.

## Contributing

This is a private repository. For issues or suggestions, please contact the maintainers.
