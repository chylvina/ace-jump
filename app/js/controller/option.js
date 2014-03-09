angular.module('option', [
    'filter.i18n',
    'service.storage',
    'service.setting'
  ])
  .config(function() {

  })
  .controller('optionController', function($rootScope, $scope, appSetting) {
    appSetting.bind('ready', function() {
      $scope.setting = $.extend(true, {}, appSetting.data);

      $scope.saveAndClose = function() {
        appSetting.set($scope.setting)
          .then(function() {
            window.close();
          });
      };

      $scope.setDefault = function() {
        $scope.setting = $.extend(true, {}, appSetting.default);
      };

      $scope.$watch('setting', function(newValue, oldValue) {
        //if(newValue === oldValue) return;

        if(newValue.hotKeySimple == newValue.hotKeyEntire || newValue.hotKeySimple == newValue.hotKeySmart || newValue.hotKeySmart == newValue.hotKeyEntire) {
          //$scope.error = 'Duplicate Hot Key.'
          $scope.error = chrome.i18n.getMessage('errorDuplicate');
        }
        else {
          $scope.error = '';
        }
      }, true);

      $scope.error = '';
    });
  })
  .run(function() {

  });
