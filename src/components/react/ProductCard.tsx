// src/components/react/ProductCard.tsx - TARJETA PERFECTAMENTE CUADRADA
import React from 'react';
import type { Product } from '../../lib/types';
import { getPrimaryImageUrl } from '../../lib/types';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'featured' | 'compact';
  showQuickAdd?: boolean;
  className?: string;
}

export function ProductCard({ 
  product, 
  variant = 'default', 
  showQuickAdd = true,
  className = '' 
}: ProductCardProps) {
  const primaryImage = getPrimaryImageUrl(product);
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const isOutOfStock = !product.is_active || product.stock <= 0;
  const isFeatured = product.featured;

  // 🎯 CLASES UNIFICADAS PARA DIFERENTES VARIANTES
  const getCardClasses = () => {
    const baseClasses = "group relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300";
    
    switch (variant) {
      case 'featured':
        return `${baseClasses} hover:shadow-lg hover:border-gray-300 hover:-translate-y-1`;
      case 'compact':
        return `${baseClasses} hover:shadow-md hover:border-gray-300`;
      default:
        return `${baseClasses} hover:shadow-lg hover:border-gray-300`;
    }
  };

  const getImageContainerClasses = () => {
    // 🔳 ASPECTO CUADRADO PERFECTO SIEMPRE
    return "aspect-square relative overflow-hidden bg-gray-50";
  };

  const getContentClasses = () => {
    switch (variant) {
      case 'featured':
        return "p-6";
      case 'compact':
        return "p-3";
      default:
        return "p-4";
    }
  };

  return (
    <article className={`${getCardClasses()} ${className}`}>
      <a href={`/producto/${product.slug}`} className="block h-full">
        
        {/* 🔳 IMAGEN CUADRADA PERFECTA */}
        <div className={getImageContainerClasses()}>
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isFeatured && (
              <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full font-medium">
                Destacado
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                Agotado
              </span>
            )}
          </div>
          
          {/* Quick Add Button */}
          {showQuickAdd && !isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('add-to-cart', {
                    detail: { productId: product.id, quantity: 1 }
                  }));
                }}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Agregar al carrito
              </button>
            </div>
          )}
        </div>

        {/* 📝 CONTENIDO UNIFORME */}
        <div className={getContentClasses()}>
          <div className="space-y-3">
            
            {/* Nombre del producto */}
            <h3 className={`font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors ${
              variant === 'compact' ? 'text-sm' : 'text-base'
            }`}>
              {product.name}
            </h3>

            {/* Categoría */}
            {product.category && (
              <p className={`text-gray-500 capitalize ${
                variant === 'compact' ? 'text-xs' : 'text-sm'
              }`}>
                {product.category}
              </p>
            )}

            {/* Precio */}
            <div className="flex items-center justify-between">
              <span className={`font-bold text-gray-900 ${
                variant === 'compact' ? 'text-base' : 'text-lg'
              }`}>
                {formatPrice(product.price)}
              </span>
              
              {/* Stock indicator */}
              {!isOutOfStock && (
                <span className={`text-green-600 ${
                  variant === 'compact' ? 'text-xs' : 'text-sm'
                }`}>
                  En stock
                </span>
              )}
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}