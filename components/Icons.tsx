// components/Icons.tsx
// Expose BOTH sets so any page can import what it needs.

/** Impact badge icons (brand page) */
export const CO2Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h.01M12 12h.01M15 12h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"/>
  </svg>
);

export const WaterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22c4.418 0 8-3.582 8-8 0-4.967-8-12-8-12S4 9.033 4 14c0 4.418 3.582 8 8 8z"/>
  </svg>
);

export const RecycleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"/>
  </svg>
);

export const CertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

/** Certification mini icons (index cards) */
export const LeafIcon = () => ( // Organic
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 3c7 0 12 5 12 12 0 3-2 6-5 6-4 0-7-3-7-7C5 8 7 5 11 5c2 0 4 1 5 3-2-5-7-5-11-5z"/>
  </svg>
);

export const HandHeartIcon = () => ( // Fair Trade
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21s-6-4.35-6-8.5A3.5 3.5 0 0 1 12 9a3.5 3.5 0 0 1 6 3.5C18 16.65 12 21 12 21z"/>
  </svg>
);

export const TreeIcon = () => ( // FSC
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l4 6h-3l3 5h-3l3 5h-8l3-5H8l3-5H8l4-6z"/>
  </svg>
);

export const SparkIcon = () => ( // Climate Neutral
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z"/>
  </svg>
);
