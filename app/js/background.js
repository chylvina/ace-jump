// for get element by id
function $(id) {
  return document.getElementById(id);
}

// Returns -1 if value isn't in array.
// Return position starting from 0 if found
function inArray(value, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == value) return i;
  }
  return -1;
}

var injectHash = {};

// base bg object
var bg = {
  tab: 0,
  tabs: [],
  helperFile: "js/helper.js",
  dropperLoaded: false,
  screenshotData: '',
  screenshotFormat: 'png',
  debugImage: null,
  debugTab: 0,
  color: null,

  // use selected tab
  // need to null all tab-specific variables
  useTab: function (tab) {
    bg.tab = tab;
  },

  sendMessage: function (message, callback) {
    chrome.tabs.sendMessage(bg.tab.id, message, callback);
  },

  messageListener: function () {
    // simple messages
    chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
      switch (req.type) {
        case 'greeneye_hot_key':
          chrome.storage.sync.get(['hotKeyEnabled', 'hotKeySimple', 'hotKeyEntire', 'hotKeySmart', 'type'], function (r) {
            if (!r.hotKeyEnabled) {
              return;
            }

            var type;
            switch (req.keyCode) {
              case r.hotKeySimple.charCodeAt(0):
                type = 1;
                break;
              case r.hotKeyEntire.charCodeAt(0):
                type = 2;
                break;
              case r.hotKeySmart.charCodeAt(0):
                type = 3;
                break;
              default:
                return;
            }

            chrome.tabs.getSelected(null, function (tab) {
              if (r.type == type) {
                chrome.storage.sync.set({type: 0}, function () {
                  chrome.tabs.sendMessage(tab.id, {msg: 'app-setting-updated'});
                })
              }
              else {
                chrome.storage.sync.set({type: type}, function () {
                  chrome.tabs.sendMessage(tab.id, {msg: 'app-setting-updated'});
                })
              }
            });
          });
          break;

        // Reload background script
        case 'reload-background':
          window.location.reload();
          break;
      }
    });

    // longer connections
    chrome.runtime.onConnect.addListener(function (port) {
      port.onMessage.addListener(function (req) {
        switch (req.type) {
          // Set color given in req
          case 'set-color':
            bg.setColor(req);
            break;

        }
      });
    });
  },

  // method for setting color. It set bg color, update badge and save to history if possible
  setColor: function (req) {
    // we are storing color with first # character
    if (!req.color.rgbhex.match(/^#/))
      req.color.rgbhex = '#' + req.color.rgbhex;

    bg.color = req.color.rgbhex;
    chrome.browserAction.setBadgeText({text: ' '});
    chrome.browserAction.setBadgeBackgroundColor({color: [req.color.r, req.color.g, req.color.b, 255]});

    // local storage only if available
    if (window.localStorage != null) {
      // save to clipboard through small hack
      if (window.localStorage['autoClipboard'] === "true") {
        var edCb = $('edClipboard');
        edCb.value = window.localStorage['autoClipboardNoGrid'] === "true" ? bg.color.substring(1) : bg.color;
        edCb.select();
        document.execCommand("copy", false, null);
      }

      // history can be disabled i.e when setting color from
      // history itself
      if (req.history == undefined || req.history != 'no') {
        var history = JSON.parse(window.localStorage.history);
        // first check if there isn't same color in history
        if (inArray(bg.color, history) < 0) {
          history.push(bg.color);
          window.localStorage.history = JSON.stringify(history);
        }
      }
    }
  },

  //
  activate: function (callback) {
    if (injectHash[bg.tab.id] == true) {
      if (callback) {
        callback();
      }
    }
    else {
      chrome.tabs.executeScript(bg.tab.id, {allFrames: false, file: "js/inject.js"}, function () {
        injectHash[bg.tab.id] = true;
        if (callback) {
          callback();
        }
      });
    }
  },

  pickActivate: function () {
    bg.activate(function () {
      // activate picker
      bg.sendMessage({type: 'pick-activate', options: { cursor: 'default', themeColor: localStorage['THEME_COLOR'] || "#f00" }}, function () {
      });
    });
  },

  isThisPlatform: function (operationSystem) {
    return navigator.userAgent.toLowerCase().indexOf(operationSystem) > -1;
  },

  tabOnChangeListener: function () {
    // deactivate dropper if tab changed
    chrome.tabs.onSelectionChanged.addListener(function (tabId, selectInfo) {
      if (bg.tab.id == tabId)
        bg.sendMessage({type: 'cancel'}, function () {
        });
    });

  },

  tabOnUpdateListener: function () {
    chrome.tabs.onUpdated.addListener(function (tabId) {
      console.log(tabId);
      delete injectHash[tabId];
    });
  },

  init: function () {
    // only if we have support for localStorage
    if (window.localStorage != null) {

      // show installed or updated page
      if (window.localStorage.seenInstalledPage == undefined || window.localStorage.seenInstalledPage === "false") {
        // TODO: for new installs inject ed helper to all tabs
        window.localStorage.seenInstalledPage = true;
        chrome.tabs.create({url: 'options.html', selected: true});
      }
    }

    // windows support jpeg only ?
    bg.screenshotFormat = bg.isThisPlatform('windows') ? 'jpeg' : 'png';

    // we have to listen for messages
    bg.messageListener();

    // act when tab is changed
    // TODO: call only when needed? this is now used also if picker isn't active
    bg.tabOnChangeListener();

    bg.tabOnUpdateListener();
  }
};

document.addEventListener('DOMContentLoaded', function () {
  bg.init()
});

