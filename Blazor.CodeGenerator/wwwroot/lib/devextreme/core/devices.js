/**
 * DevExtreme (core/devices.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../core/renderer"),
    windowUtils = require("./utils/window"),
    navigator = windowUtils.getNavigator(),
    window = windowUtils.getWindow(),
    extend = require("./utils/extend").extend,
    isPlainObject = require("./utils/type").isPlainObject,
    each = require("./utils/iterator").each,
    Class = require("./class"),
    errors = require("./errors"),
    Callbacks = require("./utils/callbacks"),
    resizeCallbacks = require("./utils/resize_callbacks"),
    EventsMixin = require("./events_mixin"),
    SessionStorage = require("./utils/storage").sessionStorage,
    viewPort = require("./utils/view_port"),
    Config = require("./config");
var KNOWN_UA_TABLE = {
    iPhone: "iPhone",
    iPhone5: "iPhone",
    iPhone6: "iPhone",
    iPhone6plus: "iPhone",
    iPad: "iPad",
    iPadMini: "iPad Mini",
    androidPhone: "Android Mobile",
    androidTablet: "Android",
    win8: "MSAppHost",
    win8Phone: "Windows Phone 8.0",
    msSurface: "Windows ARM Tablet PC",
    desktop: "desktop",
    win10Phone: "Windows Phone 10.0",
    win10: "MSAppHost/3.0"
};
var DEFAULT_DEVICE = {
    deviceType: "desktop",
    platform: "generic",
    version: [],
    phone: false,
    tablet: false,
    android: false,
    ios: false,
    win: false,
    generic: true,
    grade: "A",
    mac: false
};
var uaParsers = {
    win: function(userAgent) {
        var isPhone = /windows phone/i.test(userAgent) || userAgent.match(/WPDesktop/),
            isTablet = !isPhone && /Windows(.*)arm(.*)Tablet PC/i.test(userAgent),
            isDesktop = !isPhone && !isTablet && /msapphost/i.test(userAgent);
        if (!(isPhone || isTablet || isDesktop)) {
            return
        }
        var matches = userAgent.match(/windows phone (\d+).(\d+)/i) || userAgent.match(/windows nt (\d+).(\d+)/i),
            version = [];
        if (matches) {
            version.push(parseInt(matches[1], 10), parseInt(matches[2], 10))
        } else {
            matches = userAgent.match(/msapphost(\/(\d+).(\d+))?/i);
            matches && version.push(3 === parseInt(matches[2], 10) ? 10 : 8)
        }
        return {
            deviceType: isPhone ? "phone" : isTablet ? "tablet" : "desktop",
            platform: "win",
            version: version,
            grade: "A"
        }
    },
    ios: function(userAgent) {
        if (!/ip(hone|od|ad)/i.test(userAgent)) {
            return
        }
        var isPhone = /ip(hone|od)/i.test(userAgent),
            matches = userAgent.match(/os (\d+)_(\d+)_?(\d+)?/i),
            version = matches ? [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3] || 0, 10)] : [],
            isIPhone4 = 480 === window.screen.height,
            grade = isIPhone4 ? "B" : "A";
        return {
            deviceType: isPhone ? "phone" : "tablet",
            platform: "ios",
            version: version,
            grade: grade
        }
    },
    android: function(userAgent) {
        if (!/android|htc_|silk/i.test(userAgent)) {
            return
        }
        var isPhone = /mobile/i.test(userAgent),
            matches = userAgent.match(/android (\d+)\.?(\d+)?\.?(\d+)?/i),
            version = matches ? [parseInt(matches[1], 10), parseInt(matches[2] || 0, 10), parseInt(matches[3] || 0, 10)] : [],
            worseThan4_4 = version.length > 1 && (version[0] < 4 || 4 === version[0] && version[1] < 4),
            grade = worseThan4_4 ? "B" : "A";
        return {
            deviceType: isPhone ? "phone" : "tablet",
            platform: "android",
            version: version,
            grade: grade
        }
    }
};
var Devices = Class.inherit({
    ctor: function(options) {
        this._window = options && options.window || window;
        this._realDevice = this._getDevice();
        this._currentDevice = void 0;
        this._currentOrientation = void 0;
        this.changed = Callbacks();
        if (windowUtils.hasWindow()) {
            this._recalculateOrientation();
            resizeCallbacks.add(this._recalculateOrientation.bind(this))
        }
    },
    current: function(deviceOrName) {
        if (deviceOrName) {
            this._currentDevice = this._getDevice(deviceOrName);
            this._forced = true;
            this.changed.fire();
            return
        }
        if (!this._currentDevice) {
            deviceOrName = void 0;
            try {
                deviceOrName = this._getDeviceOrNameFromWindowScope()
            } catch (e) {
                deviceOrName = this._getDeviceNameFromSessionStorage()
            } finally {
                if (!deviceOrName) {
                    deviceOrName = this._getDeviceNameFromSessionStorage()
                }
                if (deviceOrName) {
                    this._forced = true
                }
            }
            this._currentDevice = this._getDevice(deviceOrName)
        }
        return this._currentDevice
    },
    real: function() {
        return extend({}, this._realDevice)
    },
    orientation: function() {
        return this._currentOrientation
    },
    isForced: function() {
        return this._forced
    },
    isRippleEmulator: function() {
        return !!this._window.tinyHippos
    },
    _getCssClasses: function(device) {
        var result = [];
        var realDevice = this._realDevice;
        device = device || this.current();
        if (device.deviceType) {
            result.push("dx-device-" + device.deviceType);
            if ("desktop" !== device.deviceType) {
                result.push("dx-device-mobile")
            }
        }
        result.push("dx-device-" + realDevice.platform);
        if (realDevice.version && realDevice.version.length) {
            result.push("dx-device-" + realDevice.platform + "-" + realDevice.version[0])
        }
        if (devices.isSimulator()) {
            result.push("dx-simulator")
        }
        if (Config().rtlEnabled) {
            result.push("dx-rtl")
        }
        return result
    },
    attachCssClasses: function(element, device) {
        this._deviceClasses = this._getCssClasses(device).join(" ");
        $(element).addClass(this._deviceClasses)
    },
    detachCssClasses: function(element) {
        $(element).removeClass(this._deviceClasses)
    },
    isSimulator: function() {
        try {
            return this._isSimulator || windowUtils.hasWindow() && this._window.top !== this._window.self && this._window.top["dx-force-device"] || this.isRippleEmulator()
        } catch (e) {
            return false
        }
    },
    forceSimulator: function() {
        this._isSimulator = true
    },
    _getDevice: function(deviceName) {
        if ("genericPhone" === deviceName) {
            deviceName = {
                deviceType: "phone",
                platform: "generic",
                generic: true
            }
        }
        if (isPlainObject(deviceName)) {
            return this._fromConfig(deviceName)
        } else {
            var ua;
            if (deviceName) {
                ua = KNOWN_UA_TABLE[deviceName];
                if (!ua) {
                    throw errors.Error("E0005")
                }
            } else {
                ua = navigator.userAgent
            }
            return this._fromUA(ua)
        }
    },
    _getDeviceOrNameFromWindowScope: function() {
        var result;
        if (windowUtils.hasWindow() && (this._window.top["dx-force-device-object"] || this._window.top["dx-force-device"])) {
            result = this._window.top["dx-force-device-object"] || this._window.top["dx-force-device"]
        }
        return result
    },
    _getDeviceNameFromSessionStorage: function() {
        var sessionStorage = SessionStorage();
        if (!sessionStorage) {
            return
        }
        var deviceOrName = sessionStorage.getItem("dx-force-device");
        try {
            return JSON.parse(deviceOrName)
        } catch (ex) {
            return deviceOrName
        }
    },
    _fromConfig: function(config) {
        var result = extend({}, DEFAULT_DEVICE, this._currentDevice, config),
            shortcuts = {
                phone: "phone" === result.deviceType,
                tablet: "tablet" === result.deviceType,
                android: "android" === result.platform,
                ios: "ios" === result.platform,
                win: "win" === result.platform,
                generic: "generic" === result.platform
            };
        return extend(result, shortcuts)
    },
    _fromUA: function(ua) {
        var config;
        each(uaParsers, function(platform, parser) {
            config = parser(ua);
            return !config
        });
        if (config) {
            return this._fromConfig(config)
        }
        var isMac = /(mac os)/.test(ua.toLowerCase()),
            deviceWithOS = DEFAULT_DEVICE;
        deviceWithOS.mac = isMac;
        return deviceWithOS
    },
    _changeOrientation: function() {
        var $window = $(this._window),
            orientation = $window.height() > $window.width() ? "portrait" : "landscape";
        if (this._currentOrientation === orientation) {
            return
        }
        this._currentOrientation = orientation;
        this.fireEvent("orientationChanged", [{
            orientation: orientation
        }])
    },
    _recalculateOrientation: function() {
        var windowWidth = $(this._window).width();
        if (this._currentWidth === windowWidth) {
            return
        }
        this._currentWidth = windowWidth;
        this._changeOrientation()
    }
}).include(EventsMixin);
var devices = new Devices;
viewPort.changeCallback.add(function(viewPort, prevViewport) {
    devices.detachCssClasses(prevViewport);
    devices.attachCssClasses(viewPort)
});
if (!devices.isForced() && "win" === devices.current().platform) {
    devices.current({
        version: [10]
    })
}
module.exports = devices;
module.exports.default = module.exports;
