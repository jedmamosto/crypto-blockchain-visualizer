# ⛓️ Blockchain Visualizer

An interactive, educational demonstration of how blockchain technology works. Explore core concepts like hashing, Proof of Work (PoW), and chain integrity through a modern, responsive web interface.

## 🚀 Key Features

- **Mining Engine**: Experience Proof of Work by mining new blocks with adjustable difficulty levels.
- **Visual Chain**: A real-time, color-coded visualization of the blockchain. Each block's hash visually connects it to the next.
- **Tampering Simulation**: Edit any block's data and watch the entire chain invalidate instantly as hashes break and cryptographic links fail.
- **Mobile Responsive**: Fully optimized for all devices with adaptive layouts.
- **Transaction Ledger**: A simplified block explorer view to track all data recorded on the chain.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Hashing**: [crypto-js](https://www.npmjs.com/package/crypto-js)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🏃 Launching Locally

1. **Clone the repository**

2. **Install dependencies**:

```bash
npm install
```

3. **Run the development server**:

```bash
npm run dev
```

4. **Open in browser**: Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

- `src/lib/`: Core blockchain logic (`Block.ts`, `Blockchain.ts`).
- `src/components/`: Reusable UI components (`BlockCard.tsx`).
- `app/`: Next.js pages and global styles.

## 📄 License

Educational Use Only.
