# Procurement Hub

A modern procurement and vendor management platform designed to streamline purchasing operations, vendor collaboration, approval workflows, and financial tracking.

## Overview

Procurement Hub provides organizations with a centralized system to manage the entire procurement lifecycle, from vendor onboarding and RFQ creation to purchase orders, approvals, and invoice tracking.

The platform helps procurement teams improve visibility, reduce manual processes, and make data-driven purchasing decisions.



## Features

### Vendor Management
- Vendor registration and onboarding
- Vendor profile management
- Supplier information tracking
- Vendor performance monitoring

### RFQ Management
- Create and manage Request for Quotations (RFQs)
- Track active RFQs
- Manage supplier responses
- Compare vendor quotations

### Quotation Management
- Submit and review quotations
- Compare pricing and terms
- Vendor quotation tracking

### Purchase Orders
- Create purchase orders
- Track order status
- Approval-based order processing
- Procurement workflow automation

### Approval Workflow
- Multi-stage approval process
- Pending approval tracking
- Approval status monitoring
- Audit-friendly workflow management

### Invoice Management
- Invoice submission and tracking
- Payment status monitoring
- Unpaid invoice tracking
- Spend analysis support

### Dashboard & Analytics
- Vendor statistics
- Procurement performance metrics
- Spend tracking
- Category-wise expenditure analysis
- Monthly spending trends
- Recent activity monitoring



## Technology Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- Drizzle ORM
- PostgreSQL

### Package Management
- PNPM



## Project Structure


Procurement-Hub/
│
├── artifacts/
│   ├── api-server/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── middlewares/
│   │   │   └── lib/
│   │
│   └── mockup-sandbox/
│       ├── src/
│       ├── components/
│       └── hooks/
│
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── README.md




## API Modules

The backend provides APIs for:

- Vendors
- RFQs
- Quotations
- Purchase Orders
- Approvals
- Invoices
- Dashboard Analytics
- Health Monitoring



## Installation

### Prerequisites

- Node.js (v18 or later)
- PNPM

### Clone Repository

bash
git clone https://github.com/your-username/Procurement-Hub.git
cd Procurement-Hub


### Install Dependencies

bash
pnpm install


### Run Development Server

bash
pnpm run dev


### Build Project

bash
pnpm run build




## Dashboard Metrics

The system provides insights including:

- Total Vendors
- Active RFQs
- Pending Approvals
- Open Purchase Orders
- Unpaid Invoices
- Monthly Spend
- Category-wise Spend
- Savings Percentage
- On-Time Delivery Rate



## Future Enhancements

- Role-Based Access Control (RBAC)
- Email Notifications
- Vendor Performance Scorecards
- Contract Management
- Procurement Forecasting
- AI-Powered Spend Analysis
- Multi-Tenant Support



## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request



## License

This project is licensed under the MIT License.



## Author

Developed as a Procurement Management Solution for modern purchasing and supplier management workflows.
