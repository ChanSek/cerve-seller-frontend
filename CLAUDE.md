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

### Claw Marketing Website (`claw/`)
The `claw/` subdirectory is a **separate Vite + React sub-project** for the Claw AI phone agent marketing site (claw.cerve.in). It has its own dependencies and build process, completely independent from the seller CRA app.

```bash
cd claw/
npm install
npm run dev              # Starts Vite dev server on port 5173
npm run build            # Production build to claw/dist/
npm run preview          # Preview production build
```

**Tech stack**: Vite + React 18 + TailwindCSS v3 + Framer Motion + React Router v6
**Pages**: Home (landing), Features, How It Works, Safety, FAQ
**Design**: Dark theme with purple-cyan gradient accents, "by Cerve" branding

### Docker Deployment
- `Dockerfile` - Multi-stage build: seller app (CRA) + claw site (Vite) + nginx
- `DockerfileWithoutSSL` - Alternative without SSL (seller only)
- Build args: `REACT_APP_BASE_URL`, `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `nginx.conf` serves seller at `__domain_name__` and claw at `claw.cerve.in`

## Architecture Overview

### Application Structure
This is a React 18 seller frontend application for an ONDC (Open Network for Digital Commerce) marketplace platform. The app manages seller operations including inventory, orders, returns, and complaints.

### Key Technologies
- **React 18.2** with React Router v6 for navigation
- **Material-UI v5** as primary component library with custom themes
- **TailwindCSS** for utility styling
- **Firebase** for authentication
- **Axios** for API communication with cookie-based auth
- **Sass** for component styling (migrated from deprecated node-sass)
- **react-json-view** for debugging and data visualization

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
- **Product** - Product CRUD, variants, customizations, bulk upload with advanced search and filtering
- **Returns** - Return order processing with status tracking
- **Complaints** - Customer complaint management and resolution
- **Settlement** - Financial settlement tracking  
- **UserListings** - Seller/provider management and verification with enhanced store context
- **CustomMenu** - Menu category and product organization
- **Customizations** - Product customization groups and items
- **Offer** - Promotional offer management
- **GatewayActivity** - Transaction activity monitoring
- **VirtualMall** - Virtual mall management with store slot allocation and grid layout
- **AdminActivity** - Administrative activity monitoring and management
- **CategoryTaxonomy** - ONDC category taxonomy management with attribute mapping

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

## Recent Feature Implementations (August 2025)

### Advanced Product Search & Selection Architecture
- **Modular Hook System** - Refactored `SelectProductDialog.jsx` into specialized custom hooks:
  - `useProductData.js` - Data fetching and state management with category-aware filtering
  - `useProductFilters.js` - Filter state management (subcategories, brands, countries)  
  - `useProductSelection.js` - Product selection logic with variant grouping and GST inheritance
- **Backend-Integrated Filtering** - Migrated from frontend filtering to backend API filtering using `/api/v1/seller/product/search/filtered`
- **Performance Optimizations** - Enhanced scroll debouncing (300ms), smarter initial load logic, and better state cleanup
- **Category-Aware Search** - Search functionality now accepts category parameters for more targeted results

### Enhanced Product Management
- **Optimized Infinite Scroll** - Improved pagination with better loading states and scroll position management
- **Master Product Selection** - Advanced product selection from master catalog with variant support
- **Text Highlighting** - Search terms highlighted in product results using `highlightText` utility
- **Multi-Strategy Filtering** - Backend filtering by brands, countries, and subcategories with pipe-separated values
- **GST Inheritance** - Variant products automatically inherit GST rates from sibling variants
- **Product Grouping** - Products grouped by parent_id for better variant management

### ONDC Category Taxonomy Management  
- **CategoryTaxonomy Module** - New comprehensive module for managing ONDC category structures
- **Multi-Category Support** - Support for all major ONDC categories (RET10-RET18):
  - RET10: Grocery, RET12: Fashion, RET14: Electronics
  - RET15: Appliances, RET16: Home & Kitchen, RET18: Health & Wellness
- **Attribute Mapping** - Dynamic attribute mapping for category-specific product requirements
- **SubCategory Management** - Enhanced subcategory handling with API integration

### Virtual Mall & Store Management Enhancements
- **Store Context Provider** - Enhanced `StoreContext.jsx` for better store state management
- **Store Timing Management** - Improved store timing components with validation
- **Multi-Store Navigation** - Enhanced store switching capabilities in navigation
- **Store Details Optimization** - Streamlined store configuration and validation

### Architecture & Performance Improvements
- **Dependency Updates** - Migrated from deprecated `node-sass` to modern `sass` package
- **Component Modularity** - Split large components into focused, reusable sub-components:
  - `FilterPanel.jsx` - Dedicated filtering interface
  - `SearchControls.jsx` - Search input and controls
  - `ProductList.jsx` - Optimized product listing with scroll handling
  - `SingleProductCard.jsx` / `MultiVariantProductCard.jsx` - Specialized product cards
- **Custom Hook Pattern** - Extracted complex logic into reusable custom hooks for better maintainability
- **API Performance** - Backend filter integration reduces frontend processing and improves response times

### Developer Experience Improvements
- **Enhanced Debugging** - Added `react-json-view` for better data visualization and debugging
- **Improved Error Handling** - Better error boundaries and user feedback in product selection flows
- **Code Organization** - Cleaner separation of concerns with dedicated utility functions and components
- **Consistent State Management** - Standardized state patterns across product management modules

## Technical Implementation Details

### Search & Filter API Integration
- **Filtered Search Endpoint**: `/api/v1/seller/product/search/filtered?category={category}&keyword={keyword}&page={page}&limit={limit}`
- **Master Product List**: `/api/v1/seller/product/master/list?page={page}&limit={limit}`
- **Filter APIs**: `/api/v1/seller/product/master/brands` and `/api/v1/seller/product/master/countries`
- **Filter Parameters**: Supports pipe-separated values for `brands`, `categories`, and `countries` query parameters

### Custom Hook Architecture
- **useProductData**: Manages data fetching, pagination, and product grouping with category awareness
- **useProductFilters**: Handles filter state (Set-based) and API calls for filter options
- **useProductSelection**: Manages product selection state with GST inheritance and variant handling

### Performance Optimizations
- **Debounced Scrolling**: 300ms debounce on infinite scroll to prevent excessive API calls
- **Smart Initial Loading**: Prevents unnecessary API calls during dialog initialization
- **State Cleanup**: Proper cleanup of timeouts and event listeners to prevent memory leaks
- **Backend Filtering**: Moved filter logic to backend for better performance and consistency

## Important Notes

- No linting or type checking commands configured - use standard React Scripts defaults
- Application uses both Material-UI and TailwindCSS - follow existing patterns
- Authentication state is persistent via cookies
- All API calls include automatic 401 handling and redirect to login
- Form components use consistent field configuration patterns found in various `-fields.js` files
- Text highlighting utility supports case-insensitive matching and regex escaping for safe search
- Infinite scroll implementation includes debouncing to prevent excessive API calls
- **New dependency**: `react-json-view` for debugging - ensure it's included in production builds if needed

## Test Coverage Requirement

**Every new file added to this codebase MUST have 100% test coverage (statements, branches, functions, lines).**

### Rules
- No PR may introduce new files without accompanying test files achieving 100% coverage
- Tests must cover every branch: all `if`/`else`, ternary conditions, conditional renders, and event handlers
- For the **Claw sub-project** (`claw/`), use **Vitest + React Testing Library**:
  - Run tests: `cd claw && npm test:run`
  - Run with coverage: `cd claw && npm run test:coverage`
  - Coverage thresholds are enforced in `claw/vite.config.js` — the build fails if below 100%
- For the **main seller app**, use **Jest + React Testing Library** (via `npm test`)
- Mock `framer-motion` using the alias in `claw/vite.config.js` (points to `claw/src/__mocks__/framer-motion.jsx`)
- Wrap React Router-dependent components with `<MemoryRouter>` in tests

### Test file locations
- Claw: `claw/src/__tests__/<mirror-of-src-path>.test.{js,jsx}`
- Main app: alongside source files or in `__tests__` subdirectory