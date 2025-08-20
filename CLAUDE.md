# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm start` - Start development server on port 3000
- `npm run build` - Build production bundle 
- `npm test` - Run test suite with Jest/React Testing Library
- `npm run eject` - Eject from Create React App (irreversible)

### Environment Setup
- Copy `.env` file and configure `REACT_APP_BASE_URL` and `REACT_APP_SELLER_BACKEND_URL`
- For local development, typically uses `http://localhost:9090/`
- Firebase config requires `REACT_APP_FIREBASE_API_KEY` and `REACT_APP_FIREBASE_AUTH_DOMAIN`

### Docker Deployment
- `Dockerfile` - Production build with nginx
- `DockerfileWithoutSSL` - Alternative without SSL
- Build args: `REACT_APP_BASE_URL`, `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`

## Architecture Overview

### Application Structure
This is a React 18 seller frontend application for an ONDC (Open Network for Digital Commerce) marketplace platform. The app manages seller operations including inventory, orders, returns, and complaints.

### Key Technologies
- **React 18.2** with React Router v6 for navigation
- **Material-UI v5** as primary component library with custom themes
- **TailwindCSS** for utility styling
- **Firebase** for authentication
- **Axios** for API communication with cookie-based auth
- **SCSS/Sass** for component styling

### Authentication Flow
- Token-based authentication with automatic 401 handling
- `PrivateRoute` wrapper checks `isLoggedIn()`, `getSellerActive()`, and `isSuperAdmin()`
- Unauthorized users redirected to `/login`
- Session management in `src/utils/validateToken.js`
- Auth state managed via `AuthProvider` context

### Core Module Architecture

#### API Layer (`src/Api/`)
- `axios.js` - HTTP client with interceptors for auth and error handling
- `firebase-init.js` - Firebase configuration
- Centralized error handling with automatic logout on 401

#### Routing (`src/Router/`)
- `Router.jsx` - Main route definitions with private route protection  
- `PrivateRoutes.jsx` - Authentication wrapper component
- `AuthProvider.js` - Authentication context provider

#### Application Modules (`src/Components/Application/`)
- **Orders** - Order management, details, status updates, cancellation
- **Inventory** - Product inventory management with Excel download
- **Product** - Product CRUD, variants, customizations, bulk upload with paginated search and master product selection
- **Returns** - Return order processing with status tracking
- **Complaints** - Customer complaint management and resolution
- **Settlement** - Financial settlement tracking  
- **UserListings** - Seller/provider management and verification
- **CustomMenu** - Menu category and product organization
- **Customizations** - Product customization groups and items
- **Offer** - Promotional offer management
- **GatewayActivity** - Transaction activity monitoring
- **VirtualMall** - Virtual mall management with store slot allocation and grid layout
- **AdminActivity** - Administrative activity monitoring and management

#### Layout System
- `AppLayout` provides consistent navigation and layout structure
- `Navbar` with Material-UI AppBar and sidebar toggle
- `Sidebar` navigation component
- Conditional layout rendering based on user role (seller vs super admin)

### State Management Patterns
- React hooks (`useState`, `useEffect`) for local component state
- Custom hooks in `src/hooks/` for reusable logic
- Context providers for auth state
- Form state managed via custom `useForm` hook

### Data Flow
- API calls through centralized axios wrapper functions (`getCall`, `postCall`, etc.)
- Automatic cookie-based session management
- Toast notifications via `cogo-toast` for user feedback
- Real-time data updates through polling patterns

### Styling Architecture  
- Material-UI theme customization
- SCSS modules for component-specific styles
- TailwindCSS utilities for layout and spacing
- Consistent color scheme defined in `src/Components/Shared/Colors.js`

### Key Utilities
- Form validation in `src/utils/validations.js`
- Date/string formatting utilities
- Search debouncing and filtering
- Multi-checkbox selection components
- Dynamic input rendering based on field configurations
- **Text highlighting** - `src/utils/textHighlight.js` for highlighting search terms in results
- **Infinite scroll** - Paginated search implementation with infinite scroll capability
- **Product filtering** - Advanced filtering options in product selection dialogs

## Environment Configuration

The application expects these environment variables:
- `REACT_APP_BASE_URL` - Backend API base URL
- `REACT_APP_SELLER_BACKEND_URL` - Seller-specific backend URL  
- `REACT_APP_FIREBASE_API_KEY` - Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN` - Firebase auth domain

## Recent Feature Implementations

### Enhanced Product Management
- **Paginated Search with Infinite Scroll** - Product search now supports pagination with infinite scroll functionality
- **Master Product Selection** - Users can select from master product catalog when adding new products
- **Text Highlighting** - Search terms are highlighted in product results using `highlightText` utility
- **Advanced Filtering** - Product selection dialogs include comprehensive filtering options by category, subcategory, and other attributes
- **Multi-store Support** - Enhanced support for managing products across multiple stores

### Virtual Mall Module
- **Mall Grid Layout** - Visual grid interface for managing virtual mall store slots
- **Store Slot Management** - Ability to allocate and manage store positions within virtual malls
- **Store Details Integration** - Comprehensive store information management within virtual mall context

### Search & Discovery Enhancements
- **Fuzzy Search** - Improved search algorithms with better matching capabilities
- **Category-based Filtering** - Enhanced filtering by product categories and subcategories
- **Real-time Search Highlighting** - Live highlighting of search terms as users type

### UI/UX Improvements
- **Enhanced Product Cards** - Improved product display cards with better visual hierarchy
- **Loading States** - Better loading indicators and skeleton screens
- **Responsive Design** - Improved mobile and tablet responsiveness

## Important Notes

- No linting or type checking commands configured - use standard React Scripts defaults
- Application uses both Material-UI and TailwindCSS - follow existing patterns
- Authentication state is persistent via cookies
- All API calls include automatic 401 handling and redirect to login
- Form components use consistent field configuration patterns found in various `-fields.js` files
- Text highlighting utility supports case-insensitive matching and regex escaping for safe search
- Infinite scroll implementation includes debouncing to prevent excessive API calls