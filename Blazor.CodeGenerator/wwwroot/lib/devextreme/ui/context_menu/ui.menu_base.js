/**
 * DevExtreme (ui/context_menu/ui.menu_base.js)
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
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _common = require("../../core/utils/common");
var _type = require("../../core/utils/type");
var _iterator = require("../../core/utils/iterator");
var _extend = require("../../core/utils/extend");
var _utils = require("../widget/utils.ink_ripple");
var _ui = require("../hierarchical_collection/ui.hierarchical_collection_widget");
var _ui2 = _interopRequireDefault(_ui);
var _uiMenu_baseEdit = require("./ui.menu_base.edit.strategy");
var _uiMenu_baseEdit2 = _interopRequireDefault(_uiMenu_baseEdit);
var _devices = require("../../core/devices");
var _devices2 = _interopRequireDefault(_devices);
var _item = require("../collection/item");
var _item2 = _interopRequireDefault(_item);

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
var DX_MENU_CLASS = "dx-menu";
var DX_MENU_NO_ICONS_CLASS = DX_MENU_CLASS + "-no-icons";
var DX_MENU_BASE_CLASS = "dx-menu-base";
var ITEM_CLASS = DX_MENU_CLASS + "-item";
var DX_ITEM_CONTENT_CLASS = ITEM_CLASS + "-content";
var DX_MENU_SELECTED_ITEM_CLASS = ITEM_CLASS + "-selected";
var DX_MENU_ITEM_WRAPPER_CLASS = ITEM_CLASS + "-wrapper";
var DX_MENU_ITEMS_CONTAINER_CLASS = DX_MENU_CLASS + "-items-container";
var DX_MENU_ITEM_EXPANDED_CLASS = ITEM_CLASS + "-expanded";
var DX_MENU_SEPARATOR_CLASS = DX_MENU_CLASS + "-separator";
var DX_MENU_ITEM_LAST_GROUP_ITEM = DX_MENU_CLASS + "-last-group-item";
var DX_ITEM_HAS_TEXT = ITEM_CLASS + "-has-text";
var DX_ITEM_HAS_ICON = ITEM_CLASS + "-has-icon";
var DX_ITEM_HAS_SUBMENU = ITEM_CLASS + "-has-submenu";
var DX_MENU_ITEM_POPOUT_CLASS = ITEM_CLASS + "-popout";
var DX_MENU_ITEM_POPOUT_CONTAINER_CLASS = DX_MENU_ITEM_POPOUT_CLASS + "-container";
var DX_MENU_ITEM_CAPTION_CLASS = ITEM_CLASS + "-text";
var SINGLE_SELECTION_MODE = "single";
var DEFAULT_DELAY = {
    show: 50,
    hide: 300
};
var MenuBase = function(_HierarchicalCollecti) {
    _inherits(MenuBase, _HierarchicalCollecti);

    function MenuBase() {
        _classCallCheck(this, MenuBase);
        return _possibleConstructorReturn(this, (MenuBase.__proto__ || Object.getPrototypeOf(MenuBase)).apply(this, arguments))
    }
    _createClass(MenuBase, [{
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(MenuBase.prototype.__proto__ || Object.getPrototypeOf(MenuBase.prototype), "_getDefaultOptions", this).call(this), {
                items: [],
                cssClass: "",
                activeStateEnabled: true,
                showSubmenuMode: {
                    name: "onHover",
                    delay: {
                        show: 50,
                        hide: 300
                    }
                },
                animation: {
                    show: {
                        type: "fade",
                        from: 0,
                        to: 1,
                        duration: 100
                    },
                    hide: {
                        type: "fade",
                        from: 1,
                        to: 0,
                        duration: 100
                    }
                },
                selectByClick: false,
                focusOnSelectedItem: false,
                keyExpr: null,
                _itemAttributes: {
                    role: "menuitem"
                },
                useInkRipple: false
            })
        }
    }, {
        key: "_itemDataKey",
        value: function() {
            return "dxMenuItemDataKey"
        }
    }, {
        key: "_itemClass",
        value: function() {
            return ITEM_CLASS
        }
    }, {
        key: "_setAriaSelected",
        value: function() {}
    }, {
        key: "_selectedItemClass",
        value: function() {
            return DX_MENU_SELECTED_ITEM_CLASS
        }
    }, {
        key: "_widgetClass",
        value: function() {
            return DX_MENU_BASE_CLASS
        }
    }, {
        key: "_focusTarget",
        value: function() {
            return this._itemContainer()
        }
    }, {
        key: "_clean",
        value: function() {
            this.option("focusedElement", null);
            _get(MenuBase.prototype.__proto__ || Object.getPrototypeOf(MenuBase.prototype), "_clean", this).call(this)
        }
    }, {
        key: "_supportedKeys",
        value: function() {
            var _this2 = this;
            var selectItem = function() {
                var $item = (0, _renderer2.default)(_this2.option("focusedElement"));
                if (!$item.length || !_this2._isSelectionEnabled()) {
                    return
                }
                _this2.selectItem($item[0])
            };
            return (0, _extend.extend)(_get(MenuBase.prototype.__proto__ || Object.getPrototypeOf(MenuBase.prototype), "_supportedKeys", this).call(this), {
                space: selectItem,
                pageUp: _common.noop,
                pageDown: _common.noop
            })
        }
    }, {
        key: "_isSelectionEnabled",
        value: function() {
            return this.option("selectionMode") === SINGLE_SELECTION_MODE
        }
    }, {
        key: "_init",
        value: function() {
            this._activeStateUnit = "." + ITEM_CLASS;
            _get(MenuBase.prototype.__proto__ || Object.getPrototypeOf(MenuBase.prototype), "_init", this).call(this);
            this._renderSelectedItem();
            this._initActions()
        }
    }, {
        key: "_getTextContainer",
        value: function(itemData) {
            var itemText = itemData.text;
            var $itemContainer = (0, _renderer2.default)("<span>").addClass(DX_MENU_ITEM_CAPTION_CLASS);
            var itemContent = (0, _type.isPlainObject)(itemData) ? itemText : String(itemData);
            return itemText && $itemContainer.text(itemContent)
        }
    }, {
        key: "_getPopoutContainer",
        value: function(itemData) {
            var items = itemData.items;
            var $popOutContainer = void 0;
            if (items && items.length) {
                var $popOutImage = (0, _renderer2.default)("<div>").addClass(DX_MENU_ITEM_POPOUT_CLASS);
                $popOutContainer = (0, _renderer2.default)("<span>").addClass(DX_MENU_ITEM_POPOUT_CONTAINER_CLASS).append($popOutImage)
            }
            return $popOutContainer
        }
    }, {
        key: "_getDataAdapterOptions",
        value: function() {
            return {
                rootValue: 0,
                multipleSelection: false,
                recursiveSelection: false,
                recursiveExpansion: false,
                searchValue: ""
            }
        }
    }, {
        key: "_selectByItem",
        value: function(selectedItem) {
            if (!selectedItem) {
                return
            }
            var nodeToSelect = this._dataAdapter.getNodeByItem(selectedItem);
            this._dataAdapter.toggleSelection(nodeToSelect.internalFields.key, true)
        }
    }, {
        key: "_renderSelectedItem",
        value: function() {
            var selectedKeys = this._dataAdapter.getSelectedNodesKeys();
            var selectedKey = selectedKeys.length && selectedKeys[0];
            var selectedItem = this.option("selectedItem");
            if (!selectedKey) {
                this._selectByItem(selectedItem);
                return
            }
            var node = this._dataAdapter.getNodeByKey(selectedKey);
            if (false === node.selectable) {
                return
            }
            if (!selectedItem) {
                this.option("selectedItem", node.internalFields.item);
                return
            }
            if (selectedItem !== node.internalFields.item) {
                this._dataAdapter.toggleSelection(selectedKey, false);
                this._selectByItem(selectedItem)
            }
        }
    }, {
        key: "_initActions",
        value: function() {}
    }, {
        key: "_initMarkup",
        value: function() {
            _get(MenuBase.prototype.__proto__ || Object.getPrototypeOf(MenuBase.prototype), "_initMarkup", this).call(this);
            this._addCustomCssClass(this.$element());
            this.option("useInkRipple") && this._renderInkRipple()
        }
    }, {
        key: "_renderInkRipple",
        value: function() {
            this._inkRipple = (0, _utils.render)()
        }
    }, {
        key: "_toggleActiveState",
        value: function($element, value, e) {
            _get(MenuBase.prototype.__proto__ || Object.getPrototypeOf(MenuBase.prototype), "_toggleActiveState", this).apply(this, arguments);
            if (!this._inkRipple) {
                return
            }
            var config = {
                element: $element,
                event: e
            };
            if (value) {
                this._inkRipple.showWave(config)
            } else {
                this._inkRipple.hideWave(config)
            }
        }
    }, {
        key: "_getShowSubmenuMode",
        value: function() {
            var defaultValue = "onClick";
            var optionValue = this.option("showSubmenuMode");
            optionValue = (0, _type.isObject)(optionValue) ? optionValue.name : optionValue;
            return this._isDesktopDevice() ? optionValue : defaultValue
        }
    }, {
        key: "_initSelectedItems",
        value: function() {}
    }, {
        key: "_isDesktopDevice",
        value: function() {
            return "desktop" === _devices2.default.real().deviceType
        }
    }, {
        key: "_initEditStrategy",
        value: function() {
            var Strategy = _uiMenu_baseEdit2.default;
            this._editStrategy = new Strategy(this)
        }
    }, {
        key: "_addCustomCssClass",
        value: function($element) {
            $element.addClass(this.option("cssClass"))
        }
    }, {
        key: "_itemWrapperSelector",
        value: function() {
            return "." + DX_MENU_ITEM_WRAPPER_CLASS
        }
    }, {
        key: "_hoverStartHandler",
        value: function(e) {
            var $itemElement = this._getItemElementByEventArgs(e);
            if (!$itemElement || this._isItemDisabled($itemElement)) {
                return
            }
            e.stopPropagation();
            if ("onHover" === this._getShowSubmenuMode()) {
                clearTimeout(this._showSubmenusTimeout);
                this._showSubmenusTimeout = setTimeout(this._showSubmenu.bind(this, $itemElement), this._getSubmenuDelay("show"))
            }
        }
    }, {
        key: "_getAvailableItems",
        value: function($itemElements) {
            return _get(MenuBase.prototype.__proto__ || Object.getPrototypeOf(MenuBase.prototype), "_getAvailableItems", this).call(this, $itemElements).filter(function() {
                return "hidden" !== (0, _renderer2.default)(this).css("visibility")
            })
        }
    }, {
        key: "_isItemDisabled",
        value: function($item) {
            return this._disabledGetter($item.data(this._itemDataKey()))
        }
    }, {
        key: "_showSubmenu",
        value: function($itemElement) {
            this._addExpandedClass($itemElement)
        }
    }, {
        key: "_addExpandedClass",
        value: function(itemElement) {
            (0, _renderer2.default)(itemElement).addClass(DX_MENU_ITEM_EXPANDED_CLASS)
        }
    }, {
        key: "_getSubmenuDelay",
        value: function(action) {
            var _option = this.option("showSubmenuMode"),
                delay = _option.delay;
            if (!(0, _type.isDefined)(delay)) {
                return DEFAULT_DELAY[action]
            }
            return (0, _type.isObject)(delay) ? delay[action] : delay
        }
    }, {
        key: "_getItemElementByEventArgs",
        value: function(eventArgs) {
            var $target = (0, _renderer2.default)(eventArgs.target);
            if ($target.hasClass(this._itemClass()) || $target.get(0) === eventArgs.currentTarget) {
                return $target
            }
            while (!$target.hasClass(this._itemClass())) {
                $target = $target.parent();
                if ($target.hasClass("dx-submenu")) {
                    return null
                }
            }
            return $target
        }
    }, {
        key: "_hoverEndHandler",
        value: function() {
            clearTimeout(this._showSubmenusTimeout)
        }
    }, {
        key: "_hasSubmenu",
        value: function(node) {
            return node.internalFields.childrenKeys.length
        }
    }, {
        key: "_renderContentImpl",
        value: function() {
            this._renderItems(this._dataAdapter.getRootNodes())
        }
    }, {
        key: "_renderItems",
        value: function(nodes, submenuContainer) {
            var _this3 = this;
            if (nodes.length) {
                this.hasIcons = false;
                var $nodeContainer = this._renderContainer(this.$element(), submenuContainer);
                var firstVisibleIndex = -1;
                var nextGroupFirstIndex = -1;
                (0, _iterator.each)(nodes, function(index, node) {
                    var isVisibleNode = false !== node.visible;
                    if (isVisibleNode && firstVisibleIndex < 0) {
                        firstVisibleIndex = index
                    }
                    var isBeginGroup = firstVisibleIndex < index && (node.beginGroup || index === nextGroupFirstIndex);
                    if (isBeginGroup) {
                        nextGroupFirstIndex = isVisibleNode ? index : index + 1
                    }
                    if (index === nextGroupFirstIndex && firstVisibleIndex < index) {
                        _this3._renderSeparator($nodeContainer)
                    }
                    _this3._renderItem(index, node, $nodeContainer)
                });
                if (!this.hasIcons) {
                    $nodeContainer.addClass(DX_MENU_NO_ICONS_CLASS)
                }
            }
        }
    }, {
        key: "_renderContainer",
        value: function($wrapper) {
            return (0, _renderer2.default)("<ul>").appendTo($wrapper).addClass(DX_MENU_ITEMS_CONTAINER_CLASS)
        }
    }, {
        key: "_createDOMElement",
        value: function($nodeContainer) {
            var $node = (0, _renderer2.default)("<li>").appendTo($nodeContainer).addClass(DX_MENU_ITEM_WRAPPER_CLASS);
            return $node
        }
    }, {
        key: "_renderItem",
        value: function(index, node, $nodeContainer, $nodeElement) {
            var items = this.option("items");
            var $itemFrame = void 0;
            if (false === node.internalFields.item.visible) {
                return
            }
            var $node = $nodeElement || this._createDOMElement($nodeContainer);
            if (items[index + 1] && items[index + 1].beginGroup) {
                $node.addClass(DX_MENU_ITEM_LAST_GROUP_ITEM)
            }
            $itemFrame = _get(MenuBase.prototype.__proto__ || Object.getPrototypeOf(MenuBase.prototype), "_renderItem", this).call(this, index, node.internalFields.item, $node);
            if (node.internalFields.item === this.option("selectedItem")) {
                $itemFrame.addClass(DX_MENU_SELECTED_ITEM_CLASS)
            }
            $itemFrame.attr("tabIndex", -1);
            if (this._hasSubmenu(node)) {
                this.setAria("haspopup", "true", $itemFrame)
            }
        }
    }, {
        key: "_renderItemFrame",
        value: function(index, itemData, $itemContainer) {
            var $itemFrame = $itemContainer.children("." + ITEM_CLASS);
            return $itemFrame.length ? $itemFrame : _get(MenuBase.prototype.__proto__ || Object.getPrototypeOf(MenuBase.prototype), "_renderItemFrame", this).apply(this, arguments)
        }
    }, {
        key: "_refreshItem",
        value: function($item, item) {
            var node = this._dataAdapter.getNodeByItem(item);
            var index = $item.data(this._itemIndexKey());
            var $nodeContainer = $item.closest("ul");
            var $nodeElement = $item.closest("li");
            this._renderItem(index, node, $nodeContainer, $nodeElement)
        }
    }, {
        key: "_addContentClasses",
        value: function(itemData, $itemFrame) {
            var hasText = itemData.text ? !!itemData.text.length : false;
            var hasIcon = !!itemData.icon;
            var hasSubmenu = itemData.items ? !!itemData.items.length : false;
            $itemFrame.toggleClass(DX_ITEM_HAS_TEXT, hasText);
            $itemFrame.toggleClass(DX_ITEM_HAS_ICON, hasIcon);
            if (!this.hasIcons) {
                this.hasIcons = hasIcon
            }
            $itemFrame.toggleClass(DX_ITEM_HAS_SUBMENU, hasSubmenu)
        }
    }, {
        key: "_getItemContent",
        value: function($itemFrame) {
            var $itemContent = _get(MenuBase.prototype.__proto__ || Object.getPrototypeOf(MenuBase.prototype), "_getItemContent", this).call(this, $itemFrame);
            if (!$itemContent.length) {
                $itemContent = $itemFrame.children("." + DX_ITEM_CONTENT_CLASS)
            }
            return $itemContent
        }
    }, {
        key: "_postprocessRenderItem",
        value: function(args) {
            var $itemElement = (0, _renderer2.default)(args.itemElement);
            var selectedIndex = this._dataAdapter.getSelectedNodesKeys();
            if (!selectedIndex.length || !this._selectedGetter(args.itemData) || !this._isItemSelectable(args.itemData)) {
                this._setAriaSelected($itemElement, "false");
                return
            }
            var node = this._dataAdapter.getNodeByItem(args.itemData);
            if (node.internalFields.key === selectedIndex[0]) {
                $itemElement.addClass(this._selectedItemClass());
                this._setAriaSelected($itemElement, "true")
            } else {
                this._setAriaSelected($itemElement, "false")
            }
        }
    }, {
        key: "_isItemSelectable",
        value: function(item) {
            return false !== item.selectable
        }
    }, {
        key: "_renderSeparator",
        value: function($itemsContainer) {
            (0, _renderer2.default)("<li>").appendTo($itemsContainer).addClass(DX_MENU_SEPARATOR_CLASS)
        }
    }, {
        key: "_itemClickHandler",
        value: function(e) {
            if (e._skipHandling) {
                return
            }
            var itemClickActionHandler = this._createAction(this._updateSubmenuVisibilityOnClick.bind(this));
            this._itemDXEventHandler(e, "onItemClick", {}, {
                afterExecute: itemClickActionHandler.bind(this)
            });
            e._skipHandling = true
        }
    }, {
        key: "_updateSubmenuVisibilityOnClick",
        value: function(actionArgs) {
            this._updateSelectedItemOnClick(actionArgs);
            if ("onClick" === this._getShowSubmenuMode()) {
                this._addExpandedClass(actionArgs.args[0].itemElement)
            }
        }
    }, {
        key: "_updateSelectedItemOnClick",
        value: function(actionArgs) {
            var args = actionArgs.args ? actionArgs.args[0] : actionArgs;
            if (!this._isItemSelectionAllowed(args.itemData)) {
                return
            }
            var selectedItemKey = this._dataAdapter.getSelectedNodesKeys();
            var selectedNode = selectedItemKey.length && this._dataAdapter.getNodeByKey(selectedItemKey[0]);
            if (selectedNode) {
                this._toggleItemSelection(selectedNode, false)
            }
            if (!selectedNode || selectedNode.internalFields.item !== args.itemData) {
                this.selectItem(args.itemData)
            } else {
                this._fireSelectionChangeEvent(null, this.option("selectedItem"));
                this._setOptionSilent("selectedItem", null)
            }
        }
    }, {
        key: "_isItemSelectionAllowed",
        value: function(item) {
            var isSelectionByClickEnabled = this._isSelectionEnabled() && this.option("selectByClick");
            return !this._isContainerEmpty() && isSelectionByClickEnabled && this._isItemSelectable(item) && !this._itemsGetter(item)
        }
    }, {
        key: "_isContainerEmpty",
        value: function() {
            return this._itemContainer().is(":empty")
        }
    }, {
        key: "_syncSelectionOptions",
        value: function() {
            return (0, _common.asyncNoop)()
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "showSubmenuMode":
                    break;
                case "selectedItem":
                    var node = this._dataAdapter.getNodeByItem(args.value);
                    var selectedKey = this._dataAdapter.getSelectedNodesKeys()[0];
                    if (node && node.internalFields.key !== selectedKey) {
                        if (false === node.selectable) {
                            break
                        }
                        if (selectedKey) {
                            this._toggleItemSelection(this._dataAdapter.getNodeByKey(selectedKey), false)
                        }
                        this._toggleItemSelection(node, true);
                        this._updateSelectedItems()
                    }
                    break;
                case "cssClass":
                case "position":
                case "selectByClick":
                case "animation":
                case "useInkRipple":
                    this._invalidate();
                    break;
                default:
                    _get(MenuBase.prototype.__proto__ || Object.getPrototypeOf(MenuBase.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "_toggleItemSelection",
        value: function(node, value) {
            var itemElement = this._getElementByItem(node.internalFields.item);
            itemElement && (0, _renderer2.default)(itemElement).toggleClass(DX_MENU_SELECTED_ITEM_CLASS);
            this._dataAdapter.toggleSelection(node.internalFields.key, value)
        }
    }, {
        key: "_getElementByItem",
        value: function(itemData) {
            var _this4 = this;
            var result = void 0;
            (0, _iterator.each)(this._itemElements(), function(_, itemElement) {
                if ((0, _renderer2.default)(itemElement).data(_this4._itemDataKey()) !== itemData) {
                    return true
                }
                result = itemElement;
                return false
            });
            return result
        }
    }, {
        key: "_updateSelectedItems",
        value: function(oldSelection, newSelection) {
            if (oldSelection || newSelection) {
                this._fireSelectionChangeEvent(newSelection, oldSelection)
            }
        }
    }, {
        key: "_fireSelectionChangeEvent",
        value: function(addedSelection, removedSelection) {
            this._createActionByOption("onSelectionChanged", {
                excludeValidators: ["disabled", "readOnly"]
            })({
                addedItems: [addedSelection],
                removedItems: [removedSelection]
            })
        }
    }, {
        key: "selectItem",
        value: function(itemElement) {
            var itemData = itemElement.nodeType ? this._getItemData(itemElement) : itemElement;
            var selectedKey = this._dataAdapter.getSelectedNodesKeys()[0];
            var selectedItem = this.option("selectedItem");
            var node = this._dataAdapter.getNodeByItem(itemData);
            if (node.internalFields.key !== selectedKey) {
                if (selectedKey) {
                    this._toggleItemSelection(this._dataAdapter.getNodeByKey(selectedKey), false)
                }
                this._toggleItemSelection(node, true);
                this._updateSelectedItems(selectedItem, itemData);
                this._setOptionSilent("selectedItem", itemData)
            }
        }
    }, {
        key: "unselectItem",
        value: function(itemElement) {
            var itemData = itemElement.nodeType ? this._getItemData(itemElement) : itemElement;
            var node = this._dataAdapter.getNodeByItem(itemData);
            var selectedItem = this.option("selectedItem");
            if (node.internalFields.selected) {
                this._toggleItemSelection(node, false);
                this._updateSelectedItems(selectedItem, null);
                this._setOptionSilent("selectedItem", null)
            }
        }
    }]);
    return MenuBase
}(_ui2.default);
MenuBase.ItemClass = _item2.default;
module.exports = MenuBase;
