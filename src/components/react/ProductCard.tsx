// src/components/react/ProductCard.tsx - VERSIÓN OPTIMIZADA MÁXIMO RENDIMIENTO
import React, { useState, useCallback, memo } from 'react';
import type { Product } from '../../lib/types';
import { getPrimaryImageUrl } from '../../lib/types';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
  className?: string;
}

// MEMOIZADO para evitar re-renders innecesarios
export const ProductCard = memo(function ProductCard({ 
  product, 
  variant = 'grid',
  className = '' 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const primaryImage = getPrimaryImageUrl(product);
  
  // Formateo de precio MEMOIZADO
  const formattedPrice = React.useMemo(() => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(product.price);
  }, [product.price]);

  const isOutOfStock = !product.is_active || product.stock <= 0;

  // Handlers MEMOIZADOS para evitar re-creates
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  
  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/producto/${product.slug}`;
  }, [product.slug]);

  const handleNameClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/producto/${product.slug}`;
  }, [product.slug]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) return;

    // Sistema de eventos optimizado
    window.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: { 
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: primaryImage,
          category: product.category,
          slug: product.slug
        },
        quantity: 1
      }
    }));

    // Feedback visual RÁPIDO
    const target = e.target as HTMLElement;
    const originalBg = target.style.backgroundColor;
    target.style.backgroundColor = '#000';
    target.textContent = '✓';
    
    setTimeout(() => {
      target.style.backgroundColor = originalBg;
      target.textContent = 'AGREGAR';
    }, 800);
  }, [isOutOfStock, product, primaryImage]);

  return (
    <article 
      className={`
        group relative bg-white border border-gray-200 overflow-hidden
        transition-all duration-200 ease-out
        ${isHovered ? 'shadow-lg border-black z-10 scale-[1.01]' : 'hover:border-gray-400 shadow-sm'}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform, box-shadow' }} // GPU acceleration
    >
      
      {/* IMAGEN OPTIMIZADA */}
      <div 
        className="aspect-square relative overflow-hidden bg-gray-50 cursor-pointer"
        onClick={handleImageClick}
      >
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className={`
              w-full h-full object-cover transition-all duration-250 ease-out
              filter grayscale hover:grayscale-0
              ${isHovered ? 'scale-105 grayscale-0' : 'scale-100 grayscale'}
            `}
            loading="lazy"
            decoding="async"
            style={{ willChange: 'transform, filter' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badge de agotado */}
        {isOutOfStock && (
          <div className="absolute top-2 left-2">
            <span className="bg-black text-white text-xs px-2 py-1 font-medium">
              AGOTADO
            </span>
          </div>
        )}

        {/* Overlay SIMPLE para hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            {!isOutOfStock ? (
              <button
                onClick={handleAddToCart}
                className="bg-white text-black px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors duration-150"
              >
                AGREGAR
              </button>
            ) : (
              <span className="bg-gray-500 text-white px-4 py-2 text-sm font-medium">
                AGOTADO
              </span>
            )}
          </div>
        )}
      </div>

      {/* INFORMACIÓN BÁSICA */}
      <div className="p-3">
        <h3 
          className="font-medium text-gray-900 text-sm line-clamp-1 cursor-pointer hover:text-gray-600 transition-colors duration-150"
          onClick={handleNameClick}
        >
          {product.name}
        </h3>
        <p className="text-black font-semibold text-base mt-1">
          {formattedPrice}
        </p>
        {product.category && (
          <p className="text-gray-500 text-xs uppercase tracking-wide mt-1">
            {product.category}
          </p>
        )}
      </div>
    </article>
  );
});

// Componente Grid OPTIMIZADO
interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export const ProductGrid = memo(function ProductGrid({ 
  products, 
  title,
  subtitle,
  columns = { mobile: 1, tablet: 2, desktop: 4 },
  gap = 'tight', // GAP PEQUEÑO por defecto
  className = ''
}: ProductGridProps) {
  
  // Grid classes OPTIMIZADO
  const gridClasses = React.useMemo(() => {
    const { mobile = 1, tablet = 2, desktop = 4 } = columns;
    
    const gapClass = {
      tight: 'gap-3',      // 12px - PEQUEÑO
      normal: 'gap-4',     // 16px
      loose: 'gap-6'       // 24px
    }[gap];
    
    return `grid grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop} ${gapClass}`;
  }, [columns, gap]);

  // Early return si no hay productos
  if (!products.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          No hay productos disponibles
        </h3>
        <p className="text-gray-500">
          Pronto tendremos nuevos productos para ti
        </p>
      </div>
    );
  }

  return (
    <section className={`py-8 ${className}`}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3 tracking-wide">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className={gridClasses}>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
          />
        ))}
      </div>
    </section>
  );
});

// Hook personalizado para optimizar renders
export function useProductCardOptimization() {
  return React.useMemo(() => ({
    // Configuraciones optimizadas
    imageDecoding: 'async' as const,
    imageLoading: 'lazy' as const,
    willChange: 'transform, filter',
    transitionDuration: '200ms'
  }), []);
}

// Componente de loading optimizado
export const ProductCardSkeleton = memo(function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-3">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
});

// Grid de skeletons para loading
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}