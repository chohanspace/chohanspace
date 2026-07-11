export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Chohan Space',
    url: 'https://www.chohanspace.com',
    logo: 'https://www.chohanspace.com/choran-space-logo.svg',
    description: 'Chohan Space designs and builds premium web experiences, polished product interfaces, and high-performance digital systems.',
    sameAs: ['https://www.linkedin.com', 'https://github.com'],
    areaServed: 'Worldwide',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
