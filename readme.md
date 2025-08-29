# CSV Classification Platform

AI-powered CSV file classification and analysis tool built with Next.js, TypeScript, Tailwind CSS, and Radix UI.

## Features

- **CSV Upload:** Upload CSV files for classification.
- **AI Classification:** Mock AI classification of uploaded CSV data.
- **Results Table:** Paginated, searchable, and sortable results table.
- **Toasts & Notifications:** User feedback via toast notifications.
- **Modern UI:** Responsive design using Tailwind CSS and Radix UI components.

## Project Structure
. 
├── app/ # Next.js app directory (routing, pages, API) 
│ ├── api/classify/ # API route for CSV classification 
│ ├── globals.css # Global styles (Tailwind) 
│ ├── layout.tsx # Root layout (includes Toaster) 
│ └── page.tsx # Main page (file upload, results) 
├── components/ # UI and feature components 
│ ├── FileUpload.tsx 
│ ├── ResultsTable.tsx 
│ └── ui/ # UI primitives (toast, button, card, etc.) 
├── hooks/ 
│ └── use-toast.ts # Custom toast notification hook 
├── lib/ 
│ ├── api.ts # API utilities (e.g., classifyFile) 
│ └── utils.ts 
├── public/ 
├── styles/ 
├── tailwind.config.ts # Tailwind CSS configuration 
├── package.json 
└── README.md

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/order-routing-frontend.git
   cd order-routing-frontend
   ```
2. **Install Dependencies:**
  ```sh
  npm install
  # or
  yarn install
  ```

3. **Run the development server:**

  ```sh
  npm run dev
  # or
  yarn dev
  ```

4. **Open http://localhost:3000 in your browser.**
   