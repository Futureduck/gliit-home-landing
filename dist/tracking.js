(function () {
  'use strict';

  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'lp_variant'];
  var STORAGE_KEY = 'gliit_tracking';

  var params = new URLSearchParams(location.search);
  var saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) {}

  KEYS.forEach(function (k) {
    var v = params.get(k);
    if (v) saved[k] = v;
  });

  saved.utm_source = saved.utm_source || 'direct';
  saved.utm_medium = saved.utm_medium || 'none';
  saved.utm_campaign = saved.utm_campaign || 'none';
  saved.utm_content = saved.utm_content || 'none';
  saved.lp_variant = saved.lp_variant || 'v1';

  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch (e) {}

  window.__gliitTracking = saved;
})();
