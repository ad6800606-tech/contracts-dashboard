SaaS Contracts Dashboard
A modern, React-based contracts management dashboard with AI-powered insights for SaaS applications. This project provides a comprehensive solution for managing contract portfolios, tracking renewals, and analyzing risks.

 Features:
Core Functionality
Contract Portfolio Management - View, search, and filter contracts
AI-Powered Risk Assessment - Automated risk scoring and recommendations
Real-time Dashboard - Live statistics and trend monitoring
Advanced Search & Filtering - Multi-criteria contract discovery
Responsive Design - Mobile-first, cross-device compatibility
Dashboard Components
Statistics Overview - Total contracts, active count, portfolio value, renewal alerts
Interactive Data Table - Sortable columns, pagination, action menus
Contract Details - Comprehensive contract information and clauses
AI Insights Panel - Risk analysis and evidence-based recommendations
File Upload System - Drag-and-drop contract document management

🛠️ Tech Stack
Frontend: React 18+ (Functional Components & Hooks)
Styling: Tailwind CSS
Icons: Lucide React
State Management: React Context API
Build Tool: Vite
Deployment: Vercel ready
📁 Project Structure
contract-dashboard/
├── public/
│   ├── contracts.json          # Mock contract data
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── ContractsDashboard.jsx    # Main dashboard component
│   │   │   ├── ContractsTable.jsx        # Data table component
│   │   │   └── ContractDetail.jsx        # Contract details view
│   │   ├── auth/
│   │   │   └── LoginPage.jsx             # Authentication component
│   │   ├── upload/
│   │   │   └── UploadModal.jsx           # File upload component
│   │   └── shared/                       # Reusable UI components
│   ├── context/
│   │   └── AppContext.jsx                # Global state management
│   ├── utils/
│   │   └── formatters.js                 # Data formatting utilities
│   ├── App.jsx                           # Main application component
│   └── index.jsx                         # Application entry point
├── index.html                            # HTML template
├── package.json                          # Dependencies and scripts
├── tailwind.config.js                    # Tailwind configuration
└── README.md                            # Project documentation

 Getting Started
Prerequisites
Node.js (v16 or higher)
npm  package manager

Installation
Clone the repository
bash
   git clone https://github.com/your-username/contract-dashboard.git
   cd contract-dashboard
Install dependencies
bash
   npm install
   # or
   yarn install
Start development server
bash
   npm run dev
   # or
   yarn dev
Open your browser Navigate to http://localhost:5173
Build for Production
bash
npm run build
# or
yarn build
   Authentication
The application includes mock authentication:

Username: Any valid username
Password: test123
JWT Token: Stored in localStorage for session management
📊 Data Structure
Contract Object
javascript
{
  "id": "CTR-001",
  "name": "Master Service Agreement",
  "parties": "Company A & Company B",
  "startDate": "2024-01-15",
  "expiry": "2025-01-15",
  "status": "Active",
  "risk": "Low",
  "value": "$2.5M",
  "clauses": [
    {
      "title": "Termination Clause",
      "summary": "Contract termination conditions...",
      "confidence": 0.95
    }
  ],
  "insights": [
    {
      "type": "risk",
      "severity": "medium",
      "message": "Renewal required within 90 days"
    }
  ]
}
UI/UX Features
Design System
Modern Glassmorphism - Translucent backgrounds with blur effects
Consistent Color Palette - Status-based color coding
Responsive Grid System - Mobile-first responsive design
Interactive Elements - Hover states, transitions, and animations
Status Color Coding
 Active: Green (bg-green-50 text-green-700)
 Expired: Red (bg-red-50 text-red-700)
 Renewal Due: Amber (bg-amber-50 text-amber-700)
Risk Level Indicators
 High Risk: Red with warning icon
 Medium Risk: Amber with caution icon
 Low Risk: Green with check icon
 Configuration
Environment Variables
Create a .env file in the root directory:

env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=SaaS Contracts Dashboard
VITE_MOCK_API=true
Tailwind Configuration
The project uses custom Tailwind configuration for:

Extended color palette
Custom font families (Inter)
Responsive breakpoints
Animation utilities
 Responsive Breakpoints
css
/* Mobile First Approach */
sm: '640px'    /* Small devices */
md: '768px'    /* Medium devices */
lg: '1024px'   /* Large devices */
xl: '1280px'   /* Extra large devices */
2xl: '1536px'  /* 2X large devices */
 Testing
Available Scripts
bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
 Deployment
Vercel Deployment
Connect your GitHub repository to Vercel
Configure build settings:
Build Command: npm run build
Output Directory: dist
Deploy automatically on push to main branch
Netlify Deployment
Connect repository to Netlify
Set build command: npm run build
Set publish directory: dist
Deploy with continuous integration
 Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
Code Style Guidelines
Use functional components with hooks
Follow Tailwind CSS utility-first approach
Implement proper error boundaries
Write descriptive commit messages
Add JSDoc comments for complex functions
 API Integration
Mock API Endpoints
javascript
// Contracts endpoint
GET /contracts.json
// Returns: { contracts: Contract[] }

// Contract details
GET /contracts/:id
// Returns: Contract

// Upload endpoint (mocked)
POST /upload
// Returns: { success: boolean, fileId: string }
 State Management
The application uses React Context API for global state management:

javascript
// AppContext provides:
- currentPage: string
- selectedContract: Contract | null
- user: User | null
- setCurrentPage: (page: string) => void
- setSelectedContract: (contract: Contract) => void
- setUser: (user: User) => void

 Performance Optimizations
Code Splitting - Dynamic imports for route-based splitting
Lazy Loading - Components loaded on demand
Memoization - React.memo for expensive components
Virtual Scrolling - For large contract lists
Image Optimization - Responsive images with proper sizing
 Troubleshooting
Common Issues
Development server won't start

bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
Build fails

bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
Styles not loading

bash
# Rebuild Tailwind CSS
npm run build-css




