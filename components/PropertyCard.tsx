import { Property } from '../types/property';

interface PropertyCardProps {
  property: Property;
  onPropertyClick?: (property: Property) => void;
}

export default function PropertyCard({ property, onPropertyClick }: PropertyCardProps) {
  const formatPrice = (priceString: string) => {
    const price = parseFloat(priceString);
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const translatePropertyType = (type: string) => {
    const translations: Record<string, string> = {
      'casa': 'Casa',
      'departamento': 'Departamento',
      'condominio': 'Condominio',
      'townhouse': 'Casa en Condominio',
      'duplex': 'Dúplex',
      'otro': 'Otro'
    };
    return translations[type] || type;
  };

  const translateStatus = (status: string) => {
    const translations: Record<string, string> = {
      'disponible': 'Disponible',
      'pendiente': 'Pendiente',
      'vendida': 'Vendida',
      'rentada': 'Rentada'
    };
    
    // Debug: log any unexpected status values
    if (!translations[status]) {
      console.warn('Unknown status value received:', status);
    }
    
    return translations[status] || status;
  };

  const handleClick = () => {
    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {property.amenities?.features && property.amenities.features.length > 0 ? (
          <img 
            src={`/house-placeholder.avif`}
            alt={property.title}
            className="w-3/4 h-3/4 object-cover"
          />
        ) : (
          <div className="text-gray-400 dark:text-gray-500">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate flex-1 mr-2">
            {property.title}
          </h3>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatPrice(property.financial.price)}
          </span>
        </div>

        {/* Address */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
          {property.address.full_address}
        </p>

        {/* Property details */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          {property.property_details.bedrooms && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
              </svg>
              {property.property_details.bedrooms} {property.property_details.bedrooms === 1 ? 'recámara' : 'recámaras'}
            </div>
          )}
          {property.property_details.bathrooms && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
              </svg>
              {property.property_details.bathrooms} {property.property_details.bathrooms === 1 ? 'baño' : 'baños'}
            </div>
          )}
          {property.property_details.square_feet && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {property.property_details.square_feet.toLocaleString()} m²
            </div>
          )}
        </div>

        {/* Property type and status */}
        <div className="flex justify-between items-center">
          <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
            {translatePropertyType(property.property_details.property_type)}
          </span>
          <span className={`inline-block text-xs px-2 py-1 rounded-full ${
            property.status === 'disponible' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
            property.status === 'pendiente' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
            property.status === 'vendida' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
            property.status === 'rentada' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}>
            {translateStatus(property.status)}
          </span>
        </div>

        {/* Description */}
        {property.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">
            {property.description}
          </p>
        )}

        {/* Features */}
        {property.amenities?.features && property.amenities.features.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {property.amenities.features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index}
                  className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded"
                >
                  {feature.replace(/_/g, ' ')}
                </span>
              ))}
              {property.amenities.features.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{property.amenities.features.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price per sqft */}
        {property.financial.price_per_sqft && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatPrice(property.financial.price_per_sqft)} por m²
          </div>
        )}
      </div>
    </div>
  );
}