# Cooked Product Costing

A Food Technology educational and practical worksheet application for calculating ingredient direct costs, indirect overhead, unit cost per serving, mark-up pricing, batch profit, and generating print-ready A4 worksheets.

## Web & Android APK

- **Live Web App (Vercel)**: Access directly in any modern desktop or mobile browser.
- **Standalone Android APK (GitHub Releases)**: Download the compiled `.apk` file under the [Releases](https://github.com/Pandagaming15/costing/releases) page for 100% offline access in kitchen laboratories without needing cellular data or Wi-Fi.

### How to Install the APK on Android:
1. Tap **Download APK** or go to [Releases](https://github.com/Pandagaming15/costing/releases).
2. Under the latest release **Assets**, download `cooked-product-costing.apk`.
3. Open the downloaded file and tap **Install** (allow installation from your browser if prompted).

## Features

- **CVE Colleges School Worksheet Header**: Includes the official school header banner image and student/group identification fields.
- **Dynamic Ingredient Costing**: Real-time entry of quantity, unit, particulars, and cost in Philippine Pesos (₱), USD, EUR, etc. Add and remove rows as needed.
- **Automated Mathematical Proofs**:
  - Direct ingredient cost summation formula.
  - Unit Cost equation: $(Ingredient\ Cost + \frac{1}{2}\ of\ cost\ of\ ingredients) \div Servings$.
  - Selling price calculation applying mark-up percentage: $Unit\ Cost \times (1 + Mark\text{-}up\ Rate)$.
  - Batch profit and profit per serving computation.
- **Costing Summary**: Clean, formatted breakdown table for quick review.
- **Direct GitHub Releases Redirect**: One-tap navigation from the Vercel web app to GitHub Releases to download the latest Android APK.
- **Export to DOCX, PDF & Print**: Export formatted Microsoft Word documents, downloadable PDFs, or print to A4 paper.
- **Local Persistence**: State automatically persists across page refreshes via `localStorage`.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Capacitor Android
- GitHub Actions CI/CD for APK releases
