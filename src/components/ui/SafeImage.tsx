'use client';

import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

export default function SafeImage({ src, alt, className, fallback }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return fallback || null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}