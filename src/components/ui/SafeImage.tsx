'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  width?: number;
  height?: number;
}

export default function SafeImage({ src, alt, className, fallback, width = 400, height = 300 }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return fallback || null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}