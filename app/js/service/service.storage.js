angular.module('service.storage', [])
  .factory('$chromeStorage', function($q) {
    var s = angular.createBaseService();

    // string or array of string or object keys
    s.get = function(keys) {
      var deferred = $q.defer();

      chrome.storage.sync.get(keys, function (r) {
        deferred.resolve(r);
      });

      return deferred.promise;
    };

    // object items
    s.set = function(items) {
      var deferred = $q.defer();

      chrome.storage.sync.set(items, function () {
        deferred.resolve(true);
      });

      return deferred.promise;
    };

    // string or array of string or object keys
    s.remove = function(keys) {
      var deferred = $q.defer();

      chrome.storage.sync.remove(keys, function (r) {
        deferred.resolve(r);
      });

      return deferred.promise;
    };

    s.clear = function() {
      var deferred = $q.defer();

      chrome.storage.sync.clear(function () {
        deferred.resolve(true);
      });

      return deferred.promise;
    };

    chrome.storage.onChanged.addListener(function(changes, namespace) {
      /*for (key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
          'Old value was "%s", new value is "%s".',
          key,
          namespace,
          storageChange.oldValue,
          storageChange.newValue);
      }*/
      s.emit('changed', changes, namespace);
    });

    return s;
  });