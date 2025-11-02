// Property data types based on backend API response
export interface Property {
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
  coordinates?: {
    latitude: string;
    longitude: string;
  };
  property_details: {
    square_feet: number;
    bedrooms: number;
    bathrooms: number;
    floors?: number;
    property_type: 'casa' | 'condominio' | 'departamento' | 'townhouse' | 'duplex' | 'other';
    year_built?: number;
    lot_size?: string;
    garage_spaces?: number;
  };
  amenities?: {
    has_basement?: boolean;
    has_pool?: boolean;
    has_garden?: boolean;
    features?: string[];
  };
  financial: {
    price: string;
    price_per_sqft?: string;
    monthly_rent?: string | null;
    property_taxes?: string;
  };
  status: 'disponible' | 'pendiente' | 'vendida' | 'rentada';
  metadata?: {
    mls_number?: string;
    listing_agent?: string;
    [key: string]: any;
  };
  owner?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Pagination link structure
export interface PaginationLink {
  url: string | null;
  label: string;
  page?: number | null;
  active: boolean;
}

export interface PropertiesResponse {
  data: Property[];
  meta: {
    total: number | number[]; // Backend returns [current_page_count, total_count]
    filters?: Record<string, any>;
    current_page: number;
    from: number;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
    self: string;
  };
}

export interface PropertyStatsResponse {
  totalProperties: number;
  averagePrice: number;
  totalValue: number;
  byType?: Record<string, number>;
  byStatus?: Record<string, number>;
}

export interface SearchParams {
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
  per_page?: number;
  page?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

// Form data types
export interface CreatePropertyData {
  title: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  square_feet: number;
  bedrooms: number;
  bathrooms: number;
  floors?: number;
  price: number;
  property_type: Property['property_details']['property_type'];
  status?: Property['status'];
  year_built?: number;
  has_basement?: boolean;
  has_pool?: boolean;
  has_garden?: boolean;
  features?: string[];
  metadata?: Record<string, any>;
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  id: string | number;
}