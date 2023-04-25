export function loadGoogleMaps(apiKey, callback) {
  if (window.google && window.google.maps) {
    callback(window.google.maps);
  } else {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      callback(window.google.maps);
    };
    document.head.appendChild(script);
  }
}
