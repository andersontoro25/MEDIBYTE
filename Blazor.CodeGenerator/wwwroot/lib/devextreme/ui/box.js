/**
 * DevExtreme (ui/box.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) {
                descriptor.writable = true
            }
            Object.defineProperty(target, descriptor.key, descriptor)
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) {
            defineProperties(Constructor.prototype, protoProps)
        }
        if (staticProps) {
            defineProperties(Constructor, staticProps)
        }
        return Constructor
    }
}();
var _get = function get(object, property, receiver) {
    if (null === object) {
        object = Function.prototype
    }
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (void 0 === desc) {
        var parent = Object.getPrototypeOf(object);
        if (null === parent) {
            return
        } else {
            return get(parent, property, receiver)
        }
    } else {
        if ("value" in desc) {
            return desc.value
        } else {
            var getter = desc.get;
            if (void 0 === getter) {
                return
            }
            return getter.call(receiver)
        }
    }
};
var _renderer = require("../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _events_engine = require("../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _component_registrator = require("../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _extend = require("../core/utils/extend");
var _common = require("../core/utils/common");
var _window = require("../core/utils/window");
var _window2 = _interopRequireDefault(_window);
var _inflector = require("../core/utils/inflector");
var _inflector2 = _interopRequireDefault(_inflector);
var _type = require("../core/utils/type");
var _style = require("../core/utils/style");
var _style2 = _interopRequireDefault(_style);
var _iterator = require("../core/utils/iterator");
var _browser = require("../core/utils/browser");
var _browser2 = _interopRequireDefault(_browser);
var _item = require("./collection/item");
var _item2 = _interopRequireDefault(_item);
var _devices = require("../core/devices");
var _devices2 = _interopRequireDefault(_devices);
var _uiCollection_widget = require("./collection/ui.collection_widget.edit");
var _uiCollection_widget2 = _interopRequireDefault(_uiCollection_widget);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return call && ("object" === typeof call || "function" === typeof call) ? call : self
}

function _inherits(subClass, superClass) {
    if ("function" !== typeof superClass && null !== superClass) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass)
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) {
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass
    }
}
var BOX_CLASS = "dx-box";
var BOX_SELECTOR = ".dx-box";
var BOX_ITEM_CLASS = "dx-box-item";
var BOX_ITEM_DATA_KEY = "dxBoxItemData";
var MINSIZE_MAP = {
    row: "minWidth",
    col: "minHeight"
};
var MAXSIZE_MAP = {
    row: "maxWidth",
    col: "maxHeight"
};
var SHRINK = 1;
var FLEX_JUSTIFY_CONTENT_MAP = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    "space-between": "space-between",
    "space-around": "space-around"
};
var FLEX_ALIGN_ITEMS_MAP = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    stretch: "stretch"
};
var FLEX_DIRECTION_MAP = {
    row: "row",
    col: "column"
};
var setFlexProp = function(element, prop, value) {
    value = _style2.default.normalizeStyleProp(prop, value);
    element.style[_style2.default.styleProp(prop)] = value;
    if (!_window2.default.hasWindow()) {
        if ("" === value || !(0, _type.isDefined)(value)) {
            return
        }
        var cssName = _inflector2.default.dasherize(prop);
        var styleExpr = cssName + ": " + value + ";";
        if (!element.attributes.style) {
            element.setAttribute("style", styleExpr)
        } else {
            if (element.attributes.style.value.indexOf(styleExpr) < 0) {
                element.attributes.style.value += " " + styleExpr
            }
        }
    }
};
var BOX_EVENTNAMESPACE = "dxBox";
var UPDATE_EVENT = "dxupdate." + BOX_EVENTNAMESPACE;
var FALLBACK_BOX_ITEM = "dx-box-fallback-item";
var FALLBACK_WRAP_MAP = {
    row: "nowrap",
    col: "normal"
};
var FALLBACK_MAIN_SIZE_MAP = {
    row: "width",
    col: "height"
};
var FALLBACK_CROSS_SIZE_MAP = {
    row: "height",
    col: "width"
};
var FALLBACK_PRE_MARGIN_MAP = {
    row: "marginLeft",
    col: "marginTop"
};
var FALLBACK_POST_MARGIN_MAP = {
    row: "marginRight",
    col: "marginBottom"
};
var FALLBACK_CROSS_PRE_MARGIN_MAP = {
    row: "marginTop",
    col: "marginLeft"
};
var FALLBACK_CROSS_POST_MARGIN_MAP = {
    row: "marginBottom",
    col: "marginRight"
};
var MARGINS_RTL_FLIP_MAP = {
    marginLeft: "marginRight",
    marginRight: "marginLeft"
};
var BoxItem = function(_CollectionWidgetItem) {
    _inherits(BoxItem, _CollectionWidgetItem);

    function BoxItem() {
        _classCallCheck(this, BoxItem);
        return _possibleConstructorReturn(this, (BoxItem.__proto__ || Object.getPrototypeOf(BoxItem)).apply(this, arguments))
    }
    _createClass(BoxItem, [{
        key: "_renderVisible",
        value: function(value, oldValue) {
            _get(BoxItem.prototype.__proto__ || Object.getPrototypeOf(BoxItem.prototype), "_renderVisible", this).call(this, value);
            if ((0, _type.isDefined)(oldValue)) {
                this._options.fireItemStateChangedAction({
                    name: "visible",
                    state: value,
                    oldState: oldValue
                })
            }
        }
    }]);
    return BoxItem
}(_item2.default);
var FlexLayoutStrategy = function() {
    function FlexLayoutStrategy($element, option) {
        _classCallCheck(this, FlexLayoutStrategy);
        this._$element = $element;
        this._option = option;
        this.initSize = _common.noop;
        this.update = _common.noop
    }
    _createClass(FlexLayoutStrategy, [{
        key: "renderBox",
        value: function() {
            this._$element.css({
                display: _style2.default.stylePropPrefix("flexDirection") + "flex"
            });
            setFlexProp(this._$element.get(0), "flexDirection", FLEX_DIRECTION_MAP[this._option("direction")])
        }
    }, {
        key: "renderAlign",
        value: function() {
            this._$element.css({
                justifyContent: this._normalizedAlign()
            })
        }
    }, {
        key: "_normalizedAlign",
        value: function() {
            var align = this._option("align");
            return align in FLEX_JUSTIFY_CONTENT_MAP ? FLEX_JUSTIFY_CONTENT_MAP[align] : align
        }
    }, {
        key: "renderCrossAlign",
        value: function() {
            this._$element.css({
                alignItems: this._normalizedCrossAlign()
            })
        }
    }, {
        key: "_normalizedCrossAlign",
        value: function() {
            var crossAlign = this._option("crossAlign");
            return crossAlign in FLEX_ALIGN_ITEMS_MAP ? FLEX_ALIGN_ITEMS_MAP[crossAlign] : crossAlign
        }
    }, {
        key: "renderItems",
        value: function($items) {
            var flexPropPrefix = _style2.default.stylePropPrefix("flexDirection");
            var direction = this._option("direction");
            (0, _iterator.each)($items, function() {
                var $item = (0, _renderer2.default)(this);
                var item = $item.data(BOX_ITEM_DATA_KEY);
                $item.css({
                    display: flexPropPrefix + "flex"
                }).css(MAXSIZE_MAP[direction], item.maxSize || "none").css(MINSIZE_MAP[direction], item.minSize || "0");
                setFlexProp($item.get(0), "flexBasis", item.baseSize || 0);
                setFlexProp($item.get(0), "flexGrow", item.ratio);
                setFlexProp($item.get(0), "flexShrink", (0, _type.isDefined)(item.shrink) ? item.shrink : SHRINK);
                $item.children().each(function(_, itemContent) {
                    (0, _renderer2.default)(itemContent).css({
                        width: "auto",
                        height: "auto",
                        display: _style2.default.stylePropPrefix("flexDirection") + "flex",
                        flexBasis: 0
                    });
                    setFlexProp(itemContent, "flexGrow", 1);
                    setFlexProp(itemContent, "flexDirection", (0, _renderer2.default)(itemContent)[0].style.flexDirection || "column")
                })
            })
        }
    }]);
    return FlexLayoutStrategy
}();
var FallbackLayoutStrategy = function() {
    function FallbackLayoutStrategy($element, option) {
        _classCallCheck(this, FallbackLayoutStrategy);
        this._$element = $element;
        this._option = option
    }
    _createClass(FallbackLayoutStrategy, [{
        key: "renderBox",
        value: function() {
            this._$element.css({
                fontSize: 0,
                whiteSpace: FALLBACK_WRAP_MAP[this._option("direction")],
                verticalAlign: "top"
            });
            _events_engine2.default.off(this._$element, UPDATE_EVENT);
            _events_engine2.default.on(this._$element, UPDATE_EVENT, this.update.bind(this))
        }
    }, {
        key: "renderAlign",
        value: function() {
            var $items = this._$items;
            if (!$items) {
                return
            }
            var align = this._option("align");
            var totalItemSize = this.totalItemSize;
            var direction = this._option("direction");
            var boxSize = this._$element[FALLBACK_MAIN_SIZE_MAP[direction]]();
            var freeSpace = boxSize - totalItemSize;
            var shift = 0;
            this._setItemsMargins($items, direction, 0);
            switch (align) {
                case "start":
                    break;
                case "end":
                    shift = freeSpace;
                    $items.first().css(this._chooseMarginSide(FALLBACK_PRE_MARGIN_MAP[direction]), shift);
                    break;
                case "center":
                    shift = .5 * freeSpace;
                    $items.first().css(this._chooseMarginSide(FALLBACK_PRE_MARGIN_MAP[direction]), shift);
                    $items.last().css(this._chooseMarginSide(FALLBACK_POST_MARGIN_MAP[direction]), shift);
                    break;
                case "space-between":
                    shift = .5 * freeSpace / ($items.length - 1);
                    this._setItemsMargins($items, direction, shift);
                    $items.first().css(this._chooseMarginSide(FALLBACK_PRE_MARGIN_MAP[direction]), 0);
                    $items.last().css(this._chooseMarginSide(FALLBACK_POST_MARGIN_MAP[direction]), 0);
                    break;
                case "space-around":
                    shift = .5 * freeSpace / $items.length;
                    this._setItemsMargins($items, direction, shift)
            }
        }
    }, {
        key: "_setItemsMargins",
        value: function($items, direction, shift) {
            $items.css(this._chooseMarginSide(FALLBACK_PRE_MARGIN_MAP[direction]), shift).css(this._chooseMarginSide(FALLBACK_POST_MARGIN_MAP[direction]), shift)
        }
    }, {
        key: "renderCrossAlign",
        value: function() {
            var $items = this._$items;
            if (!$items) {
                return
            }
            var crossAlign = this._option("crossAlign");
            var direction = this._option("direction");
            var size = this._$element[FALLBACK_CROSS_SIZE_MAP[direction]]();
            var that = this;
            switch (crossAlign) {
                case "start":
                    break;
                case "end":
                    (0, _iterator.each)($items, function() {
                        var $item = (0, _renderer2.default)(this),
                            itemSize = $item[FALLBACK_CROSS_SIZE_MAP[direction]](),
                            shift = size - itemSize;
                        $item.css(that._chooseMarginSide(FALLBACK_CROSS_PRE_MARGIN_MAP[direction]), shift)
                    });
                    break;
                case "center":
                    (0, _iterator.each)($items, function() {
                        var $item = (0, _renderer2.default)(this),
                            itemSize = $item[FALLBACK_CROSS_SIZE_MAP[direction]](),
                            shift = .5 * (size - itemSize);
                        $item.css(that._chooseMarginSide(FALLBACK_CROSS_PRE_MARGIN_MAP[direction]), shift).css(that._chooseMarginSide(FALLBACK_CROSS_POST_MARGIN_MAP[direction]), shift)
                    });
                    break;
                case "stretch":
                    $items.css(that._chooseMarginSide(FALLBACK_CROSS_PRE_MARGIN_MAP[direction]), 0).css(that._chooseMarginSide(FALLBACK_CROSS_POST_MARGIN_MAP[direction]), 0).css(FALLBACK_CROSS_SIZE_MAP[direction], "100%")
            }
        }
    }, {
        key: "_chooseMarginSide",
        value: function(value) {
            if (!this._option("rtlEnabled")) {
                return value
            }
            return MARGINS_RTL_FLIP_MAP[value] || value
        }
    }, {
        key: "renderItems",
        value: function($items) {
            var _this2 = this;
            this._$items = $items;
            var direction = this._option("direction");
            var totalRatio = 0;
            var totalWeightedShrink = 0;
            var totalBaseSize = 0;
            (0, _iterator.each)($items, function(_, item) {
                var $item = (0, _renderer2.default)(item);
                $item.css({
                    display: "inline-block",
                    verticalAlign: "top"
                });
                $item[FALLBACK_MAIN_SIZE_MAP[direction]]("auto");
                $item.removeClass(FALLBACK_BOX_ITEM);
                var itemData = $item.data(BOX_ITEM_DATA_KEY);
                var ratio = itemData.ratio || 0;
                var size = _this2._baseSize($item);
                var shrink = (0, _type.isDefined)(itemData.shrink) ? itemData.shrink : SHRINK;
                totalRatio += ratio;
                totalWeightedShrink += shrink * size;
                totalBaseSize += size
            });
            var freeSpaceSize = this._boxSize() - totalBaseSize;
            var itemSize = function($item) {
                var itemData = $item.data(BOX_ITEM_DATA_KEY),
                    size = _this2._baseSize($item),
                    factor = freeSpaceSize >= 0 ? itemData.ratio || 0 : ((0, _type.isDefined)(itemData.shrink) ? itemData.shrink : SHRINK) * size,
                    totalFactor = freeSpaceSize >= 0 ? totalRatio : totalWeightedShrink,
                    shift = totalFactor ? Math.round(freeSpaceSize * factor / totalFactor) : 0;
                return size + shift
            };
            var totalItemSize = 0;
            (0, _iterator.each)($items, function(_, item) {
                var $item = (0, _renderer2.default)(item);
                var itemData = (0, _renderer2.default)(item).data(BOX_ITEM_DATA_KEY);
                var size = itemSize($item);
                totalItemSize += size;
                $item.css(MAXSIZE_MAP[direction], itemData.maxSize || "none").css(MINSIZE_MAP[direction], itemData.minSize || "0").css(FALLBACK_MAIN_SIZE_MAP[direction], size);
                $item.addClass(FALLBACK_BOX_ITEM)
            });
            this.totalItemSize = totalItemSize
        }
    }, {
        key: "_baseSize",
        value: function(item) {
            var itemData = (0, _renderer2.default)(item).data(BOX_ITEM_DATA_KEY);
            return null == itemData.baseSize ? 0 : "auto" === itemData.baseSize ? this._contentSize(item) : this._parseSize(itemData.baseSize)
        }
    }, {
        key: "_contentSize",
        value: function(item) {
            return (0, _renderer2.default)(item)[FALLBACK_MAIN_SIZE_MAP[this._option("direction")]]()
        }
    }, {
        key: "_parseSize",
        value: function(size) {
            return String(size).match(/.+%$/) ? .01 * parseFloat(size) * this._boxSizeValue : size
        }
    }, {
        key: "_boxSize",
        value: function(value) {
            if (!arguments.length) {
                this._boxSizeValue = this._boxSizeValue || this._totalBaseSize();
                return this._boxSizeValue
            }
            this._boxSizeValue = value
        }
    }, {
        key: "_totalBaseSize",
        value: function() {
            var _this3 = this;
            var result = 0;
            (0, _iterator.each)(this._$items, function(_, item) {
                result += _this3._baseSize(item)
            });
            return result
        }
    }, {
        key: "initSize",
        value: function() {
            this._boxSize(this._$element[FALLBACK_MAIN_SIZE_MAP[this._option("direction")]]())
        }
    }, {
        key: "update",
        value: function() {
            if (!this._$items || this._$element.is(":hidden")) {
                return
            }
            this._$items.detach();
            this.initSize();
            this._$element.append(this._$items);
            this.renderItems(this._$items);
            this.renderAlign();
            this.renderCrossAlign();
            var element = this._$element.get(0);
            this._$items.find(BOX_SELECTOR).each(function() {
                if (element === (0, _renderer2.default)(this).parent().closest(BOX_SELECTOR).get(0)) {
                    _events_engine2.default.triggerHandler(this, UPDATE_EVENT)
                }
            })
        }
    }]);
    return FallbackLayoutStrategy
}();
var Box = function(_CollectionWidget) {
    _inherits(Box, _CollectionWidget);

    function Box() {
        _classCallCheck(this, Box);
        return _possibleConstructorReturn(this, (Box.__proto__ || Object.getPrototypeOf(Box)).apply(this, arguments))
    }
    _createClass(Box, [{
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "_getDefaultOptions", this).call(this), {
                direction: "row",
                align: "start",
                crossAlign: "stretch",
                activeStateEnabled: false,
                focusStateEnabled: false,
                onItemStateChanged: void 0,
                _layoutStrategy: "flex",
                _queue: void 0
            })
        }
    }, {
        key: "_defaultOptionsRules",
        value: function() {
            return _get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "_defaultOptionsRules", this).call(this).concat([{
                device: function device() {
                    var device = _devices2.default.real();
                    var isOldAndroid = "android" === device.platform && (device.version[0] < 4 || 4 === device.version[0] && device.version[1] < 4),
                        isOldIos = "ios" === device.platform && device.version[0] < 7;
                    return "win" === device.platform || _browser2.default.msie || isOldAndroid || isOldIos
                },
                options: {
                    _layoutStrategy: "fallback"
                }
            }])
        }
    }, {
        key: "_itemClass",
        value: function() {
            return BOX_ITEM_CLASS
        }
    }, {
        key: "_itemDataKey",
        value: function() {
            return BOX_ITEM_DATA_KEY
        }
    }, {
        key: "_itemElements",
        value: function() {
            return this._itemContainer().children(this._itemSelector())
        }
    }, {
        key: "_init",
        value: function() {
            _get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "_init", this).call(this);
            this.$element().addClass(BOX_CLASS + "-" + this.option("_layoutStrategy"));
            this._initLayout();
            this._initBoxQueue()
        }
    }, {
        key: "_initLayout",
        value: function() {
            this._layout = "fallback" === this.option("_layoutStrategy") ? new FallbackLayoutStrategy(this.$element(), this.option.bind(this)) : new FlexLayoutStrategy(this.$element(), this.option.bind(this))
        }
    }, {
        key: "_initBoxQueue",
        value: function() {
            this._queue = this.option("_queue") || []
        }
    }, {
        key: "_queueIsNotEmpty",
        value: function() {
            return this.option("_queue") ? false : !!this._queue.length
        }
    }, {
        key: "_pushItemToQueue",
        value: function($item, config) {
            this._queue.push({
                $item: $item,
                config: config
            })
        }
    }, {
        key: "_shiftItemFromQueue",
        value: function() {
            return this._queue.shift()
        }
    }, {
        key: "_initMarkup",
        value: function() {
            this.$element().addClass(BOX_CLASS);
            this._layout.renderBox();
            _get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "_initMarkup", this).call(this);
            this._renderAlign();
            this._renderActions()
        }
    }, {
        key: "_renderActions",
        value: function() {
            this._onItemStateChanged = this._createActionByOption("onItemStateChanged")
        }
    }, {
        key: "_renderAlign",
        value: function() {
            this._layout.renderAlign();
            this._layout.renderCrossAlign()
        }
    }, {
        key: "_renderItems",
        value: function(items) {
            var _this5 = this;
            this._layout.initSize();
            _get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "_renderItems", this).call(this, items);
            while (this._queueIsNotEmpty()) {
                var item = this._shiftItemFromQueue();
                this._createComponent(item.$item, Box, (0, _extend.extend)({
                    _layoutStrategy: this.option("_layoutStrategy"),
                    itemTemplate: this.option("itemTemplate"),
                    itemHoldTimeout: this.option("itemHoldTimeout"),
                    onItemHold: this.option("onItemHold"),
                    onItemClick: this.option("onItemClick"),
                    onItemContextMenu: this.option("onItemContextMenu"),
                    onItemRendered: this.option("onItemRendered"),
                    _queue: this._queue
                }, item.config))
            }
            this._layout.renderItems(this._itemElements());
            clearTimeout(this._updateTimer);
            this._updateTimer = setTimeout(function() {
                if (!_this5._isUpdated) {
                    _this5._layout.update()
                }
                _this5._isUpdated = false;
                _this5._updateTimer = null
            })
        }
    }, {
        key: "_renderItemContent",
        value: function(args) {
            var $itemNode = args.itemData && args.itemData.node;
            if ($itemNode) {
                return this._renderItemContentByNode(args, $itemNode)
            }
            return _get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "_renderItemContent", this).call(this, args)
        }
    }, {
        key: "_postprocessRenderItem",
        value: function(args) {
            var boxConfig = args.itemData.box;
            if (!boxConfig) {
                return
            }
            this._pushItemToQueue(args.itemContent, boxConfig)
        }
    }, {
        key: "_createItemByTemplate",
        value: function(itemTemplate, args) {
            if (args.itemData.box) {
                return itemTemplate.source ? itemTemplate.source() : (0, _renderer2.default)()
            }
            return _get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "_createItemByTemplate", this).call(this, itemTemplate, args)
        }
    }, {
        key: "_visibilityChanged",
        value: function(visible) {
            if (visible) {
                this._dimensionChanged()
            }
        }
    }, {
        key: "_dimensionChanged",
        value: function() {
            if (this._updateTimer) {
                return
            }
            this._isUpdated = true;
            this._layout.update()
        }
    }, {
        key: "_dispose",
        value: function() {
            clearTimeout(this._updateTimer);
            _get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "_dispose", this).apply(this, arguments)
        }
    }, {
        key: "_itemOptionChanged",
        value: function(item, property, value, oldValue) {
            if ("visible" === property) {
                this._onItemStateChanged({
                    name: property,
                    state: value,
                    oldState: false !== oldValue
                })
            }
            _get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "_itemOptionChanged", this).call(this, item, property, value)
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "_layoutStrategy":
                case "_queue":
                case "direction":
                    this._invalidate();
                    break;
                case "align":
                    this._layout.renderAlign();
                    break;
                case "crossAlign":
                    this._layout.renderCrossAlign();
                    break;
                default:
                    _get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "_itemOptions",
        value: function() {
            var _this6 = this;
            var options = _get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "_itemOptions", this).call(this);
            options.fireItemStateChangedAction = function(e) {
                _this6._onItemStateChanged(e)
            };
            return options
        }
    }, {
        key: "repaint",
        value: function() {
            this._dimensionChanged()
        }
    }]);
    return Box
}(_uiCollection_widget2.default);
Box.ItemClass = BoxItem;
(0, _component_registrator2.default)("dxBox", Box);
module.exports = Box;
module.exports.default = module.exports;
