// src/components/react/UnifiedProductFilters.tsx - FILTROS UNIFICADOS
import React, { useState, useEffect } from 'react';
import type { Product } from '../../lib/types';

interface FilterOptions {
  sortBy: 'featured' | 'newest' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc';
  category: string;
  priceRange: [number, number];
  inStock: boolean;
  featured: boolean;
  searchQuery: string;
}

interface UnifiedProductFiltersProps {
  products: Product[];
  onFilteredProductsChange: (products: Product[]) => void;
  showSearch?: boolean;
  showSort?: boolean;
  showFilters?: boolean;
  className?: string;
}

export function UnifiedProductFilters({
  products,
  onFilteredProductsChange,
  showSearch = true,
  showSort = true,
  showFilters = true,
  className = ''
}: UnifiedProductFiltersProps) {
  
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'featured',
    category: '',
    priceRange: [0, 1000000],
    inStock: false,
    featured: false,
    searchQuery: ''
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Obtener categorías únicas
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  // Obtener rango de precios
  const priceRange = products.length > 0 ? {
    min: Math.min(...products.map(p => p.price)),
    max: Math.max(...products.map(p => p.price))
  } : { min: 0, max: 1000000 };

  // Aplicar filtros
  const applyFilters = () => {
    let filtered = [...products];

    // Búsqueda por texto
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    }

    // Filtro por categoría
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Filtro por rango de precio
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Filtro por stock
    if (filters.inStock) {
      filtered = filtered.filter(product => product.is_active && product.stock > 0);
    }

    // Filtro por destacados
    if (filters.featured) {
      filtered = filtered.filter(product => product.featured);
    }

    // Ordenamiento
    switch (filters.sortBy) {
      case 'featured':
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return filtered;
  };

  // Efecto para aplicar filtros cuando cambien
  useEffect(() => {
    const filteredProducts = applyFilters();
    onFilteredProductsChange(filteredProducts);
  }, [filters, products]);

  const resetFilters = () => {
    setFilters({
      sortBy: 'featured',
      category: '',
      priceRange: [priceRange.min, priceRange.max],
      inStock: false,
      featured: false,
      searchQuery: ''
    });
  };

  const hasActiveFilters = 
    filters.category || 
    filters.inStock || 
    filters.featured || 
    filters.searchQuery ||
    filters.priceRange[0] !== priceRange.min ||
    filters.priceRange[1] !== priceRange.max;

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* 🔍 BARRA DE BÚSQUEDA */}
      {showSearch && (
        <div className="max-w-lg mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 🎛️ CONTROLES PRINCIPALES */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        
        {/* Ordenamiento */}
        {showSort && (
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterOptions['sortBy'] }))}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="featured">Destacados</option>
              <option value="newest">Más recientes</option>
              <option value="price-low">Precio: menor a mayor</option>
              <option value="price-high">Precio: mayor a menor</option>
              <option value="name-asc">Nombre A-Z</option>
              <option value="name-desc">Nombre Z-A</option>
            </select>
          </div>
        )}

        {/* Toggle de Filtros Avanzados */}
        {showFilters && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Filtros</span>
              {hasActiveFilters && (
                <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
                  {[filters.category, filters.inStock, filters.featured, filters.searchQuery].filter(Boolean).length}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* 🎛️ PANEL DE FILTROS AVANZADOS */}
      {showFilters && isFiltersOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Categorías */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categoría
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Rango de Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rango de precio
              </label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [Number(e.target.value), prev.priceRange[1]]
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], Number(e.target.value)]
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Disponibilidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Disponibilidad
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="mr-3 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">Solo en stock</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.checked }))}
                    className="mr-3 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">Solo destacados</span>
                </label>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col justify-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}