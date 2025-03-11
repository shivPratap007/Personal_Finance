# Personal Finance Visualizer

A simple web application for tracking personal finances, providing insights into spending habits, and managing budgets efficiently.

## Features

### 1. Transaction Management

- Add, edit, and delete transactions with details such as amount, date, and description.
- View all transactions in a structured list format.
- Basic form validation to ensure correct data entry.

### 2. Categorization & Insights

- Assign transactions to predefined categories (e.g., Food, Rent, Travel, etc.).
- View a **category-wise pie chart** to analyze spending distribution.
- A **dashboard with summary cards** displaying:
  - Total expenses for the month.
  - Breakdown of expenses by category.
  - Most recent transactions.

### 3. Budgeting & Expense Tracking

- Set **monthly budgets** for different categories.
- Compare **budget vs actual spending** using a visual chart.
- Get **spending insights** to understand trends and optimize expenses.

### 4. Charts & Data Visualization

- **Monthly expenses bar chart** for quick analysis.
- **Category-wise spending pie chart** for better financial insights.
- **Budget tracking comparison** to help in financial planning.

### 5. Tech Stack

- **Frontend:** Next.js, React, shadcn/ui
- **Backend:** MongoDB for data storage
- **Charts & UI Components:** Recharts for data visualization

### 6. Responsive Design & User Experience

- Fully responsive design for desktop and mobile users.
- Well-handled error states and validation.
- Intuitive UI with smooth animations and transitions.

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/personal-finance-visualizer.git
   ```
2. Navigate to the project directory:
   ```sh
   cd personal-finance-visualizer
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables in `.env.local`:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## Deployment

- The project is deployed at: [Live URL](https://your-deployment-url.com)
- The backend is connected with MongoDB for data storage.

## Contributing

If you'd like to contribute, feel free to fork the repository and submit a pull request.

## License

This project is open-source and available under the [MIT License](LICENSE).
