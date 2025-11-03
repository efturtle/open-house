'use client';

import { useState, useEffect } from 'react';
import { Property, PropertiesResponse, PropertyStatsResponse, SearchParams, CreatePropertyData } from '../types/property';

// Custom hook for fetching all properties
export function useProperties() {
  const [data, setData] = useState<Property[]>([]);
  const [meta, setMeta] = useState<PropertiesResponse['meta'] | null>(null);
  const [links, setLinks] = useState<PropertiesResponse['links'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasInitialized, setHasInitialized] = useState(false);

  const fetchProperties = async (page: number = 1, prioritizeAvailable: boolean = false) => {
    try {
      setLoading(true);
      // Build URL with pagination
      let url = `/api/properties?page=${page}`;
      
      // Add sorting to prioritize available properties using proper Laravel parameters
      if (prioritizeAvailable) {
        url += '&sort_by=status&sort_direction=asc'; // This will sort by status (disponible comes first alphabetically)
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result: PropertiesResponse = await response.json();
      setData(result.data || []);
      setMeta(result.meta || null);
      setLinks(result.links || null);
      setCurrentPage(page);
      setHasInitialized(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      setData([]);
      setMeta(null);
      setLinks(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPage = (page: number) => {
    fetchProperties(page, false); // Regular pagination without prioritization
  };

  useEffect(() => {
    fetchProperties(1, true); // Initial load with available properties prioritized
  }, []);

  return { data, meta, links, loading, error, refetch: fetchProperties, fetchPage, currentPage };
}

// Custom hook for searching properties
export function usePropertySearch() {
  const [data, setData] = useState<Property[]>([]);
  const [meta, setMeta] = useState<PropertiesResponse['meta'] | null>(null);
  const [links, setLinks] = useState<PropertiesResponse['links'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProperties = async (params: SearchParams) => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/properties?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result: PropertiesResponse = await response.json();
      setData(result.data || []);
      setMeta(result.meta || null);
      setLinks(result.links || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search properties');
      setData([]);
      setMeta(null);
      setLinks(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, meta, links, loading, error, searchProperties };
}

// Custom hook for property stats
export function usePropertyStats() {
  const [data, setData] = useState<PropertyStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/properties/stats');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, loading, error };
}

// Custom hook for individual property
export function useProperty(id: string | number) {
  const [data, setData] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { data, loading, error };
}

// Hook for creating properties
export function useCreateProperty() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProperty = async (propertyData: CreatePropertyData): Promise<Property | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create property');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProperty, loading, error };
}