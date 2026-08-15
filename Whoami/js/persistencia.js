// js/persistencia.js
(function() {
  "use strict";

  var STORE_KEY = "dc_portfolio_v1";
  var store = { favs: [], watched: [], academy: [] };

  function loadStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var p = JSON.parse(raw);
        if (p && Array.isArray(p.favs)) store.favs = p.favs;
        if (p && Array.isArray(p.watched)) store.watched = p.watched;
        if (p && Array.isArray(p.academy)) store.academy = p.academy;
      }
    } catch (e) { /* noop */ }
  }
  function saveStore() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* noop */ }
  }

  window.Persistencia = {
    isFav: function(id) { return store.favs.indexOf(id) !== -1; },
    isWatched: function(id) { return store.watched.indexOf(id) !== -1; },
    isAcademyDone: function(id) { return store.academy.indexOf(id) !== -1; },
    setFav: function(id, on) {
      var i = store.favs.indexOf(id);
      if (on && i === -1) store.favs.push(id);
      if (!on && i !== -1) store.favs.splice(i, 1);
      saveStore();
    },
    setWatched: function(id, on) {
      var i = store.watched.indexOf(id);
      if (on && i === -1) store.watched.push(id);
      if (!on && i !== -1) store.watched.splice(i, 1);
      saveStore();
    },
    setAcademyDone: function(id, on) {
      var i = store.academy.indexOf(id);
      if (on && i === -1) store.academy.push(id);
      if (!on && i !== -1) store.academy.splice(i, 1);
      saveStore();
    }
  };
  loadStore();
})();