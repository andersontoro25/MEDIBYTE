/**
 * DevExtreme (ui/collection/ui.collection_widget.base.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _common = require("../../core/utils/common");
var _common2 = _interopRequireDefault(_common);
var _dom = require("../../core/utils/dom");
var _dom_adapter = require("../../core/dom_adapter");
var _dom_adapter2 = _interopRequireDefault(_dom_adapter);
var _type = require("../../core/utils/type");
var _deferred = require("../../core/utils/deferred");
var _extend = require("../../core/utils/extend");
var _array = require("../../core/utils/array");
var _iterator = require("../../core/utils/iterator");
var _iterator2 = _interopRequireDefault(_iterator);
var _action = require("../../core/action");
var _action2 = _interopRequireDefault(_action);
var _guid = require("../../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _utils = require("../../events/utils");
var _utils2 = _interopRequireDefault(_utils);
var _pointer = require("../../events/pointer");
var _pointer2 = _interopRequireDefault(_pointer);
var _data_helper = require("../../data_helper");
var _data_helper2 = _interopRequireDefault(_data_helper);
var _item = require("./item");
var _item2 = _interopRequireDefault(_item);
var _selectors = require("../widget/selectors");
var _selectors2 = _interopRequireDefault(_selectors);
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _hold = require("../../events/hold");
var _hold2 = _interopRequireDefault(_hold);
var _data = require("../../core/utils/data");
var _click = require("../../events/click");
var _click2 = _interopRequireDefault(_click);
var _contextmenu = require("../../events/contextmenu");
var _contextmenu2 = _interopRequireDefault(_contextmenu);
var _bindable_template = require("../widget/bindable_template");
var _bindable_template2 = _interopRequireDefault(_bindable_template);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var COLLECTION_CLASS = "dx-collection";
var ITEM_CLASS = "dx-item";
var CONTENT_CLASS_POSTFIX = "-content";
var ITEM_CONTENT_PLACEHOLDER_CLASS = "dx-item-content-placeholder";
var ITEM_DATA_KEY = "dxItemData";
var ITEM_INDEX_KEY = "dxItemIndex";
var ITEM_TEMPLATE_ID_PREFIX = "tmpl-";
var ITEMS_SELECTOR = "[data-options*='dxItem']";
var SELECTED_ITEM_CLASS = "dx-item-selected";
var ITEM_RESPONSE_WAIT_CLASS = "dx-item-response-wait";
var EMPTY_COLLECTION = "dx-empty-collection";
var TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
var ITEM_PATH_REGEX = /^([^.]+\[\d+\]\.)+([\w.]+)$/;
var FOCUS_UP = "up";
var FOCUS_DOWN = "down";
var FOCUS_LEFT = "left";
var FOCUS_RIGHT = "right";
var FOCUS_PAGE_UP = "pageup";
var FOCUS_PAGE_DOWN = "pagedown";
var FOCUS_LAST = "last";
var FOCUS_FIRST = "first";
var CollectionWidget = _ui2.default.inherit({
    _activeStateUnit: "." + ITEM_CLASS,
    _supportedKeys: function() {
        var enter = function(e) {
                var $itemElement = (0, _renderer2.default)(this.option("focusedElement"));
                if (!$itemElement.length) {
                    return
                }
                this._itemClickHandler((0, _extend.extend)({}, e, {
                    target: $itemElement,
                    currentTarget: $itemElement
                }))
            },
            space = function(e) {
                e.preventDefault();
                enter.call(this, e)
            },
            move = function(location, e) {
                e.preventDefault();
                e.stopPropagation();
                this._moveFocus(location, e)
            };
        return (0, _extend.extend)(this.callBase(), {
            space: space,
            enter: enter,
            leftArrow: move.bind(this, FOCUS_LEFT),
            rightArrow: move.bind(this, FOCUS_RIGHT),
            upArrow: move.bind(this, FOCUS_UP),
            downArrow: move.bind(this, FOCUS_DOWN),
            pageUp: move.bind(this, FOCUS_UP),
            pageDown: move.bind(this, FOCUS_DOWN),
            home: move.bind(this, FOCUS_FIRST),
            end: move.bind(this, FOCUS_LAST)
        })
    },
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            selectOnFocus: false,
            loopItemFocus: true,
            items: [],
            itemTemplate: "item",
            onItemRendered: null,
            onItemClick: null,
            onItemHold: null,
            itemHoldTimeout: 750,
            onItemContextMenu: null,
            onFocusedItemChanged: null,
            noDataText: _message2.default.format("dxCollectionWidget-noDataText"),
            dataSource: null,
            _itemAttributes: {},
            itemTemplateProperty: "template",
            focusOnSelectedItem: true,
            focusedElement: null,
            displayExpr: void 0,
            disabledExpr: function(data) {
                return data ? data.disabled : void 0
            },
            visibleExpr: function(data) {
                return data ? data.visible : void 0
            }
        })
    },
    _getAnonymousTemplateName: function() {
        return "item"
    },
    _init: function() {
        this._compileDisplayGetter();
        this.callBase();
        this._cleanRenderedItems();
        this._refreshDataSource()
    },
    _compileDisplayGetter: function() {
        var displayExpr = this.option("displayExpr");
        this._displayGetter = displayExpr ? (0, _data.compileGetter)(this.option("displayExpr")) : void 0
    },
    _initTemplates: function() {
        this._initItemsFromMarkup();
        this.callBase();
        this._initDefaultItemTemplate()
    },
    _initDefaultItemTemplate: function() {
        var fieldsMap = this._getFieldsMap();
        this._defaultTemplates.item = new _bindable_template2.default(function($container, data) {
            if ((0, _type.isPlainObject)(data)) {
                this._prepareDefaultItemTemplate(data, $container)
            } else {
                if (fieldsMap && (0, _type.isFunction)(fieldsMap.text)) {
                    data = fieldsMap.text(data)
                }
                $container.text(String(_common2.default.ensureDefined(data, "")))
            }
        }.bind(this), this._getBindableFields(), this.option("integrationOptions.watchMethod"), fieldsMap)
    },
    _getBindableFields: function() {
        return ["text", "html"]
    },
    _getFieldsMap: function() {
        if (this._displayGetter) {
            return {
                text: this._displayGetter
            }
        }
    },
    _prepareDefaultItemTemplate: function(data, $container) {
        if (data.text) {
            $container.text(data.text)
        }
        if (data.html) {
            $container.html(data.html)
        }
    },
    _initItemsFromMarkup: function() {
        var _this = this;
        var $items = this.$element().contents().filter(ITEMS_SELECTOR);
        if (!$items.length || this.option("items").length) {
            return
        }
        var items = [].slice.call($items).map(function(item) {
            var $item = (0, _renderer2.default)(item);
            var result = (0, _dom.getElementOptions)(item).dxItem;
            var isTemplateRequired = $item.html().trim() && !result.template;
            if (isTemplateRequired) {
                result.template = _this._prepareItemTemplate($item)
            } else {
                $item.remove()
            }
            return result
        });
        this.option("items", items)
    },
    _prepareItemTemplate: function($item) {
        var templateId = ITEM_TEMPLATE_ID_PREFIX + new _guid2.default;
        var $template = $item.detach().clone().removeAttr("data-options").addClass(TEMPLATE_WRAPPER_CLASS);
        this._saveTemplate(templateId, $template);
        return templateId
    },
    _dataSourceOptions: function() {
        return {
            paginate: false
        }
    },
    _cleanRenderedItems: function() {
        this._renderedItemsCount = 0
    },
    _focusTarget: function() {
        return this.$element()
    },
    _focusInHandler: function(e) {
        this.callBase.apply(this, arguments);
        if ((0, _array.inArray)(e.target, this._focusTarget()) === -1) {
            return
        }
        var $focusedElement = (0, _renderer2.default)(this.option("focusedElement"));
        if ($focusedElement.length) {
            this._setFocusedItem($focusedElement)
        } else {
            var $activeItem = this._getActiveItem();
            if ($activeItem.length) {
                this.option("focusedElement", (0, _dom.getPublicElement)($activeItem))
            }
        }
    },
    _focusOutHandler: function() {
        this.callBase.apply(this, arguments);
        var $target = (0, _renderer2.default)(this.option("focusedElement"));
        if ($target.length) {
            this._toggleFocusClass(false, $target)
        }
    },
    _getActiveItem: function(last) {
        var $focusedElement = (0, _renderer2.default)(this.option("focusedElement"));
        if ($focusedElement.length) {
            return $focusedElement
        }
        var index = this.option("focusOnSelectedItem") ? this.option("selectedIndex") : 0;
        var activeElements = this._getActiveElement();
        var lastIndex = activeElements.length - 1;
        if (index < 0) {
            index = last ? lastIndex : 0
        }
        return activeElements.eq(index)
    },
    _renderFocusTarget: function() {
        this.callBase.apply(this, arguments);
        this._refreshActiveDescendant()
    },
    _moveFocus: function(location) {
        var $newTarget, $items = this._getAvailableItems();
        switch (location) {
            case FOCUS_PAGE_UP:
            case FOCUS_UP:
                $newTarget = this._prevItem($items);
                break;
            case FOCUS_PAGE_DOWN:
            case FOCUS_DOWN:
                $newTarget = this._nextItem($items);
                break;
            case FOCUS_RIGHT:
                $newTarget = this.option("rtlEnabled") ? this._prevItem($items) : this._nextItem($items);
                break;
            case FOCUS_LEFT:
                $newTarget = this.option("rtlEnabled") ? this._nextItem($items) : this._prevItem($items);
                break;
            case FOCUS_FIRST:
                $newTarget = $items.first();
                break;
            case FOCUS_LAST:
                $newTarget = $items.last();
                break;
            default:
                return false
        }
        if (0 !== $newTarget.length) {
            this.option("focusedElement", (0, _dom.getPublicElement)($newTarget))
        }
    },
    _getVisibleItems: function($itemElements) {
        $itemElements = $itemElements || this._itemElements();
        return $itemElements.filter(":visible")
    },
    _getAvailableItems: function($itemElements) {
        return this._getVisibleItems($itemElements).not(".dx-state-disabled")
    },
    _prevItem: function($items) {
        var $target = this._getActiveItem(),
            targetIndex = $items.index($target),
            $last = $items.last(),
            $item = (0, _renderer2.default)($items[targetIndex - 1]),
            loop = this.option("loopItemFocus");
        if (0 === $item.length && loop) {
            $item = $last
        }
        return $item
    },
    _nextItem: function($items) {
        var $target = this._getActiveItem(true),
            targetIndex = $items.index($target),
            $first = $items.first(),
            $item = (0, _renderer2.default)($items[targetIndex + 1]),
            loop = this.option("loopItemFocus");
        if (0 === $item.length && loop) {
            $item = $first
        }
        return $item
    },
    _selectFocusedItem: function($target) {
        this.selectItem($target)
    },
    _removeFocusedItem: function(target) {
        var $target = (0, _renderer2.default)(target);
        if ($target.length) {
            this._toggleFocusClass(false, $target);
            $target.removeAttr("id")
        }
    },
    _refreshActiveDescendant: function() {
        this.setAria("activedescendant", "");
        this.setAria("activedescendant", this.getFocusedItemId())
    },
    _setFocusedItem: function($target) {
        if (!$target || !$target.length) {
            return
        }
        $target.attr("id", this.getFocusedItemId());
        this._toggleFocusClass(true, $target);
        this.onFocusedItemChanged(this.getFocusedItemId());
        this._refreshActiveDescendant();
        if (this.option("selectOnFocus")) {
            this._selectFocusedItem($target)
        }
    },
    _findItemElementByItem: function(item) {
        var result = (0, _renderer2.default)(),
            that = this;
        this.itemElements().each(function() {
            var $item = (0, _renderer2.default)(this);
            if ($item.data(that._itemDataKey()) === item) {
                result = $item;
                return false
            }
        });
        return result
    },
    _getIndexByItem: function(item) {
        return this.option("items").indexOf(item)
    },
    _itemOptionChanged: function(item, property, value, oldValue) {
        var $item = this._findItemElementByItem(item);
        if (!$item.length) {
            return
        }
        if (!this.constructor.ItemClass.getInstance($item).setDataField(property, value)) {
            this._refreshItem($item, item)
        }
    },
    _refreshItem: function($item) {
        var itemData = this._getItemData($item),
            index = $item.data(this._itemIndexKey());
        this._renderItem(this._renderedItemsCount + index, itemData, null, $item)
    },
    _optionChanged: function(args) {
        if ("items" === args.name) {
            var matches = args.fullName.match(ITEM_PATH_REGEX);
            if (matches && matches.length) {
                var property = matches[matches.length - 1],
                    itemPath = args.fullName.replace("." + property, ""),
                    item = this.option(itemPath);
                this._itemOptionChanged(item, property, args.value, args.previousValue);
                return
            }
        }
        switch (args.name) {
            case "items":
            case "_itemAttributes":
            case "itemTemplateProperty":
                this._cleanRenderedItems();
                this._invalidate();
                break;
            case "dataSource":
                this._refreshDataSource();
                this._renderEmptyMessage();
                break;
            case "noDataText":
                this._renderEmptyMessage();
                break;
            case "itemTemplate":
                this._invalidate();
                break;
            case "onItemRendered":
                this._createItemRenderAction();
                break;
            case "onItemClick":
                break;
            case "onItemHold":
            case "itemHoldTimeout":
                this._attachHoldEvent();
                break;
            case "onItemContextMenu":
                this._attachContextMenuEvent();
                break;
            case "onFocusedItemChanged":
                this.onFocusedItemChanged = this._createActionByOption("onFocusedItemChanged");
                break;
            case "selectOnFocus":
            case "loopItemFocus":
            case "focusOnSelectedItem":
                break;
            case "focusedElement":
                this._removeFocusedItem(args.previousValue);
                this._setFocusedItem((0, _renderer2.default)(args.value));
                break;
            case "displayExpr":
                this._compileDisplayGetter();
                this._initDefaultItemTemplate();
                this._invalidate();
                break;
            case "visibleExpr":
            case "disabledExpr":
                this._invalidate();
                break;
            default:
                this.callBase(args)
        }
    },
    _invalidate: function() {
        this.option("focusedElement", null);
        return this.callBase.apply(this, arguments)
    },
    _loadNextPage: function() {
        var dataSource = this._dataSource;
        this._expectNextPageLoading();
        dataSource.pageIndex(1 + dataSource.pageIndex());
        return dataSource.load()
    },
    _expectNextPageLoading: function() {
        this._startIndexForAppendedItems = 0
    },
    _expectLastItemLoading: function() {
        this._startIndexForAppendedItems = -1
    },
    _forgetNextPageLoading: function() {
        this._startIndexForAppendedItems = null
    },
    _dataSourceChangedHandler: function(newItems) {
        var items = this.option("items");
        if (this._initialized && items && this._shouldAppendItems()) {
            this._renderedItemsCount = items.length;
            if (!this._isLastPage() || this._startIndexForAppendedItems !== -1) {
                this.option().items = items.concat(newItems.slice(this._startIndexForAppendedItems))
            }
            this._forgetNextPageLoading();
            this._refreshContent();
            this._renderFocusTarget()
        } else {
            this.option("items", newItems.slice())
        }
    },
    _refreshContent: function() {
        this._prepareContent();
        this._renderContent()
    },
    _dataSourceLoadErrorHandler: function() {
        this._forgetNextPageLoading();
        this.option("items", this.option("items"))
    },
    _shouldAppendItems: function() {
        return null != this._startIndexForAppendedItems && this._allowDynamicItemsAppend()
    },
    _allowDynamicItemsAppend: function() {
        return false
    },
    _clean: function() {
        this._cleanFocusState();
        this._cleanItemContainer()
    },
    _cleanItemContainer: function() {
        (0, _renderer2.default)(this._itemContainer()).empty()
    },
    _dispose: function() {
        this.callBase();
        clearTimeout(this._itemFocusTimeout)
    },
    _refresh: function() {
        this._cleanRenderedItems();
        this.callBase.apply(this, arguments)
    },
    _itemContainer: function() {
        return this.$element()
    },
    _itemClass: function() {
        return ITEM_CLASS
    },
    _itemContentClass: function() {
        return this._itemClass() + CONTENT_CLASS_POSTFIX
    },
    _selectedItemClass: function() {
        return SELECTED_ITEM_CLASS
    },
    _itemResponseWaitClass: function() {
        return ITEM_RESPONSE_WAIT_CLASS
    },
    _itemSelector: function() {
        return "." + this._itemClass()
    },
    _itemDataKey: function() {
        return ITEM_DATA_KEY
    },
    _itemIndexKey: function() {
        return ITEM_INDEX_KEY
    },
    _itemElements: function() {
        return this._itemContainer().find(this._itemSelector())
    },
    _initMarkup: function() {
        this.callBase();
        this.onFocusedItemChanged = this._createActionByOption("onFocusedItemChanged");
        this.$element().addClass(COLLECTION_CLASS);
        this._prepareContent()
    },
    _prepareContent: _common2.default.deferRenderer(function() {
        this._renderContentImpl()
    }),
    _renderContent: function() {
        this._fireContentReadyAction()
    },
    _render: function() {
        this.callBase();
        this._attachClickEvent();
        this._attachHoldEvent();
        this._attachContextMenuEvent()
    },
    _attachClickEvent: function() {
        var itemSelector = this._itemSelector(),
            clickEventNamespace = _utils2.default.addNamespace(_click2.default.name, this.NAME),
            pointerDownEventNamespace = _utils2.default.addNamespace(_pointer2.default.down, this.NAME),
            that = this;
        var pointerDownAction = new _action2.default(function(args) {
            var event = args.event;
            that._itemPointerDownHandler(event)
        });
        _events_engine2.default.off(this._itemContainer(), clickEventNamespace, itemSelector);
        _events_engine2.default.off(this._itemContainer(), pointerDownEventNamespace, itemSelector);
        _events_engine2.default.on(this._itemContainer(), clickEventNamespace, itemSelector, function(e) {
            this._itemClickHandler(e)
        }.bind(this));
        _events_engine2.default.on(this._itemContainer(), pointerDownEventNamespace, itemSelector, function(e) {
            pointerDownAction.execute({
                element: (0, _renderer2.default)(e.target),
                event: e
            })
        })
    },
    _itemClickHandler: function(e, args, config) {
        this._itemDXEventHandler(e, "onItemClick", args, config)
    },
    _itemPointerDownHandler: function(e) {
        if (!this.option("focusStateEnabled")) {
            return
        }
        this._itemFocusHandler = function() {
            clearTimeout(this._itemFocusTimeout);
            this._itemFocusHandler = null;
            if (e.isDefaultPrevented()) {
                return
            }
            var $target = (0, _renderer2.default)(e.target),
                $closestItem = $target.closest(this._itemElements()),
                $closestFocusable = this._closestFocusable($target);
            if ($closestItem.length && $closestFocusable && (0, _array.inArray)($closestFocusable.get(0), this._focusTarget()) !== -1) {
                this.option("focusedElement", (0, _dom.getPublicElement)($closestItem))
            }
        }.bind(this);
        this._itemFocusTimeout = setTimeout(this._forcePointerDownFocus.bind(this))
    },
    _closestFocusable: function($target) {
        if ($target.is(_selectors2.default.focusable)) {
            return $target
        } else {
            $target = $target.parent();
            while ($target.length && !_dom_adapter2.default.isDocument($target.get(0))) {
                if ($target.is(_selectors2.default.focusable)) {
                    return $target
                }
                $target = $target.parent()
            }
        }
    },
    _forcePointerDownFocus: function() {
        this._itemFocusHandler && this._itemFocusHandler()
    },
    _updateFocusState: function() {
        this.callBase.apply(this, arguments);
        this._forcePointerDownFocus()
    },
    _attachHoldEvent: function() {
        var $itemContainer = this._itemContainer(),
            itemSelector = this._itemSelector(),
            eventName = _utils2.default.addNamespace(_hold2.default.name, this.NAME);
        _events_engine2.default.off($itemContainer, eventName, itemSelector);
        _events_engine2.default.on($itemContainer, eventName, itemSelector, {
            timeout: this._getHoldTimeout()
        }, this._itemHoldHandler.bind(this))
    },
    _getHoldTimeout: function() {
        return this.option("itemHoldTimeout")
    },
    _shouldFireHoldEvent: function() {
        return this.hasActionSubscription("onItemHold")
    },
    _itemHoldHandler: function(e) {
        if (this._shouldFireHoldEvent()) {
            this._itemDXEventHandler(e, "onItemHold")
        } else {
            e.cancel = true
        }
    },
    _attachContextMenuEvent: function() {
        var $itemContainer = this._itemContainer(),
            itemSelector = this._itemSelector(),
            eventName = _utils2.default.addNamespace(_contextmenu2.default.name, this.NAME);
        _events_engine2.default.off($itemContainer, eventName, itemSelector);
        _events_engine2.default.on($itemContainer, eventName, itemSelector, this._itemContextMenuHandler.bind(this))
    },
    _shouldFireContextMenuEvent: function() {
        return this.hasActionSubscription("onItemContextMenu")
    },
    _itemContextMenuHandler: function(e) {
        if (this._shouldFireContextMenuEvent()) {
            this._itemDXEventHandler(e, "onItemContextMenu")
        } else {
            e.cancel = true
        }
    },
    _renderContentImpl: function() {
        var items = this.option("items") || [];
        if (this._renderedItemsCount) {
            this._renderItems(items.slice(this._renderedItemsCount))
        } else {
            this._renderItems(items)
        }
    },
    _renderItems: function(items) {
        if (items.length) {
            _iterator2.default.each(items, function(index, itemData) {
                this._renderItem(this._renderedItemsCount + index, itemData)
            }.bind(this))
        }
        this._renderEmptyMessage()
    },
    _renderItem: function(index, itemData, $container, $itemToReplace) {
        $container = $container || this._itemContainer();
        var $itemFrame = this._renderItemFrame(index, itemData, $container, $itemToReplace);
        this._setElementData($itemFrame, itemData, index);
        $itemFrame.attr(this.option("_itemAttributes"));
        this._attachItemClickEvent(itemData, $itemFrame);
        var $itemContent = this._getItemContent($itemFrame);
        var renderContentPromise = this._renderItemContent({
            index: index,
            itemData: itemData,
            container: (0, _dom.getPublicElement)($itemContent),
            contentClass: this._itemContentClass(),
            defaultTemplateName: this.option("itemTemplate")
        });
        var that = this;
        (0, _deferred.when)(renderContentPromise).done(function($itemContent) {
            that._postprocessRenderItem({
                itemElement: $itemFrame,
                itemContent: $itemContent,
                itemData: itemData,
                itemIndex: index
            });
            that._executeItemRenderAction(index, itemData, (0, _dom.getPublicElement)($itemFrame))
        });
        return $itemFrame
    },
    _getItemContent: function($itemFrame) {
        var $itemContent = $itemFrame.find("." + ITEM_CONTENT_PLACEHOLDER_CLASS);
        $itemContent.removeClass(ITEM_CONTENT_PLACEHOLDER_CLASS);
        return $itemContent
    },
    _attachItemClickEvent: function(itemData, $itemElement) {
        if (!itemData || !itemData.onClick) {
            return
        }
        _events_engine2.default.on($itemElement, _click2.default.name, function(e) {
            this._itemEventHandlerByHandler($itemElement, itemData.onClick, {
                event: e
            })
        }.bind(this))
    },
    _renderItemContent: function(args) {
        var itemTemplateName = this._getItemTemplateName(args);
        var itemTemplate = this._getTemplate(itemTemplateName);
        this._addItemContentClasses(args);
        var $templateResult = (0, _renderer2.default)(this._createItemByTemplate(itemTemplate, args));
        if (!$templateResult.hasClass(TEMPLATE_WRAPPER_CLASS)) {
            return args.container
        }
        return this._renderItemContentByNode(args, $templateResult)
    },
    _renderItemContentByNode: function(args, $node) {
        (0, _renderer2.default)(args.container).replaceWith($node);
        args.container = (0, _dom.getPublicElement)($node);
        this._addItemContentClasses(args);
        return $node
    },
    _addItemContentClasses: function(args) {
        var classes = [ITEM_CLASS + CONTENT_CLASS_POSTFIX, args.contentClass];
        (0, _renderer2.default)(args.container).addClass(classes.join(" "))
    },
    _appendItemToContainer: function($container, $itemFrame, index) {
        $itemFrame.appendTo($container)
    },
    _renderItemFrame: function(index, itemData, $container, $itemToReplace) {
        var $itemFrame = (0, _renderer2.default)("<div>");
        new this.constructor.ItemClass($itemFrame, this._itemOptions(), itemData || {});
        if ($itemToReplace && $itemToReplace.length) {
            $itemToReplace.replaceWith($itemFrame)
        } else {
            this._appendItemToContainer.call(this, $container, $itemFrame, index)
        }
        return $itemFrame
    },
    _itemOptions: function() {
        var that = this;
        return {
            watchMethod: function() {
                return that.option("integrationOptions.watchMethod")
            },
            fieldGetter: function(field) {
                var expr = that.option(field + "Expr"),
                    getter = (0, _data.compileGetter)(expr);
                return getter
            }
        }
    },
    _postprocessRenderItem: _common2.default.noop,
    _executeItemRenderAction: function(index, itemData, itemElement) {
        this._getItemRenderAction()({
            itemElement: itemElement,
            itemIndex: index,
            itemData: itemData
        })
    },
    _setElementData: function(element, data, index) {
        element.addClass([ITEM_CLASS, this._itemClass()].join(" ")).data(this._itemDataKey(), data).data(this._itemIndexKey(), index)
    },
    _createItemRenderAction: function() {
        return this._itemRenderAction = this._createActionByOption("onItemRendered", {
            element: this.element(),
            excludeValidators: ["disabled", "readOnly"],
            category: "rendering"
        })
    },
    _getItemRenderAction: function() {
        return this._itemRenderAction || this._createItemRenderAction()
    },
    _getItemTemplateName: function(args) {
        var data = args.itemData,
            templateProperty = args.templateProperty || this.option("itemTemplateProperty"),
            template = data && data[templateProperty];
        return template || args.defaultTemplateName
    },
    _createItemByTemplate: function(itemTemplate, renderArgs) {
        return itemTemplate.render({
            model: renderArgs.itemData,
            container: renderArgs.container,
            index: renderArgs.index
        })
    },
    _emptyMessageContainer: function() {
        return this._itemContainer()
    },
    _renderEmptyMessage: function(items) {
        items = items || this.option("items");
        var noDataText = this.option("noDataText"),
            hideNoData = !noDataText || items && items.length || this._isDataSourceLoading();
        if (hideNoData && this._$noData) {
            this._$noData.remove();
            this._$noData = null;
            this.setAria("label", void 0)
        }
        if (!hideNoData) {
            this._$noData = this._$noData || (0, _renderer2.default)("<div>").addClass("dx-empty-message");
            this._$noData.appendTo(this._emptyMessageContainer()).html(noDataText);
            this.setAria("label", noDataText)
        }
        this.$element().toggleClass(EMPTY_COLLECTION, !hideNoData)
    },
    _itemDXEventHandler: function(dxEvent, handlerOptionName, actionArgs, actionConfig) {
        this._itemEventHandler(dxEvent.target, handlerOptionName, (0, _extend.extend)(actionArgs, {
            event: dxEvent
        }), actionConfig)
    },
    _itemEventHandler: function(initiator, handlerOptionName, actionArgs, actionConfig) {
        var action = this._createActionByOption(handlerOptionName, (0, _extend.extend)({
            validatingTargetName: "itemElement"
        }, actionConfig));
        return this._itemEventHandlerImpl(initiator, action, actionArgs)
    },
    _itemEventHandlerByHandler: function(initiator, handler, actionArgs, actionConfig) {
        var action = this._createAction(handler, (0, _extend.extend)({
            validatingTargetName: "itemElement"
        }, actionConfig));
        return this._itemEventHandlerImpl(initiator, action, actionArgs)
    },
    _itemEventHandlerImpl: function(initiator, action, actionArgs) {
        var $itemElement = this._closestItemElement((0, _renderer2.default)(initiator)),
            args = (0, _extend.extend)({}, actionArgs);
        return action((0, _extend.extend)(actionArgs, this._extendActionArgs($itemElement), args))
    },
    _extendActionArgs: function($itemElement) {
        return {
            itemElement: (0, _dom.getPublicElement)($itemElement),
            itemIndex: this._itemElements().index($itemElement),
            itemData: this._getItemData($itemElement)
        }
    },
    _closestItemElement: function($element) {
        return (0, _renderer2.default)($element).closest(this._itemSelector())
    },
    _getItemData: function(itemElement) {
        return (0, _renderer2.default)(itemElement).data(this._itemDataKey())
    },
    _getSummaryItemsWidth: function(items, includeMargin) {
        var result = 0;
        if (items) {
            _iterator2.default.each(items, function(_, item) {
                result += (0, _renderer2.default)(item).outerWidth(includeMargin || false)
            })
        }
        return result
    },
    getFocusedItemId: function() {
        if (!this._focusedItemId) {
            this._focusedItemId = "dx-" + new _guid2.default
        }
        return this._focusedItemId
    },
    itemElements: function() {
        return this._itemElements()
    },
    itemsContainer: function() {
        return this._itemContainer()
    }
}).include(_data_helper2.default);
CollectionWidget.ItemClass = _item2.default;
module.exports = CollectionWidget;
