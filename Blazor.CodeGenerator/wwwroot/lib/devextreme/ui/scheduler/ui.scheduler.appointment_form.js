/**
 * DevExtreme (ui/scheduler/ui.scheduler.appointment_form.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _form = require("../form");
var _form2 = _interopRequireDefault(_form);
var _date_serialization = require("../../core/utils/date_serialization");
var _date_serialization2 = _interopRequireDefault(_date_serialization);
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _click = require("../../events/click");
var _click2 = _interopRequireDefault(_click);
var _type = require("../../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
require("./ui.scheduler.recurrence_editor");
require("./timezones/ui.scheduler.timezone_editor");
require("../text_area");
require("../tag_box");
require("../switch");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var RECURRENCE_EDITOR_ITEM_CLASS = "dx-scheduler-recurrence-rule-item";
var SCREEN_SIZE_OF_TOP_LABEL_LOCATION = 608;
var SCREEN_SIZE_OF_SINGLE_COLUMN = 460;
var SchedulerAppointmentForm = {
    _appointmentForm: {},
    _lockDateShiftFlag: false,
    _validateAppointmentFormDate: function(editor, value, previousValue) {
        var isCurrentDateCorrect = null === value || !!value;
        var isPreviousDateCorrect = null === previousValue || !!previousValue;
        if (!isCurrentDateCorrect && isPreviousDateCorrect) {
            editor.option("value", previousValue)
        }
    },
    _getAllDayStartDate: function(startDate) {
        return startDate.setHours(0, 0, 0, 0)
    },
    _getAllDayEndDate: function(startDate) {
        var endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        return endDate
    },
    _updateLabelLocation: function(formWidth) {
        var form = this._appointmentForm;
        if (form._initialized && form.isReady()) {
            form.option("labelLocation", formWidth < SCREEN_SIZE_OF_TOP_LABEL_LOCATION ? "top" : "left")
        }
    },
    create: function(componentCreator, $container, isReadOnly, formData) {
        var _this = this;
        this._appointmentForm = componentCreator($container, _form2.default, {
            items: this._editors,
            readOnly: isReadOnly,
            showValidationSummary: true,
            scrollingEnabled: true,
            formData: formData,
            colCount: 2,
            showColonAfterLabel: false,
            screenByWidth: function() {
                var formWidth = $container.parent().outerWidth();
                _this._updateLabelLocation(formWidth);
                return formWidth < SCREEN_SIZE_OF_SINGLE_COLUMN ? "xs" : "lg"
            }
        });
        return this._appointmentForm
    },
    prepareAppointmentFormEditors: function(allDay, dataExprs, schedulerInst) {
        var that = this;
        this._editors = [{
            dataField: dataExprs.textExpr,
            editorType: "dxTextBox",
            colSpan: 2,
            label: {
                text: _message2.default.format("dxScheduler-editorLabelTitle")
            }
        }, {
            dataField: dataExprs.startDateExpr,
            editorType: "dxDateBox",
            label: {
                text: _message2.default.format("dxScheduler-editorLabelStartDate")
            },
            validationRules: [{
                type: "required"
            }],
            editorOptions: {
                type: allDay ? "date" : "datetime",
                width: "100%",
                calendarOptions: {
                    firstDayOfWeek: schedulerInst.option("firstDayOfWeek")
                },
                onValueChanged: function(args) {
                    that._validateAppointmentFormDate(args.component, args.value, args.previousValue);
                    var value = _date_serialization2.default.deserializeDate(args.value),
                        previousValue = _date_serialization2.default.deserializeDate(args.previousValue),
                        endDateEditor = that._appointmentForm.getEditor(dataExprs.endDateExpr),
                        endValue = _date_serialization2.default.deserializeDate(endDateEditor.option("value"));
                    if (!that._appointmentForm._lockDateShiftFlag && _type2.default.isDefined(endValue) && _type2.default.isDefined(value) && !!endValue && endValue < value) {
                        var duration = endValue.getTime() - previousValue.getTime();
                        endDateEditor.option("value", new Date(value.getTime() + duration))
                    }
                }
            }
        }, {
            dataField: dataExprs.startDateTimeZoneExpr,
            editorType: "dxSchedulerTimezoneEditor",
            colSpan: 2,
            label: {
                text: " ",
                showColon: false
            },
            editorOptions: {
                observer: schedulerInst
            },
            visible: false
        }, {
            dataField: dataExprs.endDateExpr,
            editorType: "dxDateBox",
            label: {
                text: _message2.default.format("dxScheduler-editorLabelEndDate")
            },
            validationRules: [{
                type: "required"
            }],
            editorOptions: {
                type: allDay ? "date" : "datetime",
                width: "100%",
                calendarOptions: {
                    firstDayOfWeek: schedulerInst.option("firstDayOfWeek")
                },
                onValueChanged: function(args) {
                    that._validateAppointmentFormDate(args.component, args.value, args.previousValue);
                    var value = _date_serialization2.default.deserializeDate(args.value),
                        previousValue = _date_serialization2.default.deserializeDate(args.previousValue),
                        startDateEditor = that._appointmentForm.getEditor(dataExprs.startDateExpr),
                        startValue = _date_serialization2.default.deserializeDate(startDateEditor.option("value"));
                    if (!that._appointmentForm._lockDateShiftFlag && !!value && startValue > value) {
                        var duration = previousValue ? previousValue.getTime() - startValue.getTime() : 0;
                        startDateEditor.option("value", new Date(value.getTime() - duration))
                    }
                }
            }
        }, {
            dataField: dataExprs.endDateTimeZoneExpr,
            editorType: "dxSchedulerTimezoneEditor",
            colSpan: 2,
            label: {
                text: " ",
                showColon: false
            },
            editorOptions: {
                observer: schedulerInst
            },
            visible: false
        }, {
            dataField: dataExprs.allDayExpr,
            editorType: "dxSwitch",
            colSpan: 2,
            label: {
                text: _message2.default.format("dxScheduler-allDay")
            },
            editorOptions: {
                onValueChanged: function(args) {
                    var value = args.value,
                        startDateEditor = that._appointmentForm.getEditor(dataExprs.startDateExpr),
                        endDateEditor = that._appointmentForm.getEditor(dataExprs.endDateExpr);
                    if (startDateEditor && endDateEditor) {
                        startDateEditor.option("type", value ? "date" : "datetime");
                        endDateEditor.option("type", value ? "date" : "datetime");
                        if (!startDateEditor.option("value")) {
                            return
                        }
                        var startDate = _date_serialization2.default.deserializeDate(startDateEditor.option("value"));
                        if (value) {
                            startDateEditor.option("value", that._getAllDayStartDate(startDate));
                            endDateEditor.option("value", that._getAllDayEndDate(startDate))
                        } else {
                            startDate.setHours(schedulerInst.option("startDayHour"));
                            startDateEditor.option("value", startDate);
                            endDateEditor.option("value", schedulerInst._workSpace.calculateEndDate(_date_serialization2.default.deserializeDate(startDateEditor.option("value"))))
                        }
                    }
                }
            }
        }, {
            itemType: "empty",
            colSpan: 2
        }, {
            dataField: dataExprs.descriptionExpr,
            editorType: "dxTextArea",
            colSpan: 2,
            label: {
                text: _message2.default.format("dxScheduler-editorLabelDescription")
            }
        }, {
            itemType: "empty",
            colSpan: 2
        }, {
            dataField: dataExprs.recurrenceRuleExpr,
            editorType: "dxRecurrenceEditor",
            colSpan: 2,
            editorOptions: {
                observer: schedulerInst,
                firstDayOfWeek: schedulerInst.option("firstDayOfWeek"),
                onValueChanged: function(args) {
                    var value = that._getRecurrenceRule(schedulerInst, that._appointmentForm);
                    schedulerInst.fire("recurrenceEditorVisibilityChanged", value)
                },
                onContentReady: function(args) {
                    var $editorField = (0, _renderer2.default)(args.element).closest(".dx-field-item"),
                        $editorLabel = $editorField.find(".dx-field-item-label");
                    _events_engine2.default.off($editorLabel, _click2.default.name);
                    _events_engine2.default.on($editorLabel, _click2.default.name, function() {
                        args.component.toggle()
                    })
                }
            },
            cssClass: RECURRENCE_EDITOR_ITEM_CLASS,
            label: {
                text: _message2.default.format("dxScheduler-editorLabelRecurrence")
            }
        }];
        if (!dataExprs.recurrenceRuleExpr) {
            this._editors.splice(9, 2)
        }
        return this._editors
    },
    _getRecurrenceRule: function(schedulerInstance, appointmentForm) {
        return !_type2.default.isEmptyObject(appointmentForm) ? !!schedulerInstance.fire("getField", "recurrenceRule", appointmentForm.option("formData")) : false
    },
    concatResources: function(resources) {
        this._editors = this._editors.concat(resources)
    },
    checkEditorsType: function(form, startDateExpr, endDateExpr, allDay) {
        var startDateFormItem = form.itemOption(startDateExpr),
            endDateFormItem = form.itemOption(endDateExpr);
        if (startDateFormItem && endDateFormItem) {
            var startDateEditorOptions = startDateFormItem.editorOptions,
                endDateEditorOptions = endDateFormItem.editorOptions;
            if (allDay) {
                startDateEditorOptions.type = endDateEditorOptions.type = "date"
            } else {
                startDateEditorOptions.type = endDateEditorOptions.type = "datetime"
            }
            form.itemOption(startDateExpr, "editorOptions", startDateEditorOptions);
            form.itemOption(endDateExpr, "editorOptions", endDateEditorOptions)
        }
    },
    updateFormData: function(appointmentForm, formData) {
        appointmentForm._lockDateShiftFlag = true;
        appointmentForm.option("formData", formData);
        appointmentForm._lockDateShiftFlag = false
    }
};
module.exports = SchedulerAppointmentForm;
