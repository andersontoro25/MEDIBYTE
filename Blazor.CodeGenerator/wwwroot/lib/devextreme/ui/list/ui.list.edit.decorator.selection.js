/**
 * DevExtreme (ui/list/ui.list.edit.decorator.selection.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    clickEvent = require("../../events/click"),
    extend = require("../../core/utils/extend").extend,
    errors = require("../widget/ui.errors"),
    CheckBox = require("../check_box"),
    RadioButton = require("../radio_group/radio_button"),
    eventUtils = require("../../events/utils"),
    registerDecorator = require("./ui.list.edit.decorator_registry").register,
    EditDecorator = require("./ui.list.edit.decorator");
var SELECT_DECORATOR_ENABLED_CLASS = "dx-list-select-decorator-enabled",
    SELECT_DECORATOR_SELECT_ALL_CLASS = "dx-list-select-all",
    SELECT_DECORATOR_SELECT_ALL_CHECKBOX_CLASS = "dx-list-select-all-checkbox",
    SELECT_DECORATOR_SELECT_ALL_LABEL_CLASS = "dx-list-select-all-label",
    SELECT_CHECKBOX_CONTAINER_CLASS = "dx-list-select-checkbox-container",
    SELECT_CHECKBOX_CLASS = "dx-list-select-checkbox",
    SELECT_RADIO_BUTTON_CONTAINER_CLASS = "dx-list-select-radiobutton-container",
    SELECT_RADIO_BUTTON_CLASS = "dx-list-select-radiobutton",
    FOCUSED_STATE_CLASS = "dx-state-focused";
var CLICK_EVENT_NAME = eventUtils.addNamespace(clickEvent.name, "dxListEditDecorator");
registerDecorator("selection", "default", EditDecorator.inherit({
    _init: function() {
        this.callBase.apply(this, arguments);
        var selectionMode = this._list.option("selectionMode");
        this._singleStrategy = "single" === selectionMode;
        this._containerClass = this._singleStrategy ? SELECT_RADIO_BUTTON_CONTAINER_CLASS : SELECT_CHECKBOX_CONTAINER_CLASS;
        this._controlClass = this._singleStrategy ? SELECT_RADIO_BUTTON_CLASS : SELECT_CHECKBOX_CLASS;
        this._controlWidget = this._singleStrategy ? RadioButton : CheckBox;
        this._list.$element().addClass(SELECT_DECORATOR_ENABLED_CLASS)
    },
    beforeBag: function(config) {
        var $itemElement = config.$itemElement,
            $container = config.$container;
        var $control = $("<div>").addClass(this._controlClass);
        new this._controlWidget($control, extend(this._commonOptions(), {
            value: this._isSelected($itemElement),
            focusStateEnabled: false,
            hoverStateEnabled: false,
            onValueChanged: function(e) {
                this._processCheckedState($itemElement, e.value);
                e.event && e.event.stopPropagation()
            }.bind(this)
        }));
        $container.addClass(this._containerClass);
        $container.append($control)
    },
    modifyElement: function(config) {
        this.callBase.apply(this, arguments);
        var $itemElement = config.$itemElement,
            control = this._controlWidget.getInstance($itemElement.find("." + this._controlClass));
        eventsEngine.on($itemElement, "stateChanged", function(e, state) {
            control.option("value", state)
        }.bind(this))
    },
    _updateSelectAllState: function() {
        if (!this._$selectAll) {
            return
        }
        this._selectAllCheckBox.option("value", this._list.isSelectAll())
    },
    afterRender: function() {
        if ("all" !== this._list.option("selectionMode")) {
            return
        }
        if (!this._$selectAll) {
            this._renderSelectAll()
        } else {
            this._updateSelectAllState()
        }
    },
    handleKeyboardEvents: function(currentFocusedIndex, moveFocusUp) {
        var moveFocusDown = !moveFocusUp;
        var list = this._list;
        var $selectAll = this._$selectAll;
        var lastItemIndex = list._getLastItemIndex();
        var isFocusOutOfList = moveFocusUp && 0 === currentFocusedIndex || moveFocusDown && currentFocusedIndex === lastItemIndex;
        var hasSelectAllItem = !!$selectAll;
        if (hasSelectAllItem && isFocusOutOfList) {
            list.option("focusedElement", $selectAll);
            list.scrollToItem(list.option("focusedElement"));
            return true
        }
        return false
    },
    handleEnterPressing: function() {
        if (this._$selectAll && this._$selectAll.hasClass(FOCUSED_STATE_CLASS)) {
            this._selectAllCheckBox.option("value", !this._selectAllCheckBox.option("value"));
            return true
        }
    },
    _renderSelectAll: function() {
        var $selectAll = this._$selectAll = $("<div>").addClass(SELECT_DECORATOR_SELECT_ALL_CLASS),
            list = this._list,
            downArrowHandler = list._supportedKeys().downArrow.bind(list);
        this._selectAllCheckBox = list._createComponent($("<div>").addClass(SELECT_DECORATOR_SELECT_ALL_CHECKBOX_CLASS).appendTo($selectAll), CheckBox, {
            focusStateEnabled: false,
            hoverStateEnabled: false
        });
        this._selectAllCheckBox.registerKeyHandler("downArrow", downArrowHandler);
        $("<div>").addClass(SELECT_DECORATOR_SELECT_ALL_LABEL_CLASS).text(this._list.option("selectAllText")).appendTo($selectAll);
        this._list.itemsContainer().prepend($selectAll);
        this._updateSelectAllState();
        this._attachSelectAllHandler()
    },
    _attachSelectAllHandler: function() {
        this._selectAllCheckBox.option("onValueChanged", this._selectAllHandler.bind(this));
        eventsEngine.off(this._$selectAll, CLICK_EVENT_NAME);
        eventsEngine.on(this._$selectAll, CLICK_EVENT_NAME, this._selectAllClickHandler.bind(this))
    },
    _selectAllHandler: function(e) {
        e.event && e.event.stopPropagation();
        var isSelectedAll = this._selectAllCheckBox.option("value");
        var result = this._list._createActionByOption("onSelectAllValueChanged")({
            value: isSelectedAll
        });
        if (false === result) {
            return
        }
        if (true === isSelectedAll) {
            this._selectAllItems()
        } else {
            if (false === isSelectedAll) {
                this._unselectAllItems()
            }
        }
    },
    _checkSelectAllCapability: function() {
        var list = this._list,
            dataSource = list.getDataSource();
        if ("allPages" === list.option("selectAllMode") && list.option("grouped") && (!dataSource || !dataSource.group())) {
            errors.log("W1010");
            return false
        }
        return true
    },
    _selectAllItems: function() {
        if (!this._checkSelectAllCapability()) {
            return
        }
        this._list._selection.selectAll("page" === this._list.option("selectAllMode"))
    },
    _unselectAllItems: function() {
        if (!this._checkSelectAllCapability()) {
            return
        }
        this._list._selection.deselectAll("page" === this._list.option("selectAllMode"))
    },
    _selectAllClickHandler: function() {
        this._selectAllCheckBox.option("value", !this._selectAllCheckBox.option("value"))
    },
    _isSelected: function($itemElement) {
        return this._list.isItemSelected($itemElement)
    },
    _processCheckedState: function($itemElement, checked) {
        if (checked) {
            this._list.selectItem($itemElement)
        } else {
            this._list.unselectItem($itemElement)
        }
    },
    dispose: function() {
        this._disposeSelectAll();
        this._list.$element().removeClass(SELECT_DECORATOR_ENABLED_CLASS);
        this.callBase.apply(this, arguments)
    },
    _disposeSelectAll: function() {
        if (this._$selectAll) {
            this._$selectAll.remove();
            this._$selectAll = null
        }
    }
}));
