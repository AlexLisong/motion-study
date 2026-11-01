/* Google Analytics: this site's approved production hostname only. */
(function () {
  'use strict';
  var measurementId = 'G-SMBEXJ3CN1';
  var allowedHosts = ["motion.whyjs.com"];
  var includePath = true;
  if (allowedHosts.indexOf(location.hostname) === -1 || window.__siteGaLoaded) return;
  window.__siteGaLoaded = true;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  var referrer = '';
  try { referrer = document.referrer ? new URL(document.referrer).origin + '/' : ''; } catch { referrer = ''; }
  var lastPage = '';
  function pageView() {
    var page = location.origin + (includePath ? location.pathname : '/');
    if (page === lastPage) return;
    lastPage = page;
    var fields = { page_location: page, page_title: location.hostname, page_referrer: referrer };
    gtag('set', fields);
    gtag('event', 'page_view', Object.assign({ send_to: measurementId }, fields));
  }
  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: location.origin + (includePath ? location.pathname : '/'),
    page_title: location.hostname,
    page_referrer: referrer
  });
  pageView();
  ['pushState', 'replaceState'].forEach(function (method) {
    var original = history[method];
    history[method] = function () {
      var result = original.apply(this, arguments);
      pageView();
      return result;
    };
  });
  window.addEventListener('popstate', pageView);
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(script);
})();
