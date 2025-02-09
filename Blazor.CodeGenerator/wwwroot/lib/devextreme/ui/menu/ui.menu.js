/**
 * DevExtreme (ui/menu/ui.menu.js)
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
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _common = require("../../core/utils/common");
var _dom = require("../../core/utils/dom");
var _iterator = require("../../core/utils/iterator");
var _type = require("../../core/utils/type");
var _extend = require("../../core/utils/extend");
var _utils = require("../overlay/utils");
var _utils2 = require("../../events/utils");
var _pointer = require("../../events/pointer");
var _pointer2 = _interopRequireDefault(_pointer);
var _hover = require("../../events/hover");
var _hover2 = _interopRequireDefault(_hover);
var _ui = require("../context_menu/ui.menu_base");
var _ui2 = _interopRequireDefault(_ui);
var _overlay = require("../overlay");
var _overlay2 = _interopRequireDefault(_overlay);
var _ui3 = require("./ui.submenu");
var _ui4 = _interopRequireDefault(_ui3);
var _button = require("../button");
var _button2 = _interopRequireDefault(_button);
var _tree_view = require("../tree_view");
var _tree_view2 = _interopRequireDefault(_tree_view);

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
var DX_MENU_VERTICAL_CLASS = DX_MENU_CLASS + "-vertical";
var DX_MENU_HORIZONTAL_CLASS = DX_MENU_CLASS + "-horizontal";
var DX_MENU_ITEM_CLASS = DX_MENU_CLASS + "-item";
var DX_MENU_ITEMS_CONTAINER_CLASS = DX_MENU_CLASS + "-items-container";
var DX_MENU_ITEM_EXPANDED_CLASS = DX_MENU_ITEM_CLASS + "-expanded";
var DX_CONTEXT_MENU_CLASS = "dx-context-menu";
var DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS = DX_CONTEXT_MENU_CLASS + "-container-border";
var DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS = "dx-context-menu-content-delimiter";
var DX_SUBMENU_CLASS = "dx-submenu";
var DX_STATE_DISABLED_CLASS = "dx-state-disabled";
var DX_STATE_HOVER_CLASS = "dx-state-hover";
var DX_STATE_ACTIVE_CLASS = "dx-state-active";
var DX_ADAPTIVE_MODE_CLASS = DX_MENU_CLASS + "-adaptive-mode";
var DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS = DX_MENU_CLASS + "-hamburger-button";
var DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS = DX_ADAPTIVE_MODE_CLASS + "-overlay-wrapper";
var FOCUS_UP = "up";
var FOCUS_DOWN = "down";
var FOCUS_LEFT = "left";
var FOCUS_RIGHT = "right";
var SHOW_SUBMENU_OPERATION = "showSubmenu";
var NEXTITEM_OPERATION = "nextItem";
var PREVITEM_OPERATION = "prevItem";
var DEFAULT_DELAY = {
    show: 50,
    hide: 300
};
var ACTIONS = ["onSubmenuShowing", "onSubmenuShown", "onSubmenuHiding", "onSubmenuHidden", "onItemContextMenu", "onItemClick", "onSelectionChanged"];
var Menu = function(_MenuBase) {
    _inherits(Menu, _MenuBase);

    function Menu() {
        _classCallCheck(this, Menu);
        return _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).apply(this, arguments))
    }
    _createClass(Menu, [{
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_getDefaultOptions", this).call(this), {
                orientation: "horizontal",
                submenuDirection: "auto",
                showFirstSubmenuMode: {
                    name: "onClick",
                    delay: {
                        show: 50,
                        hide: 300
                    }
                },
                hideSubmenuOnMouseLeave: false,
                onSubmenuShowing: null,
                onSubmenuShown: null,
                onSubmenuHiding: null,
                onSubmenuHidden: null,
                adaptivityEnabled: false
            })
        }
    }, {
        key: "_setOptionsByReference",
        value: function() {
            _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_setOptionsByReference", this).call(this);
            (0, _extend.extend)(this._optionsByReference, {
                animation: true,
                selectedItem: true
            })
        }
    }, {
        key: "_itemElements",
        value: function() {
            var rootMenuElements = _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_itemElements", this).call(this);
            var submenuElements = this._submenuItemElements();
            return rootMenuElements.add(submenuElements)
        }
    }, {
        key: "_submenuItemElements",
        value: function() {
            var elements = [];
            var itemSelector = "." + DX_MENU_ITEM_CLASS;
            var currentSubmenu = this._submenus.length && this._submenus[0];
            if (currentSubmenu && currentSubmenu.itemsContainer()) {
                elements = currentSubmenu.itemsContainer().find(itemSelector)
            }
            return elements
        }
    }, {
        key: "_focusTarget",
        value: function() {
            return this.$element()
        }
    }, {
        key: "_isMenuHorizontal",
        value: function() {
            return "horizontal" === this.option("orientation")
        }
    }, {
        key: "_moveFocus",
        value: function(location) {
            var $items = this._getAvailableItems();
            var isMenuHorizontal = this._isMenuHorizontal();
            var $activeItem = this._getActiveItem(true);
            var argument = void 0;
            var operation = void 0;
            var navigationAction = void 0;
            var $newTarget = void 0;
            switch (location) {
                case FOCUS_UP:
                    operation = isMenuHorizontal ? SHOW_SUBMENU_OPERATION : this._getItemsNavigationOperation(PREVITEM_OPERATION);
                    argument = isMenuHorizontal ? $activeItem : $items;
                    navigationAction = this._getKeyboardNavigationAction(operation, argument);
                    $newTarget = navigationAction();
                    break;
                case FOCUS_DOWN:
                    operation = isMenuHorizontal ? SHOW_SUBMENU_OPERATION : this._getItemsNavigationOperation(NEXTITEM_OPERATION);
                    argument = isMenuHorizontal ? $activeItem : $items;
                    navigationAction = this._getKeyboardNavigationAction(operation, argument);
                    $newTarget = navigationAction();
                    break;
                case FOCUS_RIGHT:
                    operation = isMenuHorizontal ? this._getItemsNavigationOperation(NEXTITEM_OPERATION) : SHOW_SUBMENU_OPERATION;
                    argument = isMenuHorizontal ? $items : $activeItem;
                    navigationAction = this._getKeyboardNavigationAction(operation, argument);
                    $newTarget = navigationAction();
                    break;
                case FOCUS_LEFT:
                    operation = isMenuHorizontal ? this._getItemsNavigationOperation(PREVITEM_OPERATION) : SHOW_SUBMENU_OPERATION;
                    argument = isMenuHorizontal ? $items : $activeItem;
                    navigationAction = this._getKeyboardNavigationAction(operation, argument);
                    $newTarget = navigationAction();
                    break;
                default:
                    return _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_moveFocus", this).call(this, location)
            }
            if ($newTarget && 0 !== $newTarget.length) {
                this.option("focusedElement", (0, _dom.getPublicElement)($newTarget))
            }
        }
    }, {
        key: "_getItemsNavigationOperation",
        value: function(operation) {
            var navOperation = operation;
            if (this.option("rtlEnabled")) {
                navOperation = operation === PREVITEM_OPERATION ? NEXTITEM_OPERATION : PREVITEM_OPERATION
            }
            return navOperation
        }
    }, {
        key: "_getKeyboardNavigationAction",
        value: function(operation, argument) {
            var action = _common.noop;
            switch (operation) {
                case SHOW_SUBMENU_OPERATION:
                    if (!argument.hasClass(DX_STATE_DISABLED_CLASS)) {
                        action = this._showSubmenu.bind(this, argument)
                    }
                    break;
                case NEXTITEM_OPERATION:
                    action = this._nextItem.bind(this, argument);
                    break;
                case PREVITEM_OPERATION:
                    action = this._prevItem.bind(this, argument)
            }
            return action
        }
    }, {
        key: "_clean",
        value: function() {
            _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_clean", this).call(this);
            this.option("templatesRenderAsynchronously") && clearTimeout(this._resizeEventTimer)
        }
    }, {
        key: "_visibilityChanged",
        value: function(visible) {
            if (visible) {
                if (!this._menuItemsWidth) {
                    this._updateItemsWidthCache()
                }
                this._dimensionChanged()
            }
        }
    }, {
        key: "_isAdaptivityEnabled",
        value: function() {
            return this.option("adaptivityEnabled") && "horizontal" === this.option("orientation")
        }
    }, {
        key: "_updateItemsWidthCache",
        value: function() {
            var $menuItems = this.$element().find("ul").first().children("li").children("." + DX_MENU_ITEM_CLASS);
            this._menuItemsWidth = this._getSummaryItemsWidth($menuItems, true)
        }
    }, {
        key: "_dimensionChanged",
        value: function() {
            if (!this._isAdaptivityEnabled()) {
                return
            }
            var containerWidth = this.$element().outerWidth();
            this._toggleAdaptiveMode(this._menuItemsWidth > containerWidth)
        }
    }, {
        key: "_init",
        value: function() {
            _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_init", this).call(this);
            this._submenus = []
        }
    }, {
        key: "_initActions",
        value: function() {
            var _this2 = this;
            this._actions = {};
            (0, _iterator.each)(ACTIONS, function(index, action) {
                _this2._actions[action] = _this2._createActionByOption(action)
            })
        }
    }, {
        key: "_initMarkup",
        value: function() {
            this._visibleSubmenu = null;
            this.$element().addClass(DX_MENU_CLASS);
            _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_initMarkup", this).call(this);
            this.setAria("role", "menubar")
        }
    }, {
        key: "_render",
        value: function() {
            _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_render", this).call(this);
            this._initAdaptivity()
        }
    }, {
        key: "_renderHamburgerButton",
        value: function() {
            this._hamburger = new _button2.default((0, _renderer2.default)("<div>").addClass(DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS), {
                icon: "menu",
                activeStateEnabled: false,
                onClick: this._toggleTreeView.bind(this)
            });
            return this._hamburger.$element()
        }
    }, {
        key: "_toggleTreeView",
        value: function(state) {
            if ((0, _type.isPlainObject)(state)) {
                state = !this._overlay.option("visible")
            }
            this._overlay.option("visible", state);
            this._toggleHamburgerActiveState(state)
        }
    }, {
        key: "_toggleHamburgerActiveState",
        value: function(state) {
            this._hamburger && this._hamburger.$element().toggleClass(DX_STATE_ACTIVE_CLASS, state)
        }
    }, {
        key: "_toggleAdaptiveMode",
        value: function(state) {
            var $menuItemsContainer = this.$element().find("." + DX_MENU_HORIZONTAL_CLASS);
            var $adaptiveElements = this.$element().find("." + DX_ADAPTIVE_MODE_CLASS);
            if (state) {
                this._hideVisibleSubmenu()
            } else {
                this._treeView && this._treeView.collapseAll();
                this._overlay && this._toggleTreeView(state)
            }
            $menuItemsContainer.toggle(!state);
            $adaptiveElements.toggle(state)
        }
    }, {
        key: "_removeAdaptivity",
        value: function() {
            if (!this._$adaptiveContainer) {
                return
            }
            this._toggleAdaptiveMode(false);
            this._$adaptiveContainer.remove();
            this._$adaptiveContainer = null;
            this._treeView = null;
            this._hamburger = null;
            this._overlay = null
        }
    }, {
        key: "_treeviewItemClickHandler",
        value: function(e) {
            this._actions.onItemClick(e);
            if (!e.node.children.length) {
                this._toggleTreeView(false)
            }
        }
    }, {
        key: "_getAdaptiveOverlayOptions",
        value: function() {
            var _this3 = this;
            var rtl = this.option("rtlEnabled");
            var position = rtl ? "right" : "left";
            return {
                maxHeight: function() {
                    return (0, _utils.getElementMaxHeightByWindow)(_this3.$element())
                },
                deferRendering: false,
                shading: false,
                animation: false,
                closeOnTargetScroll: true,
                onHidden: function() {
                    _this3._toggleHamburgerActiveState(false)
                },
                height: "auto",
                closeOnOutsideClick: function(e) {
                    return !(0, _renderer2.default)(e.target).closest("." + DX_ADAPTIVE_HAMBURGER_BUTTON_CLASS).length
                },
                position: {
                    collision: "flipfit",
                    at: "bottom " + position,
                    my: "top " + position,
                    of: this._hamburger.$element()
                }
            }
        }
    }, {
        key: "_getTreeViewOptions",
        value: function() {
            var _this4 = this;
            var menuOptions = {};
            var optionsToTransfer = ["rtlEnabled", "width", "accessKey", "activeStateEnabled", "animation", "dataSource", "disabled", "displayExpr", "displayExpr", "focusStateEnabled", "hint", "hoverStateEnabled", "itemsExpr", "items", "itemTemplate", "selectedExpr", "selectionMode", "tabIndex", "visible"];
            var actionsToTransfer = ["onItemContextMenu", "onSelectionChanged"];
            (0, _iterator.each)(optionsToTransfer, function(_, option) {
                menuOptions[option] = _this4.option(option)
            });
            (0, _iterator.each)(actionsToTransfer, function(_, actionName) {
                menuOptions[actionName] = function(e) {
                    _this4._actions[actionName](e)
                }
            });
            return (0, _extend.extend)(menuOptions, {
                dataSource: this.getDataSource(),
                animationEnabled: !!this.option("animation"),
                onItemClick: this._treeviewItemClickHandler.bind(this),
                onItemExpanded: function(e) {
                    _this4._overlay.repaint();
                    _this4._actions.onSubmenuShown(e)
                },
                onItemCollapsed: function(e) {
                    _this4._overlay.repaint();
                    _this4._actions.onSubmenuHidden(e)
                },
                selectNodesRecursive: false,
                selectByClick: this.option("selectByClick"),
                expandEvent: "click"
            })
        }
    }, {
        key: "_initAdaptivity",
        value: function() {
            if (!this._isAdaptivityEnabled()) {
                return
            }
            this._$adaptiveContainer = (0, _renderer2.default)("<div>").addClass(DX_ADAPTIVE_MODE_CLASS);
            var $hamburger = this._renderHamburgerButton();
            this._treeView = this._createComponent((0, _renderer2.default)("<div>"), _tree_view2.default, this._getTreeViewOptions());
            this._overlay = this._createComponent((0, _renderer2.default)("<div>"), _overlay2.default, this._getAdaptiveOverlayOptions());
            this._overlay.$content().append(this._treeView.$element()).addClass(DX_ADAPTIVE_MODE_CLASS).addClass(this.option("cssClass"));
            this._overlay._wrapper().addClass(DX_ADAPTIVE_MODE_OVERLAY_WRAPPER_CLASS);
            this._$adaptiveContainer.append($hamburger);
            this._$adaptiveContainer.append(this._overlay.$element());
            this.$element().append(this._$adaptiveContainer);
            this._updateItemsWidthCache();
            this._dimensionChanged()
        }
    }, {
        key: "_getDelay",
        value: function(delayType) {
            var delay = this.option("showFirstSubmenuMode").delay;
            if (!(0, _type.isDefined)(delay)) {
                return DEFAULT_DELAY[delayType]
            } else {
                return (0, _type.isObject)(delay) ? delay[delayType] : delay
            }
        }
    }, {
        key: "_keyboardHandler",
        value: function(e) {
            return this._visibleSubmenu ? true : _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_keyboardHandler", this).call(this, e)
        }
    }, {
        key: "_renderContainer",
        value: function() {
            var $wrapper = (0, _renderer2.default)("<div>");
            $wrapper.appendTo(this.$element()).addClass(this._isMenuHorizontal() ? DX_MENU_HORIZONTAL_CLASS : DX_MENU_VERTICAL_CLASS);
            return _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_renderContainer", this).call(this, $wrapper)
        }
    }, {
        key: "_renderSubmenuItems",
        value: function(node, $itemFrame) {
            var submenu = this._createSubmenu(node, $itemFrame);
            this._submenus.push(submenu);
            this._renderBorderElement($itemFrame);
            return submenu
        }
    }, {
        key: "_createSubmenu",
        value: function(node, $rootItem) {
            var $submenuContainer = (0, _renderer2.default)("<div>").addClass(DX_CONTEXT_MENU_CLASS).appendTo($rootItem);
            var childKeyboardProcessor = this._keyboardProcessor && this._keyboardProcessor.attachChildProcessor(),
                items = this._getChildNodes(node),
                result = this._createComponent($submenuContainer, _ui4.default, (0, _extend.extend)(this._getSubmenuOptions(), {
                    _keyboardProcessor: childKeyboardProcessor,
                    _dataAdapter: this._dataAdapter,
                    _parentKey: node.internalFields.key,
                    items: items,
                    onHoverStart: this._clearTimeouts.bind(this),
                    position: this.getSubmenuPosition($rootItem)
                }));
            this._attachSubmenuHandlers($rootItem, result);
            return result
        }
    }, {
        key: "_getSubmenuOptions",
        value: function() {
            var _this5 = this;
            var $submenuTarget = (0, _renderer2.default)("<div>");
            var isMenuHorizontal = this._isMenuHorizontal();
            return {
                itemTemplate: this.option("itemTemplate"),
                target: $submenuTarget,
                orientation: this.option("orientation"),
                selectionMode: this.option("selectionMode"),
                cssClass: this.option("cssClass"),
                selectByClick: this.option("selectByClick"),
                hoverStateEnabled: this.option("hoverStateEnabled"),
                activeStateEnabled: this.option("activeStateEnabled"),
                focusStateEnabled: this.option("focusStateEnabled"),
                animation: this.option("animation"),
                showSubmenuMode: this.option("showSubmenuMode"),
                displayExpr: this.option("displayExpr"),
                disabledExpr: this.option("disabledExpr"),
                selectedExpr: this.option("selectedExpr"),
                itemsExpr: this.option("itemsExpr"),
                onFocusedItemChanged: function(e) {
                    if (!e.component.option("visible")) {
                        return
                    }
                    _this5.option("focusedElement", e.component.option("focusedElement"))
                },
                onSelectionChanged: this._nestedItemOnSelectionChangedHandler.bind(this),
                onItemClick: this._nestedItemOnItemClickHandler.bind(this),
                onItemRendered: this.option("onItemRendered"),
                onLeftFirstItem: isMenuHorizontal ? null : this._moveMainMenuFocus.bind(this, PREVITEM_OPERATION),
                onLeftLastItem: isMenuHorizontal ? null : this._moveMainMenuFocus.bind(this, NEXTITEM_OPERATION),
                onCloseRootSubmenu: this._moveMainMenuFocus.bind(this, isMenuHorizontal ? PREVITEM_OPERATION : null),
                onExpandLastSubmenu: isMenuHorizontal ? this._moveMainMenuFocus.bind(this, NEXTITEM_OPERATION) : null
            }
        }
    }, {
        key: "_getShowFirstSubmenuMode",
        value: function() {
            if (!this._isDesktopDevice()) {
                return "onClick"
            }
            var optionValue = this.option("showFirstSubmenuMode");
            return (0, _type.isObject)(optionValue) ? optionValue.name : optionValue
        }
    }, {
        key: "_moveMainMenuFocus",
        value: function(direction) {
            var $items = this._getAvailableItems();
            var itemCount = $items.length;
            var $currentItem = $items.filter("." + DX_MENU_ITEM_EXPANDED_CLASS).eq(0);
            var itemIndex = $items.index($currentItem);
            this._hideSubmenu(this._visibleSubmenu);
            itemIndex += direction === PREVITEM_OPERATION ? -1 : 1;
            if (itemIndex >= itemCount) {
                itemIndex = 0
            } else {
                if (itemIndex < 0) {
                    itemIndex = itemCount - 1
                }
            }
            var $newItem = $items.eq(itemIndex);
            this.option("focusedElement", (0, _dom.getPublicElement)($newItem))
        }
    }, {
        key: "_nestedItemOnSelectionChangedHandler",
        value: function(args) {
            var selectedItem = args.addedItems.length && args.addedItems[0];
            var submenu = _ui4.default.getInstance(args.element);
            var onSelectionChanged = this._actions.onSelectionChanged;
            onSelectionChanged(args);
            selectedItem && this._clearSelectionInSubmenus(selectedItem[0], submenu);
            this._clearRootSelection();
            this._setOptionSilent("selectedItem", selectedItem)
        }
    }, {
        key: "_clearSelectionInSubmenus",
        value: function(item, targetSubmenu) {
            var _this6 = this;
            var cleanAllSubmenus = !arguments.length;
            (0, _iterator.each)(this._submenus, function(index, submenu) {
                var $submenu = submenu._itemContainer();
                var isOtherItem = !$submenu.is(targetSubmenu && targetSubmenu._itemContainer());
                var $selectedItem = $submenu.find("." + _this6._selectedItemClass());
                if (isOtherItem && $selectedItem.length || cleanAllSubmenus) {
                    $selectedItem.removeClass(_this6._selectedItemClass());
                    var selectedItemData = _this6._getItemData($selectedItem);
                    if (selectedItemData) {
                        selectedItemData.selected = false
                    }
                    submenu._clearSelectedItems()
                }
            })
        }
    }, {
        key: "_clearRootSelection",
        value: function() {
            var $prevSelectedItem = this.$element().find("." + DX_MENU_ITEMS_CONTAINER_CLASS).first().children().children().filter("." + this._selectedItemClass());
            if ($prevSelectedItem.length) {
                var prevSelectedItemData = void 0;
                prevSelectedItemData = this._getItemData($prevSelectedItem);
                prevSelectedItemData.selected = false;
                $prevSelectedItem.removeClass(this._selectedItemClass())
            }
        }
    }, {
        key: "_nestedItemOnItemClickHandler",
        value: function(e) {
            this._actions.onItemClick(e)
        }
    }, {
        key: "_attachSubmenuHandlers",
        value: function($rootItem, submenu) {
            var _this7 = this;
            var $submenuOverlayContent = submenu.getOverlayContent();
            var submenus = $submenuOverlayContent.find("." + DX_SUBMENU_CLASS);
            var submenuMouseLeaveName = (0, _utils2.addNamespace)(_hover2.default.end, this.NAME + "_submenu");
            submenu.option({
                onShowing: this._submenuOnShowingHandler.bind(this, $rootItem, submenu),
                onShown: this._submenuOnShownHandler.bind(this, $rootItem, submenu),
                onHiding: this._submenuOnHidingHandler.bind(this, $rootItem, submenu),
                onHidden: this._submenuOnHiddenHandler.bind(this, $rootItem, submenu)
            });
            (0, _iterator.each)(submenus, function(index, submenu) {
                _events_engine2.default.off(submenu, submenuMouseLeaveName);
                _events_engine2.default.on(submenu, submenuMouseLeaveName, null, _this7._submenuMouseLeaveHandler.bind(_this7, $rootItem))
            })
        }
    }, {
        key: "_submenuOnShowingHandler",
        value: function($rootItem, submenu) {
            var $border = $rootItem.children("." + DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS);
            this._actions.onSubmenuShowing({
                rootItem: (0, _dom.getPublicElement)($rootItem),
                submenu: submenu
            });
            $border.show();
            $rootItem.addClass(DX_MENU_ITEM_EXPANDED_CLASS)
        }
    }, {
        key: "_submenuOnShownHandler",
        value: function($rootItem, submenu) {
            this._actions.onSubmenuShown({
                rootItem: (0, _dom.getPublicElement)($rootItem),
                submenu: submenu
            })
        }
    }, {
        key: "_submenuOnHidingHandler",
        value: function($rootItem, submenu, eventArgs) {
            var $border = $rootItem.children("." + DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS);
            var args = eventArgs;
            args.rootItem = (0, _dom.getPublicElement)($rootItem);
            args.submenu = submenu;
            this._actions.onSubmenuHiding(args);
            eventArgs = args;
            if (!eventArgs.cancel) {
                if (this._visibleSubmenu === submenu) {
                    this._visibleSubmenu = null
                }
                $border.hide();
                $rootItem.removeClass(DX_MENU_ITEM_EXPANDED_CLASS)
            }
        }
    }, {
        key: "_submenuOnHiddenHandler",
        value: function($rootItem, submenu) {
            this._actions.onSubmenuHidden({
                rootItem: (0, _dom.getPublicElement)($rootItem),
                submenu: submenu
            })
        }
    }, {
        key: "_submenuMouseLeaveHandler",
        value: function($rootItem, eventArgs) {
            var target = (0, _renderer2.default)(eventArgs.relatedTarget).parents("." + DX_CONTEXT_MENU_CLASS)[0];
            var contextMenu = this._getSubmenuByRootElement($rootItem).getOverlayContent()[0];
            if (this.option("hideSubmenuOnMouseLeave") && target !== contextMenu) {
                this._clearTimeouts();
                setTimeout(this._hideSubmenuAfterTimeout.bind(this), this._getDelay("hide"))
            }
        }
    }, {
        key: "_hideSubmenuAfterTimeout",
        value: function() {
            if (!this._visibleSubmenu) {
                return
            }
            var isRootItemHovered = (0, _renderer2.default)(this._visibleSubmenu.$element().context).hasClass(DX_STATE_HOVER_CLASS);
            var isSubmenuItemHovered = this._visibleSubmenu.getOverlayContent().find("." + DX_STATE_HOVER_CLASS).length;
            var hoveredElementFromSubMenu = this._visibleSubmenu.getOverlayContent().get(0).querySelector(":hover");
            if (!hoveredElementFromSubMenu && !isSubmenuItemHovered && !isRootItemHovered) {
                this._visibleSubmenu.hide()
            }
        }
    }, {
        key: "_getSubmenuByRootElement",
        value: function($rootItem) {
            if (!$rootItem) {
                return false
            }
            var $submenu = $rootItem.children("." + DX_CONTEXT_MENU_CLASS);
            return $submenu.length && _ui4.default.getInstance($submenu)
        }
    }, {
        key: "getSubmenuPosition",
        value: function($rootItem) {
            var isHorizontalMenu = this._isMenuHorizontal();
            var submenuDirection = this.option("submenuDirection").toLowerCase();
            var rtlEnabled = this.option("rtlEnabled");
            var submenuPosition = {
                collision: "flip",
                of: $rootItem
            };
            switch (submenuDirection) {
                case "leftortop":
                    submenuPosition.at = "left top";
                    submenuPosition.my = isHorizontalMenu ? "left bottom" : "right top";
                    break;
                case "rightorbottom":
                    submenuPosition.at = isHorizontalMenu ? "left bottom" : "right top";
                    submenuPosition.my = "left top";
                    break;
                default:
                    if (isHorizontalMenu) {
                        submenuPosition.at = rtlEnabled ? "right bottom" : "left bottom";
                        submenuPosition.my = rtlEnabled ? "right top" : "left top"
                    } else {
                        submenuPosition.at = rtlEnabled ? "left top" : "right top";
                        submenuPosition.my = rtlEnabled ? "right top" : "left top"
                    }
            }
            return submenuPosition
        }
    }, {
        key: "_renderBorderElement",
        value: function($item) {
            (0, _renderer2.default)("<div>").appendTo($item).addClass(DX_CONTEXT_MENU_CONTAINER_BORDER_CLASS).hide()
        }
    }, {
        key: "_itemPointerDownHandler",
        value: function(e) {
            var $target = (0, _renderer2.default)(e.target);
            var $closestItem = $target.closest(this._itemElements());
            if ($closestItem.hasClass("dx-menu-item-has-submenu")) {
                this.option("focusedElement", null);
                return
            }
            _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_itemPointerDownHandler", this).call(this, e)
        }
    }, {
        key: "_hoverStartHandler",
        value: function(e) {
            var mouseMoveEventName = (0, _utils2.addNamespace)(_pointer2.default.move, this.NAME);
            var $item = this._getItemElementByEventArgs(e);
            var node = this._dataAdapter.getNodeByItem(this._getItemData($item));
            var isSelectionActive = (0, _type.isDefined)(e.buttons) && 1 === e.buttons || !(0, _type.isDefined)(e.buttons) && 1 === e.which;
            if (this._isItemDisabled($item)) {
                return
            }
            _events_engine2.default.off($item, mouseMoveEventName);
            if (!this._hasChildren(node)) {
                this._showSubmenuTimer = setTimeout(this._hideSubmenuAfterTimeout.bind(this), this._getDelay("hide"));
                return
            }
            if ("onHover" === this._getShowFirstSubmenuMode() && !isSelectionActive) {
                var submenu = this._getSubmenuByElement($item);
                this._clearTimeouts();
                if (!submenu.isOverlayVisible()) {
                    _events_engine2.default.on($item, mouseMoveEventName, this._itemMouseMoveHandler.bind(this));
                    this._showSubmenuTimer = this._getDelay("hide")
                }
            }
        }
    }, {
        key: "_hoverEndHandler",
        value: function(eventArg) {
            var _this8 = this;
            var $item = this._getItemElementByEventArgs(eventArg);
            var relatedTarget = (0, _renderer2.default)(eventArg.relatedTarget);
            _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_hoverEndHandler", this).call(this, eventArg);
            this._clearTimeouts();
            if (this._isItemDisabled($item)) {
                return
            }
            if (relatedTarget.hasClass(DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS)) {
                return
            }
            if (this.option("hideSubmenuOnMouseLeave") && !relatedTarget.hasClass(DX_MENU_ITEMS_CONTAINER_CLASS)) {
                this._hideSubmenuTimer = setTimeout(function() {
                    _this8._hideSubmenuAfterTimeout()
                }, this._getDelay("hide"))
            }
        }
    }, {
        key: "_hideVisibleSubmenu",
        value: function() {
            if (!this._visibleSubmenu) {
                return false
            }
            this._hideSubmenu(this._visibleSubmenu);
            return true
        }
    }, {
        key: "_showSubmenu",
        value: function($itemElement) {
            var submenu = this._getSubmenuByElement($itemElement);
            if (this._visibleSubmenu !== submenu) {
                this._hideVisibleSubmenu()
            }
            if (submenu) {
                submenu.show();
                this.option("focusedElement", submenu.option("focusedElement"))
            }
            this._visibleSubmenu = submenu;
            this._hoveredRootItem = $itemElement
        }
    }, {
        key: "_hideSubmenu",
        value: function(submenu) {
            submenu && submenu.hide();
            if (this._visibleSubmenu === submenu) {
                this._visibleSubmenu = null
            }
            this._hoveredRootItem = null
        }
    }, {
        key: "_itemMouseMoveHandler",
        value: function(e) {
            var _this9 = this;
            if (e.pointers && e.pointers.length) {
                return
            }
            var $item = (0, _renderer2.default)(e.currentTarget);
            if (!(0, _type.isDefined)(this._showSubmenuTimer)) {
                return
            }
            this._clearTimeouts();
            this._showSubmenuTimer = setTimeout(function() {
                var submenu = _this9._getSubmenuByElement($item);
                if (submenu && !submenu.isOverlayVisible()) {
                    _this9._showSubmenu($item)
                }
            }, this._getDelay("show"))
        }
    }, {
        key: "_clearTimeouts",
        value: function() {
            clearTimeout(this._hideSubmenuTimer);
            clearTimeout(this._showSubmenuTimer)
        }
    }, {
        key: "_getSubmenuByElement",
        value: function($itemElement, itemData) {
            var submenu = this._getSubmenuByRootElement($itemElement);
            if (submenu) {
                return submenu
            } else {
                itemData = itemData || this._getItemData($itemElement);
                var node = this._dataAdapter.getNodeByItem(itemData);
                return this._hasChildren(node) && this._renderSubmenuItems(node, $itemElement)
            }
        }
    }, {
        key: "_updateSubmenuVisibilityOnClick",
        value: function(actionArgs) {
            var args = actionArgs.args.length && actionArgs.args[0];
            if (!args || this._disabledGetter(args.itemData)) {
                return
            }
            var $itemElement = (0, _renderer2.default)(args.itemElement);
            var currentSubmenu = this._getSubmenuByElement($itemElement, args.itemData);
            this._updateSelectedItemOnClick(actionArgs);
            if (this._visibleSubmenu) {
                if (this._visibleSubmenu === currentSubmenu) {
                    if ("onClick" === this.option("showFirstSubmenuMode")) {
                        this._hideSubmenu(this._visibleSubmenu)
                    }
                    return
                } else {
                    this._hideSubmenu(this._visibleSubmenu)
                }
            }
            if (!currentSubmenu) {
                return
            }
            if (!currentSubmenu.isOverlayVisible()) {
                this._showSubmenu($itemElement);
                return
            }
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "orientation":
                case "submenuDirection":
                    this._invalidate();
                    break;
                case "showFirstSubmenuMode":
                case "hideSubmenuOnMouseLeave":
                    break;
                case "showSubmenuMode":
                    this._changeSubmenusOption(args.name, args.value);
                    break;
                case "onSubmenuShowing":
                case "onSubmenuShown":
                case "onSubmenuHiding":
                case "onSubmenuHidden":
                    this._initActions();
                    break;
                case "adaptivityEnabled":
                    args.value ? this._initAdaptivity() : this._removeAdaptivity();
                    break;
                case "width":
                    if (this._isAdaptivityEnabled()) {
                        this._treeView.option(args.name, args.value);
                        this._overlay.option(args.name, args.value)
                    }
                    _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_optionChanged", this).call(this, args);
                    this._dimensionChanged();
                    break;
                case "animation":
                    if (this._isAdaptivityEnabled()) {
                        this._treeView.option("animationEnabled", !!args.value)
                    }
                    _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_optionChanged", this).call(this, args);
                    break;
                default:
                    if (this._isAdaptivityEnabled()) {
                        this._treeView.option(args.name, args.value)
                    }
                    _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "_changeSubmenusOption",
        value: function(name, value) {
            (0, _iterator.each)(this._submenus, function(index, submenu) {
                submenu.option(name, value)
            })
        }
    }, {
        key: "selectItem",
        value: function(itemElement) {
            this._hideSubmenu(this._visibleSubmenu);
            _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "selectItem", this).call(this, itemElement)
        }
    }, {
        key: "unselectItem",
        value: function(itemElement) {
            this._hideSubmenu(this._visibleSubmenu);
            _get(Menu.prototype.__proto__ || Object.getPrototypeOf(Menu.prototype), "selectItem", this).call(this, itemElement)
        }
    }]);
    return Menu
}(_ui2.default);
(0, _component_registrator2.default)("dxMenu", Menu);
module.exports = Menu;
