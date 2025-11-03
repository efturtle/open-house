# Open House - Property Management System

A modern, full-stack property management application built with Next.js and Laravel. This system allows real estate professionals to manage property listings, search and filter properties, and handle property information efficiently.

## 🏠 Project Overview

Open House is a comprehensive property management solution that provides:
- Property listing and management
- Advanced search and filtering capabilities
- Responsive design with dark mode support
- Real-time property status tracking
- Multi-environment deployment support

## 🚀 Tech Stack

### Frontend
- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS 4** - Modern utility-first CSS framework
- **ESLint** - Code linting and formatting

### Backend
- **Laravel** - PHP framework (backend API)
- **MySQL/PostgreSQL** - Database (backend)

## 📋 Features

### Property Management
- ✅ View all properties with pagination
- ✅ Advanced search and filtering
- ✅ Property type filtering (Casa, Departamento, Condominio, etc.)
- ✅ Status filtering (Disponible, Pendiente, Vendida, Rentada)
- ✅ Price range filtering
- ✅ Location-based search
- ✅ Bedroom/bathroom filtering

### User Interface
- ✅ Responsive design for all devices
- ✅ Dark mode support
- ✅ Modern card-based property display
- ✅ Interactive search forms
- ✅ Loading states and error handling

### Technical Features
- ✅ TypeScript for type safety
- ✅ Environment-specific configuration
- ✅ API route optimization
- ✅ Error logging and debugging
- ✅ Clean architecture with custom hooks

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Laravel backend API running

### 1. Clone the Repository
```bash
git clone https://github.com/efturtle/open-house.git
cd open-house
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the environment variables
nano .env.local
```

### 4. Configure Backend URL
Edit `.env.local` and set your backend URL:
```bash
# Local development
BACKEND_URL=http://127.0.0.1:8000/api
```

### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🌍 Environment Configuration

The application supports multiple deployment environments:

### Local Development
```bash
BACKEND_URL=http://127.0.0.1:8000/api
NODE_ENV=development
```

### VM Environment (192.168.122.23)
```bash
BACKEND_URL=http://192.168.122.23:8000/api
NODE_ENV=production
```

### Production Environment (18.188.102.108)
```bash
BACKEND_URL=http://18.188.102.108:8000/api
NODE_ENV=production
```

## 📁 Project Structure

```
open-house/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── properties/           # Property API endpoints
│   │       ├── route.ts          # Main properties endpoint
│   │       ├── search/           # Search endpoint (deprecated)
│   │       ├── stats/            # Statistics endpoint
│   │       └── [property]/       # Individual property CRUD
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Home page
├── components/                   # React Components
│   ├── PropertyCard.tsx          # Individual property display
│   └── PropertyList.tsx          # Property list with search
├── hooks/                        # Custom React Hooks
│   └── useProperties.ts          # Property data management
├── lib/                          # Utility Libraries
│   └── api-utils.ts              # API helper functions
├── types/                        # TypeScript Type Definitions
│   └── property.ts               # Property-related types
├── public/                       # Static Assets
│   └── house-placeholder.avif    # Default property image
├── .env.example                  # Environment variables template
├── next.config.ts                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🔧 API Endpoints

### Frontend API Routes
- `GET /api/properties` - Get all properties with optional filters
- `POST /api/properties` - Create new property
- `GET /api/properties/[id]` - Get specific property
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property
- `GET /api/properties/stats` - Get property statistics

### Query Parameters
The `/api/properties` endpoint supports the following filters:
- `page` - Pagination page number
- `per_page` - Items per page
- `property_type` - Filter by type (casa, departamento, condominio, etc.)
- `status` - Filter by status (disponible, pendiente, vendida, rentada)
- `city` - Filter by city
- `bedrooms` - Minimum number of bedrooms
- `bathrooms` - Minimum number of bathrooms
- `min_price` - Minimum price
- `max_price` - Maximum price
- `sort_by` - Sort field (status, price, created_at, etc.)
- `sort_direction` - Sort direction (asc, desc)
- `q` - General search query

### Example API Calls
```bash
# Get all properties
GET /api/properties?page=1

# Filter by property type
GET /api/properties?property_type=casa&page=1

# Filter by status and sort
GET /api/properties?status=disponible&sort_by=price&sort_direction=asc

# Complex search
GET /api/properties?property_type=casa&status=disponible&min_price=100000&max_price=500000&bedrooms=3
```

## 🎨 Components Documentation

### PropertyList Component
The main component that handles property display and search functionality.

**Features:**
- Property grid display
- Search form with multiple filters
- Pagination
- Loading and error states
- Real-time filtering

**Usage:**
```tsx
import PropertyList from '@/components/PropertyList';

export default function HomePage() {
  return <PropertyList />;
}
```

### PropertyCard Component
Individual property display component.

**Props:**
```tsx
interface PropertyCardProps {
  property: Property;
  onPropertyClick?: (property: Property) => void;
}
```

**Features:**
- Property image display
- Price formatting
- Status indicators with color coding
- Property details (bedrooms, bathrooms, area)
- Responsive design

### useProperties Hook
Custom hook for property data management.

**Returns:**
```tsx
{
  data: Property[];
  meta: PropertiesResponse['meta'] | null;
  links: PropertiesResponse['links'] | null;
  loading: boolean;
  error: string | null;
  refetch: (page?: number) => void;
  fetchPage: (page: number) => void;
  currentPage: number;
}
```

**Usage:**
```tsx
const { data, loading, error, refetch } = useProperties();
```

## 🎯 Type Definitions

### Property Type
```tsx
interface Property {
  id: string | number;
  title: string;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    full_address: string;
  };
  property_details: {
    square_feet: number;
    bedrooms: number;
    bathrooms: number;
    property_type: 'casa' | 'condominio' | 'departamento' | 'townhouse' | 'duplex' | 'other';
  };
  financial: {
    price: string;
    price_per_sqft?: string;
  };
  status: 'disponible' | 'pendiente' | 'vendida' | 'rentada';
  created_at: string;
  updated_at: string;
}
```

### Search Parameters
```tsx
interface SearchParams {
  q?: string;
  city?: string;
  property_type?: string;
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
}
```

## 🚀 Deployment

### Building for Production
```bash
npm run build
npm start
```

### Environment-Specific Deployment

**For VM Environment:**
```bash
# Use VM environment file
cp .env.vm .env.local
npm run build
npm start
```

**For Production Environment:**
```bash
# Use production environment file
cp  .env.example .env.production
npm run build
npm start
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Testing Checklist
- [ ] Property list loads correctly
- [ ] Search filters work (property type, status, price range)
- [ ] Pagination functions properly
- [ ] Property cards display all information
- [ ] Responsive design works on mobile/tablet
- [ ] Dark mode toggle functions
- [ ] Error states display appropriately
- [ ] Loading states appear during API calls

---
