/**
 * DevExtreme (ui/scheduler/ui.scheduler.recurrence_editor.js)
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
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _guid = require("../../core/guid");
var _guid2 = _interopRequireDefault(_guid);
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _utils = require("./utils.recurrence");
var _utils2 = _interopRequireDefault(_utils);
var _dom = require("../../core/utils/dom");
var _dom2 = _interopRequireDefault(_dom);
var _type = require("../../core/utils/type");
var _extend = require("../../core/utils/extend");
var _array = require("../../core/utils/array");
var _iterator = require("../../core/utils/iterator");
var _editor = require("../editor/editor");
var _editor2 = _interopRequireDefault(_editor);
var _check_box = require("../check_box");
var _check_box2 = _interopRequireDefault(_check_box);
var _radio_group = require("../radio_group");
var _radio_group2 = _interopRequireDefault(_radio_group);
var _number_box = require("../number_box");
var _number_box2 = _interopRequireDefault(_number_box);
var _select_box = require("../select_box");
var _select_box2 = _interopRequireDefault(_select_box);
var _date_box = require("../date_box");
var _date_box2 = _interopRequireDefault(_date_box);
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _date = require("../../localization/date");
var _date2 = _interopRequireDefault(_date);
var _date3 = require("../../core/utils/date");
var _date4 = _interopRequireDefault(_date3);
var _uiScheduler = require("./ui.scheduler.publisher_mixin");
var _uiScheduler2 = _interopRequireDefault(_uiScheduler);

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
var RECURRENCE_EDITOR = "dx-recurrence-editor";
var LABEL_POSTFIX = "-label";
var WRAPPER_POSTFIX = "-wrapper";
var RECURRENCE_EDITOR_CONTAINER = "dx-recurrence-editor-container";
var FREQUENCY_EDITOR = "dx-recurrence-selectbox-freq";
var INTERVAL_EDITOR = "dx-recurrence-numberbox-interval";
var INTERVAL_EDITOR_FIELD = "dx-recurrence-interval-field";
var REPEAT_END_EDITOR = "dx-recurrence-repeat-end";
var REPEAT_END_EDITOR_CONTAINER = "dx-recurrence-repeat-end-container";
var REPEAT_TYPE_EDITOR = "dx-recurrence-radiogroup-repeat-type";
var REPEAT_COUNT_EDITOR = "dx-recurrence-numberbox-repeat-count";
var REPEAT_UNTIL_DATE_EDITOR = "dx-recurrence-datebox-until-date";
var REPEAT_ON_EDITOR = "dx-recurrence-repeat-on";
var REPEAT_ON_WEEK_EDITOR = "dx-recurrence-repeat-on-week";
var DAY_OF_WEEK = "dx-recurrence-checkbox-day-of-week";
var REPEAT_ON_MONTH_EDITOR = "dx-recurrence-repeat-on-month";
var DAY_OF_MONTH = "dx-recurrence-numberbox-day-of-month";
var REPEAT_ON_YEAR_EDITOR = "dx-recurrence-repeat-on-year";
var MONTH_OF_YEAR = "dx-recurrence-selectbox-month-of-year";
var FIELD_CLASS = "dx-field";
var RECURRENCE_FREQ_FIELD = "dx-recurrence-freq-field";
var FIELD_LABEL_CLASS = "dx-field-label";
var FIELD_VALUE_CLASS = "dx-field-value";
var frequencies = [{
    text: function() {
        return _message2.default.format("dxScheduler-recurrenceNever")
    },
    value: "never"
}, {
    text: function() {
        return _message2.default.format("dxScheduler-recurrenceDaily")
    },
    value: "daily"
}, {
    text: function() {
        return _message2.default.format("dxScheduler-recurrenceWeekly")
    },
    value: "weekly"
}, {
    text: function() {
        return _message2.default.format("dxScheduler-recurrenceMonthly")
    },
    value: "monthly"
}, {
    text: function() {
        return _message2.default.format("dxScheduler-recurrenceYearly")
    },
    value: "yearly"
}];
var repeatEndTypes = [{
    text: function() {
        return _message2.default.format("dxScheduler-recurrenceNever")
    },
    value: "never"
}, {
    text: function() {
        return _message2.default.format("dxScheduler-recurrenceRepeatOnDate")
    },
    value: "until"
}, {
    text: function() {
        return _message2.default.format("dxScheduler-recurrenceRepeatCount")
    },
    value: "count"
}];
var days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
var RecurrenceRule = function() {
    function RecurrenceRule(recurrence) {
        _classCallCheck(this, RecurrenceRule);
        this._recurrenceRule = _utils2.default.getRecurrenceRule(recurrence).rule
    }
    _createClass(RecurrenceRule, [{
        key: "makeRules",
        value: function(string) {
            this._recurrenceRule = _utils2.default.getRecurrenceRule(string).rule
        }
    }, {
        key: "makeRule",
        value: function(field, value) {
            if (!value) {
                delete this._recurrenceRule[field];
                return
            }
            if ((0, _type.isDefined)(field)) {
                if ("until" === field) {
                    delete this._recurrenceRule.count
                }
                if ("count" === field) {
                    delete this._recurrenceRule.until
                }
                this._recurrenceRule[field] = value
            }
        }
    }, {
        key: "repeatableRule",
        value: function() {
            var rules = this._recurrenceRule;
            if ("count" in rules) {
                return "count"
            }
            if ("until" in rules) {
                return "until"
            }
            return null
        }
    }, {
        key: "recurrenceString",
        value: function() {
            return _utils2.default.getRecurrenceString(this._recurrenceRule)
        }
    }, {
        key: "rules",
        value: function() {
            return this._recurrenceRule
        }
    }, {
        key: "daysFromByDayRule",
        value: function() {
            return _utils2.default.daysFromByDayRule(this._recurrenceRule)
        }
    }]);
    return RecurrenceRule
}();
var RecurrenceEditor = _editor2.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            value: null,
            startDate: new Date,
            firstDayOfWeek: void 0
        })
    },
    _getFirstDayOfWeek: function() {
        return (0, _type.isDefined)(this.option("firstDayOfWeek")) ? this.option("firstDayOfWeek") : _date2.default.firstDayOfWeekIndex()
    },
    _createComponent: function(element, name) {
        var config = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        this._extendConfig(config, {
            readOnly: this.option("readOnly")
        });
        return this.callBase(element, name, config)
    },
    _init: function() {
        this.callBase();
        this._recurrenceRule = new RecurrenceRule(this.option("value"))
    },
    _render: function() {
        this.callBase();
        this.$element().addClass(RECURRENCE_EDITOR);
        this._$container = (0, _renderer2.default)("<div>").addClass(RECURRENCE_EDITOR_CONTAINER).appendTo(this.$element());
        this._renderEditors();
        this._renderContainerVisibility(this.option("value"))
    },
    _renderContainerVisibility: function(value) {
        if (value) {
            this._$container.show();
            _dom2.default.triggerShownEvent(this._$container)
        } else {
            this._$container.hide()
        }
    },
    _changeValueByVisibility: function(value) {
        this._renderContainerVisibility(value);
        if (value) {
            if (!this.option("value")) {
                this._handleDefaults()
            }
        } else {
            this._recurrenceRule.makeRules("");
            this.option("value", "")
        }
    },
    _handleDefaults: function() {
        this._recurrenceRule.makeRule("freq", "daily");
        this._changeEditorValue()
    },
    _changeEditorValue: function() {
        this.option("value", this._recurrenceRule.recurrenceString() || "")
    },
    _renderEditors: function() {
        this._renderFreqEditor();
        this._renderIntervalEditor();
        this._renderRepeatOnEditor();
        this._renderRepeatEndEditor()
    },
    _renderFreqEditor: function() {
        var _this = this;
        var freq = (this._recurrenceRule.rules().freq || "never").toLowerCase();
        var $freqEditor = (0, _renderer2.default)("<div>").addClass(FREQUENCY_EDITOR).addClass(FIELD_VALUE_CLASS);
        this._freqEditor = this._createComponent($freqEditor, _select_box2.default, {
            field: "freq",
            items: frequencies,
            value: freq,
            valueExpr: "value",
            displayExpr: "text",
            layout: "horizontal",
            onValueChanged: function(args) {
                _this._valueChangedHandler(args);
                _this.invoke("resizePopup")
            }
        });
        var $field = (0, _renderer2.default)("<div>").addClass(FIELD_CLASS).addClass(RECURRENCE_FREQ_FIELD).append($freqEditor);
        this.$element().prepend($field)
    },
    _renderIntervalEditor: function() {
        var freq = this._recurrenceRule.rules().freq || "daily";
        var $intervalEditor = (0, _renderer2.default)("<div>").addClass(INTERVAL_EDITOR).addClass(FIELD_VALUE_CLASS);
        var $intervalEditorLabel = (0, _renderer2.default)("<div>").text(_message2.default.format("dxScheduler-recurrenceRepeatEvery")).addClass(INTERVAL_EDITOR + LABEL_POSTFIX).addClass(FIELD_LABEL_CLASS);
        this._$intervalTypeLabel = (0, _renderer2.default)("<div>").text(_message2.default.format("dxScheduler-recurrenceRepeat" + freq.charAt(0).toUpperCase() + freq.substr(1).toLowerCase())).addClass(REPEAT_TYPE_EDITOR + LABEL_POSTFIX);
        var interval = this._recurrenceRule.rules().interval || 1;
        this._intervalEditor = this._createComponent($intervalEditor, _number_box2.default, {
            field: "interval",
            min: 1,
            value: interval,
            showSpinButtons: true,
            useLargeSpinButtons: false,
            onValueChanged: this._valueChangedHandler.bind(this)
        });
        var $field = (0, _renderer2.default)("<div>").addClass(FIELD_CLASS).addClass(INTERVAL_EDITOR_FIELD).append($intervalEditorLabel, $intervalEditor, this._$intervalTypeLabel);
        this._$container.append($field);
        this._setAriaDescribedBy(this._intervalEditor, $intervalEditorLabel)
    },
    _renderRepeatOnEditor: function() {
        var freq = (this._recurrenceRule.rules().freq || "").toLowerCase();
        if (!(0, _type.isDefined)(this._$repeatOnEditor)) {
            this._$repeatOnEditor = (0, _renderer2.default)("<div>").addClass(REPEAT_ON_EDITOR).addClass(FIELD_CLASS).appendTo(this._$container)
        }
        if (!freq || "daily" === freq) {
            this._clearRepeatOnEditor();
            this._clearRepeatOnLabel();
            return
        }
        if (!(0, _type.isDefined)(this._$repeatOnLabel)) {
            this._renderRepeatOnLabel(this._$repeatOnEditor)
        }
        if ("weekly" === freq && !this._$repeatOnWeek) {
            this._renderRepeatOnWeekEditor();
            return
        }
        if ("monthly" === freq && !this._$repeatOnMonth) {
            this._renderRepeatOnMonthEditor();
            return
        }
        if ("yearly" === freq && !this._$repeatOnYear) {
            this._renderRepeatOnYearEditor();
            return
        }
    },
    _renderRepeatOnLabel: function($element) {
        this._$repeatOnLabel = (0, _renderer2.default)("<div>").text(_message2.default.format("dxScheduler-recurrenceRepeatOn")).addClass(REPEAT_ON_EDITOR + LABEL_POSTFIX).addClass(FIELD_LABEL_CLASS);
        $element.append(this._$repeatOnLabel)
    },
    _clearRepeatOnEditor: function() {
        if ((0, _type.isDefined)(this._$repeatOnWeek)) {
            this._$repeatOnWeek.detach();
            this._$repeatOnWeek.remove();
            delete this._$repeatOnWeek
        }
        if ((0, _type.isDefined)(this._$repeatOnMonth)) {
            this._$repeatOnMonth.detach();
            this._$repeatOnMonth.remove();
            delete this._$repeatOnMonth
        }
        if ((0, _type.isDefined)(this._$repeatOnYear)) {
            this._$repeatOnYear.detach();
            this._$repeatOnYear.remove();
            delete this._$repeatOnYear
        }
    },
    _clearRepeatOnLabel: function() {
        if ((0, _type.isDefined)(this._$repeatOnLabel)) {
            this._$repeatOnLabel.detach();
            this._$repeatOnLabel.remove();
            delete this._$repeatOnLabel
        }
    },
    _renderRepeatOnWeekEditor: function() {
        this._clearRepeatOnEditor();
        this._$repeatOnWeek = (0, _renderer2.default)("<div>").addClass(REPEAT_ON_WEEK_EDITOR).addClass(FIELD_VALUE_CLASS).appendTo(this._$repeatOnEditor);
        var localDaysNames = _date2.default.getDayNames("short");
        var daysFromRules = this._daysOfWeekByRules();
        this._daysOfWeek = [];
        for (var i = 0; i < 7; i++) {
            var daysOffset = this._getFirstDayOfWeek() + i;
            var dayIndex = daysOffset % 7;
            var checkBoxText = localDaysNames[dayIndex].toUpperCase();
            var dayName = days[dayIndex];
            var $day = (0, _renderer2.default)("<div>").addClass(DAY_OF_WEEK);
            var day = this._createComponent($day, _check_box2.default, {
                text: checkBoxText,
                value: (0, _array.inArray)(dayName, daysFromRules) > -1 ? true : false,
                onValueChanged: this._repeatByDayValueChangeHandler.bind(this)
            });
            this._daysOfWeek[dayIndex] = day;
            this._$repeatOnWeek.append($day)
        }
    },
    _daysOfWeekByRules: function() {
        var daysByRule = this._recurrenceRule.daysFromByDayRule();
        if (!daysByRule.length) {
            daysByRule = [days[this.option("startDate").getDay()]]
        }
        return daysByRule
    },
    _repeatByDayValueChangeHandler: function() {
        var byDayRule = "";
        (0, _iterator.each)(this._daysOfWeek, function(index, day) {
            if (day.option("value")) {
                var dayName = days[index];
                if (!byDayRule) {
                    byDayRule = dayName
                } else {
                    byDayRule = byDayRule + "," + dayName
                }
            }
        });
        this._recurrenceRule.makeRule("byday", byDayRule);
        this._changeEditorValue()
    },
    _renderRepeatOnMonthEditor: function() {
        this._clearRepeatOnEditor();
        this._$repeatOnMonth = (0, _renderer2.default)("<div>").addClass(REPEAT_ON_MONTH_EDITOR).addClass(FIELD_VALUE_CLASS).appendTo(this._$repeatOnEditor);
        this._renderDayOfMonthEditor(this._$repeatOnMonth)
    },
    _renderRepeatOnYearEditor: function() {
        this._clearRepeatOnEditor();
        this._$repeatOnYear = (0, _renderer2.default)("<div>").addClass(REPEAT_ON_YEAR_EDITOR).addClass(FIELD_VALUE_CLASS).appendTo(this._$repeatOnEditor);
        var months = [];
        var monthsNames = _date2.default.getMonthNames("wide");
        for (var i = 0; i < 12; i++) {
            months[i] = {
                value: String(i + 1),
                text: monthsNames[i]
            }
        }
        var byMonth = this._monthOfYearByRules();
        var $monthOfYear = (0, _renderer2.default)("<div>").addClass(MONTH_OF_YEAR).appendTo(this._$repeatOnYear);
        var monthChanged = function(args) {
            this._valueChangedHandler.call(this, args);
            var monthValue = parseInt(args.component.option("value"));
            if (this._dayEditor && monthValue) {
                var maxAllowedDay = new Date((new Date).getFullYear(), parseInt(monthValue), 0).getDate();
                if (2 === monthValue) {
                    maxAllowedDay = 29
                }
                this._dayEditor.option("max", maxAllowedDay)
            }
        };
        this._monthEditor = this._createComponent($monthOfYear, _select_box2.default, {
            field: "bymonth",
            items: months,
            value: byMonth,
            displayExpr: "text",
            valueExpr: "value",
            onValueChanged: monthChanged.bind(this)
        });
        this._renderDayOfMonthEditor(this._$repeatOnYear)
    },
    _monthOfYearByRules: function() {
        var monthByRule = this._recurrenceRule.rules().bymonth;
        if (!monthByRule) {
            monthByRule = this.option("startDate").getMonth() + 1
        }
        return monthByRule
    },
    _renderDayOfMonthEditor: function($element) {
        var byMonthDay = this._dayOfMonthByRules();
        var $dayEditor = (0, _renderer2.default)("<div>").addClass(DAY_OF_MONTH);
        this._dayEditor = this._createComponent($dayEditor, _number_box2.default, {
            field: "bymonthday",
            min: 1,
            max: 31,
            showSpinButtons: true,
            useLargeSpinButtons: false,
            value: byMonthDay,
            onValueChanged: this._valueChangedHandler.bind(this)
        });
        $element.append($dayEditor)
    },
    _dayOfMonthByRules: function() {
        var dayByRule = this._recurrenceRule.rules().bymonthday;
        if (!dayByRule) {
            dayByRule = this.option("startDate").getDate()
        }
        return dayByRule
    },
    _setAriaDescribedBy: function(editor, $label) {
        var labelId = "label-" + new _guid2.default;
        editor.setAria("describedby", labelId);
        editor.setAria("id", labelId, $label)
    },
    _repeatEndSwitchValueChangeHandler: function(args) {
        var value = args.value;
        this._renderRepeatEndVisibility(value);
        if (!this._recurrenceRule.rules().count && !this._recurrenceRule.rules().until && value) {
            this._handleRepeatEndDefaults()
        } else {
            if (!value) {
                this._recurrenceRule.makeRule("count", "");
                this._recurrenceRule.makeRule("until", "");
                this._changeEditorValue()
            }
        }
    },
    _renderRepeatEndVisibility: function(value) {
        if (!value) {
            this._$repeatEndEditor.hide()
        } else {
            this._$repeatEndEditor.show()
        }
    },
    _handleRepeatEndDefaults: function() {
        this._recurrenceRule.makeRule("count", 1);
        this._changeEditorValue()
    },
    _renderRepeatEndEditor: function(rule) {
        rule = (0, _type.isDefined)(rule) ? rule : this._recurrenceRule.repeatableRule();
        if (!rule) {
            rule = "count"
        }
        if (!(0, _type.isDefined)(this._$repeatEndEditor)) {
            (0, _renderer2.default)("<div>").text(_message2.default.format("dxScheduler-recurrenceEnd")).addClass(REPEAT_END_EDITOR_CONTAINER + LABEL_POSTFIX).addClass(FIELD_LABEL_CLASS).appendTo(this._$container);
            this._$repeatEndEditor = (0, _renderer2.default)("<div>").addClass(REPEAT_END_EDITOR_CONTAINER).addClass(FIELD_CLASS).appendTo(this._$container);
            this._renderRepeatEndTypeEditor()
        }
    },
    _renderRepeatEndTypeEditor: function() {
        var _this2 = this;
        var repeatType = this._recurrenceRule.repeatableRule() || "never";
        this._$repeatTypeEditor = (0, _renderer2.default)("<div>").addClass(REPEAT_TYPE_EDITOR).addClass(FIELD_VALUE_CLASS).appendTo(this._$repeatEndEditor);
        this._repeatTypeEditor = this._createComponent(this._$repeatTypeEditor, _radio_group2.default, {
            items: repeatEndTypes,
            value: repeatType,
            displayExpr: "text",
            valueExpr: "value",
            itemTemplate: function(itemData) {
                if ("count" === itemData.value) {
                    return _this2._renderRepeatCountEditor()
                }
                if ("until" === itemData.value) {
                    return _this2._renderRepeatUntilEditor()
                }
                return _this2._renderDefaultRepeatEnd()
            },
            layout: "vertical",
            onValueChanged: this._repeatTypeValueChangedHandler.bind(this)
        });
        this._disableRepeatEndParts(repeatType)
    },
    _renderDefaultRepeatEnd: function() {
        var $editorTemplate = (0, _renderer2.default)("<div>").addClass(REPEAT_END_EDITOR + WRAPPER_POSTFIX);
        (0, _renderer2.default)("<div>").text(_message2.default.format("dxScheduler-recurrenceNever")).addClass(REPEAT_END_EDITOR + LABEL_POSTFIX).appendTo($editorTemplate);
        return $editorTemplate
    },
    _repeatTypeValueChangedHandler: function(args) {
        var value = args.value;
        this._disableRepeatEndParts(value);
        if ("until" === value) {
            this._recurrenceRule.makeRule(value, this._getUntilValue())
        }
        if ("count" === value) {
            this._recurrenceRule.makeRule(value, this._repeatCountEditor.option("value"))
        }
        if ("never" === value) {
            this._recurrenceRule.makeRule("count", "");
            this._recurrenceRule.makeRule("until", "")
        }
        this._changeEditorValue()
    },
    _disableRepeatEndParts: function(value) {
        if ("until" === value) {
            this._repeatCountEditor.option("disabled", true);
            this._repeatUntilDate.option("disabled", false)
        }
        if ("count" === value) {
            this._repeatCountEditor.option("disabled", false);
            this._repeatUntilDate.option("disabled", true)
        }
        if ("never" === value) {
            this._repeatCountEditor.option("disabled", true);
            this._repeatUntilDate.option("disabled", true)
        }
    },
    _renderRepeatCountEditor: function() {
        var repeatCount = this._recurrenceRule.rules().count || 1;
        var $editorTemplate = (0, _renderer2.default)("<div>").addClass(REPEAT_END_EDITOR + WRAPPER_POSTFIX);
        (0, _renderer2.default)("<div>").text(_message2.default.format("dxScheduler-recurrenceAfter")).addClass(REPEAT_END_EDITOR + LABEL_POSTFIX).appendTo($editorTemplate);
        this._$repeatCountEditor = (0, _renderer2.default)("<div>").addClass(REPEAT_COUNT_EDITOR).addClass(FIELD_VALUE_CLASS).appendTo($editorTemplate);
        (0, _renderer2.default)("<div>").text(_message2.default.format("dxScheduler-recurrenceRepeatCount")).addClass(REPEAT_END_EDITOR + LABEL_POSTFIX).appendTo($editorTemplate);
        this._repeatCountEditor = this._createComponent(this._$repeatCountEditor, _number_box2.default, {
            field: "count",
            min: 1,
            showSpinButtons: true,
            useLargeSpinButtons: false,
            value: repeatCount,
            onValueChanged: this._repeatCountValueChangeHandler.bind(this)
        });
        return $editorTemplate
    },
    _repeatCountValueChangeHandler: function(args) {
        if ("count" !== this._recurrenceRule.repeatableRule()) {
            return
        }
        var value = args.value;
        this._recurrenceRule.makeRule("count", value);
        this._changeEditorValue()
    },
    _formatUntilDate: function(date) {
        if (this._recurrenceRule.rules().until && _date4.default.sameDate(this._recurrenceRule.rules().until, date)) {
            return date
        }
        return _date4.default.setToDayEnd(date)
    },
    _renderRepeatUntilEditor: function() {
        var repeatUntil = this._recurrenceRule.rules().until || this._formatUntilDate(new Date);
        var $editorTemplate = (0, _renderer2.default)("<div>").addClass(REPEAT_END_EDITOR + WRAPPER_POSTFIX);
        (0, _renderer2.default)("<div>").text(_message2.default.format("dxScheduler-recurrenceOn")).addClass(REPEAT_END_EDITOR + LABEL_POSTFIX).appendTo($editorTemplate);
        this._$repeatDateEditor = (0, _renderer2.default)("<div>").addClass(REPEAT_UNTIL_DATE_EDITOR).addClass(FIELD_VALUE_CLASS).appendTo($editorTemplate);
        this._repeatUntilDate = this._createComponent(this._$repeatDateEditor, _date_box2.default, {
            field: "until",
            value: repeatUntil,
            type: "date",
            onValueChanged: this._repeatUntilValueChangeHandler.bind(this),
            calendarOptions: {
                firstDayOfWeek: this._getFirstDayOfWeek()
            }
        });
        return $editorTemplate
    },
    _repeatUntilValueChangeHandler: function(args) {
        if ("until" !== this._recurrenceRule.repeatableRule()) {
            return
        }
        var untilDate = this._formatUntilDate(new Date(args.value));
        this._repeatUntilDate.option("value", untilDate);
        this._recurrenceRule.makeRule("until", untilDate);
        this._changeEditorValue()
    },
    _valueChangedHandler: function(args) {
        var value = args.component.option("value");
        var field = args.component.option("field");
        var visible = true;
        if ("freq" === field && "never" === value) {
            visible = false;
            this.option("value", "")
        } else {
            this._recurrenceRule.makeRule(field, value);
            this._makeRepeatOnRule(field, value);
            this._changeEditorValue()
        }
        this._renderContainerVisibility(visible)
    },
    _makeRepeatOnRule: function(field, value) {
        if ("freq" !== field) {
            return
        }
        if ("daily" === value) {
            this._recurrenceRule.makeRule("byday", "");
            this._recurrenceRule.makeRule("bymonth", "");
            this._recurrenceRule.makeRule("bymonthday", "")
        }
        if ("weekly" === value) {
            this._recurrenceRule.makeRule("byday", this._daysOfWeekByRules());
            this._recurrenceRule.makeRule("bymonth", "");
            this._recurrenceRule.makeRule("bymonthday", "")
        }
        if ("monthly" === value) {
            this._recurrenceRule.makeRule("bymonthday", this._dayOfMonthByRules());
            this._recurrenceRule.makeRule("bymonth", "");
            this._recurrenceRule.makeRule("byday", "")
        }
        if ("yearly" === value) {
            this._recurrenceRule.makeRule("bymonthday", this._dayOfMonthByRules());
            this._recurrenceRule.makeRule("bymonth", this._monthOfYearByRules());
            this._recurrenceRule.makeRule("byday", "")
        }
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "value":
                this._recurrenceRule.makeRules(args.value);
                this._repeatTypeEditor.option("value", this._recurrenceRule.repeatableRule() || "never");
                this._renderRepeatEndEditor();
                this._renderRepeatOnEditor();
                this._changeEditorsValues(this._recurrenceRule.rules());
                this.callBase(args);
                break;
            case "startDate":
                this._clearRepeatOnEditor();
                this._renderRepeatOnEditor();
                this._makeRepeatOnRule("freq", this._recurrenceRule.rules().freq);
                if ((0, _type.isDefined)(this._recurrenceRule.recurrenceString())) {
                    this._changeEditorValue()
                }
                break;
            case "firstDayOfWeek":
                this._clearRepeatOnEditor();
                this._renderRepeatOnEditor();
                if (this._$repeatDateEditor) {
                    this._repeatUntilDate.option("calendarOptions.firstDayOfWeek", this._getFirstDayOfWeek())
                }
                break;
            case "visible":
                this._changeValueByVisibility(args.value);
                this.callBase(args);
                break;
            default:
                this.callBase(args)
        }
    },
    _changeEditorsValues: function(rules) {
        this._changeCheckBoxesValue(!!rules.byday);
        this._freqEditor.option("value", (rules.freq || "never").toLowerCase());
        this._changeRepeatTypeLabel();
        this._intervalEditor.option("value", rules.interval);
        this._changeRepeatCountValue();
        this._changeRepeatUntilValue();
        this._changeDayOfMonthValue();
        this._changeMonthOfYearValue()
    },
    _changeRepeatTypeLabel: function() {
        var $labels = this.$element().find("." + REPEAT_TYPE_EDITOR + LABEL_POSTFIX);
        if (!$labels.length) {
            return
        }
        var freq = this._recurrenceRule.rules().freq || "daily";
        (0, _iterator.each)($labels, function(_, $label) {
            (0, _renderer2.default)($label).text(_message2.default.format("dxScheduler-recurrenceRepeat" + freq.charAt(0).toUpperCase() + freq.substr(1).toLowerCase()))
        })
    },
    _changeRepeatCountValue: function() {
        if (!this._$repeatCountEditor) {
            return
        }
        var count = this._recurrenceRule.rules().count || 1;
        this._repeatCountEditor.option("value", count)
    },
    _changeRepeatUntilValue: function() {
        if (!this._$repeatDateEditor) {
            return
        }
        this._repeatUntilDate.option("value", this._getUntilValue())
    },
    _getUntilValue: function() {
        return this._recurrenceRule.rules().until || this._formatUntilDate(new Date)
    },
    _changeCheckBoxesValue: function(byDayChanged) {
        if (!this._$repeatOnWeek || !byDayChanged) {
            return
        }
        var daysByRule = this._daysOfWeekByRules();
        (0, _iterator.each)(this._daysOfWeek, function(index, day) {
            var dayName = days[index];
            day.option("value", (0, _array.inArray)(dayName, daysByRule) > -1)
        })
    },
    _changeDayOfMonthValue: function() {
        if (!this._$repeatOnMonth && !this._$repeatOnYear) {
            return
        }
        var day = this._dayOfMonthByRules() || 1;
        this._dayEditor.option("value", day)
    },
    _changeMonthOfYearValue: function() {
        if (!this._$repeatOnYear) {
            return
        }
        var month = this._monthOfYearByRules() || 1;
        this._monthEditor.option("value", month)
    },
    toggle: function() {
        this._freqEditor.focus()
    },
    setAria: function() {
        if (this._switchEditor) {
            this._switchEditor.setAria(arguments.length <= 0 ? void 0 : arguments[0], arguments.length <= 1 ? void 0 : arguments[1])
        }
    }
}).include(_uiScheduler2.default);
(0, _component_registrator2.default)("dxRecurrenceEditor", RecurrenceEditor);
module.exports = RecurrenceEditor;
