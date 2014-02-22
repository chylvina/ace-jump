angular.module('filter.i18n', [])
  .filter('i18nReplace', function () {
    return function (s) {
      return chrome.i18n.getMessage(s);
    }
  })