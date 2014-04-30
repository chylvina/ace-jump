angular.module('popup', [
    'filter.i18n',
    'service.storage',
    'service.setting',
    'ui.bootstrap.bindHtml'
  ])
  .config(function() {

  })
  .controller('popupController', function($rootScope, $scope, appSetting) {
    appSetting.bind('ready', function() {
      var tab;

      var init = function() {
        $scope.activate = function(type) {
          chrome.tabs.sendMessage(tab.id, {msg: 'activate'});
          //chrome.tabs.reload(tab.id);
          window.close();
        };

        $scope.appSetting = appSetting;
      };

      chrome.tabs.getSelected(null, function (t) {
        tab = t;

        $scope.tip = '';

        init();

        // special chrome pages
        if (tab.url.indexOf('chrome') == 0) {
          $scope.tip = chrome.i18n.getMessage('tip1');
          if(!$rootScope.$$phase) {
            $scope.$digest();
          }
          return;
        }
        // chrome gallery
        if (tab.url.indexOf('https://chrome.google.com/webstore') == 0) {
          $scope.tip = chrome.i18n.getMessage('tip2');
          if(!$rootScope.$$phase) {
            $scope.$digest();
          }
          return;
        }
        // local pages
        if (tab.url.indexOf('file') == 0) {
          $scope.tip = chrome.i18n.getMessage('tip2');
          if(!$rootScope.$$phase) {
            $scope.$digest();
          }
          return;
        }

        if(!$rootScope.$$phase) {
          $scope.$digest();
        }
      });
    });
  })
  .run(function() {

  });
