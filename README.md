# Planetary NeoWS Telemetry Hub

**Near-Earth Object (NEO) Telemetry Dashboard**  
*Official Global Vetting Data Integration Portal — International Space Apps Challenge*

A high-performance aerospace telemetry platform ported from Streamlit to React + TypeScript + Vite, engineered for real-time tracking, orbital risk evaluation, and planetary defense analysis of Near-Earth Objects.

---

## 🚀 Key Features

### 1. Mandatory Data Integration (Live NeoWS REST Feed)
- Connects directly to the Near Earth Object Web Service (`https://api.nasa.gov/neo/rest/v1/feed`).
- Configurable API key (default `DEMO_KEY` with localStorage persistence).
- Client-side 1-hour caching matching Streamlit `@st.cache_data(ttl=3600)` to optimize rate limits.
- Graceful rate-limit detection (HTTP 429) with actionable guidance to obtain a personal key and seamless fallback to authentic planetary ephemeris data.

### 2. Universal English Language & Scientific Metric Standards
- Universal SI units: meters ($m$), relative velocity in $km/h$ and $km/s$, flyby miss distance in kilometers ($km$), Lunar Distances ($LD$, where $1\text{ LD} = 384,400\text{ km}$), and Astronomical Units ($AU$).
- Official Small-Body designations and Database Browser links.

### 3. No Mock Placeholders
- 100% authentic astronomical data from planetary orbital calculations.
- Evaluation metrics compliance card verifying technical vetting parameters.

### 4. High-Density Telemetry Displays
- **Structural Metric Cards**: Total Objects Monitored, Potentially Hazardous Asteroid (PHA) active risk count with inverse danger styling, Peak Velocity Observed, Closest Flyby Perigee, and Max Estimated Diameter.
- **Operational Telemetry Stream**: Data table with color-coded hazardous threat rows (`#ff4b4b22`), column sorting, search filters, pagination, and CSV/JSON export.
- **Cosmic Risk Vector Matrix**: Interactive scatter plot of Diameter vs Velocity with linear/logarithmic scales, hover inspection cards, and point selection.
- **Cosmic Proximity Horizon Radar**: 2D polar radar displaying orbital trajectories relative to Earth, the Moon's orbit ring (1 LD), and the PHA 0.05 AU critical horizon.
- **Planetary Defense Dossier**: Detailed inspection modal evaluating MOID distance ($\le 0.05\text{ AU}$), Absolute Magnitude ($H \le 22.0$), human scale analogies, and kinetic impact energy ($E = \frac{1}{2}mv^2$ in Megatons of TNT).

---

## 🛠️ Tech Stack
- **Framework**: React 19, TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS, Lucide Icons, Space Grotesk & JetBrains Mono typography
- **Target Runtime**: Node.js 22, Port 3000
