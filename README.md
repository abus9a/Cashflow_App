# Cashflow Panel for Small Businesses

A lightweight financial dashboard built with Next.js. This application helps small business owners track their current balances, manage planned transactions, and visually forecast potential cash gaps before they happen.

## Features

* Role-Based Access Control (Mock Auth):
    * Owner: Has access to high-level KPIs and the visual cashflow forecasting chart.
    * Accountant: Has access to the data entry form to add, delete, and update transaction statuses.
* Interactive Cashflow Forecast: An area chart that calculates the running balance for the next 15 days based on planned transactions.
* Cash Gap Alerts: Highlights dates where the balance drops below zero, warning of upcoming deficits.
* Transaction Registry: A comprehensive table of all operations with visual indicators for overdue payments.
* Data Persistence: Uses browser localStorage to save transactions across page reloads.

## Tech Stack

* Framework: Next.js (React)
* Styling: Tailwind CSS
* Charts: Recharts
* Icons: Lucide React
* Date Management: date-fns

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have Node.js installed (version 18+ recommended).

### Installation

1. Navigate to the project directory:
   ```bash
   cd cashflow-panel
Install the required dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
Open your browser and navigate to:

Plaintext
http://localhost:3000
How to Use
Login Screen: Upon opening the app, choose to log in as either the Owner or the Accountant.

Accountant Workflow:

Enter new expected income or expenses using the form.

Hover over the operations registry to reveal action buttons.

Click the check button to mark a planned transaction as Paid.

Click the trash button to delete a transaction.

Owner Workflow:

Review the top KPI cards for a quick financial summary.

Analyze the Cashflow Forecast chart. If the line dips below the red dashed line, a Cash Gap is approaching.

Roadmap
Connect to a real backend (PostgreSQL + Node.js).

Implement real JWT authentication.

Add transaction categories and pie chart analytics.

Export/Import data via CSV or Excel.