// Maps utility functions for mobile-optimized Google Maps integration

export const openLocationInMaps = (location, options = {}) => {
  if (!location?.name && !location?.address) {
    console.warn('No location data provided');
    return;
  }
  
  // Create search query
  const query = location.address || location.name;
  const encodedQuery = encodeURIComponent(query);
  
  // Check if coordinates are available for more precise location
  let mapsUrl;
  if (location.coordinates?.lat && location.coordinates?.lng) {
    // Use coordinates for precise location
    mapsUrl = `https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`;
  } else {
    // Use search query
    mapsUrl = `https://maps.google.com/?q=${encodedQuery}`;
  }
  
  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // On mobile, try to open in native Google Maps app first, then fallback to web
    const googleMapsApp = `googlemaps://maps?q=${encodedQuery}`;
    const appleMapsApp = `maps://maps?q=${encodedQuery}`;
    
    // Try to open native app
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // iOS: Try Google Maps app, fallback to Apple Maps, then web
      window.location.href = googleMapsApp;
      
      // Fallback after short delay
      setTimeout(() => {
        window.location.href = appleMapsApp;
        
        // Final fallback to web
        setTimeout(() => {
          window.open(mapsUrl, '_blank', 'noopener,noreferrer');
        }, 1000);
      }, 1000);
    } else {
      // Android: Try Google Maps app, fallback to web
      window.location.href = googleMapsApp;
      
      // Fallback after short delay
      setTimeout(() => {
        window.open(mapsUrl, '_blank', 'noopener,noreferrer');
      }, 1000);
    }
  } else {
    // Desktop: Open in new tab
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  }
};

export const formatLocationForDisplay = (location) => {
  if (!location) return '';
  
  if (location.name && location.address) {
    return `${location.name}, ${location.address}`;
  }
  
  return location.name || location.address || '';
};

export const getLocationSearchUrl = (location) => {
  if (!location?.name && !location?.address) return '';
  
  const query = location.address || location.name;
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
};

// Indian Rupee formatting utility
export const formatCurrency = (amount) => {
  if (!amount || amount === 0) return '₹0';
  
  // Format with Indian locale for proper comma placement
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Format cost range for activities
export const formatCostRange = (minCost, maxCost) => {
  if (!minCost && !maxCost) return 'Free';
  if (minCost === maxCost) return formatCurrency(minCost);
  
  return `${formatCurrency(minCost || 0)} - ${formatCurrency(maxCost)}`;
};

// Get currency symbol
export const getCurrencySymbol = () => '₹';

// Convert USD to INR (for legacy data)
export const convertUSDToINR = (usdAmount, exchangeRate = 83) => {
  return Math.round(usdAmount * exchangeRate);
};