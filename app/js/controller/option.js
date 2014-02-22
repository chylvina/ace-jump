angular.module('option', [
    'filter.i18n',
    'service.storage',
    'service.setting',
    'ui.bootstrap.bindHtml'
  ])
  .config(function() {

  })
  .controller('optionController', function($rootScope, $scope, appSetting) {
    appSetting.bind('ready', function() {
      $scope.setting = $.extend(true, {}, appSetting.data);

      $("#spectrum-color").spectrum({
        showInput: true,
        color: $scope.setting.color,
        chooseText: chrome.i18n.getMessage('spectrumChoose'),
        cancelText: chrome.i18n.getMessage('spectrumCancel'),
        change: function (c) {
          $scope.setting.color = c.toHexString();
        }
      });
      $("#spectrum-bgcolor").spectrum({
        showInput: true,
        color: $scope.setting.bgColor,
        chooseText: chrome.i18n.getMessage('spectrumChoose'),
        cancelText: chrome.i18n.getMessage('spectrumCancel'),
        change: function (color) {
          $scope.setting.bgColor = color.toHexString();
        }
      });
      $("#spectrum-bordercolor").spectrum({
        showInput: true,
        color: $scope.setting.borderColor,
        chooseText: chrome.i18n.getMessage('spectrumChoose'),
        cancelText: chrome.i18n.getMessage('spectrumCancel'),
        change: function (color) {
          $scope.setting.borderColor = color.toHexString();
        }
      });

      $scope.saveAndClose = function() {
        appSetting.set($scope.setting)
          .then(function() {
            window.close();
          });
      };

      $scope.setDefault = function() {
        $scope.setting = $.extend(true, {}, appSetting.default);
        $("#spectrum-color").spectrum("set", $scope.setting.color);
        $("#spectrum-bgcolor").spectrum("set", $scope.setting.bgColor);
        $("#spectrum-bordercolor").spectrum("set", $scope.setting.borderColor);
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
