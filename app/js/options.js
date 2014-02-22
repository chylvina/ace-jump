$(document).ready(function () {
    var bg = chrome.extension.getBackgroundPage();

    function isWindowsOrLinuxPlatform() {
        return navigator.userAgent.toLowerCase().indexOf('windows') > -1 ||
            navigator.userAgent.toLowerCase().indexOf('linux') > -1;
    }

    function i18nReplace(id, messageid) {
        return $('#' + id).text(chrome.i18n.getMessage(messageid || id));
    }

    function init() {
        initShoppingAssist();
        HotKey.setup();
        HotKeySetting.setup();

        localStorage['THEME_COLOR'] = localStorage['THEME_COLOR'] || "#f00";

        $("#spectrum").spectrum({
            showInput: true,
            color: localStorage['THEME_COLOR'],
            chooseText: chrome.i18n.getMessage('spectrumChoose'),
            cancelText: chrome.i18n.getMessage('spectrumCancel'),
            change: function (color) {
                localStorage['THEME_COLOR'] = color.toHexString();
            }
        });

        $("#saveAndClose").click(function () {
            if (save()) {
                chrome.tabs.getSelected(null, function (tab) {
                    chrome.tabs.remove(tab.id);
                });
            }
        });
    }

    function save() {
        // shopping assist
        $('#shoppingAssist').prop('checked') ? chrome.storage.sync.set({'SERVICE_CONFIRMED': 't1'})
         : chrome.storage.sync.set({'SERVICE_CONFIRMED': 'f0'});

        return HotKeySetting.save();
    }

    function initShoppingAssist() {
        chrome.storage.sync.get('SERVICE_CONFIRMED', function(items) {
            if(items.SERVICE_CONFIRMED === 'f0') {
                $('#shoppingAssist').prop('checked', false);
            }
            else {
                $('#shoppingAssist').prop('checked', true);
            }

            updateSAH();
        });

        $('#shoppingAssist').click(updateSAH);
    }

    function updateSAH() {
        if ($('#shoppingAssist').prop('checked') == true) {
            shoppingAssistContainer.style.background = 'url(../img/heart.png) no-repeat 26px 2px';
        }
        else {
            shoppingAssistContainer.style.background = 'url(../img/heart_gray.png) no-repeat 26px 2px';
        }
    }

  var HotKeySetting = (function () {
    const CHAR_CODE_OF_AT = 64;
    const CHAR_CODE_OF_A = 65;
    const CHAR_CODE_OF_Z = 90;
    var hotKeySelection =
      $('#hot-key-setting select');
    var isWindowsOrLinuxPlatform = function () {
      return navigator.userAgent.toLowerCase().indexOf('windows') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('linux') > -1;
    }
    var isWindowsOrLinux = isWindowsOrLinuxPlatform();

    var hotkey = {
      setup:function () {
        for (var i = 0; i < hotKeySelection.length; i++) {
          hotKeySelection[i].add(new Option('--', '@'));
          for (var j = CHAR_CODE_OF_A; j <= CHAR_CODE_OF_Z; j++) {
            var value = String.fromCharCode(j);
            var option = new Option(value, value);
            hotKeySelection[i].add(option);
          }
        }

        $('#typeSimple').selectedIndex =
          HotKey.getCharCode('clear') - CHAR_CODE_OF_AT;
        $('#typeEntire').selectedIndex =
          HotKey.getCharCode('area') - CHAR_CODE_OF_AT;
        $('#typeSmart').selectedIndex =
          HotKey.getCharCode('viewport') - CHAR_CODE_OF_AT;
      },

      validate:function () {
        var hotKeyLength =
          Array.prototype.filter.call(hotKeySelection,
            function (element) {
              return element.value != '@'
            }
          ).length;
        if (hotKeyLength != 0) {
          var validateMap = {};
          validateMap[hotKeySelection[0].value] = true;
          validateMap[hotKeySelection[1].value] = true;
          validateMap[hotKeySelection[2].value] = true;

          if (Object.keys(validateMap).length < hotKeyLength) {
            $scope.error = 'hot_key_conflict';
            return false;
          }
        }
        $scope.error = '';
        return true;
      }
    };
    return hotkey;
  })();

    var ErrorInfo = (function () {
        var infoWrapper = $('#error-info');
        return {
            show: function (msgKey) {
                var msg = chrome.i18n.getMessage(msgKey);
                infoWrapper.text(msg);
                infoWrapper.show();
            },

            hide: function () {
                infoWrapper.hide();
            }
        };
    })();

    init();
});