/**
 * DevExtreme (ui/filter_builder/filter_builder.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _dom_adapter = require("../../core/dom_adapter");
var _dom_adapter2 = _interopRequireDefault(_dom_adapter);
var _class = require("../../core/class");
var _class2 = _interopRequireDefault(_class);
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _extend = require("../../core/utils/extend");
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _utils = require("./utils");
var _utils2 = _interopRequireDefault(_utils);
var _deferred = require("../../core/utils/deferred");
var _deferred2 = _interopRequireDefault(_deferred);
var _type = require("../../core/utils/type");
var _tree_view = require("../tree_view");
var _tree_view2 = _interopRequireDefault(_tree_view);
var _popup = require("../popup");
var _popup2 = _interopRequireDefault(_popup);
var _utils3 = require("../overlay/utils");
var _ui3 = require("../shared/ui.editor_factory_mixin");
var _ui4 = _interopRequireDefault(_ui3);
var _utils4 = require("../../events/utils");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var FILTER_BUILDER_CLASS = "dx-filterbuilder",
    FILTER_BUILDER_GROUP_CLASS = FILTER_BUILDER_CLASS + "-group",
    FILTER_BUILDER_GROUP_ITEM_CLASS = FILTER_BUILDER_GROUP_CLASS + "-item",
    FILTER_BUILDER_GROUP_CONTENT_CLASS = FILTER_BUILDER_GROUP_CLASS + "-content",
    FILTER_BUILDER_GROUP_OPERATIONS_CLASS = FILTER_BUILDER_GROUP_CLASS + "-operations",
    FILTER_BUILDER_GROUP_OPERATION_CLASS = FILTER_BUILDER_GROUP_CLASS + "-operation",
    FILTER_BUILDER_ACTION_CLASS = FILTER_BUILDER_CLASS + "-action",
    FILTER_BUILDER_IMAGE_CLASS = FILTER_BUILDER_ACTION_CLASS + "-icon",
    FILTER_BUILDER_IMAGE_ADD_CLASS = "dx-icon-plus",
    FILTER_BUILDER_IMAGE_REMOVE_CLASS = "dx-icon-remove",
    FILTER_BUILDER_ITEM_TEXT_CLASS = FILTER_BUILDER_CLASS + "-text",
    FILTER_BUILDER_ITEM_TEXT_PART_CLASS = FILTER_BUILDER_ITEM_TEXT_CLASS + "-part",
    FILTER_BUILDER_ITEM_TEXT_SEPARATOR_CLASS = FILTER_BUILDER_ITEM_TEXT_CLASS + "-separator",
    FILTER_BUILDER_ITEM_TEXT_SEPARATOR_EMPTY_CLASS = FILTER_BUILDER_ITEM_TEXT_SEPARATOR_CLASS + "-empty",
    FILTER_BUILDER_ITEM_FIELD_CLASS = FILTER_BUILDER_CLASS + "-item-field",
    FILTER_BUILDER_ITEM_OPERATION_CLASS = FILTER_BUILDER_CLASS + "-item-operation",
    FILTER_BUILDER_ITEM_VALUE_CLASS = FILTER_BUILDER_CLASS + "-item-value",
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = FILTER_BUILDER_CLASS + "-item-value-text",
    FILTER_BUILDER_OVERLAY_CLASS = FILTER_BUILDER_CLASS + "-overlay",
    FILTER_BUILDER_FILTER_OPERATIONS_CLASS = FILTER_BUILDER_CLASS + "-operations",
    FILTER_BUILDER_FIELDS_CLASS = FILTER_BUILDER_CLASS + "-fields",
    FILTER_BUILDER_ADD_CONDITION_CLASS = FILTER_BUILDER_CLASS + "-add-condition",
    ACTIVE_CLASS = "dx-state-active",
    FILTER_BUILDER_MENU_CUSTOM_OPERATION_CLASS = FILTER_BUILDER_CLASS + "-menu-custom-operation",
    SOURCE = "filterBuilder",
    DISABLED_STATE_CLASS = "dx-state-disabled",
    TAB_KEY = "tab",
    ENTER_KEY = "enter",
    ESCAPE_KEY = "escape";
var ACTIONS = [{
        name: "onEditorPreparing",
        config: {
            excludeValidators: ["disabled", "readOnly"],
            category: "rendering"
        }
    }, {
        name: "onEditorPrepared",
        config: {
            excludeValidators: ["disabled", "readOnly"],
            category: "rendering"
        }
    }, {
        name: "onValueChanged",
        config: {
            excludeValidators: ["disabled", "readOnly"]
        }
    }],
    OPERATORS = {
        and: "and",
        or: "or",
        notAnd: "!and",
        notOr: "!or"
    };
var EditorFactory = _class2.default.inherit(_ui4.default);
var renderValueText = function($container, value, customOperation) {
    if (Array.isArray(value)) {
        var lastItemIndex = value.length - 1;
        $container.empty();
        value.forEach(function(t, i) {
            (0, _renderer2.default)("<span>").addClass(FILTER_BUILDER_ITEM_TEXT_PART_CLASS).text(t).appendTo($container);
            if (i !== lastItemIndex) {
                (0, _renderer2.default)("<span>").addClass(FILTER_BUILDER_ITEM_TEXT_SEPARATOR_CLASS).text(customOperation && customOperation.valueSeparator ? customOperation.valueSeparator : "|").addClass(FILTER_BUILDER_ITEM_TEXT_SEPARATOR_EMPTY_CLASS).appendTo($container)
            }
        })
    } else {
        if (value) {
            $container.text(value)
        } else {
            $container.text(_message2.default.format("dxFilterBuilder-enterValueText"))
        }
    }
};
var FilterBuilder = _ui2.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            onEditorPreparing: null,
            onEditorPrepared: null,
            onValueChanged: null,
            fields: [],
            defaultGroupOperation: "and",
            groupOperations: ["and", "or", "notAnd", "notOr"],
            maxGroupLevel: void 0,
            value: null,
            allowHierarchicalFields: false,
            groupOperationDescriptions: {
                and: _message2.default.format("dxFilterBuilder-and"),
                or: _message2.default.format("dxFilterBuilder-or"),
                notAnd: _message2.default.format("dxFilterBuilder-notAnd"),
                notOr: _message2.default.format("dxFilterBuilder-notOr")
            },
            customOperations: [],
            filterOperationDescriptions: {
                between: _message2.default.format("dxFilterBuilder-filterOperationBetween"),
                equal: _message2.default.format("dxFilterBuilder-filterOperationEquals"),
                notEqual: _message2.default.format("dxFilterBuilder-filterOperationNotEquals"),
                lessThan: _message2.default.format("dxFilterBuilder-filterOperationLess"),
                lessThanOrEqual: _message2.default.format("dxFilterBuilder-filterOperationLessOrEquals"),
                greaterThan: _message2.default.format("dxFilterBuilder-filterOperationGreater"),
                greaterThanOrEqual: _message2.default.format("dxFilterBuilder-filterOperationGreaterOrEquals"),
                startsWith: _message2.default.format("dxFilterBuilder-filterOperationStartsWith"),
                contains: _message2.default.format("dxFilterBuilder-filterOperationContains"),
                notContains: _message2.default.format("dxFilterBuilder-filterOperationNotContains"),
                endsWith: _message2.default.format("dxFilterBuilder-filterOperationEndsWith"),
                isBlank: _message2.default.format("dxFilterBuilder-filterOperationIsBlank"),
                isNotBlank: _message2.default.format("dxFilterBuilder-filterOperationIsNotBlank")
            }
        })
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "onEditorPreparing":
            case "onEditorPrepared":
            case "onValueChanged":
                this._initActions();
                break;
            case "customOperations":
                this._initCustomOperations();
                this._invalidate();
                break;
            case "fields":
            case "defaultGroupOperation":
            case "maxGroupLevel":
            case "groupOperations":
            case "allowHierarchicalFields":
            case "groupOperationDescriptions":
            case "filterOperationDescriptions":
                this._invalidate();
                break;
            case "value":
                if (args.value !== args.previousValue) {
                    var disableInvalidateForValue = this._disableInvalidateForValue;
                    if (!disableInvalidateForValue) {
                        this._initModel();
                        this._invalidate()
                    }
                    this._disableInvalidateForValue = false;
                    this.executeAction("onValueChanged", {
                        value: args.value,
                        previousValue: args.previousValue
                    });
                    this._disableInvalidateForValue = disableInvalidateForValue
                }
                break;
            default:
                this.callBase(args)
        }
    },
    getFilterExpression: function() {
        var fields = this._getNormalizedFields(),
            value = (0, _extend.extend)(true, [], this._model);
        return _utils2.default.getFilterExpression(_utils2.default.getNormalizedFilter(value), fields, this._customOperations, SOURCE)
    },
    _getNormalizedFields: function() {
        return _utils2.default.getNormalizedFields(this.option("fields"))
    },
    _updateFilter: function() {
        this._disableInvalidateForValue = true;
        var value = (0, _extend.extend)(true, [], this._model),
            normalizedValue = _utils2.default.getNormalizedFilter(value),
            oldValue = _utils2.default.getNormalizedFilter(this._getModel(this.option("value")));
        if (JSON.stringify(oldValue) !== JSON.stringify(normalizedValue)) {
            this.option("value", normalizedValue)
        }
        this._disableInvalidateForValue = false;
        this._fireContentReadyAction()
    },
    _init: function() {
        this._initCustomOperations();
        this._initModel();
        this._initEditorFactory();
        this._initActions();
        this.callBase()
    },
    _initEditorFactory: function() {
        this._editorFactory = new EditorFactory
    },
    _initCustomOperations: function() {
        this._customOperations = _utils2.default.getMergedOperations(this.option("customOperations"), this.option("filterOperationDescriptions.between"))
    },
    _getModel: function(value) {
        return _utils2.default.convertToInnerStructure(value, this._customOperations)
    },
    _initModel: function() {
        this._model = this._getModel(this.option("value"))
    },
    _initActions: function() {
        var that = this;
        that._actions = {};
        ACTIONS.forEach(function(action) {
            that._actions[action.name] = that._createActionByOption(action.name, action.config)
        })
    },
    executeAction: function(actionName, options) {
        var action = this._actions[actionName];
        return action && action(options)
    },
    _initMarkup: function() {
        this.$element().addClass(FILTER_BUILDER_CLASS);
        this.callBase();
        this._createGroupElementByCriteria(this._model).appendTo(this.$element())
    },
    _createConditionElement: function(condition, parent) {
        return (0, _renderer2.default)("<div>").addClass(FILTER_BUILDER_GROUP_CLASS).append(this._createConditionItem(condition, parent))
    },
    _createGroupElementByCriteria: function(criteria, parent) {
        var groupLevel = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
        var $group = this._createGroupElement(criteria, parent, groupLevel),
            $groupContent = $group.find("." + FILTER_BUILDER_GROUP_CONTENT_CLASS),
            groupCriteria = _utils2.default.getGroupCriteria(criteria);
        for (var i = 0; i < groupCriteria.length; i++) {
            var innerCriteria = groupCriteria[i];
            if (_utils2.default.isGroup(innerCriteria)) {
                this._createGroupElementByCriteria(innerCriteria, groupCriteria, groupLevel + 1).appendTo($groupContent)
            } else {
                if (_utils2.default.isCondition(innerCriteria)) {
                    this._createConditionElement(innerCriteria, groupCriteria).appendTo($groupContent)
                }
            }
        }
        return $group
    },
    _createGroupElement: function(criteria, parent, groupLevel) {
        var _this = this;
        var $groupItem = (0, _renderer2.default)("<div>").addClass(FILTER_BUILDER_GROUP_ITEM_CLASS),
            $groupContent = (0, _renderer2.default)("<div>").addClass(FILTER_BUILDER_GROUP_CONTENT_CLASS),
            $group = (0, _renderer2.default)("<div>").addClass(FILTER_BUILDER_GROUP_CLASS).append($groupItem).append($groupContent);
        if (null != parent) {
            this._createRemoveButton(function() {
                _utils2.default.removeItem(parent, criteria);
                $group.remove();
                _this._updateFilter()
            }).appendTo($groupItem)
        }
        this._createGroupOperationButton(criteria).appendTo($groupItem);
        this._createAddButton(function() {
            var newGroup = _utils2.default.createEmptyGroup(_this.option("defaultGroupOperation"));
            _utils2.default.addItem(newGroup, criteria);
            _this._createGroupElement(newGroup, criteria, groupLevel + 1).appendTo($groupContent);
            _this._updateFilter()
        }, function() {
            var field = _this.option("fields")[0],
                newCondition = _utils2.default.createCondition(field, _this._customOperations);
            _utils2.default.addItem(newCondition, criteria);
            _this._createConditionElement(newCondition, criteria).appendTo($groupContent);
            _this._updateFilter()
        }, groupLevel).appendTo($groupItem);
        return $group
    },
    _createButton: function(caption) {
        return (0, _renderer2.default)("<div>").text(caption)
    },
    _createGroupOperationButton: function(criteria) {
        var _this2 = this;
        var groupOperations = this._getGroupOperations(criteria),
            groupMenuItem = _utils2.default.getGroupMenuItem(criteria, groupOperations),
            caption = groupMenuItem.text,
            $operationButton = groupOperations && groupOperations.length < 2 ? this._createButton(caption).addClass(DISABLED_STATE_CLASS) : this._createButtonWithMenu({
                caption: caption,
                menu: {
                    items: groupOperations,
                    displayExpr: "text",
                    keyExpr: "value",
                    onItemClick: function(e) {
                        if (groupMenuItem !== e.itemData) {
                            _utils2.default.setGroupValue(criteria, e.itemData.value);
                            $operationButton.html(e.itemData.text);
                            groupMenuItem = e.itemData;
                            _this2._updateFilter()
                        }
                    },
                    onContentReady: function(e) {
                        e.component.selectItem(groupMenuItem)
                    },
                    cssClass: FILTER_BUILDER_GROUP_OPERATIONS_CLASS
                }
            });
        return $operationButton.addClass(FILTER_BUILDER_ITEM_TEXT_CLASS).addClass(FILTER_BUILDER_GROUP_OPERATION_CLASS).attr("tabindex", 0)
    },
    _createButtonWithMenu: function(options) {
        var that = this,
            removeMenu = function() {
                that.$element().find("." + ACTIVE_CLASS).removeClass(ACTIVE_CLASS);
                that.$element().find(".dx-overlay .dx-treeview").remove();
                that.$element().find(".dx-overlay").remove()
            },
            rtlEnabled = this.option("rtlEnabled"),
            menuOnItemClickWrapper = function(handler) {
                return function(e) {
                    handler(e);
                    if ("dxclick" === e.event.type) {
                        removeMenu()
                    }
                }
            },
            position = rtlEnabled ? "right" : "left",
            $button = this._createButton(options.caption);
        (0, _extend.extend)(options.menu, {
            focusStateEnabled: true,
            selectionMode: "single",
            onItemClick: menuOnItemClickWrapper(options.menu.onItemClick),
            onHiding: function(e) {
                $button.removeClass(ACTIVE_CLASS)
            },
            position: {
                my: position + " top",
                at: position + " bottom",
                offset: "0 1",
                of: $button,
                collision: "flip"
            },
            animation: null,
            onHidden: function() {
                removeMenu()
            },
            cssClass: FILTER_BUILDER_OVERLAY_CLASS + " " + options.menu.cssClass,
            rtlEnabled: rtlEnabled
        });
        options.popup = {
            onShown: function(info) {
                var treeViewElement = (0, _renderer2.default)(info.component.content()).find(".dx-treeview"),
                    treeView = treeViewElement.dxTreeView("instance");
                _events_engine2.default.on(treeViewElement, "keyup keydown", function(e) {
                    var keyName = (0, _utils4.normalizeKeyName)(e);
                    if ("keydown" === e.type && keyName === TAB_KEY || "keyup" === e.type && (keyName === ESCAPE_KEY || keyName === ENTER_KEY)) {
                        info.component.hide();
                        _events_engine2.default.trigger(options.menu.position.of, "focus")
                    }
                });
                treeView.focus();
                treeView.option("focusedElement", null)
            }
        };
        this._subscribeOnClickAndEnterKey($button, function() {
            removeMenu();
            that._createPopupWithTreeView(options, that.$element());
            $button.addClass(ACTIVE_CLASS)
        });
        return $button
    },
    _hasValueButton: function(condition) {
        var customOperation = _utils2.default.getCustomOperation(this._customOperations, condition[1]);
        return customOperation ? false !== customOperation.hasValue : null !== condition[2]
    },
    _createOperationButtonWithMenu: function(condition, field) {
        var _this3 = this;
        var that = this,
            availableOperations = _utils2.default.getAvailableOperations(field, this.option("filterOperationDescriptions"), this._customOperations),
            currentOperation = _utils2.default.getOperationFromAvailable(_utils2.default.getOperationValue(condition), availableOperations),
            $operationButton = this._createButtonWithMenu({
                caption: currentOperation.text,
                menu: {
                    items: availableOperations,
                    displayExpr: "text",
                    onItemRendered: function(e) {
                        e.itemData.isCustom && (0, _renderer2.default)(e.itemElement).addClass(FILTER_BUILDER_MENU_CUSTOM_OPERATION_CLASS)
                    },
                    onContentReady: function(e) {
                        e.component.selectItem(currentOperation)
                    },
                    onItemClick: function(e) {
                        if (currentOperation !== e.itemData) {
                            currentOperation = e.itemData;
                            _utils2.default.updateConditionByOperation(condition, currentOperation.value, that._customOperations);
                            var $valueButton = $operationButton.siblings().filter("." + FILTER_BUILDER_ITEM_VALUE_CLASS);
                            if (that._hasValueButton(condition)) {
                                if (0 !== $valueButton.length) {
                                    $valueButton.remove()
                                }
                                that._createValueButton(condition, field).appendTo($operationButton.parent())
                            } else {
                                $valueButton.remove()
                            }
                            $operationButton.html(currentOperation.text);
                            _this3._updateFilter()
                        }
                    },
                    cssClass: FILTER_BUILDER_FILTER_OPERATIONS_CLASS
                }
            }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS).addClass(FILTER_BUILDER_ITEM_OPERATION_CLASS).attr("tabindex", 0);
        return $operationButton
    },
    _createOperationAndValueButtons: function(condition, field, $item) {
        this._createOperationButtonWithMenu(condition, field).appendTo($item);
        if (this._hasValueButton(condition)) {
            this._createValueButton(condition, field).appendTo($item)
        }
    },
    _createFieldButtonWithMenu: function(fields, condition, field) {
        var _this4 = this;
        var that = this,
            allowHierarchicalFields = this.option("allowHierarchicalFields"),
            items = _utils2.default.getItems(fields, allowHierarchicalFields),
            item = _utils2.default.getField(field.name || field.dataField, items),
            getFullCaption = function(item, items) {
                return allowHierarchicalFields ? _utils2.default.getCaptionWithParents(item, items) : item.caption
            };
        var $fieldButton = this._createButtonWithMenu({
            caption: getFullCaption(item, items),
            menu: {
                items: items,
                dataStructure: "plain",
                displayExpr: "caption",
                onItemClick: function(e) {
                    if (item !== e.itemData) {
                        item = e.itemData;
                        condition[0] = item.name || item.dataField;
                        condition[2] = "object" === item.dataType ? null : "";
                        _utils2.default.updateConditionByOperation(condition, _utils2.default.getDefaultOperation(item), that._customOperations);
                        $fieldButton.siblings().filter("." + FILTER_BUILDER_ITEM_TEXT_CLASS).remove();
                        that._createOperationAndValueButtons(condition, item, $fieldButton.parent());
                        var caption = getFullCaption(item, e.component.option("items"));
                        $fieldButton.html(caption);
                        _this4._updateFilter()
                    }
                },
                onContentReady: function(e) {
                    e.component.selectItem(item)
                },
                cssClass: FILTER_BUILDER_FIELDS_CLASS
            }
        }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS).addClass(FILTER_BUILDER_ITEM_FIELD_CLASS).attr("tabindex", 0);
        return $fieldButton
    },
    _createConditionItem: function(condition, parent) {
        var _this5 = this;
        var $item = (0, _renderer2.default)("<div>").addClass(FILTER_BUILDER_GROUP_ITEM_CLASS),
            fields = this._getNormalizedFields(),
            field = _utils2.default.getField(condition[0], fields);
        this._createRemoveButton(function() {
            _utils2.default.removeItem(parent, condition);
            $item.remove();
            _this5._updateFilter()
        }).appendTo($item);
        this._createFieldButtonWithMenu(fields, condition, field).appendTo($item);
        this._createOperationAndValueButtons(condition, field, $item);
        return $item
    },
    _getGroupOperations: function(criteria) {
        var groupOperations = this.option("groupOperations"),
            groupOperationDescriptions = this.option("groupOperationDescriptions");
        if (!groupOperations || !groupOperations.length) {
            groupOperations = [_utils2.default.getGroupValue(criteria).replace("!", "not")]
        }
        return groupOperations.map(function(operation) {
            return {
                text: groupOperationDescriptions[operation],
                value: OPERATORS[operation]
            }
        })
    },
    _createRemoveButton: function(handler) {
        var $removeButton = (0, _renderer2.default)("<div>").addClass(FILTER_BUILDER_IMAGE_CLASS).addClass(FILTER_BUILDER_IMAGE_REMOVE_CLASS).addClass(FILTER_BUILDER_ACTION_CLASS).attr("tabindex", 0);
        this._subscribeOnClickAndEnterKey($removeButton, handler);
        return $removeButton
    },
    _createAddButton: function(addGroupHandler, addConditionHandler, groupLevel) {
        var $button = void 0,
            maxGroupLevel = this.option("maxGroupLevel");
        if ((0, _type.isDefined)(maxGroupLevel) && groupLevel >= maxGroupLevel) {
            $button = this._createButton();
            this._subscribeOnClickAndEnterKey($button, addConditionHandler)
        } else {
            $button = this._createButtonWithMenu({
                menu: {
                    items: [{
                        caption: _message2.default.format("dxFilterBuilder-addCondition"),
                        click: addConditionHandler
                    }, {
                        caption: _message2.default.format("dxFilterBuilder-addGroup"),
                        click: addGroupHandler
                    }],
                    displayExpr: "caption",
                    onItemClick: function(e) {
                        e.itemData.click()
                    },
                    cssClass: FILTER_BUILDER_ADD_CONDITION_CLASS
                }
            })
        }
        return $button.addClass(FILTER_BUILDER_IMAGE_CLASS).addClass(FILTER_BUILDER_IMAGE_ADD_CLASS).addClass(FILTER_BUILDER_ACTION_CLASS).attr("tabindex", 0)
    },
    _createValueText: function(item, field, $container) {
        var that = this,
            $text = (0, _renderer2.default)("<div>").html("&nbsp;").addClass(FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).attr("tabindex", 0).appendTo($container),
            value = item[2];
        var customOperation = _utils2.default.getCustomOperation(that._customOperations, item[1]);
        if (!customOperation && field.lookup) {
            _utils2.default.getCurrentLookupValueText(field, value, function(result) {
                renderValueText($text, result)
            })
        } else {
            _deferred2.default.when(_utils2.default.getCurrentValueText(field, value, customOperation)).done(function(result) {
                renderValueText($text, result, customOperation)
            })
        }
        that._subscribeOnClickAndEnterKey($text, function(e) {
            if ("keyup" === e.type) {
                e.stopPropagation()
            }
            that._createValueEditorWithEvents(item, field, $container)
        });
        return $text
    },
    _updateConditionValue: function(item, value, callback) {
        var areValuesDifferent = item[2] !== value;
        if (areValuesDifferent) {
            item[2] = value
        }
        callback();
        this._updateFilter()
    },
    _addDocumentKeyUp: function($editor, handler) {
        var document = _dom_adapter2.default.getDocument();
        var documentKeyUpHandler = function(e) {
            if (isComposing || hasCompositionJustEnded) {
                hasCompositionJustEnded = false;
                return
            }
            handler(e)
        };
        _events_engine2.default.on(document, "keyup", documentKeyUpHandler);
        var isComposing = false;
        var hasCompositionJustEnded = false;
        var input = $editor.find("input");
        _events_engine2.default.on(input, "compositionstart", function() {
            isComposing = true
        });
        _events_engine2.default.on(input, "compositionend", function() {
            isComposing = false;
            hasCompositionJustEnded = true
        });
        _events_engine2.default.on(input, "keydown", function(event) {
            if (229 !== event.which) {
                hasCompositionJustEnded = false
            }
        });
        this._documentKeyUpHandler = documentKeyUpHandler
    },
    _addDocumentClick: function($editor, closeEditorFunc) {
        var _this6 = this;
        var document = _dom_adapter2.default.getDocument();
        var documentClickHandler = function(e) {
            if (!_this6._isFocusOnEditorParts($editor, e.target)) {
                _events_engine2.default.trigger($editor.find("input"), "change");
                closeEditorFunc()
            }
        };
        _events_engine2.default.on(document, "dxpointerdown", documentClickHandler);
        this._documentClickHandler = documentClickHandler
    },
    _isFocusOnEditorParts: function($editor, target) {
        var activeElement = target || _dom_adapter2.default.getActiveElement();
        return (0, _renderer2.default)(activeElement).closest($editor.children()).length || (0, _renderer2.default)(activeElement).closest(".dx-dropdowneditor-overlay").length
    },
    _removeEvents: function() {
        var document = _dom_adapter2.default.getDocument();
        (0, _type.isDefined)(this._documentKeyUpHandler) && _events_engine2.default.off(document, "keyup", this._documentKeyUpHandler);
        (0, _type.isDefined)(this._documentClickHandler) && _events_engine2.default.off(document, "dxpointerdown", this._documentClickHandler)
    },
    _dispose: function() {
        this._removeEvents();
        this.callBase()
    },
    _createValueEditorWithEvents: function(item, field, $container) {
        var _this7 = this;
        var value = item[2],
            createValueText = function() {
                $container.empty();
                _this7._removeEvents();
                return _this7._createValueText(item, field, $container)
            },
            closeEditor = function() {
                _this7._updateConditionValue(item, value, function() {
                    createValueText()
                })
            };
        var options = {
            value: "" === value ? null : value,
            filterOperation: _utils2.default.getOperationValue(item),
            setValue: function(data) {
                value = null === data ? "" : data
            },
            closeEditor: closeEditor,
            text: $container.text()
        };
        $container.empty();
        var $editor = this._createValueEditor($container, field, options);
        _events_engine2.default.trigger($editor.find("input").not(":hidden").eq(0), "focus");
        this._removeEvents();
        this._addDocumentClick($editor, closeEditor);
        this._addDocumentKeyUp($editor, function(e) {
            var keyName = (0, _utils4.normalizeKeyName)(e);
            if (keyName === TAB_KEY) {
                if (_this7._isFocusOnEditorParts($editor)) {
                    return
                }
                _this7._updateConditionValue(item, value, function() {
                    createValueText();
                    if (e.shiftKey) {
                        _events_engine2.default.trigger($container.prev(), "focus")
                    }
                })
            }
            if (keyName === ESCAPE_KEY) {
                _events_engine2.default.trigger(createValueText(), "focus")
            }
            if (keyName === ENTER_KEY) {
                _this7._updateConditionValue(item, value, function() {
                    _events_engine2.default.trigger(createValueText(), "focus")
                })
            }
        });
        this._fireContentReadyAction()
    },
    _createValueButton: function(item, field) {
        var $valueButton = (0, _renderer2.default)("<div>").addClass(FILTER_BUILDER_ITEM_TEXT_CLASS).addClass(FILTER_BUILDER_ITEM_VALUE_CLASS);
        this._createValueText(item, field, $valueButton);
        return $valueButton
    },
    _createValueEditor: function($container, field, options) {
        var $editor = (0, _renderer2.default)("<div>").attr("tabindex", 0).appendTo($container),
            customOperation = _utils2.default.getCustomOperation(this._customOperations, options.filterOperation),
            editorTemplate = customOperation && customOperation.editorTemplate ? customOperation.editorTemplate : field.editorTemplate;
        if (editorTemplate) {
            var template = this._getTemplate(editorTemplate);
            template.render({
                model: (0, _extend.extend)({
                    field: field
                }, options),
                container: $editor
            })
        } else {
            this._editorFactory.createEditor.call(this, $editor, (0, _extend.extend)({}, field, options, {
                parentType: SOURCE
            }))
        }
        return $editor
    },
    _createPopupWithTreeView: function(options, $container) {
        var that = this,
            $popup = (0, _renderer2.default)("<div>").addClass(options.menu.cssClass).appendTo($container);
        this._createComponent($popup, _popup2.default, {
            onHiding: options.menu.onHiding,
            onHidden: options.menu.onHidden,
            rtlEnabled: options.menu.rtlEnabled,
            position: options.menu.position,
            animation: options.menu.animation,
            contentTemplate: function(contentElement) {
                var $menuContainer = (0, _renderer2.default)("<div>");
                that._createComponent($menuContainer, _tree_view2.default, options.menu);
                return $menuContainer
            },
            maxHeight: function() {
                return (0, _utils3.getElementMaxHeightByWindow)(options.menu.position.of)
            },
            visible: true,
            focusStateEnabled: false,
            closeOnOutsideClick: true,
            onShown: options.popup.onShown,
            shading: false,
            width: "auto",
            height: "auto",
            showTitle: false
        })
    },
    _subscribeOnClickAndEnterKey: function($button, handler) {
        _events_engine2.default.on($button, "dxclick", handler);
        _events_engine2.default.on($button, "keyup", function(e) {
            if ((0, _utils4.normalizeKeyName)(e) === ENTER_KEY) {
                handler(e)
            }
        })
    }
});
(0, _component_registrator2.default)("dxFilterBuilder", FilterBuilder);
module.exports = FilterBuilder;
module.exports.renderValueText = renderValueText;
