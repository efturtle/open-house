'use client';

import { useState, useEffect } from 'react';
import { useProperties, usePropertySearch } from '../hooks/useProperties';
import { Property, SearchParams } from '../types/property';
import PropertyCard from './PropertyCard';

export default function PropertyList() {
  // Main properties data
  const { 
    data: allProperties, 
    meta: allMeta, 
    links: allLinks, 
    loading: propertiesLoading, 
    error: propertiesError,
    fetchPage
  } = useProperties();
  const { data: searchResults, meta: searchMeta, links: searchLinks, loading: searchLoading, searchProperties } = usePropertySearch();
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [currentMainPage, setCurrentMainPage] = useState(1);
  
  // Use search results if searching, otherwise use all properties
  const properties = isSearching ? searchResults : allProperties;
  const meta = isSearching ? searchMeta : allMeta;
  const links = isSearching ? searchLinks : allLinks;
  const loading = isSearching ? searchLoading : propertiesLoading;
  const error = propertiesError; // You could also handle search errors separately

  // Helper function to get the total count from meta.total (could be array or number)
  const getTotalCount = (total: number | number[] | undefined): number => {
    if (Array.isArray(total)) {
      return total[1] || total[0] || 0; // [current_page_count, total_count]
    }
    return total || 0;
  };

  // Helper function to get current page count
  const getCurrentPageCount = (total: number | number[] | undefined): number => {
    if (Array.isArray(total)) {
      return total[0] || 0; // [current_page_count, total_count]
    }
    return total || 0;
  };

  const formatFilterName = (key: string): string => {
    const filterNames: Record<string, string> = {
      'city': 'Ciudad',
      'property_type': 'Tipo',
      'status': 'Estado',
      'bedrooms': 'Recámaras',
      'bathrooms': 'Baños',
      'min_price': 'Precio Mín.',
      'max_price': 'Precio Máx.',
      'q': 'Búsqueda',
      'sort_by': 'Ordenar por',
      'sort_direction': 'Dirección'
    };
    return filterNames[key] || key;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Reset to page 1 when searching
    await searchProperties({ ...searchParams, page: 1 });
  };

  const handlePageChange = (page: number) => {
    if (isSearching) {
      searchProperties({ ...searchParams, page });
    } else {
      // Handle pagination for all properties
      setCurrentMainPage(page);
      fetchPage(page);
    }
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchParams({});
    // Don't fetch again - just show current main properties data
    // The useProperties hook already has data for currentMainPage
  };

  const handlePropertyClick = (property: Property) => {
    console.log('Propiedad seleccionada:', property);
    // Aquí puedes agregar navegación a la página de detalle
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-8">
        <p>Error al cargar propiedades: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Query */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buscar
              </label>
              <input
                type="text"
                id="search"
                placeholder="Buscar propiedades..."
                value={searchParams.q || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, q: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                id="city"
                placeholder="Ingresa la ciudad"
                value={searchParams.city || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Min Price */}
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Precio Mínimo
              </label>
              <input
                type="number"
                id="minPrice"
                placeholder="0"
                value={searchParams.min_price || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, min_price: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Max Price */}
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Precio Máximo
              </label>
              <input
                type="number"
                id="maxPrice"
                placeholder="Sin límite"
                value={searchParams.max_price || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, max_price: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recámaras
              </label>
              <select
                id="bedrooms"
                value={searchParams.bedrooms || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, bedrooms: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Cualquiera</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo
              </label>
              <select
                id="propertyType"
                value={searchParams.property_type || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, property_type: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Cualquier Tipo</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="condominio">Condominio</option>
                <option value="townhouse">Casa en Condominio</option>
                <option value="duplex">Dúplex</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fase
              </label>
              <select
                id="status"
                value={searchParams.status || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, status: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Cualquier Fase</option>
                <option value="disponible">Disponible</option>
                <option value="pendiente">Pendiente</option>
                <option value="vendida">Vendida</option>
                <option value="rentada">Rentada</option>
              </select>
            </div>
          </div>

          {/* Search Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={searchLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {searchLoading ? 'Buscando...' : 'Buscar Propiedades'}
            </button>
            
            {isSearching && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Limpiar Búsqueda
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isSearching ? 'Resultados de Búsqueda' : 'Todas las Propiedades'}
        </h2>
        <div className="text-gray-600 dark:text-gray-400">
          {meta ? (
            <div className="text-right">
              <div>
                {isSearching ? (
                  <>Mostrando {getCurrentPageCount(meta.total)} de {getTotalCount(meta.total)} propiedades</>
                ) : (
                  <>Mostrando las primeras {properties.length} propiedades</>
                )}
              </div>
              {isSearching && meta.current_page > 1 && (
                <div className="text-sm">
                  Página {meta.current_page} de {meta.last_page}
                </div>
              )}
            </div>
          ) : (
            <span>
              {properties.length} {properties.length === 1 ? 'propiedad' : 'propiedades'} 
              {isSearching ? ' encontrada' : ' mostrada'}{properties.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </div>

      {/* Suggestion message for initial load */}
      {!isSearching && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-blue-800 dark:text-blue-200">
              <strong>¿Buscas algo específico?</strong> Utiliza el formulario de búsqueda para encontrar más propiedades y acceder a la paginación completa.
            </span>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {isSearching && meta && meta.filters && Object.keys(meta.filters).length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Filtros Activos:
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(meta.filters).map(([key, value]) => (
              <span 
                key={key}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
              >
                {formatFilterName(key)}: {typeof value === 'string' ? value : JSON.stringify(value)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Properties Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onPropertyClick={handlePropertyClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 dark:text-gray-400 py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-lg">No se encontraron propiedades</p>
          <p className="text-sm">Intenta ajustar tus criterios de búsqueda</p>
        </div>
      )}

      {/* Pagination - only show when searching */}
      {isSearching && meta && meta.last_page > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          {/* Previous button */}
          {links?.prev && (
            <button
              onClick={() => {
                const url = new URL(links.prev!);
                const page = url.searchParams.get('page');
                if (page) handlePageChange(parseInt(page));
              }}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Anterior
            </button>
          )}

          {/* Page numbers */}
          <div className="flex space-x-1">
            {meta.links
              .filter(link => link.page && !link.label.includes('Previous') && !link.label.includes('Next'))
              .map((link, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (link.page) handlePageChange(link.page);
                  }}
                  className={`px-3 py-2 text-sm font-medium border ${
                    link.active
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  disabled={link.active}
                >
                  {link.label}
                </button>
              ))}
          </div>

          {/* Next button */}
          {links?.next && (
            <button
              onClick={() => {
                const url = new URL(links.next!);
                const page = url.searchParams.get('page');
                if (page) handlePageChange(parseInt(page));
              }}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Siguiente
            </button>
          )}
        </div>
      )}
    </div>
  );
}