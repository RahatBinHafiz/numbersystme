# Number System Lab — Learn • Convert • Visualize

An interactive educational laboratory for learning and visualizing number system conversions (Binary, Octal, Decimal, and Hexadecimal) with manual step-by-step textbook solutions, responsive layouts, and interactive 3D digit blocks.

---

## ✨ Features

- **All 12 Conversion Directions Supported**:
  - Binary (Base 2) $\leftrightarrow$ Decimal (Base 10)
  - Binary (Base 2) $\leftrightarrow$ Octal (Base 8)
  - Binary (Base 2) $\leftrightarrow$ Hexadecimal (Base 16)
  - Decimal (Base 10) $\leftrightarrow$ Octal (Base 8)
  - Decimal (Base 10) $\leftrightarrow$ Hexadecimal (Base 16)
  - Octal (Base 8) $\leftrightarrow$ Hexadecimal (Base 16)
- **Pure Arithmetic Solutions (No Built-ins)**: Derived entirely using fundamental algorithms:
  - Positional place-value expansion ($\sum d_i \times b^i$)
  - Repeated integer division by target base with bottom-up remainder collection ($MSB \leftarrow LSB$)
  - 3-bit (Octal) and 4-bit (Hexadecimal) binary grouping with left zero-padding
  - Direct digit-by-digit expansion to fixed binary chunks
  - 3-step educational binary bridge for Octal $\leftrightarrow$ Hexadecimal
- **Interactive 3D Visualizer**: Three.js WebGL canvas displaying interactive digit blocks, place values, and group clusters with OrbitControls.
- **Mobile-Friendly**: Touch-optimized controls, auto-reflowing grids, and responsive viewports.
- **Dark & Light Mode**: Laboratory dark theme and high-contrast light mode.
- **Unit Tested**: Comprehensive test suite covering all 12 algorithms and edge cases.

---

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Run test suite
npm test

# 4. Build for production
npm run build
```

---

## 🌐 Deploying to Render (Static Site)

1. Push this repository to GitHub.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** $\rightarrow$ **Static Site**.
4. Connect your GitHub repository.
5. Set the build parameters:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
6. Under **Redirects / Rewrites**, add:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
7. Click **Create Static Site**.
