/**
 * DevExtreme (viz/components/chart_theme_manager.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var noop = require("../../core/utils/common").noop,
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    BaseThemeManager = require("../core/base_theme_manager").BaseThemeManager,
    _isString = typeUtils.isString,
    _isDefined = typeUtils.isDefined,
    _normalizeEnum = require("../core/utils").normalizeEnum;
var ThemeManager = BaseThemeManager.inherit(function() {
    var ctor = function(params) {
        var that = this;
        that.callBase.apply(that, arguments);
        var options = params.options || {};
        that._userOptions = options;
        that._mergeAxisTitleOptions = [];
        that._multiPieColors = {};
        that._callback = noop
    };
    var dispose = function() {
        var that = this;
        that.palette && that.palette.dispose();
        that.palette = that._userOptions = that._mergedSettings = that._multiPieColors = null;
        return that.callBase.apply(that, arguments)
    };
    var resetPalette = function() {
        this.palette.reset();
        this._multiPieColors = {}
    };
    var processTitleOptions = function(options) {
        return _isString(options) ? {
            text: options
        } : options
    };
    var processAxisOptions = function(axisOptions) {
        if (!axisOptions) {
            return {}
        }
        axisOptions = extend(true, {}, axisOptions);
        axisOptions.title = processTitleOptions(axisOptions.title);
        if ("logarithmic" === axisOptions.type && axisOptions.logarithmBase <= 0 || axisOptions.logarithmBase && !typeUtils.isNumeric(axisOptions.logarithmBase)) {
            axisOptions.logarithmBase = void 0;
            axisOptions.logarithmBaseError = true
        }
        if (axisOptions.label) {
            if (axisOptions.label.alignment) {
                axisOptions.label.userAlignment = true
            }
        }
        return axisOptions
    };
    var applyParticularAxisOptions = function(name, userOptions, rotated) {
        var theme = this._theme,
            position = !(rotated ^ "valueAxis" === name) ? "horizontalAxis" : "verticalAxis",
            processedUserOptions = processAxisOptions(userOptions, name),
            commonAxisSettings = processAxisOptions(this._userOptions.commonAxisSettings, name),
            mergeOptions = extend(true, {}, theme.commonAxisSettings, theme[position], theme[name], commonAxisSettings, processedUserOptions);
        mergeOptions.workWeek = processedUserOptions.workWeek || theme[name].workWeek;
        mergeOptions.forceUserTickInterval |= _isDefined(processedUserOptions.tickInterval) && !_isDefined(processedUserOptions.axisDivisionFactor);
        return mergeOptions
    };
    var mergeOptions = function(name, userOptions) {
        userOptions = userOptions || this._userOptions[name];
        var theme = this._theme[name],
            result = this._mergedSettings[name];
        if (result) {
            return result
        }
        if (typeUtils.isPlainObject(theme) && typeUtils.isPlainObject(userOptions)) {
            result = extend(true, {}, theme, userOptions)
        } else {
            result = _isDefined(userOptions) ? userOptions : theme
        }
        this._mergedSettings[name] = result;
        return result
    };
    var applyParticularTheme = {
        base: mergeOptions,
        argumentAxis: applyParticularAxisOptions,
        valueAxisRangeSelector: function() {
            return mergeOptions.call(this, "valueAxis")
        },
        valueAxis: applyParticularAxisOptions,
        series: function(name, userOptions, seriesCount) {
            var settings, mainSeriesColor, seriesVisibility, that = this,
                theme = that._theme,
                userCommonSettings = that._userOptions.commonSeriesSettings || {},
                themeCommonSettings = theme.commonSeriesSettings,
                widgetType = that._themeSection.split(".").slice(-1)[0],
                type = _normalizeEnum(userOptions.type || userCommonSettings.type || themeCommonSettings.type || "pie" === widgetType && theme.type),
                palette = that.palette,
                isBar = ~type.indexOf("bar"),
                isLine = ~type.indexOf("line"),
                isArea = ~type.indexOf("area"),
                isBubble = "bubble" === type,
                resolveLabelsOverlapping = that.getOptions("resolveLabelsOverlapping"),
                containerBackgroundColor = that.getOptions("containerBackgroundColor"),
                seriesTemplate = applyParticularTheme.seriesTemplate.call(this);
            if (isBar || isBubble) {
                userOptions = extend(true, {}, userCommonSettings, userCommonSettings[type], userOptions);
                seriesVisibility = userOptions.visible;
                userCommonSettings = {
                    type: {}
                };
                extend(true, userOptions, userOptions.point);
                userOptions.visible = seriesVisibility
            }
            settings = extend(true, {
                aggregation: {}
            }, themeCommonSettings, themeCommonSettings[type], userCommonSettings, userCommonSettings[type], userOptions);
            settings.aggregation.enabled = "chart" === widgetType && normalizeAggregationEnabled(settings.aggregation, that.getOptions("useAggregation"));
            settings.type = type;
            settings.widgetType = widgetType;
            settings.containerBackgroundColor = containerBackgroundColor;
            if ("pie" !== widgetType) {
                mainSeriesColor = settings.color || palette.getNextColor(seriesCount)
            } else {
                mainSeriesColor = function(argument, index, count) {
                    var cat = argument + "-" + index;
                    if (!that._multiPieColors[cat]) {
                        that._multiPieColors[cat] = palette.getNextColor(count)
                    }
                    return that._multiPieColors[cat]
                }
            }
            settings.mainSeriesColor = mainSeriesColor;
            settings.resolveLabelsOverlapping = resolveLabelsOverlapping;
            if (settings.label && (isLine || isArea && "rangearea" !== type || "scatter" === type)) {
                settings.label.position = "outside"
            }
            if (seriesTemplate) {
                settings.nameField = seriesTemplate.nameField
            }
            return settings
        },
        animation: function(name) {
            var userOptions = this._userOptions[name];
            userOptions = typeUtils.isPlainObject(userOptions) ? userOptions : _isDefined(userOptions) ? {
                enabled: !!userOptions
            } : {};
            return mergeOptions.call(this, name, userOptions)
        },
        seriesTemplate: function() {
            var value = mergeOptions.call(this, "seriesTemplate");
            if (value) {
                value.nameField = value.nameField || "series"
            }
            return value
        },
        zoomAndPan: function() {
            function parseOption(option) {
                option = _normalizeEnum(option);
                var pan = "pan" === option || "both" === option,
                    zoom = "zoom" === option || "both" === option;
                return {
                    pan: pan,
                    zoom: zoom,
                    none: !pan && !zoom
                }
            }
            var userOptions = this._userOptions.zoomAndPan;
            if (!_isDefined(userOptions)) {
                var zoomingMode = _normalizeEnum(this.getOptions("zoomingMode"));
                var scrollingMode = _normalizeEnum(this.getOptions("scrollingMode"));
                var allowZoom = ["all", "mouse", "touch"].indexOf(zoomingMode) !== -1;
                var allowScroll = ["all", "mouse", "touch"].indexOf(scrollingMode) !== -1;
                userOptions = {
                    argumentAxis: allowZoom && allowScroll ? "both" : allowZoom ? "zoom" : allowScroll ? "pan" : "none",
                    allowMouseWheel: "all" === zoomingMode || "mouse" === zoomingMode,
                    allowTouchGestures: "all" === zoomingMode || "touch" === zoomingMode || "all" === scrollingMode || "touch" === scrollingMode
                }
            }
            var options = mergeOptions.call(this, "zoomAndPan", userOptions);
            return {
                valueAxis: parseOption(options.valueAxis),
                argumentAxis: parseOption(options.argumentAxis),
                dragToZoom: !!options.dragToZoom,
                dragBoxStyle: {
                    "class": "dxc-shutter",
                    fill: options.dragBoxStyle.color,
                    opacity: options.dragBoxStyle.opacity
                },
                panKey: options.panKey,
                allowMouseWheel: !!options.allowMouseWheel,
                allowTouchGestures: !!options.allowTouchGestures
            }
        }
    };
    var normalizeAggregationEnabled = function(aggregation, useAggregation) {
        return !!(!_isDefined(aggregation.enabled) ? useAggregation : aggregation.enabled)
    };
    return {
        _themeSection: "chart",
        ctor: ctor,
        dispose: dispose,
        resetPalette: resetPalette,
        getOptions: function(name) {
            return (applyParticularTheme[name] || applyParticularTheme.base).apply(this, arguments)
        },
        refresh: function() {
            this._mergedSettings = {};
            return this.callBase.apply(this, arguments)
        },
        _initializeTheme: function() {
            var that = this;
            that.callBase.apply(that, arguments);
            that.updatePalette()
        },
        resetOptions: function(name) {
            this._mergedSettings[name] = null
        },
        update: function(options) {
            this._userOptions = options
        },
        updatePalette: function() {
            var that = this;
            that.palette = that.createPalette(that.getOptions("palette"), {
                useHighlight: true,
                extensionMode: that.getOptions("paletteExtensionMode")
            })
        }
    }
}());
exports.ThemeManager = ThemeManager;
