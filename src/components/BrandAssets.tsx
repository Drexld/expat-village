interface BrandLogoProps {
  variant?: 'logo-light' | 'logo-navy' | 'icon-navy';
  className?: string;
  alt?: string;
}

const assetByVariant: Record<NonNullable<BrandLogoProps['variant']>, string> = {
  'logo-light': '/brand/expat-village-logo-light-navy.svg',
  'logo-navy': '/brand/expat-village-logo-navy.svg',
  'icon-navy': '/brand/expat-village-icon-navy.svg',
};

export function BrandAsset({
  variant = 'logo-light',
  className = '',
  alt = 'Expat Village',
}: BrandLogoProps) {
  return (
    <img
      src={assetByVariant[variant]}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}

