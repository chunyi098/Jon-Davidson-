// Injects the correct JD favicon on every page
(function() {
  // Remove any existing favicon links
  document.querySelectorAll('link[rel="icon"]').forEach(function(el) { el.remove(); });
  // Add the SVG favicon
  var link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = (document.head.querySelector('base') ? '' : '') + 'assets/favicon.svg';
  // Handle pages in subdirectories
  var depth = (window.location.pathname.match(/\//g) || []).length - 1;
  if (depth <= 0) link.href = 'assets/favicon.svg';
  document.head.appendChild(link);
})();
