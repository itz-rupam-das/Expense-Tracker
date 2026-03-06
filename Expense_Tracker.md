# Personal Expense Tracker Web Application
## Project Report

### Author
Rupam Das  
BCA Student – MAKAUT  

---

# 1. Project Overview

The **Personal Expense Tracker** is a responsive web application designed to help users track and manage their daily financial expenses. The main objective of this application is to provide users with a simple and efficient way to record daily spending, analyze spending patterns, and control unnecessary expenses.

The system will allow users to add expenses, categorize them, set daily spending limits, and visualize financial data using graphs and charts.

The application will be designed to work on both **mobile devices and desktop browsers** through a responsive web interface.

---

# 2. Objectives

The main objectives of this project are:

- Track **daily expenses**
- Analyze **weekly and monthly spending**
- Provide **visual financial reports**
- Set **daily spending limits**
- Notify the user when spending exceeds the limit
- Provide a **clean, aesthetic, modern user interface**
- Ensure full **mobile and desktop compatibility**

---

# 3. Application Type

| Type | Description |
|-----|-------------|
| Platform | Web Application |
| Devices Supported | Desktop, Tablet, Mobile |
| Interface | Responsive Web UI |
| Architecture | Client-Server Model |

---

# 4. Key Features

## 4.1 Expense Tracking

Users can:

- Add daily expenses
- Categorize expenses (Food, Travel, Bills, Shopping, etc.)
- Enter amount, category, notes, and date
- Edit or delete expenses

Example:

| Date | Category | Amount | Notes |
|-----|------|------|------|
| 05 Jan | Food | ₹120 | Lunch |
| 05 Jan | Travel | ₹40 | Bus |

---

## 4.2 Expense Dashboard

The **dashboard page** will show a quick overview of financial activity including:

- Today's spending
- Weekly spending
- Monthly spending
- Remaining daily limit
- Recent transactions

Dashboard components:

- Summary cards
- Graph charts
- Recent expense list

---

## 4.3 Graph and Chart Analytics

The application will provide **visual data representation** using charts.

Charts include:

### Daily Spending Chart
Shows spending for each day.

### Weekly Spending Chart
Displays expenses for each day of the week.

### Monthly Spending Chart
Shows total monthly spending trends.

### Category Chart
Displays which category consumes the most money.

Charts used:

- Bar Chart
- Line Chart
- Pie Chart

Libraries that may be used:

- Chart.js
- Recharts
- ApexCharts

---

## 4.4 Daily Spending Limit Alert

Users can set a **daily spending limit**.

Example:

Daily Limit = ₹500

If total daily spending exceeds ₹500, the system will:

- Show a **warning notification**
- Display a **limit exceeded message**

Example notification:
⚠ Daily Spending Limit Reached
You have spent ₹520 today.
Your limit was ₹500.


Alert methods:

- On-screen notification
- Pop-up alert

---

# 5. Navigation Structure

The website will include a navigation bar for easy page access.

### Navigation Bar Pages

| Page | Purpose |
|-----|--------|
| Home | Dashboard overview |
| Wallet | Manage expenses |
| Reports | Graphs and analytics |
| Contact | Contact information |
| Settings | Spending limits and preferences |

Navigation layout:

Logo | Home | Wallet | Reports | Contact | Settings

---

# 6. Website Pages Description

## 6.1 Home Page (Dashboard)

Displays overall financial summary.

Components:

- Total expenses today
- Weekly spending summary
- Monthly summary
- Graph charts
- Recent transactions
- Remaining daily limit

Design elements:

- Cards
- Graph widgets
- Clean layout

---

## 6.2 Wallet Page

The wallet page allows users to manage their expenses.

Functions:

- Add new expense
- View expense list
- Edit expense
- Delete expense

Form Fields:

| Field | Description |
|------|-------------|
| Amount | Expense value |
| Category | Expense category |
| Date | Date of expense |
| Notes | Optional description |

---

## 6.3 Reports Page

The reports page will provide detailed financial analysis.

Charts included:

- Daily spending graph
- Weekly spending graph
- Monthly spending graph
- Category breakdown chart

Purpose:

Helps users understand spending patterns.

---

## 6.4 Contact Page

Simple page containing:

- Developer contact details
- Email form for feedback
- Social links (optional)

Example fields:

- Name
- Email
- Message

---

## 6.5 Settings Page

Users can configure preferences.

Options include:

- Set daily spending limit
- Change currency
- Manage categories

Example:


Daily Limit: ₹500
Currency: INR


---

# 7. User Interface Design

The UI will follow a **modern minimal design**.

Design style:

- Soft color palette
- Clean typography
- Card-based layout
- Rounded elements
- Light shadow effects

### UI Components

- Cards
- Charts
- Tables
- Forms
- Navigation bar
- Notifications

Example UI sections:

```bash
+-----------------------+
| Today's Spending ₹240 |
+-----------------------+

+-----------------------+
| Weekly Chart |
| ████ |
| ███████ |
+-----------------------+
```

---

# 8. Responsive Design

The application will be fully responsive.

Responsive behavior:

| Device | Layout |
|------|------|
| Mobile | Vertical stacked layout |
| Tablet | Two column layout |
| Desktop | Multi column dashboard |

Technologies used:

- Flexbox
- CSS Grid
- Media Queries

Framework options:

- Tailwind CSS
- Bootstrap
- Material UI

---

# 9. Technology Stack

## Frontend

Possible technologies:

- HTML5
- CSS3
- JavaScript
- React.js (recommended)

UI Frameworks:

- Tailwind CSS
- Bootstrap

Chart Libraries:

- Chart.js
- Recharts

---

## Backend (Optional but recommended)

- Node.js
- Express.js

Purpose:

- Store user expenses
- Manage database
- Handle user settings

---

## Database

Possible databases:

| Database | Type |
|------|------|
| MongoDB | NoSQL |
| Firebase | Cloud database |
| MySQL | Relational |

Database will store:

- User expenses
- Categories
- Spending limits

---

# 10. Data Structure Example

Expense Object Example:

```json
{
  "amount": 120,
  "category": "Food",
  "date": "2026-01-05",
  "note": "Lunch"
}
```

---

# 11. Notification System

When spending exceeds the limit:

Process:

1. Calculate total daily expenses
2. Compare with daily limit
3. If exceeded → trigger alert

Pseudo logic:

```javascript
if (daily_expense > daily_limit) {
    show_alert("Daily spending limit reached");
}
```
# 12. Security Considerations

- Data validation
- Secure database connection
- Prevent malicious input
- Optional user authentication

# 13. Future Improvements

Possible future features:

- AI spending analysis
- Budget suggestions
- Export reports (PDF / Excel)
- Multiple wallets
- Income tracking
- Mobile app version

# 14. Conclusion

The Personal Expense Tracker Web Application will provide users with a simple yet powerful way to manage their daily finances.

With features such as:

- Expense tracking
- Graph analytics
- Spending limit alerts
- Responsive modern UI

The system will help users make better financial decisions and maintain better control over their spending habits.