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

## ✨ What's New (v2.0)

> 🚀 **15 major features** added in the latest update — from income tracking to smart insights!

<table>
<tr>
<td width="50%">

🆕 **Income Tracking & Net Balance**
🔍 **Search, Date & Type Filters**
📤 **CSV Export (Wallet & Reports)**
💾 **JSON Data Backup & Restore**
☁️ **Supabase Cloud Sync & Auth**
🎯 **Per-Category Monthly Budgets**

</td>
<td width="50%">

💡 **Auto-Generated Spending Insights**
📊 **Doughnut Analytics Charts**
🔁 **Recurring Expenses (Auto-Add)**
📱 **Refined Mobile UI & Custom Overlays**
➕ **Global Floating Action Button**

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
| 💳 Summary Cards | Today's Spending, This Week, This Month, Remaining Limit (with emoji indicators), **Net Balance** |
| 📈 Weekly Chart | 7-day bar chart with currency-aware tooltips |
| 🍩 Category Doughnut | Visual, modern breakdown of where your money goes |
| 🎯 Budget Bars | Per-category progress bars that turn yellow → red as limits approach |
| 💡 Insights | Auto-generated tips like *"You spent 40% more this week"* |
| ➕ Global Add Button | Floating action button to record transactions instantly from anywhere |
| 📋 Recent List | Last 5 transactions with income/expense color coding |

</details>

<details>
<summary><b>💼 Wallet</b> — Full transaction management</summary>
<br/>

| Feature | Description |
|---------|-------------|
| ➕ Add Transaction | Record **Expenses** and **Income** with category, date, notes |
| ✨ Smart Forms | Forms automatically hide inapplicable fields (e.g. Income categories) |
| ✏️ Inline Editing | Click any row → edit in-place → Enter to save |
| ↩️ Undo Delete | Toast with Undo button (5s auto-dismiss) + `Ctrl+Z` |
| 🔍 Search | Real-time filter by notes or category name |
| 🏷️ Multi-Filter | Category + Type (Income/Expense) + Date Range perfectly scaled on Mobile |
| 📥 CSV Export | Download filtered transactions as `.csv` |
| 🔁 Recurring | Mark as Daily / Weekly / Monthly — auto-added on app load |

</details>

<details>
<summary><b>📈 Reports</b> — Deep spending analytics</summary>
<br/>

| Chart | Description |
|-------|-------------|
| 📉 Daily Line | Last 7 days with smooth curves and data points |
| 📊 Weekly Horizontal | Last 4 weeks with purple gradient bars |
| 📊 Monthly Vertical | Last 6 months with teal/emerald theme |
| 🍩 Category Doughnut | Modern all-time category breakdown with sharp legends |
| ⚖️ Income vs Expenses | Side-by-side monthly comparison (green vs red) |
| 🎯 Budget vs Actual | How you're doing against your category budgets |
| 💡 Insights | Same smart tips as the Dashboard |
| 📥 CSV Export | Download all report data |

</details>

<details>
<summary><b>⚙️ Settings</b> — Full control over your experience</summary>
<br/>

| Feature | Description |
|---------|-------------|
| 🌙 Theme Toggle | Dark ↔ Light mode with smooth transitions |
| 💰 Spending Limit | Set daily limit in INR / USD / EUR / GBP |
| 🎯 Category Budgets | Monthly limits per category (Food, Travel, Bills, etc.) |
| 📂 Manage Categories | Add / remove custom categories |
| 💾 Export Backup | Download all data as `.json` |
| 📤 Import Backup | Restore from a previous backup (with safety confirmation) |
| ⚠️ Danger Zone | Reset all data with confirmation |

</details>

<details>
<summary><b>⌨️ Keyboard Shortcuts</b></summary>
<br/>

| Key | Action |
|-----|--------|
| `N` | Navigate to Wallet → Open Add Transaction form |
| `Escape` | Close any open modal or form |
| `Ctrl+Z` | Undo last deleted transaction |

</details>

---

## 🛠️ Tech Stack

<div align="center">

| | Technology | Purpose |
|---|-----------|---------|
| ⚛️ | **React 19** | Component-based UI |
| ⚡ | **Vite 6** | Lightning-fast builds |
| 📊 | **Chart.js 4** | Interactive visualizations |
| 🧭 | **React Router** | Client-side navigation |
| 🎨 | **Lucide React** | Beautiful icon system |
| ☁️ | **Supabase** | Backend Auth & Database |
| 🐘 | **PostgreSQL** | Relational cloud storage |
| 📱 | **PWA Manifest** | Installable web app |

</div>

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/itz-rupam-das/Expense-Tracker.git
cd Expense-Tracker

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open in browser
# → http://localhost:5173/Expense-Tracker/
```

### 📦 Build for Production
```bash
npm run build
# Output → dist/ folder, ready for deployment
```

---

## 📁 Project Structure

```
src/
├── 🧩 components/
│   ├── Navbar.jsx          # Navigation bar
│   ├── Notification.jsx    # Spending limit popup alert
│   └── SummaryCard.jsx     # Dashboard card component
│
├── 🧠 context/
│   ├── ExpenseContext.jsx  # State, computed values, helpers
│   └── ThemeContext.jsx    # Dark / Light theme
│
├── 📄 pages/
│   ├── Home.jsx            # Dashboard + charts + insights
│   ├── Wallet.jsx          # Transactions + search + filters
│   ├── Reports.jsx         # Analytics + charts
│   ├── Settings.jsx        # Preferences + budgets + backup
│   └── Contact.jsx         # Developer info + feedback
│
├── App.jsx                 # Routing + keyboard shortcuts
├── index.css               # Design system + theme tokens
└── main.jsx                # Entry point
```

---

## 🎨 Design Philosophy

<table>
<tr>
<td align="center">🌑<br/><b>Dark-First</b><br/><sub>Glassmorphism & gradients</sub></td>
<td align="center">☀️<br/><b>Light Mode</b><br/><sub>Clean, soft, readable</sub></td>
<td align="center">✍️<br/><b>Inter Font</b><br/><sub>Premium typography</sub></td>
<td align="center">📱<br/><b>Responsive</b><br/><sub>Desktop · Tablet · Mobile</sub></td>
<td align="center">✨<br/><b>Animations</b><br/><sub>Fade, scale, slide</sub></td>
</tr>
</table>

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. **Fork** the project
2. **Create** your feature branch — `git checkout -b feature/AmazingFeature`
3. **Commit** your changes — `git commit -m 'Add AmazingFeature'`
4. **Push** to the branch — `git push origin feature/AmazingFeature`
5. **Open** a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full details.

---

<div align="center">

## 👤 Developer

<img src="https://github.com/itz-rupam-das.png" width="100" style="border-radius:50%"/>

**Rupam Das**
BCA Student — MAKAUT

<a href="https://github.com/itz-rupam-das"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a>
<a href="https://www.linkedin.com/in/rupam-das-kolkata"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
<a href="https://www.instagram.com/itz_rupam_das"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" /></a>
<a href="mailto:rdas4098@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>

<br/><br/>

⭐ **If you found this useful, give it a star!** ⭐

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

</div>
