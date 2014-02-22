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
        $scope.toggle = function(type) {
          if(appSetting.get('type') == type) {
            ga('send', 'event', 'popup', 'analysis', 'disable', type);

            appSetting.set({
              type: appSetting.TYPE_NONE
            })
              .then(function() {
                chrome.tabs.sendMessage(tab.id, {msg: 'app-setting-updated'});
                //chrome.tabs.reload(tab.id);
                window.close();
              });
          }
          else {
            ga('send', 'event', 'popup', 'analysis', 'enable', type);

            appSetting.set({
              type: type
            })
              .then(function() {
                chrome.tabs.sendMessage(tab.id, {msg: 'app-setting-updated'});
                //chrome.tabs.reload(tab.id);
                window.close();
              });
          }
        };

        $scope.goSetting = function() {
          ga('send', 'event', 'popup', 'click', 'option');

          chrome.tabs.create({ url:'options.html'});
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
          $scope.tip = chrome.i18n.getMessage('tip3');
          chrome.tabs.sendMessage(tab.id, {msg:'is_green_eye_load'},
            function (response) {
              if (response && response.msg == 'green_eye_loaded') {
                $scope.tip = '';
                if(!$rootScope.$$phase) {
                  $scope.$digest();
                }
              }
            });
        }

        if(!$rootScope.$$phase) {
          $scope.$digest();
        }

        setTimeout(function () {
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-46763746-1', 'green-eye.com');
          ga('send', 'event', 'popup', 'analysis', 'type', appSetting.type);
        }, 500);
      });
    });
  })
  .run(function() {

  });
