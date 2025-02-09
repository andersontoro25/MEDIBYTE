/**
 * DevExtreme (ui/multi_view.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _fx = require("../animation/fx");
var _fx2 = _interopRequireDefault(_fx);
var _translator2 = require("../animation/translator");
var _translator3 = _interopRequireDefault(_translator2);
var _math = require("../core/utils/math");
var _math2 = _interopRequireDefault(_math);
var _extend = require("../core/utils/extend");
var _common = require("../core/utils/common");
var _dom = require("../core/utils/dom");
var _type = require("../core/utils/type");
var _devices = require("../core/devices");
var _devices2 = _interopRequireDefault(_devices);
var _component_registrator = require("../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _uiCollection_widget = require("./collection/ui.collection_widget.live_update");
var _uiCollection_widget2 = _interopRequireDefault(_uiCollection_widget);
var _swipeable = require("../events/gesture/swipeable");
var _swipeable2 = _interopRequireDefault(_swipeable);
var _deferred = require("../core/utils/deferred");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var MULTIVIEW_CLASS = "dx-multiview";
var MULTIVIEW_WRAPPER_CLASS = "dx-multiview-wrapper";
var MULTIVIEW_ITEM_CONTAINER_CLASS = "dx-multiview-item-container";
var MULTIVIEW_ITEM_CLASS = "dx-multiview-item";
var MULTIVIEW_ITEM_HIDDEN_CLASS = "dx-multiview-item-hidden";
var MULTIVIEW_ITEM_DATA_KEY = "dxMultiViewItemData";
var MULTIVIEW_ANIMATION_DURATION = 200;
var toNumber = function(value) {
    return +value
};
var position = function($element) {
    return _translator3.default.locate($element).left
};
var _translator = {
    move: function($element, position) {
        _translator3.default.move($element, {
            left: position
        })
    }
};
var animation = {
    moveTo: function($element, position, duration, completeAction) {
        _fx2.default.animate($element, {
            type: "slide",
            to: {
                left: position
            },
            duration: duration,
            complete: completeAction
        })
    },
    complete: function($element) {
        _fx2.default.stop($element, true)
    }
};
var MultiView = _uiCollection_widget2.default.inherit({
    _activeStateUnit: "." + MULTIVIEW_ITEM_CLASS,
    _supportedKeys: function() {
        return (0, _extend.extend)(this.callBase(), {
            pageUp: _common.noop,
            pageDown: _common.noop
        })
    },
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            selectedIndex: 0,
            swipeEnabled: true,
            animationEnabled: true,
            loop: false,
            deferRendering: true,
            _itemAttributes: {
                role: "tabpanel"
            },
            loopItemFocus: false,
            selectOnFocus: true,
            selectionMode: "single",
            selectionRequired: true,
            selectionByClick: false
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                return "desktop" === _devices2.default.real().deviceType && !_devices2.default.isSimulator()
            },
            options: {
                focusStateEnabled: true
            }
        }])
    },
    _itemClass: function() {
        return MULTIVIEW_ITEM_CLASS
    },
    _itemDataKey: function() {
        return MULTIVIEW_ITEM_DATA_KEY
    },
    _itemContainer: function() {
        return this._$itemContainer
    },
    _itemElements: function() {
        return this._itemContainer().children(this._itemSelector())
    },
    _itemWidth: function() {
        if (!this._itemWidthValue) {
            this._itemWidthValue = this._$wrapper.width()
        }
        return this._itemWidthValue
    },
    _clearItemWidthCache: function() {
        delete this._itemWidthValue
    },
    _itemsCount: function() {
        return this.option("items").length
    },
    _normalizeIndex: function(index) {
        var count = this._itemsCount();
        if (index < 0) {
            index += count
        }
        if (index >= count) {
            index -= count
        }
        return index
    },
    _getRTLSignCorrection: function() {
        return this.option("rtlEnabled") ? -1 : 1
    },
    _init: function() {
        this.callBase.apply(this, arguments);
        var $element = this.$element();
        $element.addClass(MULTIVIEW_CLASS);
        this._$wrapper = (0, _renderer2.default)("<div>").addClass(MULTIVIEW_WRAPPER_CLASS);
        this._$wrapper.appendTo($element);
        this._$itemContainer = (0, _renderer2.default)("<div>").addClass(MULTIVIEW_ITEM_CONTAINER_CLASS);
        this._$itemContainer.appendTo(this._$wrapper);
        this.option("loopItemFocus", this.option("loop"));
        this._initSwipeable()
    },
    _initMarkup: function() {
        this._deferredItems = [];
        this.callBase();
        var selectedItemIndices = this._getSelectedItemIndices();
        this._updateItemsVisibility(selectedItemIndices[0])
    },
    _afterItemElementDeleted: function($item, deletedActionArgs) {
        this.callBase($item, deletedActionArgs);
        if (this._deferredItems) {
            this._deferredItems.splice(deletedActionArgs.itemIndex, 1)
        }
    },
    _beforeItemElementInserted: function(change) {
        this.callBase.apply(this, arguments);
        if (this._deferredItems) {
            this._deferredItems.splice(change.index, 0, null)
        }
    },
    _executeItemRenderAction: function(index, itemData, itemElement) {
        index = (this.option("items") || []).indexOf(itemData);
        this.callBase(index, itemData, itemElement)
    },
    _renderItemContent: function(args) {
        var renderContentDeferred = new _deferred.Deferred;
        var that = this,
            callBase = this.callBase;
        var deferred = new _deferred.Deferred;
        deferred.done(function() {
            var $itemContent = callBase.call(that, args);
            renderContentDeferred.resolve($itemContent)
        });
        this._deferredItems[args.index] = deferred;
        this.option("deferRendering") || deferred.resolve();
        return renderContentDeferred.promise()
    },
    _render: function() {
        var _this = this;
        this.callBase();
        (0, _common.deferRender)(function() {
            var selectedItemIndices = _this._getSelectedItemIndices();
            _this._updateItems(selectedItemIndices[0])
        })
    },
    _updateItems: function(selectedIndex, newIndex) {
        this._updateItemsPosition(selectedIndex, newIndex);
        this._updateItemsVisibility(selectedIndex, newIndex)
    },
    _modifyByChanges: function() {
        this.callBase.apply(this, arguments);
        var selectedItemIndices = this._getSelectedItemIndices();
        this._updateItemsVisibility(selectedItemIndices[0])
    },
    _updateItemsPosition: function(selectedIndex, newIndex) {
        var $itemElements = this._itemElements(),
            positionSign = (0, _type.isDefined)(newIndex) ? -this._animationDirection(newIndex, selectedIndex) : void 0,
            $selectedItem = $itemElements.eq(selectedIndex);
        _translator.move($selectedItem, 0);
        if ((0, _type.isDefined)(newIndex)) {
            _translator.move($itemElements.eq(newIndex), 100 * positionSign + "%")
        }
    },
    _updateItemsVisibility: function(selectedIndex, newIndex) {
        var $itemElements = this._itemElements();
        $itemElements.each(function(itemIndex, item) {
            var $item = (0, _renderer2.default)(item),
                isHidden = itemIndex !== selectedIndex && itemIndex !== newIndex;
            if (!isHidden) {
                this._renderSpecificItem(itemIndex)
            }
            $item.toggleClass(MULTIVIEW_ITEM_HIDDEN_CLASS, isHidden);
            this.setAria("hidden", isHidden || void 0, $item)
        }.bind(this))
    },
    _renderSpecificItem: function(index) {
        var $item = this._itemElements().eq(index),
            hasItemContent = $item.find(this._itemContentClass()).length > 0;
        if ((0, _type.isDefined)(index) && !hasItemContent) {
            this._deferredItems[index].resolve();
            (0, _dom.triggerResizeEvent)($item)
        }
    },
    _refreshItem: function($item, item) {
        this.callBase($item, item);
        this._updateItemsVisibility(this.option("selectedIndex"))
    },
    _setAriaSelected: _common.noop,
    _updateSelection: function(addedSelection, removedSelection) {
        var newIndex = addedSelection[0],
            prevIndex = removedSelection[0];
        animation.complete(this._$itemContainer);
        this._updateItems(prevIndex, newIndex);
        var animationDirection = this._animationDirection(newIndex, prevIndex);
        this._animateItemContainer(animationDirection * this._itemWidth(), function() {
            _translator.move(this._$itemContainer, 0);
            this._updateItems(newIndex);
            this._$itemContainer.width()
        }.bind(this))
    },
    _animateItemContainer: function(position, completeCallback) {
        var duration = this.option("animationEnabled") ? MULTIVIEW_ANIMATION_DURATION : 0;
        animation.moveTo(this._$itemContainer, position, duration, completeCallback)
    },
    _animationDirection: function(newIndex, prevIndex) {
        var containerPosition = position(this._$itemContainer),
            indexDifference = (prevIndex - newIndex) * this._getRTLSignCorrection() * this._getItemFocusLoopSignCorrection(),
            isSwipePresent = 0 !== containerPosition,
            directionSignVariable = isSwipePresent ? containerPosition : indexDifference;
        return _math2.default.sign(directionSignVariable)
    },
    _getSwipeDisabledState: function() {
        return !this.option("swipeEnabled") || this._itemsCount() <= 1
    },
    _initSwipeable: function() {
        var _this2 = this;
        this._createComponent(this.$element(), _swipeable2.default, {
            disabled: this._getSwipeDisabledState(),
            elastic: false,
            itemSizeFunc: this._itemWidth.bind(this),
            onStart: function(args) {
                return _this2._swipeStartHandler(args.event)
            },
            onUpdated: function(args) {
                return _this2._swipeUpdateHandler(args.event)
            },
            onEnd: function(args) {
                return _this2._swipeEndHandler(args.event)
            }
        })
    },
    _swipeStartHandler: function(e) {
        animation.complete(this._$itemContainer);
        var selectedIndex = this.option("selectedIndex"),
            loop = this.option("loop"),
            lastIndex = this._itemsCount() - 1,
            rtl = this.option("rtlEnabled");
        e.maxLeftOffset = toNumber(loop || (rtl ? selectedIndex > 0 : selectedIndex < lastIndex));
        e.maxRightOffset = toNumber(loop || (rtl ? selectedIndex < lastIndex : selectedIndex > 0));
        this._swipeDirection = null
    },
    _swipeUpdateHandler: function(e) {
        var offset = e.offset,
            swipeDirection = _math2.default.sign(offset) * this._getRTLSignCorrection();
        _translator.move(this._$itemContainer, offset * this._itemWidth());
        if (swipeDirection !== this._swipeDirection) {
            this._swipeDirection = swipeDirection;
            var selectedIndex = this.option("selectedIndex"),
                newIndex = this._normalizeIndex(selectedIndex - swipeDirection);
            this._updateItems(selectedIndex, newIndex)
        }
    },
    _swipeEndHandler: function(e) {
        var targetOffset = e.targetOffset * this._getRTLSignCorrection();
        if (targetOffset) {
            this.option("selectedIndex", this._normalizeIndex(this.option("selectedIndex") - targetOffset));
            var $selectedElement = this.itemElements().filter(".dx-item-selected");
            this.option("focusStateEnabled") && this.option("focusedElement", (0, _dom.getPublicElement)($selectedElement))
        } else {
            this._animateItemContainer(0, _common.noop)
        }
    },
    _getItemFocusLoopSignCorrection: function() {
        return this._itemFocusLooped ? -1 : 1
    },
    _moveFocus: function() {
        this.callBase.apply(this, arguments);
        this._itemFocusLooped = false
    },
    _prevItem: function($items) {
        var $result = this.callBase.apply(this, arguments);
        this._itemFocusLooped = $result.is($items.last());
        return $result
    },
    _nextItem: function($items) {
        var $result = this.callBase.apply(this, arguments);
        this._itemFocusLooped = $result.is($items.first());
        return $result
    },
    _dimensionChanged: function() {
        this._clearItemWidthCache()
    },
    _visibilityChanged: function(visible) {
        if (visible) {
            this._dimensionChanged()
        }
    },
    _updateSwipeDisabledState: function() {
        var disabled = this._getSwipeDisabledState();
        _swipeable2.default.getInstance(this.$element()).option("disabled", disabled)
    },
    _optionChanged: function(args) {
        var value = args.value;
        switch (args.name) {
            case "loop":
                this.option("loopItemFocus", value);
                break;
            case "animationEnabled":
                break;
            case "swipeEnabled":
                this._updateSwipeDisabledState();
                break;
            case "deferRendering":
                this._invalidate();
                break;
            case "items":
                this._updateSwipeDisabledState();
                this.callBase(args);
                break;
            default:
                this.callBase(args)
        }
    }
});
(0, _component_registrator2.default)("dxMultiView", MultiView);
module.exports = MultiView;
module.exports.default = module.exports;
