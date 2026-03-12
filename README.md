<div align="center">

<!-- Hero Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=💰%20Personal%20Expense%20Tracker&fontSize=36&fontColor=ffffff&animation=fadeIn&fontAlignY=32&desc=Track%20•%20Analyze%20•%20Budget%20•%20Save&descSize=16&descAlignY=52" width="100%"/>

<br/>

<!-- Badges Row 1 -->
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Chart.js-4-FF6384?style=for-the-badge&logo=chart.js&logoColor=white" />
<img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" />

<br/><br/>

<!-- Badges Row 2 -->
<a href="https://itz-rupam-das.github.io/Expense-Tracker/"><img src="https://img.shields.io/badge/🌐_Live_Demo-Click_Here-8B5CF6?style=for-the-badge" /></a>
<a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-34D399?style=for-the-badge" /></a>
<img src="https://img.shields.io/github/stars/itz-rupam-das/Expense-Tracker?style=for-the-badge&color=fbbf24&logo=github" />

<br/>

<p>
  <i>A sleek, modern expense tracking web app with income management, interactive charts,<br/>
  smart budget alerts, spending insights, and cloud synchronization — powered by Supabase.</i>
</p>

<a href="https://itz-rupam-das.github.io/Expense-Tracker/">
  <img src="https://img.shields.io/badge/▶_TRY_IT_NOW-itz--rupam--das.github.io/Expense--Tracker-8B5CF6?style=for-the-badge&logoColor=white" />
</a>

</div>

<br/>

---

## ✨ Features Update (v2.1)

> 🚀 **Advanced Financial Control** — Now with full Supabase integration and enhanced profile management!

<table>
<tr>
<td width="50%">

🔐 **Supabase Authentication** (Secure Sign-up/Login)
☁️ **Real-time Cloud Sync** (Multi-device access)
🖼️ **Profile Management** (Avatar upload & Smart Crop)
🆕 **Income Tracking & Net Balance**
🔍 **Search, Date & Type Filters**
📤 **CSV Export (Wallet & Reports)**

</td>
<td width="50%">

💡 **Auto-Generated Spending Insights**
📊 **Doughnut & Line Analytics Charts**
💾 **JSON Data Backup & Restore**
🎯 **Per-Category Monthly Budgets**
📱 **Refined Mobile UI** (Less congestion, more focus)

</td>
</tr>
</table>

---

## 🎯 Features at a Glance

<details>
<summary><b>📊 Dashboard</b> — Your financial command center</summary>
<br/>

| Feature | Description |
|---------|-------------|
| 💳 Summary Cards | Today's Spending, This Week, This Month, Remaining Limit, **Net Balance** |
| 📈 Weekly Chart | 7-day bar chart with currency-aware tooltips |
| 🍩 Category Doughnut | Visual breakdown of where your money goes |
| 🎯 Budget Bars | Monthly progress indicators (Yellow → Red alerts) |
| 💡 Insights | Smart tips comparing current spending to previous periods |
| 📋 Recent List | Last 5 transactions with color-coded status |

</details>

<details>
<summary><b>💼 Wallet</b> — Full transaction management</summary>
<br/>

| Feature | Description |
|---------|-------------|
| ➕ Add Transaction | Record Expenses and Income with categories and dates |
| 🔍 Search & Filter | Real-time search + Category/Type/Date range filtering |
| ✏️ Inline Editing | Edit existing transactions directly in the list |
| 📥 Export | Download your transaction history as `.csv` |
| 🔁 Recurring | Manage repeating expenses easily |

</details>

<details>
<summary><b>👤 Profile & Customization</b></summary>
<br/>

| Feature | Description |
|---------|-------------|
| 🖼️ Avatar Upload | Upload custom profile pictures directly to Supabase Storage |
| ✂️ Smart Crop | Built-in image cropper for perfect profile circles |
| 📝 Bio | Personalize your profile with a name and bio |
| ☁️ Cloud Sync | Your settings and transactions are saved to your account |

</details>

<details>
<summary><b>📈 Reports & Analytics</b></summary>
<br/>

| Chart | Description |
|-------|-------------|
| 📈 Multi-Chart View | Daily trends, Weekly comparisons, and Monthly growth |
| ⚖️ Income vs Expenses | Direct visual comparison of your earnings vs spending |
| 📥 Full Export | Export all analytics data for external review |

</details>

<details>
<summary><b>⚙️ Settings & Theme</b></summary>
<br/>

| Feature | Description |
|---------|-------------|
| 🌙 Theme Toggle | Global Dark/Light mode toggle in the top Navbar |
| 💰 Spending Limit | Set your global daily currency and limit |
| 🎯 Budgets | Manage specific monthly budgets for every category |
| 💾 Data Portability | Export/Import your entire history as `.json` |

</details>

---

## 🛠️ Tech Stack

<div align="center">

| | Technology | Purpose |
|---|-----------|---------|
| ⚛️ | **React 19** | Modern UI library |
| ⚡ | **Vite 6** | Fast build tool & Dev server |
| 📊 | **Chart.js 4** | Interactive data visualization |
| ☁️ | **Supabase** | Cloud Database, Auth & Storage |
| 🖼️ | **React Image Crop** | Client-side image manipulation |
| 🎨 | **Lucide React** | Sleek icon system |
| 📱 | **PWA** | Installable mobile experience |

</div>

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/itz-rupam-das/Expense-Tracker.git
cd Expense-Tracker

# 2. Install dependencies
npm install

# 3. Create .env.local
# Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 4. Start dev server
npm run dev
```

---

## 📁 Project Structure

```
src/
├── 🧩 components/
│   ├── Navbar.jsx          # Top navigation with theme toggle
│   ├── BottomNav.jsx       # Mobile-optimized bottom navigation
│   └── SummaryCard.jsx     # Dashboard visualization components
│
├── 🧠 context/
│   ├── AuthContext.jsx     # Supabase Auth management
│   ├── ExpenseContext.jsx  # Core logic & Supabase sync
│   └── ThemeContext.jsx    # Global styling state
│
├── 📄 pages/
│   ├── Home.jsx            # Dynamic Dashboard
│   ├── Wallet.jsx          # Transaction management
│   ├── Reports.jsx         # Detailed analytics
│   ├── Profile.jsx         # User profile & avatar management
│   └── Settings.jsx        # App preferences & budgets
│
└── App.jsx                 # Routing & App entry
```

---

## 🎨 Design Philosophy

<table>
<tr>
<td align="center">🌑<br/><b>Dark-First</b><br/><sub>Glassmorphism</sub></td>
<td align="center">☀️<br/><b>Light Mode</b><br/><sub>Soft & Clean</sub></td>
<td align="center">✍️<br/><b>Outfit Font</b><br/><sub>Modern type</sub></td>
<td align="center">📱<br/><b>Mobile-First</b><br/><sub>Responsive gestures</sub></td>
<td align="center">✨<br/><b>Animations</b><br/><sub>Framer-style flows</sub></td>
</tr>
</table>

---

## 🤝 Contributing

1. **Fork** the project
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

