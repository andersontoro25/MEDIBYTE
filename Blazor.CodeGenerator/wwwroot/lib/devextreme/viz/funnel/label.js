/**
 * DevExtreme (viz/funnel/label.js)
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
var _label = require("../series/points/label");
var _label2 = _interopRequireDefault(_label);
var _utils = require("../core/utils");
var _extend = require("../../core/utils/extend");
var _common = require("../../core/utils/common");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i]
        }
        return arr2
    } else {
        return Array.from(arr)
    }
}
var OUTSIDE_POSITION = "outside";
var INSIDE_POSITION = "inside";
var OUTSIDE_LABEL_INDENT = 5;
var COLUMNS_LABEL_INDENT = 20;
var CONNECTOR_INDENT = 4;
var PREVENT_EMPTY_PIXEL_OFFSET = 1;

function getLabelIndent(pos) {
    pos = (0, _utils.normalizeEnum)(pos);
    if (pos === OUTSIDE_POSITION) {
        return OUTSIDE_LABEL_INDENT
    } else {
        if (pos === INSIDE_POSITION) {
            return 0
        }
    }
    return COLUMNS_LABEL_INDENT
}

function isOutsidePosition(pos) {
    pos = (0, _utils.normalizeEnum)(pos);
    return pos === OUTSIDE_POSITION || pos !== INSIDE_POSITION
}

function correctYForInverted(y, bBox, inverted) {
    return inverted ? y - bBox.height : y
}

function getOutsideRightLabelPosition(coords, bBox, options, inverted) {
    return {
        x: coords[2] + options.horizontalOffset + OUTSIDE_LABEL_INDENT,
        y: correctYForInverted(coords[3] + options.verticalOffset, bBox, inverted)
    }
}

function getOutsideLeftLabelPosition(coords, bBox, options, inverted) {
    return {
        x: coords[0] - bBox.width - options.horizontalOffset - OUTSIDE_LABEL_INDENT,
        y: correctYForInverted(coords[1] + options.verticalOffset, bBox, inverted)
    }
}

function getInsideLabelPosition(coords, bBox, options) {
    var width = coords[2] - coords[0],
        height = coords[7] - coords[1];
    return {
        x: coords[0] + width / 2 + options.horizontalOffset - bBox.width / 2,
        y: coords[1] + options.verticalOffset + height / 2 - bBox.height / 2
    }
}

function getColumnLabelRightPosition(labelRect, rect, textAlignment) {
    return function(coords, bBox, options, inverted) {
        return {
            x: "left" === textAlignment ? rect[2] + options.horizontalOffset + COLUMNS_LABEL_INDENT : labelRect[2] - bBox.width,
            y: correctYForInverted(coords[3] + options.verticalOffset, bBox, inverted)
        }
    }
}

function getColumnLabelLeftPosition(labelRect, rect, textAlignment) {
    return function(coords, bBox, options, inverted) {
        return {
            x: "left" === textAlignment ? labelRect[0] : rect[0] - bBox.width - options.horizontalOffset - COLUMNS_LABEL_INDENT,
            y: correctYForInverted(coords[3] + options.verticalOffset, bBox, inverted)
        }
    }
}

function getConnectorStrategy(options, inverted) {
    var isLeftPos = "left" === options.horizontalAlignment,
        connectorIndent = isLeftPos ? CONNECTOR_INDENT : -CONNECTOR_INDENT,
        verticalCorrection = inverted ? -PREVENT_EMPTY_PIXEL_OFFSET : 0;

    function getFigureCenter(figure) {
        return isLeftPos ? [figure[0] + PREVENT_EMPTY_PIXEL_OFFSET, figure[1] + verticalCorrection] : [figure[2] - PREVENT_EMPTY_PIXEL_OFFSET, figure[3] + verticalCorrection]
    }
    return {
        isLabelInside: function() {
            return !isOutsidePosition(options.position)
        },
        getFigureCenter: getFigureCenter,
        prepareLabelPoints: function(bBox) {
            var x = bBox.x + connectorIndent,
                y = bBox.y,
                x1 = x + bBox.width;
            return [].concat(_toConsumableArray(Array(bBox.height + 1))).map(function(_, i) {
                return [x, y + i]
            }).concat([].concat(_toConsumableArray(Array(bBox.height + 1))).map(function(_, i) {
                return [x1, y + i]
            }))
        },
        isHorizontal: function() {
            return true
        },
        findFigurePoint: function(figure) {
            return getFigureCenter(figure)
        },
        adjustPoints: function(points) {
            return points.map(Math.round)
        }
    }
}

function getLabelOptions(labelOptions, defaultColor, defaultTextAlignment) {
    var opt = labelOptions || {},
        labelFont = (0, _extend.extend)({}, opt.font) || {},
        labelBorder = opt.border || {},
        labelConnector = opt.connector || {},
        backgroundAttr = {
            fill: opt.backgroundColor || defaultColor,
            "stroke-width": labelBorder.visible ? labelBorder.width || 0 : 0,
            stroke: labelBorder.visible && labelBorder.width ? labelBorder.color : "none",
            dashStyle: labelBorder.dashStyle
        },
        connectorAttr = {
            stroke: labelConnector.visible && labelConnector.width ? labelConnector.color || defaultColor : "none",
            "stroke-width": labelConnector.visible ? labelConnector.width || 0 : 0,
            opacity: labelConnector.opacity
        };
    labelFont.color = "none" === opt.backgroundColor && "#ffffff" === (0, _utils.normalizeEnum)(labelFont.color) && "inside" !== opt.position ? defaultColor : labelFont.color;
    return {
        format: opt.format,
        textAlignment: opt.textAlignment || (isOutsidePosition(opt.position) ? defaultTextAlignment : "center"),
        customizeText: opt.customizeText,
        attributes: {
            font: labelFont
        },
        visible: 0 !== labelFont.size ? opt.visible : false,
        showForZeroValues: opt.showForZeroValues,
        horizontalOffset: opt.horizontalOffset,
        verticalOffset: opt.verticalOffset,
        background: backgroundAttr,
        connector: connectorAttr,
        wordWrap: labelOptions.wordWrap,
        textOverflow: labelOptions.textOverflow
    }
}

function correctLabelPosition(pos, bBox, rect) {
    if (pos.x < rect[0]) {
        pos.x = rect[0]
    }
    if (pos.x + bBox.width > rect[2]) {
        pos.x = rect[2] - bBox.width
    }
    if (pos.y < rect[1]) {
        pos.y = rect[1]
    }
    if (pos.y + bBox.height > rect[3]) {
        pos.y = rect[3] - bBox.height
    }
    return pos
}

function removeEmptySpace(labels, requiredSpace, startPoint) {
    labels.reduce(function(requiredSpace, label, index, labels) {
        var prevLabel = labels[index + 1];
        if (requiredSpace > 0) {
            var bBox = label.getBoundingRect();
            var point = prevLabel ? prevLabel.getBoundingRect().y + prevLabel.getBoundingRect().height : startPoint;
            var emptySpace = bBox.y - point;
            var shift = Math.min(emptySpace, requiredSpace);
            labels.slice(0, index + 1).forEach(function(label) {
                var bBox = label.getBoundingRect();
                label.shift(bBox.x, bBox.y - shift)
            });
            requiredSpace -= shift
        }
        return requiredSpace
    }, requiredSpace)
}
exports.plugin = {
    name: "lables",
    init: _common.noop,
    dispose: _common.noop,
    extenders: {
        _initCore: function() {
            this._labelsGroup = this._renderer.g().attr({
                "class": this._rootClassPrefix + "-labels"
            }).append(this._renderer.root);
            this._labels = []
        },
        _applySize: function() {
            var groupWidth, options = this._getOption("label"),
                adaptiveLayout = this._getOption("adaptiveLayout"),
                rect = this._rect,
                labelWidth = 0,
                width = rect[2] - rect[0];
            this._labelRect = rect.slice();
            if (!this._labels.length || !isOutsidePosition(options.position)) {
                if ((0, _utils.normalizeEnum)("none" !== this._getOption("resolveLabelOverlapping", true))) {
                    this._labels.forEach(function(l) {
                        return !l.isVisible() && l.draw(true)
                    })
                }
                return
            }
            groupWidth = this._labels.map(function(label) {
                label.resetEllipsis();
                return label.getBoundingRect().width
            }).reduce(function(max, width) {
                return Math.max(max, width)
            }, 0);
            labelWidth = groupWidth + options.horizontalOffset + getLabelIndent(options.position);
            if (!adaptiveLayout.keepLabels && width - labelWidth < adaptiveLayout.width) {
                this._labels.forEach(function(label) {
                    label.draw(false)
                });
                return
            } else {
                if (width - labelWidth < adaptiveLayout.width) {
                    labelWidth = width - adaptiveLayout.width;
                    labelWidth = labelWidth > 0 ? labelWidth : 0
                }
                this._labels.forEach(function(label) {
                    label.draw(true)
                })
            }
            if ("left" === options.horizontalAlignment) {
                rect[0] += labelWidth
            } else {
                rect[2] -= labelWidth
            }
        },
        _buildNodes: function() {
            this._createLabels()
        },
        _change_TILING: function() {
            var textAlignment, that = this,
                options = that._getOption("label"),
                getCoords = getInsideLabelPosition,
                inverted = that._getOption("inverted", true);
            if (isOutsidePosition(options.position)) {
                if ((0, _utils.normalizeEnum)(options.position) === OUTSIDE_POSITION) {
                    getCoords = "left" === options.horizontalAlignment ? getOutsideLeftLabelPosition : getOutsideRightLabelPosition
                } else {
                    textAlignment = this._defaultLabelTextAlignment();
                    getCoords = "left" === options.horizontalAlignment ? getColumnLabelLeftPosition(this._labelRect, this._rect, textAlignment) : getColumnLabelRightPosition(this._labelRect, this._rect, textAlignment)
                }
            }
            that._labels.forEach(function(label, index) {
                var bBox, pos, item = that._items[index],
                    borderWidth = item.getNormalStyle()["stroke-width"],
                    halfBorderWidth = inverted ? borderWidth / 2 : -borderWidth / 2,
                    coords = halfBorderWidth ? item.coords.map(function(coord, index) {
                        if (1 === index || 3 === index) {
                            return coord - halfBorderWidth
                        } else {
                            if (2 === index) {
                                return coord - borderWidth
                            } else {
                                if (0 === index) {
                                    return coord + borderWidth
                                }
                            }
                        }
                        return coord
                    }) : item.coords;
                if (!options.showForZeroValues && 0 === item.value) {
                    label.draw(false);
                    return
                }
                if (isOutsidePosition(options.position)) {
                    that._correctLabelWidth(label, item.coords, options)
                }
                bBox = label.getBoundingRect();
                pos = correctLabelPosition(getCoords(coords, bBox, options, inverted), bBox, that._labelRect);
                label.setFigureToDrawConnector(coords);
                label.shift(pos.x, pos.y)
            });
            that._resolveLabelOverlapping()
        }
    },
    members: {
        _resolveLabelOverlapping: function() {
            var that = this;
            var resolveLabelOverlapping = (0, _utils.normalizeEnum)(that._getOption("resolveLabelOverlapping", true));
            var labels = this._getOption("inverted", true) ? that._labels.slice().reverse() : that._labels;
            if ("hide" === resolveLabelOverlapping) {
                labels.reduce(function(height, label) {
                    if (label.getBoundingRect().y < height) {
                        label.hide()
                    } else {
                        height = label.getBoundingRect().y + label.getBoundingRect().height
                    }
                    return height
                }, 0)
            } else {
                if ("shift" === resolveLabelOverlapping) {
                    var maxHeight = this._labelRect[3];
                    labels.reduce(function(_ref, label, index, labels) {
                        var _ref2 = _slicedToArray(_ref, 2),
                            height = _ref2[0],
                            emptySpace = _ref2[1];
                        var bBox = label.getBoundingRect();
                        var y = bBox.y;
                        if (bBox.y < height) {
                            label.shift(bBox.x, height);
                            y = height
                        }
                        if (y - height > 0) {
                            emptySpace += y - height
                        }
                        if (y + bBox.height > maxHeight) {
                            if (emptySpace && emptySpace > y + bBox.height - maxHeight) {
                                removeEmptySpace(labels.slice(0, index).reverse(), y + bBox.height - maxHeight, that._labelRect[1]);
                                emptySpace -= y + bBox.height - maxHeight;
                                label.shift(bBox.x, y - (y + bBox.height - maxHeight));
                                height = y - (y + bBox.height - maxHeight) + bBox.height
                            } else {
                                label.hide()
                            }
                        } else {
                            height = y + bBox.height
                        }
                        return [height, emptySpace]
                    }, [this._labelRect[1], 0])
                }
            }
        },
        _defaultLabelTextAlignment: function() {
            return this._getOption("rtlEnabled", true) ? "right" : "left"
        },
        _correctLabelWidth: function(label, item, options) {
            var isLeftPos = "left" === options.horizontalAlignment,
                minX = isLeftPos ? this._labelRect[0] : item[2],
                maxX = isLeftPos ? item[0] : this._labelRect[2],
                maxWidth = maxX - minX;
            if (label.getBoundingRect().width > maxWidth) {
                label.fit(maxWidth)
            }
        },
        _createLabels: function() {
            var that = this,
                labelOptions = that._getOption("label"),
                connectorStrategy = getConnectorStrategy(labelOptions, that._getOption("inverted", true));
            this._labelsGroup.clear();
            if (!labelOptions.visible) {
                return
            }
            this._labels = that._items.map(function(item) {
                var label = new _label2.default.Label({
                    renderer: that._renderer,
                    labelsGroup: that._labelsGroup,
                    strategy: connectorStrategy
                });
                label.setOptions(getLabelOptions(labelOptions, item.color, that._defaultLabelTextAlignment()));
                label.setData({
                    item: item,
                    value: item.value,
                    percent: item.percent
                });
                label.draw(true);
                return label
            });
            if (this._labels.length && isOutsidePosition(labelOptions.position)) {
                this._requestChange(["LAYOUT"])
            }
        }
    },
    customize: function(constructor) {
        constructor.prototype._proxyData.push(function(x, y) {
            var data, that = this;
            that._labels.forEach(function(label, index) {
                var rect = label.getBoundingRect();
                if (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height) {
                    var pos = isOutsidePosition(that._getOption("label").position) ? "outside" : "inside";
                    data = {
                        id: index,
                        type: pos + "-label"
                    };
                    return true
                }
            });
            return data
        });
        ["label", "resolveLabelOverlapping"].forEach(function(optionName) {
            constructor.addChange({
                code: optionName.toUpperCase(),
                handler: function() {
                    this._createLabels();
                    this._requestChange(["LAYOUT"])
                },
                isThemeDependent: true,
                isOptionChange: true,
                option: optionName
            })
        })
    },
    fontFields: ["label.font"]
};
