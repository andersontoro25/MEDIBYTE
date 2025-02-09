/**
 * DevExtreme (viz/core/renderers/renderer.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _slicedToArray = function() {
    function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = void 0;
        try {
            for (var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i) {
                    break
                }
            }
        } catch (err) {
            _d = true;
            _e = err
        } finally {
            try {
                if (!_n && _i.return) {
                    _i.return()
                }
            } finally {
                if (_d) {
                    throw _e
                }
            }
        }
        return _arr
    }
    return function(arr, i) {
        if (Array.isArray(arr)) {
            return arr
        } else {
            if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i)
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }
    }
}();
var _renderer = require("../../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _dom_adapter = require("../../../core/dom_adapter");
var _dom_adapter2 = _interopRequireDefault(_dom_adapter);
var _window = require("../../../core/utils/window");
var _window2 = _interopRequireDefault(_window);
var _call_once = require("../../../core/utils/call_once");
var _call_once2 = _interopRequireDefault(_call_once);
var _events_engine = require("../../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _browser = require("../../../core/utils/browser");
var _browser2 = _interopRequireDefault(_browser);
var _svg = require("../../../core/utils/svg");
var _animation = require("./animation");
var _animation2 = _interopRequireDefault(_animation);
var _utils = require("../utils");
var _type = require("../../../core/utils/type");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var window = _window2.default.getWindow();
var max = Math.max,
    min = Math.min,
    floor = Math.floor,
    round = Math.round,
    sin = Math.sin,
    cos = Math.cos,
    abs = Math.abs,
    PI = Math.PI;
var PI_DIV_180 = PI / 180;
var SHARPING_CORRECTION = .5;
var ARC_COORD_PREC = 5;
var pxAddingExceptions = {
    "column-count": true,
    "fill-opacity": true,
    "flex-grow": true,
    "flex-shrink": true,
    "font-weight": true,
    "line-height": true,
    opacity: true,
    order: true,
    orphans: true,
    widows: true,
    "z-index": true,
    zoom: true
};
var KEY_TEXT = "text";
var KEY_STROKE = "stroke";
var KEY_STROKE_WIDTH = "stroke-width";
var KEY_STROKE_OPACITY = "stroke-opacity";
var KEY_FONT_SIZE = "font-size";
var KEY_FONT_STYLE = "font-style";
var KEY_FONT_WEIGHT = "font-weight";
var KEY_TEXT_DECORATION = "text-decoration";
var NONE = "none";
var DEFAULT_FONT_SIZE = 12;
var ELLIPSIS = "...";
var objectCreate = function() {
    if (!Object.create) {
        return function(proto) {
            var F = function() {};
            F.prototype = proto;
            return new F
        }
    } else {
        return function(proto) {
            return Object.create(proto)
        }
    }
}();
var DEFAULTS = {
    scaleX: 1,
    scaleY: 1,
    "pointer-events": ""
};
var getBackup = (0, _call_once2.default)(function() {
    var backupContainer = _dom_adapter2.default.createElement("div"),
        backupCounter = 0;
    backupContainer.style.left = "-9999px";
    backupContainer.style.position = "absolute";
    return {
        backupContainer: backupContainer,
        backupCounter: backupCounter
    }
});

function backupRoot(root) {
    if (0 === getBackup().backupCounter) {
        _dom_adapter2.default.getBody().appendChild(getBackup().backupContainer)
    }++getBackup().backupCounter;
    root.append({
        element: getBackup().backupContainer
    })
}

function restoreRoot(root, container) {
    root.append({
        element: container
    });
    --getBackup().backupCounter;
    if (0 === getBackup().backupCounter) {
        _dom_adapter2.default.getBody().removeChild(getBackup().backupContainer)
    }
}
var getNextDefsSvgId = function() {
    var numDefsSvgElements = 1;
    return function() {
        return "DevExpress_" + numDefsSvgElements++
    }
}();

function isObjectArgument(value) {
    return value && "string" !== typeof value
}

function createElement(tagName) {
    return _dom_adapter2.default.createElementNS("http://www.w3.org/2000/svg", tagName)
}

function getFuncIri(id, pathModified) {
    return null !== id ? "url(" + (pathModified ? window.location.href.split("#")[0] : "") + "#" + id + ")" : id
}

function extend(target, source) {
    var key = void 0;
    for (key in source) {
        target[key] = source[key]
    }
    return target
}

function roundValue(value, exp) {
    value = value.toString().split("e");
    value = round(+(value[0] + "e" + (value[1] ? +value[1] + exp : exp)));
    value = value.toString().split("e");
    return +(value[0] + "e" + (value[1] ? +value[1] - exp : -exp))
}

function getBoundingClientRect(element) {
    var box = void 0;
    try {
        box = element.getBoundingClientRect()
    } catch (e) {}
    return box || {
        left: 0,
        top: 0
    }
}
var preserveAspectRatioMap = {
    full: NONE,
    lefttop: "xMinYMin",
    leftcenter: "xMinYMid",
    leftbottom: "xMinYMax",
    centertop: "xMidYMin",
    center: "xMidYMid",
    centerbottom: "xMidYMax",
    righttop: "xMaxYMin",
    rightcenter: "xMaxYMid",
    rightbottom: "xMaxYMax"
};

function normalizeArcParams(x, y, innerR, outerR, startAngle, endAngle) {
    var isCircle = void 0,
        noArc = true,
        angleDiff = roundValue(endAngle, 3) - roundValue(startAngle, 3);
    if (angleDiff) {
        if (abs(angleDiff) % 360 === 0) {
            startAngle = 0;
            endAngle = 360;
            isCircle = true;
            endAngle -= .01
        }
        if (startAngle > 360) {
            startAngle %= 360
        }
        if (endAngle > 360) {
            endAngle %= 360
        }
        if (startAngle > endAngle) {
            startAngle -= 360
        }
        noArc = false
    }
    startAngle *= PI_DIV_180;
    endAngle *= PI_DIV_180;
    return [x, y, min(outerR, innerR), max(outerR, innerR), cos(startAngle), sin(startAngle), cos(endAngle), sin(endAngle), isCircle, floor(abs(endAngle - startAngle) / PI) % 2 ? "1" : "0", noArc]
}
var buildArcPath = function(x, y, innerR, outerR, startAngleCos, startAngleSin, endAngleCos, endAngleSin, isCircle, longFlag) {
    return ["M", (x + outerR * startAngleCos).toFixed(ARC_COORD_PREC), (y - outerR * startAngleSin).toFixed(ARC_COORD_PREC), "A", outerR.toFixed(ARC_COORD_PREC), outerR.toFixed(ARC_COORD_PREC), 0, longFlag, 0, (x + outerR * endAngleCos).toFixed(ARC_COORD_PREC), (y - outerR * endAngleSin).toFixed(ARC_COORD_PREC), isCircle ? "M" : "L", (x + innerR * endAngleCos).toFixed(5), (y - innerR * endAngleSin).toFixed(ARC_COORD_PREC), "A", innerR.toFixed(ARC_COORD_PREC), innerR.toFixed(ARC_COORD_PREC), 0, longFlag, 1, (x + innerR * startAngleCos).toFixed(ARC_COORD_PREC), (y - innerR * startAngleSin).toFixed(ARC_COORD_PREC), "Z"].join(" ")
};

function buildPathSegments(points, type) {
    var list = [
        ["M", 0, 0]
    ];
    switch (type) {
        case "line":
            list = buildLineSegments(points);
            break;
        case "area":
            list = buildLineSegments(points, true);
            break;
        case "bezier":
            list = buildCurveSegments(points);
            break;
        case "bezierarea":
            list = buildCurveSegments(points, true)
    }
    return list
}

function buildLineSegments(points, close) {
    return buildSegments(points, buildSimpleLineSegment, close)
}

function buildCurveSegments(points, close) {
    return buildSegments(points, buildSimpleCurveSegment, close)
}

function buildSegments(points, buildSimpleSegment, close) {
    var i = void 0,
        ii = void 0,
        list = [];
    if (points[0] && points[0].length) {
        for (i = 0, ii = points.length; i < ii; ++i) {
            buildSimpleSegment(points[i], close, list)
        }
    } else {
        buildSimpleSegment(points, close, list)
    }
    return list
}

function buildSimpleLineSegment(points, close, list) {
    var i = 0,
        k0 = list.length,
        k = k0,
        ii = (points || []).length;
    if (ii) {
        if (void 0 !== points[0].x) {
            for (; i < ii;) {
                list[k++] = ["L", points[i].x, points[i++].y]
            }
        } else {
            for (; i < ii;) {
                list[k++] = ["L", points[i++], points[i++]]
            }
        }
        list[k0][0] = "M"
    } else {
        list[k] = ["M", 0, 0]
    }
    close && list.push(["Z"]);
    return list
}

function buildSimpleCurveSegment(points, close, list) {
    var i = void 0,
        k = list.length,
        ii = (points || []).length;
    if (ii) {
        if (void 0 !== points[0].x) {
            list[k++] = ["M", points[0].x, points[0].y];
            for (i = 1; i < ii;) {
                list[k++] = ["C", points[i].x, points[i++].y, points[i].x, points[i++].y, points[i].x, points[i++].y]
            }
        } else {
            list[k++] = ["M", points[0], points[1]];
            for (i = 2; i < ii;) {
                list[k++] = ["C", points[i++], points[i++], points[i++], points[i++], points[i++], points[i++]]
            }
        }
    } else {
        list[k] = ["M", 0, 0]
    }
    close && list.push(["Z"]);
    return list
}

function combinePathParam(segments) {
    var d = [],
        k = 0,
        i = void 0,
        ii = segments.length,
        segment = void 0,
        j = void 0,
        jj = void 0;
    for (i = 0; i < ii; ++i) {
        segment = segments[i];
        for (j = 0, jj = segment.length; j < jj; ++j) {
            d[k++] = segment[j]
        }
    }
    return d.join(" ")
}

function compensateSegments(oldSegments, newSegments, type) {
    var oldLength = oldSegments.length,
        newLength = newSegments.length,
        i = void 0,
        originalNewSegments = void 0,
        makeEqualSegments = type.indexOf("area") !== -1 ? makeEqualAreaSegments : makeEqualLineSegments;
    if (0 === oldLength) {
        for (i = 0; i < newLength; i++) {
            oldSegments.push(newSegments[i].slice(0))
        }
    } else {
        if (oldLength < newLength) {
            makeEqualSegments(oldSegments, newSegments, type)
        } else {
            if (oldLength > newLength) {
                originalNewSegments = newSegments.slice(0);
                makeEqualSegments(newSegments, oldSegments, type)
            }
        }
    }
    return originalNewSegments
}

function prepareConstSegment(constSeg, type) {
    var x = constSeg[constSeg.length - 2],
        y = constSeg[constSeg.length - 1];
    switch (type) {
        case "line":
        case "area":
            constSeg[0] = "L";
            break;
        case "bezier":
        case "bezierarea":
            constSeg[0] = "C";
            constSeg[1] = constSeg[3] = constSeg[5] = x;
            constSeg[2] = constSeg[4] = constSeg[6] = y
    }
}

function makeEqualLineSegments(short, long, type) {
    var constSeg = short[short.length - 1].slice(),
        i = short.length;
    prepareConstSegment(constSeg, type);
    for (; i < long.length; i++) {
        short[i] = constSeg.slice(0)
    }
}

function makeEqualAreaSegments(short, long, type) {
    var i = void 0,
        head = void 0,
        shortLength = short.length,
        longLength = long.length,
        constsSeg1 = void 0,
        constsSeg2 = void 0;
    if ((shortLength - 1) % 2 === 0 && (longLength - 1) % 2 === 0) {
        i = (shortLength - 1) / 2 - 1;
        head = short.slice(0, i + 1);
        constsSeg1 = head[head.length - 1].slice(0);
        constsSeg2 = short.slice(i + 1)[0].slice(0);
        prepareConstSegment(constsSeg1, type);
        prepareConstSegment(constsSeg2, type);
        for (var j = i; j < (longLength - 1) / 2 - 1; j++) {
            short.splice(j + 1, 0, constsSeg1);
            short.splice(j + 3, 0, constsSeg2)
        }
    }
}

function baseCss(that, styles) {
    var elemStyles = that._styles,
        str = "",
        key = void 0,
        value = void 0;
    styles = styles || {};
    for (key in styles) {
        value = styles[key];
        if ((0, _type.isDefined)(value)) {
            value += "number" === typeof value && !pxAddingExceptions[key] ? "px" : "";
            elemStyles[key] = "" !== value ? value : null
        }
    }
    for (key in elemStyles) {
        value = elemStyles[key];
        if (value) {
            str += key + ":" + value + ";"
        }
    }
    str && that.element.setAttribute("style", str);
    return that
}

function fixFuncIri(wrapper, attribute) {
    var element = wrapper.element,
        id = wrapper.attr(attribute);
    if (id && id.indexOf("DevExpress") !== -1) {
        element.removeAttribute(attribute);
        element.setAttribute(attribute, getFuncIri(id, wrapper.renderer.pathModified))
    }
}

function baseAttr(that, attrs) {
    attrs = attrs || {};
    var settings = that._settings,
        attributes = {},
        key = void 0,
        value = void 0,
        elem = that.element,
        renderer = that.renderer,
        rtl = renderer.rtl,
        hasTransformations = void 0,
        recalculateDashStyle = void 0,
        sw = void 0,
        i = void 0;
    if (!isObjectArgument(attrs)) {
        if (attrs in settings) {
            return settings[attrs]
        }
        if (attrs in DEFAULTS) {
            return DEFAULTS[attrs]
        }
        return 0
    }
    extend(attributes, attrs);
    for (key in attributes) {
        value = attributes[key];
        if (void 0 === value) {
            continue
        }
        settings[key] = value;
        if ("align" === key) {
            key = "text-anchor";
            value = {
                left: rtl ? "end" : "start",
                center: "middle",
                right: rtl ? "start" : "end"
            } [value] || null
        } else {
            if ("dashStyle" === key) {
                recalculateDashStyle = true;
                continue
            } else {
                if (key === KEY_STROKE_WIDTH) {
                    recalculateDashStyle = true
                } else {
                    if (value && ("fill" === key || "clip-path" === key || "filter" === key) && value.indexOf("DevExpress") !== -1) {
                        that._addFixIRICallback();
                        value = getFuncIri(value, renderer.pathModified)
                    } else {
                        if (/^(translate(X|Y)|rotate[XY]?|scale(X|Y)|sharp|sharpDirection)$/i.test(key)) {
                            hasTransformations = true;
                            continue
                        } else {
                            if (/^(x|y|d)$/i.test(key)) {
                                hasTransformations = true
                            }
                        }
                    }
                }
            }
        }
        if (null === value) {
            elem.removeAttribute(key)
        } else {
            elem.setAttribute(key, value)
        }
    }
    if (recalculateDashStyle && "dashStyle" in settings) {
        value = settings.dashStyle;
        sw = ("_originalSW" in that ? that._originalSW : settings[KEY_STROKE_WIDTH]) || 1;
        key = "stroke-dasharray";
        value = null === value ? "" : (0, _utils.normalizeEnum)(value);
        if ("" === value || "solid" === value || value === NONE) {
            that.element.removeAttribute(key)
        } else {
            value = value.replace(/longdash/g, "8,3,").replace(/dash/g, "4,3,").replace(/dot/g, "1,3,").replace(/,$/, "").split(",");
            i = value.length;
            while (i--) {
                value[i] = parseInt(value[i]) * sw
            }
            that.element.setAttribute(key, value.join(","))
        }
    }
    if (hasTransformations) {
        that._applyTransformation()
    }
    return that
}

function pathAttr(attrs) {
    var that = this,
        segments = void 0;
    if (isObjectArgument(attrs)) {
        attrs = extend({}, attrs);
        segments = attrs.segments;
        if ("points" in attrs) {
            segments = buildPathSegments(attrs.points, that.type);
            delete attrs.points
        }
        if (segments) {
            attrs.d = combinePathParam(segments);
            that.segments = segments;
            delete attrs.segments
        }
    }
    return baseAttr(that, attrs)
}

function arcAttr(attrs) {
    var settings = this._settings,
        x = void 0,
        y = void 0,
        innerRadius = void 0,
        outerRadius = void 0,
        startAngle = void 0,
        endAngle = void 0;
    if (isObjectArgument(attrs)) {
        attrs = extend({}, attrs);
        if ("x" in attrs || "y" in attrs || "innerRadius" in attrs || "outerRadius" in attrs || "startAngle" in attrs || "endAngle" in attrs) {
            settings.x = x = "x" in attrs ? attrs.x : settings.x;
            delete attrs.x;
            settings.y = y = "y" in attrs ? attrs.y : settings.y;
            delete attrs.y;
            settings.innerRadius = innerRadius = "innerRadius" in attrs ? attrs.innerRadius : settings.innerRadius;
            delete attrs.innerRadius;
            settings.outerRadius = outerRadius = "outerRadius" in attrs ? attrs.outerRadius : settings.outerRadius;
            delete attrs.outerRadius;
            settings.startAngle = startAngle = "startAngle" in attrs ? attrs.startAngle : settings.startAngle;
            delete attrs.startAngle;
            settings.endAngle = endAngle = "endAngle" in attrs ? attrs.endAngle : settings.endAngle;
            delete attrs.endAngle;
            attrs.d = buildArcPath.apply(null, normalizeArcParams(x, y, innerRadius, outerRadius, startAngle, endAngle))
        }
    }
    return baseAttr(this, attrs)
}

function rectAttr(attrs) {
    var that = this,
        x = void 0,
        y = void 0,
        width = void 0,
        height = void 0,
        sw = void 0,
        maxSW = void 0,
        newSW = void 0;
    if (isObjectArgument(attrs)) {
        attrs = extend({}, attrs);
        if (void 0 !== attrs.x || void 0 !== attrs.y || void 0 !== attrs.width || void 0 !== attrs.height || void 0 !== attrs[KEY_STROKE_WIDTH]) {
            void 0 !== attrs.x ? x = that._originalX = attrs.x : x = that._originalX || 0;
            void 0 !== attrs.y ? y = that._originalY = attrs.y : y = that._originalY || 0;
            void 0 !== attrs.width ? width = that._originalWidth = attrs.width : width = that._originalWidth || 0;
            void 0 !== attrs.height ? height = that._originalHeight = attrs.height : height = that._originalHeight || 0;
            void 0 !== attrs[KEY_STROKE_WIDTH] ? sw = that._originalSW = attrs[KEY_STROKE_WIDTH] : sw = that._originalSW;
            maxSW = ~~((width < height ? width : height) / 2);
            newSW = (sw || 0) < maxSW ? sw || 0 : maxSW;
            attrs.x = x + newSW / 2;
            attrs.y = y + newSW / 2;
            attrs.width = width - newSW;
            attrs.height = height - newSW;
            ((sw || 0) !== newSW || !(0 === newSW && void 0 === sw)) && (attrs[KEY_STROKE_WIDTH] = newSW)
        }
        if ("sharp" in attrs) {
            delete attrs.sharp
        }
    }
    return baseAttr(that, attrs)
}

function textAttr(attrs) {
    var that = this,
        settings = void 0,
        isResetRequired = void 0,
        wasStroked = void 0,
        isStroked = void 0;
    if (!isObjectArgument(attrs)) {
        return baseAttr(that, attrs)
    }
    attrs = extend({}, attrs);
    settings = that._settings;
    wasStroked = (0, _type.isDefined)(settings[KEY_STROKE]) && (0, _type.isDefined)(settings[KEY_STROKE_WIDTH]);
    if (void 0 !== attrs[KEY_TEXT]) {
        settings[KEY_TEXT] = attrs[KEY_TEXT];
        delete attrs[KEY_TEXT];
        isResetRequired = true
    }
    if (void 0 !== attrs[KEY_STROKE]) {
        settings[KEY_STROKE] = attrs[KEY_STROKE];
        delete attrs[KEY_STROKE]
    }
    if (void 0 !== attrs[KEY_STROKE_WIDTH]) {
        settings[KEY_STROKE_WIDTH] = attrs[KEY_STROKE_WIDTH];
        delete attrs[KEY_STROKE_WIDTH]
    }
    if (void 0 !== attrs[KEY_STROKE_OPACITY]) {
        settings[KEY_STROKE_OPACITY] = attrs[KEY_STROKE_OPACITY];
        delete attrs[KEY_STROKE_OPACITY]
    }
    isStroked = (0, _type.isDefined)(settings[KEY_STROKE]) && (0, _type.isDefined)(settings[KEY_STROKE_WIDTH]);
    baseAttr(that, attrs);
    isResetRequired = isResetRequired || isStroked !== wasStroked && settings[KEY_TEXT];
    if (isResetRequired) {
        createTextNodes(that, settings.text, isStroked);
        that._hasEllipsis = false
    }
    if (isResetRequired || void 0 !== attrs.x || void 0 !== attrs.y) {
        locateTextNodes(that)
    }
    if (isStroked) {
        strokeTextNodes(that)
    }
    return that
}

function textCss(styles) {
    styles = styles || {};
    baseCss(this, styles);
    if (KEY_FONT_SIZE in styles) {
        locateTextNodes(this)
    }
    return this
}

function orderHtmlTree(list, line, node, parentStyle, parentClassName) {
    var style = void 0,
        realStyle = void 0,
        i = void 0,
        ii = void 0,
        nodes = void 0;
    if (void 0 !== node.wholeText) {
        list.push({
            value: node.wholeText,
            style: parentStyle,
            className: parentClassName,
            line: line,
            height: parentStyle[KEY_FONT_SIZE] || 0
        })
    } else {
        if ("BR" === node.tagName) {
            ++line
        } else {
            if (_dom_adapter2.default.isElementNode(node)) {
                extend(style = {}, parentStyle);
                switch (node.tagName) {
                    case "B":
                    case "STRONG":
                        style[KEY_FONT_WEIGHT] = "bold";
                        break;
                    case "I":
                    case "EM":
                        style[KEY_FONT_STYLE] = "italic";
                        break;
                    case "U":
                        style[KEY_TEXT_DECORATION] = "underline"
                }
                realStyle = node.style;
                realStyle.color && (style.fill = realStyle.color);
                realStyle.fontSize && (style[KEY_FONT_SIZE] = realStyle.fontSize);
                realStyle.fontStyle && (style[KEY_FONT_STYLE] = realStyle.fontStyle);
                realStyle.fontWeight && (style[KEY_FONT_WEIGHT] = realStyle.fontWeight);
                realStyle.textDecoration && (style[KEY_TEXT_DECORATION] = realStyle.textDecoration);
                for (i = 0, nodes = node.childNodes, ii = nodes.length; i < ii; ++i) {
                    line = orderHtmlTree(list, line, nodes[i], style, node.className || parentClassName)
                }
            }
        }
    }
    return line
}

function adjustLineHeights(items) {
    var i = void 0,
        ii = void 0,
        currentItem = items[0],
        item = void 0;
    for (i = 1, ii = items.length; i < ii; ++i) {
        item = items[i];
        if (item.line === currentItem.line) {
            currentItem.height = maxLengthFontSize(currentItem.height, item.height);
            currentItem.inherits = currentItem.inherits || 0 === parseFloat(item.height);
            item.height = NaN
        } else {
            currentItem = item
        }
    }
}

function removeExtraAttrs(html) {
    var findTagAttrs = /(?:(<[a-z0-9]+\s*))([\s\S]*?)(>|\/>)/gi,
        findStyleAndClassAttrs = /(style|class)\s*=\s*(["'])(?:(?!\2).)*\2\s?/gi;
    return html.replace(findTagAttrs, function(allTagAttrs, p1, p2, p3) {
        p2 = (p2 && p2.match(findStyleAndClassAttrs) || []).map(function(str) {
            return str
        }).join(" ");
        return p1 + p2 + p3
    })
}

function parseHTML(text) {
    var items = [],
        div = _dom_adapter2.default.createElement("div");
    div.innerHTML = text.replace(/\r/g, "").replace(/\n/g, "<br/>");
    orderHtmlTree(items, 0, div, {}, "");
    adjustLineHeights(items);
    return items
}

function parseMultiline(text) {
    var texts = text.replace(/\r/g, "").split(/\n/g),
        i = 0,
        items = [];
    for (; i < texts.length; i++) {
        items.push({
            value: texts[i].trim(),
            height: 0,
            line: i
        })
    }
    return items
}

function createTspans(items, element, fieldName) {
    var i = void 0,
        ii = void 0,
        item = void 0;
    for (i = 0, ii = items.length; i < ii; ++i) {
        item = items[i];
        item[fieldName] = createElement("tspan");
        item[fieldName].appendChild(_dom_adapter2.default.createTextNode(item.value));
        item.style && baseCss({
            element: item[fieldName],
            _styles: {}
        }, item.style);
        item.className && item[fieldName].setAttribute("class", item.className);
        element.appendChild(item[fieldName])
    }
}

function restoreText() {
    if (this._hasEllipsis) {
        this.attr({
            text: this._settings.text
        })
    }
}

function applyEllipsis(maxWidth) {
    var that = this,
        lines = void 0,
        hasEllipsis = false,
        i = void 0,
        ii = void 0,
        lineParts = void 0,
        j = void 0,
        jj = void 0,
        text = void 0,
        ellipsis = void 0,
        ellipsisWidth = void 0;
    restoreText.call(that);
    ellipsis = that.renderer.text(ELLIPSIS).attr(that._styles).append(that.renderer.root);
    ellipsisWidth = ellipsis.getBBox().width;
    if (that._getElementBBox().width > maxWidth) {
        if (maxWidth - ellipsisWidth < 0) {
            maxWidth = 0
        } else {
            maxWidth -= ellipsisWidth
        }
        lines = prepareLines(that.element, that._texts, maxWidth);
        for (i = 0, ii = lines.length; i < ii; ++i) {
            lineParts = lines[i].parts;
            if (1 === lines[i].commonLength) {
                continue
            }
            for (j = 0, jj = lineParts.length; j < jj; ++j) {
                text = lineParts[j];
                if ((0, _type.isDefined)(text.endIndex)) {
                    setNewText(text, text.endIndex);
                    hasEllipsis = true
                } else {
                    if (text.startBox > maxWidth) {
                        removeTextSpan(text)
                    }
                }
            }
        }
    }
    ellipsis.remove();
    that._hasEllipsis = hasEllipsis;
    return hasEllipsis
}

function cloneAndRemoveAttrs(node) {
    var clone = void 0;
    if (node) {
        clone = node.cloneNode();
        clone.removeAttribute("y");
        clone.removeAttribute("x")
    }
    return clone || node
}

function detachAndStoreTitleElements(element) {
    var titleElements = _dom_adapter2.default.querySelectorAll(element, "title");
    for (var i = 0; i < titleElements.length; i++) {
        element.removeChild(titleElements[i])
    }
    return function() {
        for (var _i = 0; _i < titleElements.length; _i++) {
            element.appendChild(titleElements[_i])
        }
    }
}

function setMaxSize(maxWidth, maxHeight) {
    var options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    var that = this,
        lines = [],
        textChanged = false,
        textIsEmpty = false,
        ellipsis = void 0,
        ellipsisWidth = void 0,
        ellipsisMaxWidth = maxWidth;
    restoreText.call(that);
    var restoreTitleElement = detachAndStoreTitleElements(this.element);
    ellipsis = that.renderer.text(ELLIPSIS).attr(that._styles).append(that.renderer.root);
    ellipsisWidth = ellipsis.getBBox().width;
    var _that$_getElementBBox = that._getElementBBox(),
        width = _that$_getElementBBox.width,
        height = _that$_getElementBBox.height;
    if (width > maxWidth || maxHeight && height > maxHeight) {
        if (maxWidth - ellipsisWidth < 0) {
            ellipsisMaxWidth = 0
        } else {
            ellipsisMaxWidth -= ellipsisWidth
        }
        lines = applyOverflowRules(that.element, that._texts, maxWidth, ellipsisMaxWidth, options, maxHeight);
        lines = setMaxHeight(lines, ellipsisMaxWidth, options, maxHeight, parseFloat(this._getLineHeight()));
        this._texts = lines.reduce(function(texts, line) {
            return texts.concat(line.parts)
        }, []).filter(function(t) {
            return "" !== t.value
        }).map(function(t) {
            t.stroke && t.tspan.parentNode.appendChild(t.stroke);
            return t
        }).map(function(t) {
            t.tspan.parentNode.appendChild(t.tspan);
            return t
        });
        !this._texts.length && (this._texts = null);
        textChanged = true;
        if (this._texts) {
            locateTextNodes(this)
        } else {
            this.element.textContent = "";
            textIsEmpty = true
        }
    }
    ellipsis.remove();
    that._hasEllipsis = textChanged;
    restoreTitleElement();
    return {
        rowCount: lines.length,
        textChanged: textChanged,
        textIsEmpty: textIsEmpty
    }
}

function getIndexForEllipsis(text, maxWidth, startBox, endBox) {
    var k = void 0,
        kk = void 0;
    if (startBox <= maxWidth && endBox > maxWidth) {
        for (k = 1, kk = text.value.length; k <= kk; ++k) {
            if (startBox + text.tspan.getSubStringLength(0, k) > maxWidth) {
                return k - 1
            }
        }
    }
}

function getTextWidth(text) {
    return text.value.length ? text.tspan.getSubStringLength(0, text.value.length) : 0
}

function prepareLines(element, texts, maxWidth) {
    var lines = [],
        i = void 0,
        ii = void 0,
        text = void 0,
        startBox = void 0,
        endBox = void 0;
    if (texts) {
        for (i = 0, ii = texts.length; i < ii; ++i) {
            text = texts[i];
            if (!lines[text.line]) {
                text.startBox = startBox = 0;
                lines.push({
                    commonLength: text.value.length,
                    parts: [text]
                })
            } else {
                text.startBox = startBox;
                lines[text.line].parts.push(text);
                lines[text.line].commonLength += text.value.length
            }
            endBox = startBox + text.tspan.getSubStringLength(0, text.value.length);
            text.endIndex = getIndexForEllipsis(text, maxWidth, startBox, endBox);
            startBox = endBox
        }
    } else {
        text = {
            value: element.textContent,
            tspan: element
        };
        text.startBox = startBox = 0;
        endBox = startBox + getTextWidth(text);
        text.endIndex = getIndexForEllipsis(text, maxWidth, startBox, endBox);
        lines = [{
            commonLength: element.textContent.length,
            parts: [text]
        }]
    }
    return lines
}

function getSpaceBreakIndex(text, maxWidth) {
    var initialIndices = text.startBox > 0 ? [0] : [];
    var spaceIndices = text.value.split("").reduce(function(indices, char, index) {
        if (" " === char) {
            indices.push(index)
        }
        return indices
    }, initialIndices);
    var spaceIndex = 0;
    while (void 0 !== spaceIndices[spaceIndex + 1] && text.startBox + text.tspan.getSubStringLength(0, spaceIndices[spaceIndex + 1]) < maxWidth) {
        spaceIndex++
    }
    return spaceIndices[spaceIndex]
}

function getWordBreakIndex(text, maxWidth) {
    for (var i = 0; i < text.value.length - 1; i++) {
        if (text.startBox + text.tspan.getSubStringLength(0, i + 1) > maxWidth) {
            return i
        }
    }
}

function getEllipsisString(ellipsisMaxWidth, _ref) {
    var hideOverflowEllipsis = _ref.hideOverflowEllipsis;
    return hideOverflowEllipsis && 0 === ellipsisMaxWidth ? "" : ELLIPSIS
}

function setEllipsis(text, ellipsisMaxWidth, options) {
    var ellipsis = getEllipsisString(ellipsisMaxWidth, options);
    if (text.value.length && text.tspan.parentNode) {
        for (var i = text.value.length - 1; i >= 1; i--) {
            if (text.startBox + text.tspan.getSubStringLength(0, i) < ellipsisMaxWidth) {
                setNewText(text, i, ellipsis);
                break
            } else {
                if (1 === i) {
                    setNewText(text, 0, ellipsis)
                }
            }
        }
    }
}

function wordWrap(text, maxWidth, ellipsisMaxWidth, options) {
    var wholeText = text.value;
    var breakIndex = void 0;
    if ("none" !== options.wordWrap) {
        breakIndex = "normal" === options.wordWrap ? getSpaceBreakIndex(text, maxWidth) : getWordBreakIndex(text, maxWidth)
    }
    var restLines = [];
    var restText = void 0;
    if (isFinite(breakIndex)) {
        setNewText(text, breakIndex, "");
        var newTextOffset = " " === wholeText[breakIndex] ? 1 : 0;
        var restString = wholeText.slice(breakIndex + newTextOffset);
        if (restString.length) {
            var restTspan = cloneAndRemoveAttrs(text.tspan);
            restTspan.textContent = restString;
            text.tspan.parentNode.appendChild(restTspan);
            restText = extend(extend({}, text), {
                value: restString,
                startBox: 0,
                height: 0,
                tspan: restTspan,
                stroke: cloneAndRemoveAttrs(text.stroke),
                endBox: restTspan.getSubStringLength(0, restString.length)
            });
            restText.stroke && (restText.stroke.textContent = restString);
            if (restText.endBox > maxWidth) {
                restLines = wordWrap(restText, maxWidth, ellipsisMaxWidth, options);
                if (!restLines.length) {
                    return []
                }
            }
        }
    }
    if (text.value.length) {
        if ("ellipsis" === options.textOverflow && text.tspan.getSubStringLength(0, text.value.length) > maxWidth) {
            setEllipsis(text, ellipsisMaxWidth, options)
        }
        if ("hide" === options.textOverflow && text.tspan.getSubStringLength(0, text.value.length) > maxWidth) {
            return []
        }
    } else {
        text.tspan.parentNode.removeChild(text.tspan)
    }
    var parts = [];
    if (restText) {
        parts.push(restText)
    }
    return [{
        commonLength: wholeText.length,
        parts: parts
    }].concat(restLines)
}

function calculateLineHeight(line, lineHeight) {
    return line.parts.reduce(function(height, text) {
        return max(height, getItemLineHeight(text, lineHeight))
    }, 0)
}

function setMaxHeight(lines, ellipsisMaxWidth, options, maxHeight, lineHeight) {
    var textOverflow = options.textOverflow;
    if (!isFinite(maxHeight) || 0 === Number(maxHeight) || "none" === textOverflow) {
        return lines
    }
    var result = lines.reduce(function(_ref2, l, index, arr) {
        var _ref3 = _slicedToArray(_ref2, 2),
            lines = _ref3[0],
            commonHeight = _ref3[1];
        var height = calculateLineHeight(l, lineHeight);
        commonHeight += height;
        if (commonHeight < maxHeight) {
            lines.push(l)
        } else {
            l.parts.forEach(function(item) {
                removeTextSpan(item)
            });
            if ("ellipsis" === textOverflow) {
                var prevLine = arr[index - 1];
                if (prevLine) {
                    var text = prevLine.parts[prevLine.parts.length - 1];
                    if (!text.hasEllipsis) {
                        if (0 === ellipsisMaxWidth || text.endBox < ellipsisMaxWidth) {
                            setNewText(text, text.value.length, getEllipsisString(ellipsisMaxWidth, options))
                        } else {
                            setEllipsis(text, ellipsisMaxWidth, options)
                        }
                    }
                }
            }
        }
        return [lines, commonHeight]
    }, [
        [], 0
    ]);
    if ("hide" === textOverflow && result[1] > maxHeight) {
        result[0].forEach(function(l) {
            l.parts.forEach(function(item) {
                removeTextSpan(item)
            })
        });
        return []
    }
    return result[0]
}

function applyOverflowRules(element, texts, maxWidth, ellipsisMaxWidth, options) {
    if (!texts) {
        var textValue = element.textContent;
        var text = {
            value: textValue,
            height: 0,
            line: 0
        };
        element.textContent = "";
        createTspans([text], element, "tspan");
        texts = [text]
    }
    return texts.reduce(function(_ref4, text) {
        var _ref5 = _slicedToArray(_ref4, 5),
            lines = _ref5[0],
            startBox = _ref5[1],
            endBox = _ref5[2],
            stop = _ref5[3],
            lineNumber = _ref5[4];
        var line = lines[lines.length - 1];
        if (stop) {
            return [lines, startBox, endBox, stop]
        }
        if (!line || text.line !== lineNumber) {
            text.startBox = startBox = 0;
            lines.push({
                commonLength: text.value.length,
                parts: [text]
            })
        } else {
            text.startBox = startBox;
            if (startBox > ellipsisMaxWidth && "none" === options.wordWrap && "ellipsis" === options.textOverflow) {
                removeTextSpan(text);
                return [lines, startBox, endBox, stop, lineNumber]
            }
            line.parts.push(text);
            line.commonLength += text.value.length
        }
        text.endBox = endBox = startBox + getTextWidth(text);
        startBox = endBox;
        if ((0, _type.isDefined)(maxWidth) && endBox > maxWidth) {
            var wordWrapLines = wordWrap(text, maxWidth, ellipsisMaxWidth, options);
            if (!wordWrapLines.length) {
                lines = [];
                stop = true
            } else {
                lines = lines.concat(wordWrapLines.filter(function(l) {
                    return l.parts.length > 0
                }))
            }
        }
        return [lines, startBox, endBox, stop, text.line]
    }, [
        [], 0, 0, false, 0
    ])[0]
}

function setNewText(text, index) {
    var insertString = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : ELLIPSIS;
    var newText = text.value.substr(0, index) + insertString;
    text.value = text.tspan.textContent = newText;
    text.stroke && (text.stroke.textContent = newText);
    if (insertString === ELLIPSIS) {
        text.hasEllipsis = true
    }
}

function removeTextSpan(text) {
    text.tspan.parentNode && text.tspan.parentNode.removeChild(text.tspan);
    text.stroke && text.stroke.parentNode && text.stroke.parentNode.removeChild(text.stroke)
}

function createTextNodes(wrapper, text, isStroked) {
    var items = void 0,
        parsedHtml = void 0;
    wrapper._texts = null;
    wrapper.clear();
    if (null === text) {
        return
    }
    text = "" + text;
    if (!wrapper.renderer.encodeHtml && (/<[a-z][\s\S]*>/i.test(text) || text.indexOf("&") !== -1)) {
        parsedHtml = removeExtraAttrs(text);
        items = parseHTML(parsedHtml)
    } else {
        if (/\n/g.test(text)) {
            items = parseMultiline(text)
        } else {
            if (isStroked) {
                items = [{
                    value: text.trim(),
                    height: 0
                }]
            }
        }
    }
    if (items) {
        if (items.length) {
            wrapper._texts = items;
            if (isStroked) {
                createTspans(items, wrapper.element, KEY_STROKE)
            }
            createTspans(items, wrapper.element, "tspan")
        }
    } else {
        wrapper.element.appendChild(_dom_adapter2.default.createTextNode(text))
    }
}

function setTextNodeAttribute(item, name, value) {
    item.tspan.setAttribute(name, value);
    item.stroke && item.stroke.setAttribute(name, value)
}

function getItemLineHeight(item, defaultValue) {
    return item.inherits ? maxLengthFontSize(item.height, defaultValue) : item.height || defaultValue
}

function locateTextNodes(wrapper) {
    if (!wrapper._texts) {
        return
    }
    var items = wrapper._texts,
        x = wrapper._settings.x,
        lineHeight = wrapper._getLineHeight(),
        i = void 0,
        ii = void 0,
        item = items[0];
    setTextNodeAttribute(item, "x", x);
    setTextNodeAttribute(item, "y", wrapper._settings.y);
    for (i = 1, ii = items.length; i < ii; ++i) {
        item = items[i];
        if (parseFloat(item.height) >= 0) {
            setTextNodeAttribute(item, "x", x);
            var height = getItemLineHeight(item, lineHeight);
            setTextNodeAttribute(item, "dy", height)
        }
    }
}

function maxLengthFontSize(fontSize1, fontSize2) {
    var parsedHeight1 = parseFloat(fontSize1),
        parsedHeight2 = parseFloat(fontSize2),
        height1 = parsedHeight1 || DEFAULT_FONT_SIZE,
        height2 = parsedHeight2 || DEFAULT_FONT_SIZE;
    return height1 > height2 ? !isNaN(parsedHeight1) ? fontSize1 : height1 : !isNaN(parsedHeight2) ? fontSize2 : height2
}

function strokeTextNodes(wrapper) {
    if (!wrapper._texts) {
        return
    }
    var items = wrapper._texts,
        stroke = wrapper._settings[KEY_STROKE],
        strokeWidth = wrapper._settings[KEY_STROKE_WIDTH],
        strokeOpacity = wrapper._settings[KEY_STROKE_OPACITY] || 1,
        tspan = void 0,
        i = void 0,
        ii = void 0;
    for (i = 0, ii = items.length; i < ii; ++i) {
        tspan = items[i].stroke;
        tspan.setAttribute(KEY_STROKE, stroke);
        tspan.setAttribute(KEY_STROKE_WIDTH, strokeWidth);
        tspan.setAttribute(KEY_STROKE_OPACITY, strokeOpacity);
        tspan.setAttribute("stroke-linejoin", "round")
    }
}

function baseAnimate(that, params, options, complete) {
    options = options || {};
    var key = void 0,
        value = void 0,
        renderer = that.renderer,
        settings = that._settings,
        animationParams = {};
    var defaults = {
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        rotateX: 0,
        rotateY: 0
    };
    if (complete) {
        options.complete = complete
    }
    if (renderer.animationEnabled()) {
        for (key in params) {
            value = params[key];
            if (/^(translate(X|Y)|rotate[XY]?|scale(X|Y))$/i.test(key)) {
                animationParams.transform = animationParams.transform || {
                    from: {},
                    to: {}
                };
                animationParams.transform.from[key] = key in settings ? Number(settings[key].toFixed(3)) : defaults[key];
                animationParams.transform.to[key] = value
            } else {
                if ("arc" === key || "segments" === key) {
                    animationParams[key] = value
                } else {
                    animationParams[key] = {
                        from: key in settings ? settings[key] : parseFloat(that.element.getAttribute(key) || 0),
                        to: value
                    }
                }
            }
        }
        renderer.animateElement(that, animationParams, extend(extend({}, renderer._animation), options))
    } else {
        options.step && options.step.call(that, 1, 1);
        options.complete && options.complete.call(that);
        that.attr(params)
    }
    return that
}

function pathAnimate(params, options, complete) {
    var that = this,
        curSegments = that.segments || [],
        newSegments = void 0,
        endSegments = void 0;
    if (that.renderer.animationEnabled() && "points" in params) {
        newSegments = buildPathSegments(params.points, that.type);
        endSegments = compensateSegments(curSegments, newSegments, that.type);
        params.segments = {
            from: curSegments,
            to: newSegments,
            end: endSegments
        };
        delete params.points
    }
    return baseAnimate(that, params, options, complete)
}

function arcAnimate(params, options, complete) {
    var that = this,
        settings = that._settings,
        arcParams = {
            from: {},
            to: {}
        };
    if (that.renderer.animationEnabled() && ("x" in params || "y" in params || "innerRadius" in params || "outerRadius" in params || "startAngle" in params || "endAngle" in params)) {
        arcParams.from.x = settings.x || 0;
        arcParams.from.y = settings.y || 0;
        arcParams.from.innerRadius = settings.innerRadius || 0;
        arcParams.from.outerRadius = settings.outerRadius || 0;
        arcParams.from.startAngle = settings.startAngle || 0;
        arcParams.from.endAngle = settings.endAngle || 0;
        arcParams.to.x = "x" in params ? params.x : settings.x;
        delete params.x;
        arcParams.to.y = "y" in params ? params.y : settings.y;
        delete params.y;
        arcParams.to.innerRadius = "innerRadius" in params ? params.innerRadius : settings.innerRadius;
        delete params.innerRadius;
        arcParams.to.outerRadius = "outerRadius" in params ? params.outerRadius : settings.outerRadius;
        delete params.outerRadius;
        arcParams.to.startAngle = "startAngle" in params ? params.startAngle : settings.startAngle;
        delete params.startAngle;
        arcParams.to.endAngle = "endAngle" in params ? params.endAngle : settings.endAngle;
        delete params.endAngle;
        params.arc = arcParams
    }
    return baseAnimate(that, params, options, complete)
}

function buildLink(target, parameters) {
    var obj = {
        is: false,
        name: parameters.name || parameters,
        after: parameters.after
    };
    if (target) {
        obj.to = target
    } else {
        obj.virtual = true
    }
    return obj
}

function SvgElement(renderer, tagName, type) {
    var that = this;
    that.renderer = renderer;
    that.element = createElement(tagName);
    that._settings = {};
    that._styles = {};
    if ("path" === tagName) {
        that.type = type || "line";
    }
}

function removeFuncIriCallback(callback) {
    fixFuncIriCallbacks.remove(callback)
}
exports.SvgElement = SvgElement;
SvgElement.prototype = {
    constructor: SvgElement,
    _getJQElement: function() {
        return this._$element || (this._$element = (0, _renderer2.default)(this.element))
    },
    _addFixIRICallback: function() {
        var that = this,
            fn = function() {
                fixFuncIri(that, "fill");
                fixFuncIri(that, "clip-path");
                fixFuncIri(that, "filter")
            };
        that.element._fixFuncIri = fn;
        fn.renderer = that.renderer;
        fixFuncIriCallbacks.add(fn);
        that._addFixIRICallback = function() {}
    },
    _clearChildrenFuncIri: function() {
        var clearChildren = function clearChildren(element) {
            var i = void 0;
            for (i = 0; i < element.childNodes.length; i++) {
                removeFuncIriCallback(element.childNodes[i]._fixFuncIri);
                clearChildren(element.childNodes[i])
            }
        };
        clearChildren(this.element)
    },
    dispose: function() {
        removeFuncIriCallback(this.element._fixFuncIri);
        this._clearChildrenFuncIri();
        this._getJQElement().remove();
        return this
    },
    append: function(parent) {
        (parent || this.renderer.root).element.appendChild(this.element);
        return this
    },
    remove: function() {
        var element = this.element;
        element.parentNode && element.parentNode.removeChild(element);
        return this
    },
    enableLinks: function() {
        this._links = [];
        return this
    },
    virtualLink: function(parameters) {
        linkItem({
            _link: buildLink(null, parameters)
        }, this);
        return this
    },
    linkAfter: function(name) {
        this._linkAfter = name;
        return this
    },
    linkOn: function(target, parameters) {
        this._link = buildLink(target, parameters);
        linkItem(this, target);
        return this
    },
    linkOff: function() {
        unlinkItem(this);
        this._link = null;
        return this
    },
    linkAppend: function() {
        var link = this._link,
            items = link.to._links,
            i = void 0,
            next = void 0;
        for (i = link.i + 1;
            (next = items[i]) && !next._link.is; ++i) {}
        this._insert(link.to, next);
        link.is = true;
        return this
    },
    _insert: function(parent, next) {
        parent.element.insertBefore(this.element, next ? next.element : null)
    },
    linkRemove: function() {
        this.remove();
        this._link.is = false;
        return this
    },
    clear: function() {
        this._clearChildrenFuncIri();
        this._getJQElement().empty();
        return this
    },
    toBackground: function() {
        var elem = this.element,
            parent = elem.parentNode;
        parent && parent.insertBefore(elem, parent.firstChild);
        return this
    },
    toForeground: function() {
        var elem = this.element,
            parent = elem.parentNode;
        parent && parent.appendChild(elem);
        return this
    },
    attr: function(attrs) {
        return baseAttr(this, attrs)
    },
    smartAttr: function(attrs) {
        var that = this;
        if (attrs.hatching && "none" !== (0, _utils.normalizeEnum)(attrs.hatching.direction)) {
            attrs = extend({}, attrs);
            attrs.fill = that._hatching = that.renderer.lockHatching(attrs.fill, attrs.hatching, that._hatching);
            delete attrs.hatching
        } else {
            if (that._hatching) {
                that.renderer.releaseHatching(that._hatching);
                that._hatching = null
            }
        }
        return that.attr(attrs)
    },
    css: function(styles) {
        return baseCss(this, styles)
    },
    animate: function(params, options, complete) {
        return baseAnimate(this, params, options, complete)
    },
    sharp: function(pos, sharpDirection) {
        return this.attr({
            sharp: pos || true,
            sharpDirection: sharpDirection
        })
    },
    _applyTransformation: function() {
        var tr = this._settings;
        var scaleXDefined = void 0;
        var scaleYDefined = void 0;
        var rotateX = void 0;
        var rotateY = void 0;
        var transformations = [];
        var sharpMode = tr.sharp;
        var trDirection = tr.sharpDirection || 1;
        var strokeOdd = tr[KEY_STROKE_WIDTH] % 2;
        var correctionX = strokeOdd && ("h" === sharpMode || true === sharpMode) ? SHARPING_CORRECTION * trDirection : 0;
        var correctionY = strokeOdd && ("v" === sharpMode || true === sharpMode) ? SHARPING_CORRECTION * trDirection : 0;
        transformations.push("translate(" + ((tr.translateX || 0) + correctionX) + "," + ((tr.translateY || 0) + correctionY) + ")");
        if (tr.rotate) {
            if ("rotateX" in tr) {
                rotateX = tr.rotateX
            } else {
                rotateX = tr.x
            }
            if ("rotateY" in tr) {
                rotateY = tr.rotateY
            } else {
                rotateY = tr.y
            }
            transformations.push("rotate(" + tr.rotate + "," + (rotateX || 0) + "," + (rotateY || 0) + ")")
        }
        scaleXDefined = (0, _type.isDefined)(tr.scaleX);
        scaleYDefined = (0, _type.isDefined)(tr.scaleY);
        if (scaleXDefined || scaleYDefined) {
            transformations.push("scale(" + (scaleXDefined ? tr.scaleX : 1) + "," + (scaleYDefined ? tr.scaleY : 1) + ")")
        }
        if (transformations.length) {
            this.element.setAttribute("transform", transformations.join(" "))
        }
    },
    move: function(x, y, animate, animOptions) {
        var obj = {};
        (0, _type.isDefined)(x) && (obj.translateX = x);
        (0, _type.isDefined)(y) && (obj.translateY = y);
        if (!animate) {
            this.attr(obj)
        } else {
            this.animate(obj, animOptions)
        }
        return this
    },
    rotate: function(angle, x, y, animate, animOptions) {
        var obj = {
            rotate: angle || 0
        };
        (0, _type.isDefined)(x) && (obj.rotateX = x);
        (0, _type.isDefined)(y) && (obj.rotateY = y);
        if (!animate) {
            this.attr(obj)
        } else {
            this.animate(obj, animOptions)
        }
        return this
    },
    _getElementBBox: function() {
        var elem = this.element,
            bBox = void 0;
        try {
            bBox = elem.getBBox && elem.getBBox()
        } catch (e) {}
        return bBox || {
            x: 0,
            y: 0,
            width: elem.offsetWidth || 0,
            height: elem.offsetHeight || 0
        }
    },
    getBBox: function() {
        var transformation = this._settings,
            bBox = this._getElementBBox();
        if (transformation.rotate) {
            bBox = (0, _utils.rotateBBox)(bBox, [("rotateX" in transformation ? transformation.rotateX : transformation.x) || 0, ("rotateY" in transformation ? transformation.rotateY : transformation.y) || 0], -transformation.rotate)
        } else {
            bBox = (0, _utils.normalizeBBox)(bBox)
        }
        return bBox
    },
    markup: function() {
        return (0, _svg.getSvgMarkup)(this.element)
    },
    getOffset: function() {
        return this._getJQElement().offset()
    },
    stopAnimation: function(disableComplete) {
        var animation = this.animation;
        animation && animation.stop(disableComplete);
        return this
    },
    setTitle: function(text) {
        var titleElem = createElement("title");
        titleElem.textContent = text || "";
        this.element.appendChild(titleElem)
    },
    data: function(obj, val) {
        var elem = this.element,
            key = void 0;
        if (void 0 !== val) {
            elem[obj] = val
        } else {
            for (key in obj) {
                elem[key] = obj[key]
            }
        }
        return this
    },
    on: function() {
        var args = [this._getJQElement()];
        args.push.apply(args, arguments);
        _events_engine2.default.on.apply(_events_engine2.default, args);
        return this
    },
    off: function() {
        var args = [this._getJQElement()];
        args.push.apply(args, arguments);
        _events_engine2.default.off.apply(_events_engine2.default, args);
        return this
    },
    trigger: function() {
        var args = [this._getJQElement()];
        args.push.apply(args, arguments);
        _events_engine2.default.trigger.apply(_events_engine2.default, args);
        return this
    }
};

function PathSvgElement(renderer, type) {
    SvgElement.call(this, renderer, "path", type)
}
exports.PathSvgElement = PathSvgElement;
PathSvgElement.prototype = objectCreate(SvgElement.prototype);
extend(PathSvgElement.prototype, {
    constructor: PathSvgElement,
    attr: pathAttr,
    animate: pathAnimate
});

function ArcSvgElement(renderer) {
    SvgElement.call(this, renderer, "path", "arc")
}
exports.ArcSvgElement = ArcSvgElement;
ArcSvgElement.prototype = objectCreate(SvgElement.prototype);
extend(ArcSvgElement.prototype, {
    constructor: ArcSvgElement,
    attr: arcAttr,
    animate: arcAnimate
});

function RectSvgElement(renderer) {
    SvgElement.call(this, renderer, "rect")
}
exports.RectSvgElement = RectSvgElement;
RectSvgElement.prototype = objectCreate(SvgElement.prototype);
extend(RectSvgElement.prototype, {
    constructor: RectSvgElement,
    attr: rectAttr
});

function TextSvgElement(renderer) {
    SvgElement.call(this, renderer, "text");
    this.css({
        "white-space": "pre"
    })
}
exports.TextSvgElement = TextSvgElement;
TextSvgElement.prototype = objectCreate(SvgElement.prototype);
extend(TextSvgElement.prototype, {
    constructor: TextSvgElement,
    attr: textAttr,
    css: textCss,
    applyEllipsis: applyEllipsis,
    setMaxSize: setMaxSize,
    restoreText: restoreText,
    _getLineHeight: function() {
        return !isNaN(parseFloat(this._styles[KEY_FONT_SIZE])) ? this._styles[KEY_FONT_SIZE] : DEFAULT_FONT_SIZE
    }
});

function updateIndexes(items, k) {
    var i = void 0,
        item = void 0;
    for (i = k; item = items[i]; ++i) {
        item._link.i = i
    }
}

function linkItem(target, container) {
    var items = container._links,
        key = target._link.after = target._link.after || container._linkAfter,
        i = void 0,
        item = void 0;
    if (key) {
        for (i = 0;
            (item = items[i]) && item._link.name !== key; ++i) {}
        if (item) {
            for (++i;
                (item = items[i]) && item._link.after === key; ++i) {}
        }
    } else {
        i = items.length
    }
    items.splice(i, 0, target);
    updateIndexes(items, i)
}

function unlinkItem(target) {
    var i = void 0,
        items = target._link.to._links;
    for (i = 0; items[i] !== target; ++i) {}
    items.splice(i, 1);
    updateIndexes(items, i)
}

function Renderer(options) {
    var that = this;
    that.root = that._createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        version: "1.1",
        fill: NONE,
        stroke: NONE,
        "stroke-width": 0
    }).attr({
        "class": options.cssClass
    }).css({
        "line-height": "normal",
        "-ms-user-select": NONE,
        "-moz-user-select": NONE,
        "-webkit-user-select": NONE,
        "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
        display: "block",
        overflow: "hidden"
    });
    that._init();
    that.pathModified = !!options.pathModified;
    that._$container = (0, _renderer2.default)(options.container);
    that.root.append({
        element: options.container
    });
    that.fixPlacement();
    that._locker = 0;
    that._backed = false
}
exports.Renderer = Renderer;
Renderer.prototype = {
    constructor: Renderer,
    _init: function() {
        var that = this;
        that._defs = that._createElement("defs").append(that.root);
        that._animationController = new _animation2.default.AnimationController(that.root.element);
        that._animation = {
            enabled: true,
            duration: 1e3,
            easing: "easeOutCubic"
        }
    },
    fixPlacement: function() {
        if (!_browser2.default.mozilla && !_browser2.default.msie) {
            return
        }
        var box = getBoundingClientRect(this._$container.get(0)),
            dx = roundValue(box.left % 1, 2),
            dy = roundValue(box.top % 1, 2);
        if (_browser2.default.msie) {
            this.root.css({
                transform: "translate(" + -dx + "px," + -dy + "px)"
            })
        } else {
            if (_browser2.default.mozilla) {
                this.root.move(-dx, -dy)
            }
        }
    },
    removePlacementFix: function() {
        if (!_browser2.default.mozilla && !_browser2.default.msie) {
            return
        }
        if (_browser2.default.msie) {
            this.root.css({
                transform: ""
            })
        } else {
            if (_browser2.default.mozilla) {
                this.root.attr({
                    transform: null
                })
            }
        }
    },
    setOptions: function(options) {
        var that = this;
        that.rtl = !!options.rtl;
        that.encodeHtml = !!options.encodeHtml;
        that.updateAnimationOptions(options.animation || {});
        that.root.attr({
            direction: that.rtl ? "rtl" : "ltr"
        });
        return that
    },
    _createElement: function(tagName, attr, type) {
        var elem = new exports.SvgElement(this, tagName, type);
        attr && elem.attr(attr);
        return elem
    },
    lock: function() {
        var that = this;
        if (0 === that._locker) {
            that._backed = !that._$container.is(":visible");
            if (that._backed) {
                backupRoot(that.root)
            }
        }++that._locker;
        return that
    },
    unlock: function() {
        var that = this;
        --that._locker;
        if (0 === that._locker) {
            if (that._backed) {
                restoreRoot(that.root, that._$container[0]);
                that.fixPlacement()
            }
            that._backed = false
        }
        return that
    },
    resize: function(width, height) {
        if (width >= 0 && height >= 0) {
            this.root.attr({
                width: width,
                height: height
            })
        }
        return this
    },
    dispose: function() {
        var that = this,
            key = void 0;
        that.root.dispose();
        that._defs.dispose();
        that._animationController.dispose();
        fixFuncIriCallbacks.removeByRenderer(that);
        for (key in that) {
            that[key] = null
        }
        return that
    },
    animationEnabled: function() {
        return !!this._animation.enabled
    },
    updateAnimationOptions: function(newOptions) {
        extend(this._animation, newOptions);
        return this
    },
    stopAllAnimations: function(lock) {
        this._animationController[lock ? "lock" : "stop"]();
        return this
    },
    animateElement: function(element, params, options) {
        this._animationController.animateElement(element, params, options);
        return this
    },
    svg: function() {
        this.removePlacementFix();
        var markup = this.root.markup();
        this.fixPlacement();
        return markup
    },
    getRootOffset: function() {
        return this.root.getOffset()
    },
    onEndAnimation: function(endAnimation) {
        this._animationController.onEndAnimation(endAnimation)
    },
    rect: function(x, y, width, height) {
        var elem = new exports.RectSvgElement(this);
        return elem.attr({
            x: x || 0,
            y: y || 0,
            width: width || 0,
            height: height || 0
        })
    },
    simpleRect: function() {
        return this._createElement("rect")
    },
    circle: function(x, y, r) {
        return this._createElement("circle", {
            cx: x || 0,
            cy: y || 0,
            r: r || 0
        })
    },
    g: function() {
        return this._createElement("g")
    },
    image: function image(x, y, w, h, href, location) {
        var image = this._createElement("image", {
            x: x || 0,
            y: y || 0,
            width: w || 0,
            height: h || 0,
            preserveAspectRatio: preserveAspectRatioMap[(0, _utils.normalizeEnum)(location)] || NONE
        });
        image.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", href || "");
        return image
    },
    path: function(points, type) {
        var elem = new exports.PathSvgElement(this, type);
        return elem.attr({
            points: points || []
        })
    },
    arc: function(x, y, innerRadius, outerRadius, startAngle, endAngle) {
        var elem = new exports.ArcSvgElement(this);
        return elem.attr({
            x: x || 0,
            y: y || 0,
            innerRadius: innerRadius || 0,
            outerRadius: outerRadius || 0,
            startAngle: startAngle || 0,
            endAngle: endAngle || 0
        })
    },
    text: function(_text, x, y) {
        var elem = new exports.TextSvgElement(this);
        return elem.attr({
            text: _text,
            x: x || 0,
            y: y || 0
        })
    },
    linearGradient: function(stops) {
        var gradient = void 0,
            id = getNextDefsSvgId(),
            that = this;
        gradient = that._createElement("linearGradient", {
            id: id
        }).append(that._defs);
        gradient.id = id;
        stops.forEach(function(stop) {
            that._createElement("stop", {
                offset: stop.offset,
                "stop-color": stop["stop-color"]
            }).append(gradient)
        });
        return gradient
    },
    pattern: function pattern(color, hatching, _id) {
        hatching = hatching || {};
        var that = this,
            id = void 0,
            d = void 0,
            pattern = void 0,
            rect = void 0,
            path = void 0,
            step = hatching.step || 6,
            stepTo2 = step / 2,
            stepBy15 = 1.5 * step;
        id = _id || getNextDefsSvgId();
        d = "right" === (0, _utils.normalizeEnum)(hatching.direction) ? "M " + stepTo2 + " " + -stepTo2 + " L " + -stepTo2 + " " + stepTo2 + " M 0 " + step + " L " + step + " 0 M " + stepBy15 + " " + stepTo2 + " L " + stepTo2 + " " + stepBy15 : "M 0 0 L " + step + " " + step + " M " + -stepTo2 + " " + stepTo2 + " L " + stepTo2 + " " + stepBy15 + " M " + stepTo2 + " " + -stepTo2 + " L " + stepBy15 + " " + stepTo2;
        pattern = that._createElement("pattern", {
            id: id,
            width: step,
            height: step,
            patternUnits: "userSpaceOnUse"
        }).append(that._defs);
        pattern.id = id;
        rect = that.rect(0, 0, step, step).attr({
            fill: color,
            opacity: hatching.opacity
        }).append(pattern);
        path = new exports.PathSvgElement(this).attr({
            d: d,
            "stroke-width": hatching.width || 1,
            stroke: color
        }).append(pattern);
        return pattern
    },
    _getPointsWithYOffset: function(points, offset) {
        return points.map(function(point, index) {
            if (index % 2 !== 0) {
                return point + offset
            }
            return point
        })
    },
    clipRect: function(x, y, width, height) {
        var that = this,
            id = getNextDefsSvgId(),
            clipPath = that._createElement("clipPath", {
                id: id
            }).append(that._defs),
            rect = that.rect(x, y, width, height).append(clipPath);
        rect.id = id;
        rect.remove = function() {
            throw "Not implemented"
        };
        rect.dispose = function() {
            clipPath.dispose();
            clipPath = null;
            return this
        };
        return rect
    },
    shadowFilter: function(x, y, width, height, offsetX, offsetY, blur, color, opacity) {
        var that = this,
            id = getNextDefsSvgId(),
            filter = that._createElement("filter", {
                id: id,
                x: x || 0,
                y: y || 0,
                width: width || 0,
                height: height || 0
            }).append(that._defs),
            gaussianBlur = that._createElement("feGaussianBlur", {
                "in": "SourceGraphic",
                result: "gaussianBlurResult",
                stdDeviation: blur || 0
            }).append(filter),
            offset = that._createElement("feOffset", {
                "in": "gaussianBlurResult",
                result: "offsetResult",
                dx: offsetX || 0,
                dy: offsetY || 0
            }).append(filter),
            flood = that._createElement("feFlood", {
                result: "floodResult",
                "flood-color": color || "",
                "flood-opacity": opacity
            }).append(filter),
            composite = that._createElement("feComposite", {
                "in": "floodResult",
                in2: "offsetResult",
                operator: "in",
                result: "compositeResult"
            }).append(filter),
            finalComposite = that._createElement("feComposite", {
                "in": "SourceGraphic",
                in2: "compositeResult",
                operator: "over"
            }).append(filter);
        filter.id = id;
        filter.gaussianBlur = gaussianBlur;
        filter.offset = offset;
        filter.flood = flood;
        filter.composite = composite;
        filter.finalComposite = finalComposite;
        filter.attr = function(attrs) {
            var that = this,
                filterAttrs = {},
                offsetAttrs = {},
                floodAttrs = {};
            "x" in attrs && (filterAttrs.x = attrs.x);
            "y" in attrs && (filterAttrs.y = attrs.y);
            "width" in attrs && (filterAttrs.width = attrs.width);
            "height" in attrs && (filterAttrs.height = attrs.height);
            baseAttr(that, filterAttrs);
            "blur" in attrs && that.gaussianBlur.attr({
                stdDeviation: attrs.blur
            });
            "offsetX" in attrs && (offsetAttrs.dx = attrs.offsetX);
            "offsetY" in attrs && (offsetAttrs.dy = attrs.offsetY);
            that.offset.attr(offsetAttrs);
            "color" in attrs && (floodAttrs["flood-color"] = attrs.color);
            "opacity" in attrs && (floodAttrs["flood-opacity"] = attrs.opacity);
            that.flood.attr(floodAttrs);
            return that
        };
        return filter
    },
    brightFilter: function(type, slope) {
        var that = this,
            id = getNextDefsSvgId(),
            filter = that._createElement("filter", {
                id: id
            }).append(that._defs),
            componentTransferElement = that._createElement("feComponentTransfer").append(filter),
            attrs = {
                type: type,
                slope: slope
            };
        filter.id = id;
        that._createElement("feFuncR", attrs).append(componentTransferElement);
        that._createElement("feFuncG", attrs).append(componentTransferElement);
        that._createElement("feFuncB", attrs).append(componentTransferElement);
        return filter
    },
    getGrayScaleFilter: function() {
        if (this._grayScaleFilter) {
            return this._grayScaleFilter
        }
        var that = this,
            id = getNextDefsSvgId(),
            filter = that._createElement("filter", {
                id: id
            }).append(that._defs);
        that._createElement("feColorMatrix").attr({
            type: "matrix",
            values: "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 0.6 0"
        }).append(filter);
        filter.id = id;
        that._grayScaleFilter = filter;
        return filter
    },
    initHatching: function() {
        var storage = this._hatchingStorage = this._hatchingStorage || {
                byHash: {},
                baseId: getNextDefsSvgId()
            },
            byHash = storage.byHash,
            name = void 0;
        for (name in byHash) {
            byHash[name].pattern.dispose()
        }
        storage.byHash = {};
        storage.refToHash = {};
        storage.nextId = 0
    },
    lockHatching: function(color, hatching, ref) {
        var storage = this._hatchingStorage,
            hash = getHatchingHash(color, hatching),
            storageItem = void 0,
            pattern = void 0;
        if (storage.refToHash[ref] !== hash) {
            if (ref) {
                this.releaseHatching(ref)
            }
            storageItem = storage.byHash[hash];
            if (!storageItem) {
                pattern = this.pattern(color, hatching, storage.baseId + "-hatching-" + storage.nextId++);
                storageItem = storage.byHash[hash] = {
                    pattern: pattern,
                    count: 0
                };
                storage.refToHash[pattern.id] = hash
            }++storageItem.count;
            ref = storageItem.pattern.id
        }
        return ref
    },
    releaseHatching: function(ref) {
        var storage = this._hatchingStorage,
            hash = storage.refToHash[ref],
            storageItem = storage.byHash[hash];
        if (storageItem && 0 === --storageItem.count) {
            storageItem.pattern.dispose();
            delete storage.byHash[hash];
            delete storage.refToHash[ref]
        }
    }
};

function getHatchingHash(color, hatching) {
    return "@" + color + "::" + hatching.step + ":" + hatching.width + ":" + hatching.opacity + ":" + hatching.direction
}
var fixFuncIriCallbacks = function() {
    var callbacks = [];
    return {
        add: function(fn) {
            callbacks.push(fn)
        },
        remove: function(fn) {
            callbacks = callbacks.filter(function(el) {
                return el !== fn
            })
        },
        removeByRenderer: function(renderer) {
            callbacks = callbacks.filter(function(el) {
                return el.renderer !== renderer
            })
        },
        fire: function() {
            callbacks.forEach(function(fn) {
                fn()
            })
        }
    }
}();
exports.refreshPaths = function() {
    fixFuncIriCallbacks.fire()
};
