/**
 * DevExtreme (viz/gauges/theme_manager.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var extend = require("../../core/utils/extend").extend,
    _extend = extend,
    BaseThemeManager = require("../core/base_theme_manager").BaseThemeManager;
var ThemeManager = BaseThemeManager.inherit({
    ctor: function(options) {
        this.callBase.apply(this, arguments);
        this._subTheme = options.subTheme
    },
    _initializeTheme: function() {
        var subTheme, that = this;
        if (that._subTheme) {
            subTheme = _extend(true, {}, that._theme[that._subTheme], that._theme);
            _extend(true, that._theme, subTheme)
        }
        that.callBase.apply(that, arguments)
    }
});
module.exports = {
    ThemeManager: ThemeManager
};
