/**
 * DevExtreme (ui/scheduler/ui.scheduler.appointment_model.js)
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
var _config = require("../../core/config");
var _config2 = _interopRequireDefault(_config);
var _iterator = require("../../core/utils/iterator");
var _iterator2 = _interopRequireDefault(_iterator);
var _date_serialization = require("../../core/utils/date_serialization");
var _date_serialization2 = _interopRequireDefault(_date_serialization);
var _utils = require("./utils.recurrence");
var _utils2 = _interopRequireDefault(_utils);
var _date = require("../../core/utils/date");
var _date2 = _interopRequireDefault(_date);
var _common = require("../../core/utils/common");
var _common2 = _interopRequireDefault(_common);
var _type = require("../../core/utils/type");
var _type2 = _interopRequireDefault(_type);
var _array = require("../../core/utils/array");
var _array2 = _interopRequireDefault(_array);
var _extend = require("../../core/utils/extend");
var _query = require("../../data/query");
var _query2 = _interopRequireDefault(_query);

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
var toMs = _date2.default.dateToMilliseconds;
var DATE_FILTER_POSITION = 0,
    USER_FILTER_POSITION = 1;
var FilterMaker = function() {
    function FilterMaker(dataAccessors) {
        _classCallCheck(this, FilterMaker);
        this._filterRegistry = null;
        this._dataAccessors = dataAccessors
    }
    _createClass(FilterMaker, [{
        key: "isRegistered",
        value: function() {
            return !!this._filterRegistry
        }
    }, {
        key: "clearRegistry",
        value: function() {
            delete this._filterRegistry
        }
    }, {
        key: "make",
        value: function(type, args) {
            if (!this._filterRegistry) {
                this._filterRegistry = {}
            }
            this._make(type).apply(this, args)
        }
    }, {
        key: "_make",
        value: function(type) {
            var _this = this;
            switch (type) {
                case "date":
                    return function(min, max, useAccessors) {
                        var startDate = useAccessors ? _this._dataAccessors.getter.startDate : _this._dataAccessors.expr.startDateExpr,
                            endDate = useAccessors ? _this._dataAccessors.getter.endDate : _this._dataAccessors.expr.endDateExpr,
                            recurrenceRule = _this._dataAccessors.expr.recurrenceRuleExpr;
                        _this._filterRegistry.date = [
                            [
                                [endDate, ">", min],
                                [startDate, "<", max]
                            ], "or", [recurrenceRule, "startswith", "freq"], "or", [
                                [endDate, min],
                                [startDate, min]
                            ]
                        ];
                        if (!recurrenceRule) {
                            _this._filterRegistry.date.splice(1, 2)
                        }
                    };
                case "user":
                    return function(userFilter) {
                        _this._filterRegistry.user = userFilter
                    }
            }
        }
    }, {
        key: "combine",
        value: function() {
            var filter = [];
            this._filterRegistry.date && filter.push(this._filterRegistry.date);
            this._filterRegistry.user && filter.push(this._filterRegistry.user);
            return filter
        }
    }, {
        key: "dateFilter",
        value: function() {
            return this._filterRegistry.date
        }
    }]);
    return FilterMaker
}();
var compareDateWithStartDayHour = function(startDate, endDate, startDayHour, allDay, severalDays) {
    var startTime = _date2.default.dateTimeFromDecimal(startDayHour);
    var result = startDate.getHours() >= startTime.hours && startDate.getMinutes() >= startTime.minutes || endDate.getHours() === startTime.hours && endDate.getMinutes() > startTime.minutes || endDate.getHours() > startTime.hours || severalDays || allDay;
    return result
};
var compareDateWithEndDayHour = function(startDate, endDate, startDayHour, endDayHour, allDay, max) {
    var result, hiddenInterval = (24 - endDayHour + startDayHour) * toMs("hour"),
        apptDuration = endDate.getTime() - startDate.getTime(),
        delta = (hiddenInterval - apptDuration) / toMs("hour"),
        apptStartHour = startDate.getHours(),
        apptStartMinutes = startDate.getMinutes();
    var endTime = _date2.default.dateTimeFromDecimal(endDayHour);
    result = apptStartHour < endTime.hours || apptStartHour === endTime.hours && apptStartMinutes < endTime.minutes || allDay && startDate <= max;
    if (apptDuration < hiddenInterval) {
        if (apptStartHour > endTime.hours && apptStartMinutes > endTime.minutes && delta <= apptStartHour - endDayHour) {
            result = false
        }
    }
    return result
};
var AppointmentModel = function() {
    function AppointmentModel(dataSource, dataAccessors, baseAppointmentDuration) {
        _classCallCheck(this, AppointmentModel);
        this.setDataAccessors(dataAccessors);
        this.setDataSource(dataSource);
        this._updatedAppointmentKeys = [];
        this._filterMaker = new FilterMaker(dataAccessors);
        this._baseAppointmentDuration = baseAppointmentDuration
    }
    _createClass(AppointmentModel, [{
        key: "_createFilter",
        value: function(min, max, remoteFiltering, dateSerializationFormat) {
            this._filterMaker.make("date", [min, max]);
            var userFilterPosition = this._excessFiltering() ? this._dataSource.filter()[USER_FILTER_POSITION] : this._dataSource.filter();
            this._filterMaker.make("user", [userFilterPosition]);
            if (remoteFiltering) {
                this._dataSource.filter(this._combineRemoteFilter(dateSerializationFormat))
            }
        }
    }, {
        key: "_excessFiltering",
        value: function() {
            var dateFilter = this._filterMaker.dateFilter(),
                dataSourceFilter = this._dataSource.filter();
            return dataSourceFilter && (_common2.default.equalByValue(dataSourceFilter, dateFilter) || dataSourceFilter.length && _common2.default.equalByValue(dataSourceFilter[DATE_FILTER_POSITION], dateFilter))
        }
    }, {
        key: "_combineFilter",
        value: function() {
            return this._filterMaker.combine()
        }
    }, {
        key: "_getStoreKey",
        value: function(target) {
            var store = this._dataSource.store();
            return store.keyOf(target)
        }
    }, {
        key: "_filterAppointmentByResources",
        value: function(appointment, resources) {
            var _this2 = this;
            var result = false;
            var checkAppointmentResourceValues = function() {
                var resource, resourceGetter = _this2._dataAccessors.getter.resources[resourceName];
                if (_type2.default.isFunction(resourceGetter)) {
                    resource = resourceGetter(appointment)
                }
                var appointmentResourceValues = _array2.default.wrapToArray(resource),
                    resourceData = _iterator2.default.map(resources[i].items, function(item) {
                        return item.id
                    });
                for (var j = 0, itemDataCount = appointmentResourceValues.length; j < itemDataCount; j++) {
                    if ((0, _array.inArray)(appointmentResourceValues[j], resourceData) > -1) {
                        return true
                    }
                }
                return false
            };
            for (var i = 0, len = resources.length; i < len; i++) {
                var resourceName = resources[i].name;
                result = checkAppointmentResourceValues.call(this);
                if (!result) {
                    return false
                }
            }
            return result
        }
    }, {
        key: "_filterAppointmentByRRule",
        value: function(appointment, min, max, startDayHour, endDayHour, firstDayOfWeek) {
            var recurrenceRule = appointment.recurrenceRule,
                recurrenceException = appointment.recurrenceException,
                allDay = appointment.allDay,
                result = true,
                appointmentStartDate = appointment.startDate,
                appointmentEndDate = appointment.endDate;
            if (allDay || this._appointmentPartInInterval(appointmentStartDate, appointmentEndDate, startDayHour, endDayHour)) {
                var trimmedDates = this._trimDates(min, max);
                min = trimmedDates.min;
                max = new Date(trimmedDates.max.getTime() - toMs("minute"))
            }
            if (recurrenceRule && !_utils2.default.getRecurrenceRule(recurrenceRule).isValid) {
                result = appointmentEndDate > min && appointmentStartDate <= max
            }
            if (result && _utils2.default.getRecurrenceRule(recurrenceRule).isValid) {
                result = _utils2.default.dateInRecurrenceRange({
                    rule: recurrenceRule,
                    exception: recurrenceException,
                    start: appointmentStartDate,
                    end: appointmentEndDate,
                    min: min,
                    max: max,
                    firstDayOfWeek: firstDayOfWeek
                })
            }
            return result
        }
    }, {
        key: "_appointmentPartInInterval",
        value: function(startDate, endDate, startDayHour, endDayHour) {
            var apptStartDayHour = startDate.getHours(),
                apptEndDayHour = endDate.getHours();
            return apptStartDayHour <= startDayHour && apptEndDayHour <= endDayHour && apptEndDayHour >= startDayHour || apptEndDayHour >= endDayHour && apptStartDayHour <= endDayHour && apptStartDayHour >= startDayHour
        }
    }, {
        key: "_createCombinedFilter",
        value: function(filterOptions, timeZoneProcessor) {
            var dataAccessors = this._dataAccessors,
                startDayHour = filterOptions.startDayHour,
                endDayHour = filterOptions.endDayHour,
                min = new Date(filterOptions.min),
                max = new Date(filterOptions.max),
                resources = filterOptions.resources,
                firstDayOfWeek = filterOptions.firstDayOfWeek,
                getRecurrenceException = filterOptions.recurrenceException,
                that = this;
            return [
                [function(appointment) {
                    var recurrenceRule, result = true,
                        startDate = new Date(dataAccessors.getter.startDate(appointment)),
                        endDate = new Date(dataAccessors.getter.endDate(appointment)),
                        appointmentTakesAllDay = that.appointmentTakesAllDay(appointment, startDayHour, endDayHour),
                        appointmentTakesSeveralDays = that.appointmentTakesSeveralDays(appointment),
                        isAllDay = dataAccessors.getter.allDay(appointment),
                        appointmentIsLong = appointmentTakesSeveralDays || appointmentTakesAllDay,
                        useRecurrence = _type2.default.isDefined(dataAccessors.getter.recurrenceRule);
                    if (useRecurrence) {
                        recurrenceRule = dataAccessors.getter.recurrenceRule(appointment)
                    }
                    if (resources && resources.length) {
                        result = that._filterAppointmentByResources(appointment, resources)
                    }
                    if (appointmentTakesAllDay && false === filterOptions.allDay) {
                        result = false
                    }
                    var startDateTimeZone = dataAccessors.getter.startDateTimeZone(appointment),
                        endDateTimeZone = dataAccessors.getter.endDateTimeZone(appointment),
                        comparableStartDate = timeZoneProcessor(startDate, startDateTimeZone),
                        comparableEndDate = timeZoneProcessor(endDate, endDateTimeZone);
                    if (result && useRecurrence) {
                        var recurrenceException = getRecurrenceException ? getRecurrenceException(appointment) : dataAccessors.getter.recurrenceException(appointment);
                        result = that._filterAppointmentByRRule({
                            startDate: comparableStartDate,
                            endDate: comparableEndDate,
                            recurrenceRule: recurrenceRule,
                            recurrenceException: recurrenceException,
                            allDay: appointmentTakesAllDay
                        }, min, max, startDayHour, endDayHour, firstDayOfWeek)
                    }
                    if (result && comparableEndDate < min && appointmentIsLong && !isAllDay && (!useRecurrence || useRecurrence && !recurrenceRule)) {
                        result = false
                    }
                    if (result && void 0 !== startDayHour) {
                        result = compareDateWithStartDayHour(comparableStartDate, comparableEndDate, startDayHour, appointmentTakesAllDay, appointmentTakesSeveralDays)
                    }
                    if (result && void 0 !== endDayHour) {
                        result = compareDateWithEndDayHour(comparableStartDate, comparableEndDate, startDayHour, endDayHour, appointmentTakesAllDay, max)
                    }
                    if (result && useRecurrence && !recurrenceRule) {
                        if (comparableEndDate < min && !isAllDay) {
                            result = false
                        }
                    }
                    return result
                }]
            ]
        }
    }, {
        key: "setDataSource",
        value: function(dataSource) {
            this._dataSource = dataSource;
            this.cleanModelState();
            this._initStoreChangeHandlers();
            this._filterMaker && this._filterMaker.clearRegistry()
        }
    }, {
        key: "_initStoreChangeHandlers",
        value: function() {
            var _this3 = this;
            this._dataSource && this._dataSource.store().on("updating", function(newItem) {
                _this3._updatedAppointment = newItem
            }.bind(this));
            this._dataSource && this._dataSource.store().on("push", function(items) {
                items.forEach(function(item) {
                    _this3._updatedAppointmentKeys.push({
                        key: _this3._dataSource.store().key(),
                        value: item.key
                    })
                }.bind(_this3))
            }.bind(this))
        }
    }, {
        key: "getUpdatedAppointment",
        value: function() {
            return this._updatedAppointment
        }
    }, {
        key: "getUpdatedAppointmentKeys",
        value: function() {
            return this._updatedAppointmentKeys
        }
    }, {
        key: "cleanModelState",
        value: function() {
            this._updatedAppointment = null;
            this._updatedAppointmentKeys = []
        }
    }, {
        key: "setDataAccessors",
        value: function(dataAccessors) {
            this._dataAccessors = dataAccessors;
            this._filterMaker = new FilterMaker(dataAccessors)
        }
    }, {
        key: "filterByDate",
        value: function(min, max, remoteFiltering, dateSerializationFormat) {
            if (!this._dataSource) {
                return
            }
            var trimmedDates = this._trimDates(min, max);
            if (!this._filterMaker.isRegistered()) {
                this._createFilter(trimmedDates.min, trimmedDates.max, remoteFiltering, dateSerializationFormat)
            } else {
                this._filterMaker.make("date", [trimmedDates.min, trimmedDates.max]);
                if (this._dataSource.filter() && this._dataSource.filter().length > 1) {
                    this._filterMaker.make("user", [this._dataSource.filter()[1]])
                }
                if (remoteFiltering) {
                    this._dataSource.filter(this._combineRemoteFilter(dateSerializationFormat))
                }
            }
        }
    }, {
        key: "_combineRemoteFilter",
        value: function(dateSerializationFormat) {
            var combinedFilter = this._filterMaker.combine();
            return this._serializeRemoteFilter(combinedFilter, dateSerializationFormat)
        }
    }, {
        key: "_serializeRemoteFilter",
        value: function(filter, dateSerializationFormat) {
            var that = this;
            if (!Array.isArray(filter)) {
                return filter
            }
            filter = (0, _extend.extend)([], filter);
            var startDate = that._dataAccessors.expr.startDateExpr,
                endDate = that._dataAccessors.expr.endDateExpr;
            if (_type2.default.isString(filter[0])) {
                if ((0, _config2.default)().forceIsoDateParsing && filter.length > 1) {
                    if (filter[0] === startDate || filter[0] === endDate) {
                        filter[filter.length - 1] = _date_serialization2.default.serializeDate(filter[filter.length - 1], dateSerializationFormat)
                    }
                }
            }
            for (var i = 0; i < filter.length; i++) {
                filter[i] = that._serializeRemoteFilter(filter[i], dateSerializationFormat)
            }
            return filter
        }
    }, {
        key: "filterLoadedAppointments",
        value: function(filterOptions, timeZoneProcessor) {
            if (!_type2.default.isFunction(timeZoneProcessor)) {
                timeZoneProcessor = function(date) {
                    return date
                }
            }
            var combinedFilter = this._createCombinedFilter(filterOptions, timeZoneProcessor);
            if (this._filterMaker.isRegistered()) {
                var trimmedDates = this._trimDates(filterOptions.min, filterOptions.max);
                this._filterMaker.make("date", [trimmedDates.min, trimmedDates.max, true]);
                var dateFilter = this.customizeDateFilter(this._filterMaker.combine(), timeZoneProcessor);
                combinedFilter.push([dateFilter])
            }
            return (0, _query2.default)(this._dataSource.items()).filter(combinedFilter).toArray()
        }
    }, {
        key: "_trimDates",
        value: function(min, max) {
            var minCopy = _date2.default.trimTime(new Date(min)),
                maxCopy = _date2.default.trimTime(new Date(max));
            maxCopy.setDate(maxCopy.getDate() + 1);
            return {
                min: minCopy,
                max: maxCopy
            }
        }
    }, {
        key: "hasAllDayAppointments",
        value: function(items, startDayHour, endDayHour) {
            if (!items) {
                return false
            }
            var that = this;
            var result = false;
            _iterator2.default.each(items, function(index, item) {
                if (that.appointmentTakesAllDay(item, startDayHour, endDayHour)) {
                    result = true;
                    return false
                }
            });
            return result
        }
    }, {
        key: "appointmentTakesAllDay",
        value: function(appointment, startDayHour, endDayHour) {
            var dataAccessors = this._dataAccessors,
                startDate = dataAccessors.getter.startDate(appointment),
                endDate = dataAccessors.getter.endDate(appointment),
                allDay = dataAccessors.getter.allDay(appointment);
            return allDay || this._appointmentHasAllDayDuration(startDate, endDate, startDayHour, endDayHour)
        }
    }, {
        key: "_appointmentHasAllDayDuration",
        value: function(startDate, endDate, startDayHour, endDayHour) {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            var dayDuration = 24,
                appointmentDurationInHours = this._getAppointmentDurationInHours(startDate, endDate);
            return appointmentDurationInHours >= dayDuration || this._appointmentHasShortDayDuration(startDate, endDate, startDayHour, endDayHour)
        }
    }, {
        key: "_appointmentHasShortDayDuration",
        value: function(startDate, endDate, startDayHour, endDayHour) {
            var appointmentDurationInHours = this._getAppointmentDurationInHours(startDate, endDate),
                shortDayDurationInHours = endDayHour - startDayHour;
            return appointmentDurationInHours >= shortDayDurationInHours && startDate.getHours() === startDayHour && endDate.getHours() === endDayHour
        }
    }, {
        key: "_getAppointmentDurationInHours",
        value: function(startDate, endDate) {
            return (endDate.getTime() - startDate.getTime()) / toMs("hour")
        }
    }, {
        key: "appointmentTakesSeveralDays",
        value: function(appointment) {
            var dataAccessors = this._dataAccessors,
                startDate = dataAccessors.getter.startDate(appointment),
                endDate = dataAccessors.getter.endDate(appointment);
            var startDateCopy = _date2.default.trimTime(new Date(startDate)),
                endDateCopy = _date2.default.trimTime(new Date(endDate));
            return startDateCopy.getTime() !== endDateCopy.getTime()
        }
    }, {
        key: "customizeDateFilter",
        value: function(dateFilter, timeZoneProcessor) {
            var _this4 = this;
            var currentFilter = (0, _extend.extend)(true, [], dateFilter);
            return function(appointment) {
                var startDate = new Date(_this4._dataAccessors.getter.startDate(appointment)),
                    endDate = new Date(_this4._dataAccessors.getter.endDate(appointment));
                endDate = _this4.fixWrongEndDate(appointment, startDate, endDate);
                appointment = (0, _extend.extend)(true, {}, appointment);
                var startDateTimeZone = _this4._dataAccessors.getter.startDateTimeZone(appointment),
                    endDateTimeZone = _this4._dataAccessors.getter.endDateTimeZone(appointment);
                var comparableStartDate = timeZoneProcessor(startDate, startDateTimeZone),
                    comparableEndDate = timeZoneProcessor(endDate, endDateTimeZone);
                _this4._dataAccessors.setter.startDate(appointment, comparableStartDate);
                _this4._dataAccessors.setter.endDate(appointment, comparableEndDate);
                return (0, _query2.default)([appointment]).filter(currentFilter).toArray().length > 0
            }.bind(this)
        }
    }, {
        key: "fixWrongEndDate",
        value: function(appointment, startDate, endDate) {
            if (this._isEndDateWrong(appointment, startDate, endDate)) {
                if (this._dataAccessors.getter.allDay(appointment)) {
                    endDate = _date2.default.setToDayEnd(new Date(startDate))
                } else {
                    endDate = new Date(startDate.getTime() + this._baseAppointmentDuration * toMs("minute"))
                }
                this._dataAccessors.setter.endDate(appointment, endDate)
            }
            return endDate
        }
    }, {
        key: "_isEndDateWrong",
        value: function(appointment, startDate, endDate) {
            return !endDate || isNaN(endDate.getTime()) || startDate.getTime() >= endDate.getTime()
        }
    }, {
        key: "add",
        value: function(data, tz) {
            var _this5 = this;
            return this._dataSource.store().insert(data).done(function() {
                _this5._dataSource.load()
            }.bind(this))
        }
    }, {
        key: "update",
        value: function(target, data) {
            var _this6 = this;
            var key = this._getStoreKey(target);
            return this._dataSource.store().update(key, data).done(function() {
                _this6._dataSource.load()
            }.bind(this))
        }
    }, {
        key: "remove",
        value: function(target) {
            var _this7 = this;
            var key = this._getStoreKey(target);
            return this._dataSource.store().remove(key).done(function() {
                _this7._dataSource.load()
            }.bind(this))
        }
    }]);
    return AppointmentModel
}();
module.exports = AppointmentModel;
