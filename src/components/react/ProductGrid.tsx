// src/components/react/ProductGrid.tsx - GRID CUADRADO UNIFICADO
import React, { useState } from 'react';
import type { Product } from '../../lib/types';
import { ProductCard } from './ProductCard';
import { UnifiedProductFilters } from './ProductsFilter';

interface UnifiedProductGridProps {
  products: Product[];
  variant?: 'featured' | 'catalog' | 'compact';
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  showSort?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
  columns?: {
    mobile?: 1 | 2 | 3;
    tablet?: 2 | 3 | 4;
    desktop?: 3 | 4 | 5 | 6;
  };
  className?: string;
}

export function UnifiedProductGrid({
  products,
  variant = 'catalog',
  title,
  subtitle,
  showFilters = true,
  showSearch = true,
  showSort = true,
  showPagination = true,
  itemsPerPage = 12,
  columns = { mobile: 1, tablet: 2, desktop: 4 },
  className = ''
}: UnifiedProductGridProps) {
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [currentPage, setCurrentPage] = useState(1);

  // 🎯 GRID CLASSES PERFECTAMENTE CUADRADO
  const getGridClasses = () => {
    const { mobile = 1, tablet = 2, desktop = 4 } = columns;
    
    const mobileClass = `grid-cols-${mobile}`;
    const tabletClass = `md:grid-cols-${tablet}`;
    const desktopClass = `lg:grid-cols-${desktop}`;
    
    return `grid ${mobileClass} ${tabletClass} ${desktopClass} gap-6`;
  };

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = showPagination 
    ? filteredProducts.slice(startIndex, startIndex + itemsPerPage)
    : filteredProducts;

  // Reset página cuando cambien los filtros
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 📝 HEADER */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
            <div className="w-24 h-px bg-gray-400 mx-auto mt-6"></div>
          </div>
        )}

        {/* 🎛️ FILTROS UNIFICADOS */}
        {(showFilters || showSearch || showSort) && (
          <div className="mb-8">
            <UnifiedProductFilters
              products={products}
              onFilteredProductsChange={setFilteredProducts}
              showSearch={showSearch}
              showSort={showSort}
              showFilters={showFilters}
            />
          </div>
        )}

        {/* 📊 CONTADOR DE RESULTADOS */}
        <div className="mb-6 text-center">
          <span className="inline-block px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* 🔳 GRID DE PRODUCTOS PERFECTAMENTE CUADRADO */}
        {paginatedProducts.length > 0 ? (
          <div className={getGridClasses()}>
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant={variant === 'featured' ? 'featured' : variant === 'compact' ? 'compact' : 'default'}
                showQuickAdd={variant !== 'compact'}
              />
            ))}
          </div>
        ) : (
          /* 🚫 ESTADO VACÍO */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m16 0l-2-3m2 3l-2 3M4 13l2-3m-2 3l2 3" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600">
                  Intenta cambiar tus filtros o búsqueda
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 📄 PAGINACIÓN */}
        {showPagination && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Anterior
            </button>
            
            <div className="flex space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </section>
  );
}