/**
 * DevExtreme (ui/pivot_grid/ui.pivot_grid.fields_area.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _common = require("../../core/utils/common");
var _iterator = require("../../core/utils/iterator");
var _uiPivot_grid = require("./ui.pivot_grid.area_item");
var _uiPivot_grid2 = require("./ui.pivot_grid.utils");
var _popup = require("../popup");
var _popup2 = _interopRequireDefault(_popup);
var _button = require("../button");
var _button2 = _interopRequireDefault(_button);
require("./ui.pivot_grid.field_chooser_base");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var DIV = "<div>";
var AREA_DRAG_CLASS = "dx-pivotgrid-drag-action";

function renderGroupConnector(field, nextField, prevField, $container) {
    if (prevField && prevField.groupName && prevField.groupName === field.groupName) {
        (0, _renderer2.default)(DIV).addClass("dx-group-connector").addClass("dx-group-connector-prev").appendTo($container)
    }
    if (nextField && nextField.groupName && nextField.groupName === field.groupName) {
        (0, _renderer2.default)(DIV).addClass("dx-group-connector").addClass("dx-group-connector-next").appendTo($container)
    }
}
exports.FieldsArea = _uiPivot_grid.AreaItem.inherit({
    ctor: function(component, area) {
        this.callBase(component);
        this._area = area
    },
    _getAreaName: function() {
        return "fields"
    },
    _createGroupElement: function() {
        return (0, _renderer2.default)(DIV).addClass("dx-pivotgrid-fields-area").addClass("dx-area-fields").addClass(AREA_DRAG_CLASS).attr("group", this._area)
    },
    isVisible: function() {
        return !!this.option("fieldPanel.visible") && this.option("fieldPanel.show" + (0, _uiPivot_grid2.capitalizeFirstLetter)(this._area) + "Fields")
    },
    _renderButton: function(element) {
        var that = this,
            container = (0, _renderer2.default)("<td>").appendTo((0, _renderer2.default)("<tr>").appendTo(element)),
            button = that.component._createComponent((0, _renderer2.default)(DIV).appendTo(container), _button2.default, {
                text: "Fields",
                icon: "menu",
                width: "auto",
                onClick: function() {
                    var popup = that.tableElement().find(".dx-fields-area-popup").dxPopup("instance");
                    if (!popup.option("visible")) {
                        popup.show()
                    }
                }
            });
        button.$element().addClass("dx-pivotgrid-fields-area-hamburger")
    },
    _getPopupOptions: function(row, button) {
        return {
            contentTemplate: function() {
                return (0, _renderer2.default)("<table>").addClass("dx-area-field-container").append((0, _renderer2.default)("<thead>").addClass("dx-pivotgrid-fields-area-head").append(row))
            },
            height: "auto",
            width: "auto",
            position: {
                at: "left",
                my: "left",
                of: button
            },
            dragEnabled: false,
            animation: {
                show: {
                    type: "pop",
                    duration: 200
                }
            },
            shading: false,
            showTitle: false,
            closeOnOutsideClick: true,
            container: button.parent()
        }
    },
    _renderPopup: function(tableElement, row) {
        var that = this,
            button = tableElement.find(".dx-button"),
            popupOptions = that._getPopupOptions(row, button),
            FieldChooserBase = that.component.$element().dxPivotGridFieldChooserBase("instance");
        if (that._rowPopup) {
            that._rowPopup.$element().remove()
        }
        that._rowPopup = that.component._createComponent((0, _renderer2.default)(DIV).appendTo(tableElement), _popup2.default, popupOptions);
        that._rowPopup.$element().addClass("dx-fields-area-popup");
        that._rowPopup.content().addClass("dx-pivotgrid-fields-container");
        that._rowPopup.content().parent().attr("group", "row");
        FieldChooserBase.subscribeToEvents(that._rowPopup.content());
        FieldChooserBase.renderSortable(that._rowPopup.content())
    },
    _shouldCreateButton: function() {
        return false
    },
    _renderTableContent: function(tableElement, data) {
        var that = this,
            groupElement = this.groupElement(),
            isVisible = this.isVisible(),
            fieldChooserBase = that.component.$element().dxPivotGridFieldChooserBase("instance"),
            head = (0, _renderer2.default)("<thead>").addClass("dx-pivotgrid-fields-area-head").appendTo(tableElement),
            area = that._area,
            row = (0, _renderer2.default)("<tr>");
        groupElement.toggleClass("dx-hidden", !isVisible);
        tableElement.addClass("dx-area-field-container");
        if (!isVisible) {
            return
        }(0, _iterator.each)(data, function(index, field) {
            if (field.area === area && false !== field.visible) {
                var td = (0, _renderer2.default)("<td>").append(fieldChooserBase.renderField(field, "row" === field.area)),
                    indicators = td.find(".dx-column-indicators");
                if (indicators.length && that._shouldCreateButton()) {
                    indicators.insertAfter(indicators.next())
                }
                td.appendTo(row);
                renderGroupConnector(field, data[index + 1], data[index - 1], td)
            }
        });
        if (!row.children().length) {
            (0, _renderer2.default)("<td>").append((0, _renderer2.default)(DIV).addClass("dx-empty-area-text").text(this.option("fieldPanel.texts." + area + "FieldArea"))).appendTo(row)
        }
        if (that._shouldCreateButton()) {
            that._renderButton(head);
            that._renderPopup(tableElement, row)
        } else {
            head.append(row)
        }
    },
    reset: function() {
        this.callBase();
        this.groupElement().css("marginTop", 0)
    },
    _renderVirtualContent: _common.noop
});
