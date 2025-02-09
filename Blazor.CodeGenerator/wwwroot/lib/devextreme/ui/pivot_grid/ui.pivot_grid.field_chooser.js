/**
 * DevExtreme (ui/pivot_grid/ui.pivot_grid.field_chooser.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _icon = require("../../core/utils/icon");
var _window = require("../../core/utils/window");
var _type = require("../../core/utils/type");
var _extend = require("../../core/utils/extend");
var _array = require("../../core/utils/array");
var _iterator = require("../../core/utils/iterator");
var _message = require("../../localization/message");
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _uiPivot_grid = require("./ui.pivot_grid.utils");
var _tree_view = require("../tree_view");
var _tree_view2 = _interopRequireDefault(_tree_view);
var _context_menu = require("../context_menu");
var _context_menu2 = _interopRequireDefault(_context_menu);
var _uiPivot_grid2 = require("./ui.pivot_grid.field_chooser_base");
var _uiPivot_grid3 = _interopRequireDefault(_uiPivot_grid2);
require("./data_source");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var DIV = "<div>",
    hasWindow = (0, _window.hasWindow)();
var FIELDCHOOSER_CLASS = "dx-pivotgridfieldchooser",
    FIELDCHOOSER_CONTAINER_CLASS = "dx-pivotgridfieldchooser-container",
    FIELDS_CONTAINER_CLASS = "dx-pivotgrid-fields-container",
    AREA_DRAG_CLASS = "dx-pivotgrid-drag-action";

function getDimensionFields(item, fields) {
    var result = [];
    if (item.items) {
        for (var i = 0; i < item.items.length; i++) {
            result.push.apply(result, getDimensionFields(item.items[i], fields))
        }
    } else {
        if ((0, _type.isDefined)(item.index)) {
            result.push(fields[item.index])
        }
    }
    return result
}

function getFirstItem(item, condition) {
    if (item.items) {
        for (var i = 0; i < item.items.length; i++) {
            var childrenItem = getFirstItem(item.items[i], condition);
            if (childrenItem) {
                return childrenItem
            }
        }
    }
    if (condition(item)) {
        return item
    }
}
var compareOrder = [function(a, b) {
    var aValue = -!!a.isMeasure,
        bValue = +!!b.isMeasure;
    return aValue + bValue
}, function(a, b) {
    var aValue = -!!(a.items && a.items.length),
        bValue = +!!(b.items && b.items.length);
    return aValue + bValue
}, function(a, b) {
    var aValue = +!!(false === a.isMeasure && a.field && a.field.levels && a.field.levels.length),
        bValue = -!!(false === b.isMeasure && b.field && b.field.levels && b.field.levels.length);
    return aValue + bValue
}, (0, _uiPivot_grid.getCompareFunction)(function(item) {
    return item.text
})];

function compareItems(a, b) {
    var result = 0,
        i = 0;
    while (!result && compareOrder[i]) {
        result = compareOrder[i++](a, b)
    }
    return result
}

function getScrollable(container) {
    return container.find(".dx-scrollable").dxScrollable("instance")
}
var FieldChooser = _uiPivot_grid3.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            height: 400,
            layout: 0,
            dataSource: null,
            onContextMenuPreparing: null,
            allowSearch: false,
            searchTimeout: 500,
            texts: {
                columnFields: (0, _message.format)("dxPivotGrid-columnFields"),
                rowFields: (0, _message.format)("dxPivotGrid-rowFields"),
                dataFields: (0, _message.format)("dxPivotGrid-dataFields"),
                filterFields: (0, _message.format)("dxPivotGrid-filterFields"),
                allFields: (0, _message.format)("dxPivotGrid-allFields")
            }
        })
    },
    _refreshDataSource: function() {
        var that = this;
        that._expandedPaths = [];
        that._changedHandler = that._changedHandler || function() {
            (0, _iterator.each)(that._dataChangedHandlers, function(_, func) {
                func()
            });
            that._fireContentReadyAction();
            that._skipStateChange = true;
            that.option("state", that._dataSource.state());
            that._skipStateChange = false
        };
        if (that._dataSource) {
            that._dataSource.off("changed", that._changedHandler);
            that._dataSource = void 0
        }
        that.callBase();
        that._dataSource && that._dataSource.on("changed", that._changedHandler)
    },
    _init: function() {
        this.callBase();
        this._refreshDataSource();
        this._dataChangedHandlers = [];
        this._initActions()
    },
    _initActions: function() {
        this._actions = {
            onContextMenuPreparing: this._createActionByOption("onContextMenuPreparing")
        }
    },
    _trigger: function(eventName, eventArg) {
        this._actions[eventName](eventArg)
    },
    _setOptionsByReference: function() {
        this.callBase();
        (0, _extend.extend)(this._optionsByReference, {
            dataSource: true
        })
    },
    _optionChanged: function(args) {
        var that = this;
        switch (args.name) {
            case "dataSource":
                that._refreshDataSource();
                that._invalidate();
                break;
            case "layout":
            case "texts":
            case "allowSearch":
            case "searchTimeout":
                that._invalidate();
                break;
            case "onContextMenuPreparing":
                that._actions[args.name] = that._createActionByOption(args.name);
                break;
            default:
                that.callBase(args)
        }
    },
    _clean: function(skipStateSetting) {
        !skipStateSetting && this._dataSource && this.option("state", this._dataSource.state());
        this.$element().children("." + FIELDCHOOSER_CONTAINER_CLASS).remove()
    },
    _renderLayout0: function($container) {
        var $col1, $col2, $col3, $col4, $row1, $row2, that = this;
        $container.addClass("dx-layout-0");
        $row1 = (0, _renderer2.default)(DIV).addClass("dx-row").appendTo($container);
        $row2 = (0, _renderer2.default)(DIV).addClass("dx-row").appendTo($container);
        $col1 = (0, _renderer2.default)(DIV).addClass("dx-col").appendTo($row1);
        $col2 = (0, _renderer2.default)(DIV).addClass("dx-col").appendTo($row1);
        $col3 = (0, _renderer2.default)(DIV).addClass("dx-col").appendTo($row2);
        $col4 = (0, _renderer2.default)(DIV).addClass("dx-col").appendTo($row2);
        that._renderArea($col1, "all");
        that._renderArea($col2, "row");
        that._renderArea($col2, "column");
        that._renderArea($col3, "filter");
        that._renderArea($col4, "data")
    },
    _renderLayout1: function($container) {
        var $col1, $col2, that = this;
        $col1 = (0, _renderer2.default)(DIV).addClass("dx-col").appendTo($container);
        $col2 = (0, _renderer2.default)(DIV).addClass("dx-col").appendTo($container);
        that._renderArea($col1, "all");
        that._renderArea($col2, "filter");
        that._renderArea($col2, "row");
        that._renderArea($col2, "column");
        that._renderArea($col2, "data")
    },
    _renderLayout2: function($container) {
        var $col1, $col2, $row1, $row2, that = this;
        $container.addClass("dx-layout-2");
        $row1 = (0, _renderer2.default)(DIV).addClass("dx-row").appendTo($container);
        that._renderArea($row1, "all");
        $row2 = (0, _renderer2.default)(DIV).addClass("dx-row").appendTo($container);
        $col1 = (0, _renderer2.default)(DIV).addClass("dx-col").appendTo($row2);
        $col2 = (0, _renderer2.default)(DIV).addClass("dx-col").appendTo($row2);
        that._renderArea($col1, "filter");
        that._renderArea($col1, "row");
        that._renderArea($col2, "column");
        that._renderArea($col2, "data")
    },
    _initMarkup: function() {
        var that = this,
            $element = this.$element(),
            $container = (0, _renderer2.default)(DIV).addClass(FIELDCHOOSER_CONTAINER_CLASS).appendTo($element),
            layout = that.option("layout");
        that.callBase();
        $element.addClass(FIELDCHOOSER_CLASS).addClass(FIELDS_CONTAINER_CLASS);
        that._dataChangedHandlers = [];
        var dataSource = this._dataSource;
        var currentState = "instantly" !== that.option("applyChangesMode") && dataSource && dataSource.state();
        currentState && that.option("state") && dataSource.state(that.option("state"), true);
        if (0 === layout) {
            that._renderLayout0($container)
        } else {
            if (1 === layout) {
                that._renderLayout1($container)
            } else {
                that._renderLayout2($container)
            }
        }
        currentState && dataSource.state(currentState, true)
    },
    _renderContentImpl: function() {
        this.callBase();
        this.renderSortable();
        this._renderContextMenu();
        this.updateDimensions()
    },
    _fireContentReadyAction: function() {
        if (!this._dataSource || !this._dataSource.isLoading()) {
            this.callBase()
        }
    },
    _getContextMenuArgs: function(dxEvent) {
        var field, area, targetFieldElement = (0, _renderer2.default)(dxEvent.target).closest(".dx-area-field"),
            targetGroupElement = (0, _renderer2.default)(dxEvent.target).closest(".dx-area-fields");
        if (targetFieldElement.length) {
            var fieldCopy = targetFieldElement.data("field");
            if (fieldCopy) {
                field = this.getDataSource().field(fieldCopy.index) || fieldCopy
            }
        }
        if (targetGroupElement.length) {
            area = targetGroupElement.attr("group")
        }
        return {
            event: dxEvent,
            field: field,
            area: area,
            items: []
        }
    },
    _renderContextMenu: function() {
        var that = this,
            $container = that.$element();
        if (that._contextMenu) {
            that._contextMenu.$element().remove()
        }
        that._contextMenu = that._createComponent((0, _renderer2.default)(DIV).appendTo($container), _context_menu2.default, {
            onPositioning: function(actionArgs) {
                var args, event = actionArgs.event;
                if (!event) {
                    return
                }
                args = that._getContextMenuArgs(event);
                that._trigger("onContextMenuPreparing", args);
                if (args.items && args.items.length) {
                    actionArgs.component.option("items", args.items)
                } else {
                    actionArgs.cancel = true
                }
            },
            target: $container,
            onItemClick: function(params) {
                params.itemData.onItemClick && params.itemData.onItemClick(params)
            },
            cssClass: "dx-pivotgridfieldchooser-context-menu"
        })
    },
    _createTreeItems: function(fields, groupFieldNames, path) {
        var isMeasure, that = this,
            resultItems = [],
            groupedItems = [],
            groupFieldName = groupFieldNames[0],
            fieldsByGroup = {};
        if (!groupFieldName) {
            (0, _iterator.each)(fields, function(index, field) {
                var icon;
                if (true === field.isMeasure) {
                    icon = "measure"
                }
                if (false === field.isMeasure) {
                    icon = field.groupName ? "hierarchy" : "dimension"
                }
                resultItems.push({
                    index: field.index,
                    field: field,
                    key: field.dataField,
                    selected: (0, _type.isDefined)(field.area),
                    text: field.caption || field.dataField,
                    icon: icon,
                    isMeasure: field.isMeasure,
                    isDefault: field.isDefault
                })
            })
        } else {
            (0, _iterator.each)(fields, function(index, field) {
                var groupName = field[groupFieldName] || "";
                fieldsByGroup[groupName] = fieldsByGroup[groupName] || [];
                fieldsByGroup[groupName].push(field);
                if (void 0 === isMeasure) {
                    isMeasure = true
                }
                isMeasure = isMeasure && true === field.isMeasure
            });
            (0, _iterator.each)(fieldsByGroup, function(groupName, fields) {
                var currentPath = path ? path + "." + groupName : groupName;
                var items = that._createTreeItems(fields, groupFieldNames.slice(1), currentPath);
                if (groupName) {
                    groupedItems.push({
                        key: groupName,
                        text: groupName,
                        path: currentPath,
                        isMeasure: items.isMeasure,
                        expanded: (0, _array.inArray)(currentPath, that._expandedPaths) >= 0,
                        items: items
                    })
                } else {
                    resultItems = items
                }
            });
            resultItems = groupedItems.concat(resultItems);
            resultItems.isMeasure = isMeasure
        }
        return resultItems
    },
    _createFieldsDataSource: function(dataSource) {
        var treeItems, fields = dataSource && dataSource.fields() || [];
        fields = fields.filter(function(field) {
            return false !== field.visible && !(0, _type.isDefined)(field.groupIndex)
        });
        treeItems = this._createTreeItems(fields, ["dimension", "displayFolder"]);
        (0, _uiPivot_grid.foreachDataLevel)(treeItems, function(items) {
            items.sort(compareItems)
        }, 0, "items");
        return treeItems
    },
    _renderFieldsTreeView: function(container) {
        var that = this,
            dataSource = that._dataSource,
            treeView = that._createComponent(container, _tree_view2.default, {
                dataSource: that._createFieldsDataSource(dataSource),
                showCheckBoxesMode: "normal",
                searchEnabled: that.option("allowSearch"),
                searchTimeout: that.option("searchTimeout"),
                itemTemplate: function(itemData, itemIndex, itemElement) {
                    if (itemData.icon) {
                        (0, _icon.getImageContainer)(itemData.icon).appendTo(itemElement)
                    }(0, _renderer2.default)("<span>").toggleClass("dx-area-field", !itemData.items).data("field", itemData.field).text(itemData.text).appendTo(itemElement)
                },
                onItemCollapsed: function(e) {
                    var index = (0, _array.inArray)(e.itemData.path, that._expandedPaths);
                    if (index >= 0) {
                        that._expandedPaths.splice(index, 1)
                    }
                },
                onItemExpanded: function(e) {
                    var index = (0, _array.inArray)(e.itemData.path, that._expandedPaths);
                    if (index < 0) {
                        that._expandedPaths.push(e.itemData.path)
                    }
                },
                onItemSelectionChanged: function(e) {
                    var field, fields, area, data = e.itemData,
                        needSelectDefaultItem = true;
                    if (data.items) {
                        if (data.selected) {
                            treeView.unselectItem(data);
                            return
                        }
                        that._processDemandState(function() {
                            fields = getDimensionFields(data, dataSource.fields());
                            for (var i = 0; i < fields.length; i++) {
                                if (fields[i].area) {
                                    needSelectDefaultItem = false;
                                    break
                                }
                            }
                        });
                        if (needSelectDefaultItem) {
                            var item = getFirstItem(data, function(item) {
                                return item.isDefault
                            }) || getFirstItem(data, function(item) {
                                return (0, _type.isDefined)(item.index)
                            });
                            item && treeView.selectItem(item);
                            return
                        }
                    } else {
                        field = dataSource.fields()[data.index];
                        if (data.selected) {
                            area = field.isMeasure ? "data" : "column"
                        }
                        if (field) {
                            fields = [field]
                        }
                    }
                    that._applyChanges(fields, {
                        area: area,
                        areaIndex: void 0
                    })
                }
            }),
            dataChanged = function() {
                var scrollable = getScrollable(container),
                    scrollTop = scrollable ? scrollable.scrollTop() : 0;
                treeView.option({
                    dataSource: that._createFieldsDataSource(dataSource)
                });
                scrollable = getScrollable(container);
                if (scrollable) {
                    scrollable.scrollTo({
                        y: scrollTop
                    });
                    scrollable.update()
                }
            };
        that._dataChangedHandlers.push(dataChanged)
    },
    _renderAreaFields: function($container, area) {
        var that = this,
            dataSource = that._dataSource,
            fields = dataSource ? (0, _extend.extend)(true, [], dataSource.getAreaFields(area, true)) : [];
        $container.empty();
        (0, _iterator.each)(fields, function(_, field) {
            if (false !== field.visible) {
                that.renderField(field, true).appendTo($container)
            }
        })
    },
    _renderArea: function(container, area) {
        var $fieldsContainer, $fieldsContent, render, that = this,
            $areaContainer = (0, _renderer2.default)(DIV).addClass("dx-area").appendTo(container),
            $fieldsHeaderContainer = (0, _renderer2.default)(DIV).addClass("dx-area-fields-header").appendTo($areaContainer),
            caption = that.option("texts." + area + "Fields");
        (0, _renderer2.default)("<span>").addClass("dx-area-icon").addClass("dx-area-icon-" + area).appendTo($fieldsHeaderContainer);
        (0, _renderer2.default)("<span>").html("&nbsp;").appendTo($fieldsHeaderContainer);
        (0, _renderer2.default)("<span>").addClass("dx-area-caption").text(caption).appendTo($fieldsHeaderContainer);
        $fieldsContainer = (0, _renderer2.default)(DIV).addClass("dx-area-fields").addClass(AREA_DRAG_CLASS).appendTo($areaContainer);
        if ("all" !== area) {
            $fieldsContainer.attr("group", area).attr("allow-scrolling", true);
            $fieldsContent = (0, _renderer2.default)(DIV).addClass("dx-area-field-container").appendTo($fieldsContainer);
            render = function() {
                that._renderAreaFields($fieldsContent, area)
            };
            that._dataChangedHandlers.push(render);
            render();
            $fieldsContainer.dxScrollable()
        } else {
            $areaContainer.addClass("dx-all-fields");
            $fieldsContainer.addClass("dx-treeview-border-visible");
            that._renderFieldsTreeView($fieldsContainer)
        }
    },
    _getSortableOptions: function() {
        return {}
    },
    _adjustSortableOnChangedArgs: function() {},
    resetTreeView: function() {
        var treeView = this.$element().find(".dx-treeview").dxTreeView("instance");
        if (treeView) {
            treeView.option("searchValue", "");
            treeView.collapseAll()
        }
    },
    applyChanges: function() {
        var state = this.option("state");
        if ((0, _type.isDefined)(state)) {
            this._dataSource.state(state)
        }
    },
    cancelChanges: function() {
        this.option("state", this._dataSource.state())
    },
    getDataSource: function() {
        return this._dataSource
    },
    updateDimensions: function() {
        var $scrollableElements = this.$element().find(".dx-area .dx-scrollable");
        $scrollableElements.dxScrollable("update")
    },
    _visibilityChanged: function(visible) {
        if (visible && hasWindow) {
            this.updateDimensions()
        }
    }
});
(0, _component_registrator2.default)("dxPivotGridFieldChooser", FieldChooser);
module.exports = FieldChooser;
