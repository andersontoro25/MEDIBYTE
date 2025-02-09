/**
 * DevExtreme (viz/core/tooltip.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _dom_adapter = require("../../core/dom_adapter");
var _dom_adapter2 = _interopRequireDefault(_dom_adapter);
var _window = require("../../core/utils/window");
var _window2 = _interopRequireDefault(_window);
var _inflector = require("../../core/utils/inflector");
var _inflector2 = _interopRequireDefault(_inflector);
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _renderer3 = require("./renderers/renderer");
var _renderer4 = _interopRequireDefault(_renderer3);
var _type = require("../../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _extend = require("../../core/utils/extend");
var _utils = require("./utils");
var _utils2 = _interopRequireDefault(_utils);
var _format_helper = require("../../format_helper");
var _plaque = require("./plaque");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var mathCeil = Math.ceil;
var mathMax = Math.max;
var mathMin = Math.min;
var window = _window2.default.getWindow();

function hideElement($element) {
    $element.css({
        left: "-9999px"
    }).detach()
}

function getSpecialFormatOptions(options, specialFormat) {
    var result = options;
    switch (specialFormat) {
        case "argument":
            result = {
                format: options.argumentFormat
            };
            break;
        case "percent":
            result = {
                format: {
                    type: "percent",
                    precision: options.format && options.format.percentPrecision
                }
            }
    }
    return result
}

function Tooltip(params) {
    var renderer, root, that = this;
    that._eventTrigger = params.eventTrigger;
    that._widgetRoot = params.widgetRoot;
    that._wrapper = (0, _renderer2.default)("<div>").css({
        position: "absolute",
        overflow: "hidden",
        pointerEvents: "none"
    }).addClass(params.cssClass);
    that._renderer = renderer = new _renderer4.default.Renderer({
        pathModified: params.pathModified,
        container: that._wrapper[0]
    });
    root = renderer.root;
    root.attr({
        "pointer-events": "none"
    });
    that._text = renderer.text(void 0, 0, 0);
    that._textGroupHtml = (0, _renderer2.default)("<div>").css({
        position: "absolute",
        padding: 0,
        margin: 0,
        border: "0px solid transparent"
    }).appendTo(that._wrapper);
    that._textHtml = (0, _renderer2.default)("<div>").css({
        position: "relative",
        display: "inline-block",
        padding: 0,
        margin: 0,
        border: "0px solid transparent"
    }).appendTo(that._textGroupHtml)
}
Tooltip.prototype = {
    constructor: Tooltip,
    dispose: function() {
        this._wrapper.remove();
        this._renderer.dispose();
        this._options = this._widgetRoot = null
    },
    _getContainer: function() {
        var options = this._options,
            container = (0, _renderer2.default)(this._widgetRoot).closest(options.container);
        if (0 === container.length) {
            container = (0, _renderer2.default)(options.container)
        }
        return (container.length ? container : (0, _renderer2.default)("body")).get(0)
    },
    setOptions: function(options) {
        var _this = this;
        options = options || {};
        var that = this;
        that._options = options;
        that._textFontStyles = _utils2.default.patchFontOptions(options.font);
        that._textFontStyles.color = options.font.color;
        that._wrapper.css({
            zIndex: options.zIndex
        });
        that._customizeTooltip = options.customizeTooltip;
        var textGroupHtml = that._textGroupHtml;
        var textHtml = that._textHtml;
        if (this.plaque) {
            this.plaque.clear()
        }
        this.plaque = new _plaque.Plaque({
            opacity: that._options.opacity,
            color: that._options.color,
            border: that._options.border,
            paddingLeftRight: that._options.paddingLeftRight,
            paddingTopBottom: that._options.paddingTopBottom,
            arrowLength: that._options.arrowLength,
            arrowWidth: 20,
            shadow: that._options.shadow,
            cornerRadius: that._options.cornerRadius
        }, that, that._renderer.root, function(tooltip, group) {
            var state = tooltip._state;
            if (state.html) {
                if (!state.isRendered) {
                    that._text.attr({
                        text: ""
                    });
                    textGroupHtml.css({
                        color: state.textColor,
                        width: null
                    });
                    textHtml.html(state.html);
                    state.isRendered = true
                }
            } else {
                that._text.css({
                    fill: state.textColor
                }).attr({
                    text: state.text,
                    "class": options.cssClass
                }).append(group.attr({
                    align: options.textAlignment
                }))
            }
            _this.plaque.customizeCloud({
                fill: state.color,
                stroke: state.borderColor
            })
        }, true, function(tooltip, g) {
            var state = tooltip._state;
            if (state.html) {
                var bBox = void 0;
                var getComputedStyle = window.getComputedStyle;
                if (getComputedStyle) {
                    bBox = getComputedStyle(textHtml.get(0));
                    bBox = {
                        x: 0,
                        y: 0,
                        width: mathCeil(parseFloat(bBox.width)),
                        height: mathCeil(parseFloat(bBox.height))
                    }
                } else {
                    bBox = textHtml.get(0).getBoundingClientRect();
                    bBox = {
                        x: 0,
                        y: 0,
                        width: mathCeil(bBox.width ? bBox.width : bBox.right - bBox.left),
                        height: mathCeil(bBox.height ? bBox.height : bBox.bottom - bBox.top)
                    }
                }
                return bBox
            }
            return g.getBBox()
        }, function(tooltip, g, x, y) {
            var state = tooltip._state;
            if (state.html) {
                that._textGroupHtml.css({
                    left: x,
                    top: y
                })
            } else {
                g.move(x, y)
            }
        });
        return that
    },
    setRendererOptions: function(options) {
        this._renderer.setOptions(options);
        this._textGroupHtml.css({
            direction: options.rtl ? "rtl" : "ltr"
        });
        return this
    },
    render: function() {
        var that = this;
        hideElement(that._wrapper);
        var normalizedCSS = {};
        for (var name in that._textFontStyles) {
            normalizedCSS[_inflector2.default.camelize(name)] = that._textFontStyles[name]
        }
        that._textGroupHtml.css(normalizedCSS);
        that._text.css(that._textFontStyles);
        that._eventData = null;
        return that
    },
    update: function(options) {
        return this.setOptions(options).render()
    },
    _prepare: function(formatObject, state) {
        var customizeTooltip = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this._customizeTooltip;
        var options = this._options;
        var customize = {};
        if (_type2.default.isFunction(customizeTooltip)) {
            customize = customizeTooltip.call(formatObject, formatObject);
            customize = _type2.default.isPlainObject(customize) ? customize : {};
            if ("text" in customize) {
                state.text = _type2.default.isDefined(customize.text) ? String(customize.text) : ""
            }
            if ("html" in customize) {
                state.html = _type2.default.isDefined(customize.html) ? String(customize.html) : ""
            }
        }
        if (!("text" in state) && !("html" in state)) {
            state.text = formatObject.valueText || formatObject.description || ""
        }
        state.color = customize.color || options.color;
        state.borderColor = customize.borderColor || (options.border || {}).color;
        state.textColor = customize.fontColor || (options.font || {}).color;
        return !!state.text || !!state.html
    },
    show: function(formatObject, params, eventData, customizeTooltip) {
        var that = this,
            state = {};
        if (!that._prepare(formatObject, state, customizeTooltip)) {
            return false
        }
        that._state = state;
        that._wrapper.appendTo(that._getContainer());
        that._textHtml.html("");
        this.plaque.clear().draw((0, _extend.extend)({}, that._options, {
            canvas: that._getCanvas()
        }, state, {
            x: params.x,
            y: params.y,
            offset: params.offset
        }));
        that.moveWrapper();
        that._eventData && that._eventTrigger("tooltipHidden", that._eventData);
        that._eventData = eventData;
        that._eventTrigger("tooltipShown", that._eventData);
        return true
    },
    hide: function() {
        var that = this;
        hideElement(that._wrapper);
        that._eventData && that._eventTrigger("tooltipHidden", that._eventData);
        that._eventData = null
    },
    move: function(x, y, offset) {
        this.plaque.draw({
            x: x,
            y: y,
            offset: offset,
            canvas: this._getCanvas()
        });
        this.moveWrapper()
    },
    moveWrapper: function() {
        var that = this;
        var plaqueBBox = this.plaque.getBBox();
        that._renderer.resize(plaqueBBox.width, plaqueBBox.height);
        var offset = that._wrapper.css({
            left: 0,
            top: 0
        }).offset();
        var left = plaqueBBox.x;
        var top = plaqueBBox.y;
        that._wrapper.css({
            left: left - offset.left,
            top: top - offset.top
        });
        this.plaque.moveRoot(-left, -top);
        if (this._state.html) {
            that._textHtml.css({
                left: -left,
                top: -top
            });
            that._textGroupHtml.css({
                width: plaqueBBox.width
            })
        }
    },
    formatValue: function(value, _specialFormat) {
        var options = _specialFormat ? getSpecialFormatOptions(this._options, _specialFormat) : this._options;
        return (0, _format_helper.format)(value, options.format)
    },
    getLocation: function() {
        return _utils2.default.normalizeEnum(this._options.location)
    },
    isEnabled: function() {
        return !!this._options.enabled
    },
    isShared: function() {
        return !!this._options.shared
    },
    _getCanvas: function() {
        var container = this._getContainer();
        var containerBox = container.getBoundingClientRect();
        var html = _dom_adapter2.default.getDocumentElement();
        var document = _dom_adapter2.default.getDocument();
        var left = window.pageXOffset || html.scrollLeft || 0;
        var top = window.pageYOffset || html.scrollTop || 0;
        var box = {
            left: left,
            top: top,
            width: html.clientWidth + left || 0,
            height: mathMax(document.body.scrollHeight, html.scrollHeight, document.body.offsetHeight, html.offsetHeight, document.body.clientHeight, html.clientHeight) || 0,
            right: 0,
            bottom: 0
        };
        if (container !== _dom_adapter2.default.getBody()) {
            left = mathMax(box.left, box.left + containerBox.left);
            top = mathMax(box.top, box.top + containerBox.top);
            box.width = mathMin(containerBox.width, box.width) + left + box.left;
            box.height = mathMin(containerBox.height, box.height) + top + box.top;
            box.left = left;
            box.top = top
        }
        return box
    }
};
exports.Tooltip = Tooltip;
exports.plugin = {
    name: "tooltip",
    init: function() {
        this._initTooltip()
    },
    dispose: function() {
        this._disposeTooltip()
    },
    members: {
        _initTooltip: function() {
            this._tooltip = new exports.Tooltip({
                cssClass: this._rootClassPrefix + "-tooltip",
                eventTrigger: this._eventTrigger,
                pathModified: this.option("pathModified"),
                widgetRoot: this.element()
            })
        },
        _disposeTooltip: function() {
            this._tooltip.dispose();
            this._tooltip = null
        },
        _setTooltipRendererOptions: function() {
            this._tooltip.setRendererOptions(this._getRendererOptions())
        },
        _setTooltipOptions: function() {
            this._tooltip.update(this._getOption("tooltip"))
        }
    },
    extenders: {
        _stopCurrentHandling: function() {
            this._tooltip && this._tooltip.hide()
        }
    },
    customize: function(constructor) {
        var proto = constructor.prototype;
        proto._eventsMap.onTooltipShown = {
            name: "tooltipShown"
        };
        proto._eventsMap.onTooltipHidden = {
            name: "tooltipHidden"
        };
        constructor.addChange({
            code: "TOOLTIP_RENDERER",
            handler: function() {
                this._setTooltipRendererOptions()
            },
            isThemeDependent: true,
            isOptionChange: true
        });
        constructor.addChange({
            code: "TOOLTIP",
            handler: function() {
                this._setTooltipOptions()
            },
            isThemeDependent: true,
            isOptionChange: true,
            option: "tooltip"
        })
    },
    fontFields: ["tooltip.font"]
};
