/**
 * DevExtreme (ui/tabs.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _events_engine = require("../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _devices = require("../core/devices");
var _devices2 = _interopRequireDefault(_devices);
var _component_registrator = require("../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _button = require("./button");
var _button2 = _interopRequireDefault(_button);
var _utils = require("./widget/utils.ink_ripple");
var _utils2 = _interopRequireDefault(_utils);
var _utils3 = require("../events/utils");
var _extend = require("../core/utils/extend");
var _type = require("../core/utils/type");
var _pointer = require("../events/pointer");
var _pointer2 = _interopRequireDefault(_pointer);
var _iterator = require("../core/utils/iterator");
var _item = require("./tabs/item");
var _item2 = _interopRequireDefault(_item);
var _themes = require("./themes");
var _themes2 = _interopRequireDefault(_themes);
var _hold = require("../events/hold");
var _hold2 = _interopRequireDefault(_hold);
var _ui = require("./scroll_view/ui.scrollable");
var _ui2 = _interopRequireDefault(_ui);
var _uiCollection_widget = require("./collection/ui.collection_widget.live_update");
var _uiCollection_widget2 = _interopRequireDefault(_uiCollection_widget);
var _icon = require("../core/utils/icon");
var _bindable_template = require("./widget/bindable_template");
var _bindable_template2 = _interopRequireDefault(_bindable_template);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var TABS_CLASS = "dx-tabs";
var TABS_WRAPPER_CLASS = "dx-tabs-wrapper";
var TABS_EXPANDED_CLASS = "dx-tabs-expanded";
var TABS_STRETCHED_CLASS = "dx-tabs-stretched";
var TABS_SCROLLABLE_CLASS = "dx-tabs-scrollable";
var TABS_NAV_BUTTONS_CLASS = "dx-tabs-nav-buttons";
var OVERFLOW_HIDDEN_CLASS = "dx-overflow-hidden";
var TABS_ITEM_CLASS = "dx-tab";
var TABS_ITEM_SELECTED_CLASS = "dx-tab-selected";
var TABS_NAV_BUTTON_CLASS = "dx-tabs-nav-button";
var TABS_LEFT_NAV_BUTTON_CLASS = "dx-tabs-nav-button-left";
var TABS_RIGHT_NAV_BUTTON_CLASS = "dx-tabs-nav-button-right";
var TABS_ITEM_TEXT_CLASS = "dx-tab-text";
var TABS_ITEM_DATA_KEY = "dxTabData";
var BUTTON_NEXT_ICON = "chevronnext";
var BUTTON_PREV_ICON = "chevronprev";
var FEEDBACK_HIDE_TIMEOUT = 100;
var FEEDBACK_DURATION_INTERVAL = 5;
var FEEDBACK_SCROLL_TIMEOUT = 300;
var TAB_OFFSET = 30;
var Tabs = _uiCollection_widget2.default.inherit({
    _activeStateUnit: "." + TABS_ITEM_CLASS,
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            hoverStateEnabled: true,
            showNavButtons: true,
            scrollByContent: true,
            scrollingEnabled: true,
            selectionMode: "single",
            activeStateEnabled: true,
            selectionRequired: false,
            selectOnFocus: true,
            loopItemFocus: false,
            useInkRipple: false,
            badgeExpr: function(data) {
                return data ? data.badge : void 0
            }
        })
    },
    _defaultOptionsRules: function() {
        var themeName = _themes2.default.current();
        return this.callBase().concat([{
            device: function() {
                return "generic" !== _devices2.default.real().platform
            },
            options: {
                showNavButtons: false
            }
        }, {
            device: {
                platform: "generic"
            },
            options: {
                scrollByContent: false
            }
        }, {
            device: function() {
                return "desktop" === _devices2.default.real().deviceType && !_devices2.default.isSimulator()
            },
            options: {
                focusStateEnabled: true
            }
        }, {
            device: function() {
                return _themes2.default.isMaterial(themeName)
            },
            options: {
                useInkRipple: true,
                selectOnFocus: false
            }
        }])
    },
    _init: function() {
        this.callBase();
        this.setAria("role", "tablist");
        this.$element().addClass(TABS_CLASS);
        this._renderWrapper();
        this._renderMultiple();
        this._feedbackHideTimeout = FEEDBACK_HIDE_TIMEOUT
    },
    _initTemplates: function() {
        this.callBase();
        this._defaultTemplates.item = new _bindable_template2.default(function($container, data) {
            if ((0, _type.isPlainObject)(data)) {
                this._prepareDefaultItemTemplate(data, $container)
            } else {
                $container.text(String(data))
            }
            var $iconElement = (0, _icon.getImageContainer)(data.icon);
            $container.wrapInner((0, _renderer2.default)("<span>").addClass(TABS_ITEM_TEXT_CLASS));
            $iconElement && $iconElement.prependTo($container)
        }.bind(this), ["text", "html", "icon"], this.option("integrationOptions.watchMethod"))
    },
    _itemClass: function() {
        return TABS_ITEM_CLASS
    },
    _selectedItemClass: function() {
        return TABS_ITEM_SELECTED_CLASS
    },
    _itemDataKey: function() {
        return TABS_ITEM_DATA_KEY
    },
    _initMarkup: function() {
        this.callBase();
        this.setAria("role", "tab", this.itemElements());
        this.option("useInkRipple") && this._renderInkRipple();
        this.$element().addClass(OVERFLOW_HIDDEN_CLASS)
    },
    _render: function() {
        this.callBase();
        this._renderScrolling()
    },
    _renderScrolling: function() {
        var removeClasses = [TABS_STRETCHED_CLASS, TABS_EXPANDED_CLASS, OVERFLOW_HIDDEN_CLASS];
        this.$element().removeClass(removeClasses.join(" "));
        if (this.option("scrollingEnabled") && this._isItemsWidthExceeded()) {
            if (!this._scrollable) {
                this._renderScrollable();
                this._renderNavButtons()
            }
            this._scrollable.update();
            this._updateNavButtonsVisibility();
            if (this.option("rtlEnabled")) {
                this._scrollable.scrollTo({
                    left: this._scrollable.scrollWidth() - this._scrollable.clientWidth()
                })
            }
            this._scrollToItem(this.option("selectedItem"))
        }
        if (!(this.option("scrollingEnabled") && this._isItemsWidthExceeded())) {
            this._cleanScrolling();
            if (this._needStretchItems() && !this._isItemsWidthExceeded()) {
                this.$element().addClass(TABS_STRETCHED_CLASS)
            }
            this.$element().removeClass(TABS_NAV_BUTTONS_CLASS).addClass(TABS_EXPANDED_CLASS)
        }
    },
    _isItemsWidthExceeded: function() {
        var tabItemsWidth = this._getSummaryItemsWidth(this._getVisibleItems(), true);
        return tabItemsWidth - 1 > this.$element().width()
    },
    _needStretchItems: function() {
        var $visibleItems = this._getVisibleItems(),
            elementWidth = this.$element().width(),
            itemsWidth = [];
        (0, _iterator.each)($visibleItems, function(_, item) {
            itemsWidth.push((0, _renderer2.default)(item).outerWidth(true))
        });
        var maxTabWidth = Math.max.apply(null, itemsWidth);
        return maxTabWidth > elementWidth / $visibleItems.length
    },
    _cleanNavButtons: function() {
        if (!this._leftButton || !this._rightButton) {
            return
        }
        this._leftButton.$element().remove();
        this._rightButton.$element().remove();
        this._leftButton = null;
        this._rightButton = null
    },
    _cleanScrolling: function() {
        if (!this._scrollable) {
            return
        }
        this._$wrapper.appendTo(this.$element());
        this._scrollable.$element().remove();
        this._scrollable = null;
        this._cleanNavButtons()
    },
    _renderInkRipple: function() {
        this._inkRipple = _utils2.default.render()
    },
    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);
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
    },
    _renderMultiple: function() {
        if ("multiple" === this.option("selectionMode")) {
            this.option("selectOnFocus", false)
        }
    },
    _renderWrapper: function() {
        this._$wrapper = (0, _renderer2.default)("<div>").addClass(TABS_WRAPPER_CLASS);
        this.$element().append(this._$wrapper)
    },
    _itemContainer: function() {
        return this._$wrapper
    },
    _renderScrollable: function() {
        var $itemContainer = this.$element().wrapInner((0, _renderer2.default)("<div>").addClass(TABS_SCROLLABLE_CLASS)).children();
        this._scrollable = this._createComponent($itemContainer, _ui2.default, {
            direction: "horizontal",
            showScrollbar: false,
            useKeyboard: false,
            useNative: false,
            scrollByContent: this.option("scrollByContent"),
            onScroll: this._updateNavButtonsVisibility.bind(this)
        });
        this.$element().append(this._scrollable.$element())
    },
    _scrollToItem: function(itemData) {
        if (!this._scrollable) {
            return
        }
        var $item = this._editStrategy.getItemElement(itemData);
        this._scrollable.scrollToElement($item)
    },
    _renderNavButtons: function() {
        this.$element().toggleClass(TABS_NAV_BUTTONS_CLASS, this.option("showNavButtons"));
        if (!this.option("showNavButtons")) {
            return
        }
        var rtlEnabled = this.option("rtlEnabled");
        this._leftButton = this._createNavButton(-TAB_OFFSET, rtlEnabled ? BUTTON_NEXT_ICON : BUTTON_PREV_ICON);
        var $leftButton = this._leftButton.$element();
        $leftButton.addClass(TABS_LEFT_NAV_BUTTON_CLASS);
        this.$element().prepend($leftButton);
        this._rightButton = this._createNavButton(TAB_OFFSET, rtlEnabled ? BUTTON_PREV_ICON : BUTTON_NEXT_ICON);
        var $rightButton = this._rightButton.$element();
        $rightButton.addClass(TABS_RIGHT_NAV_BUTTON_CLASS);
        this.$element().append($rightButton)
    },
    _updateNavButtonsVisibility: function() {
        this._leftButton && this._leftButton.option("disabled", this._scrollable.scrollLeft() <= 0);
        this._rightButton && this._rightButton.option("disabled", this._scrollable.scrollLeft() >= Math.round(this._scrollable.scrollWidth() - this._scrollable.clientWidth()))
    },
    _updateScrollPosition: function(offset, duration) {
        this._scrollable.update();
        this._scrollable.scrollBy(offset / duration)
    },
    _createNavButton: function(offset, icon) {
        var that = this;
        var holdAction = that._createAction(function() {
                that._holdInterval = setInterval(function() {
                    that._updateScrollPosition(offset, FEEDBACK_DURATION_INTERVAL)
                }, FEEDBACK_DURATION_INTERVAL)
            }),
            holdEventName = (0, _utils3.addNamespace)(_hold2.default.name, "dxNavButton"),
            pointerUpEventName = (0, _utils3.addNamespace)(_pointer2.default.up, "dxNavButton"),
            pointerOutEventName = (0, _utils3.addNamespace)(_pointer2.default.out, "dxNavButton");
        var navButton = this._createComponent((0, _renderer2.default)("<div>").addClass(TABS_NAV_BUTTON_CLASS), _button2.default, {
            focusStateEnabled: false,
            icon: icon,
            onClick: function() {
                that._updateScrollPosition(offset, 1)
            },
            integrationOptions: {}
        });
        var $navButton = navButton.$element();
        _events_engine2.default.on($navButton, holdEventName, {
            timeout: FEEDBACK_SCROLL_TIMEOUT
        }, function(e) {
            holdAction({
                event: e
            })
        }.bind(this));
        _events_engine2.default.on($navButton, pointerUpEventName, function() {
            that._clearInterval()
        });
        _events_engine2.default.on($navButton, pointerOutEventName, function() {
            that._clearInterval()
        });
        return navButton
    },
    _clearInterval: function() {
        if (this._holdInterval) {
            clearInterval(this._holdInterval)
        }
    },
    _updateSelection: function(addedSelection) {
        this._scrollable && this._scrollable.scrollToElement(this.itemElements().eq(addedSelection[0]), {
            left: 1,
            right: 1
        })
    },
    _visibilityChanged: function(visible) {
        if (visible) {
            this._dimensionChanged()
        }
    },
    _dimensionChanged: function() {
        this._renderScrolling()
    },
    _itemSelectHandler: function(e) {
        if ("single" === this.option("selectionMode") && this.isItemSelected(e.currentTarget)) {
            return
        }
        this.callBase(e)
    },
    _clean: function() {
        this._cleanScrolling();
        this.callBase()
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "useInkRipple":
            case "scrollingEnabled":
            case "showNavButtons":
                this._invalidate();
                break;
            case "scrollByContent":
                this._scrollable && this._scrollable.option(args.name, args.value);
                break;
            case "width":
                this.callBase(args);
                this._dimensionChanged();
                break;
            case "selectionMode":
                this._renderMultiple();
                this.callBase(args);
                break;
            case "badgeExpr":
                this._invalidate();
                break;
            default:
                this.callBase(args)
        }
    },
    _afterItemElementInserted: function() {
        this.callBase();
        this._renderScrolling()
    },
    _afterItemElementDeleted: function($item, deletedActionArgs) {
        this.callBase($item, deletedActionArgs);
        this._renderScrolling()
    }
});
Tabs.ItemClass = _item2.default;
(0, _component_registrator2.default)("dxTabs", Tabs);
module.exports = Tabs;
module.exports.getTabsExpandedClass = TABS_EXPANDED_CLASS;
module.exports.default = module.exports;
