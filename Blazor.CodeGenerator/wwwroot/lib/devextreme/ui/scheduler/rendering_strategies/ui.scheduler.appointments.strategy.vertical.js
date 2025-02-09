/**
 * DevExtreme (ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.vertical.js)
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
var _uiSchedulerAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.base");
var _uiSchedulerAppointmentsStrategy2 = _interopRequireDefault(_uiSchedulerAppointmentsStrategy);
var _extend = require("../../../core/utils/extend");
var _type = require("../../../core/utils/type");
var _devices = require("../../../core/devices");
var _devices2 = _interopRequireDefault(_devices);
var _date = require("../../../core/utils/date");
var _date2 = _interopRequireDefault(_date);

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
var WEEK_APPOINTMENT_DEFAULT_OFFSET = 25,
    WEEK_APPOINTMENT_MOBILE_OFFSET = 50,
    APPOINTMENT_MIN_WIDTH = 5,
    ALLDAY_APPOINTMENT_MIN_VERTICAL_OFFSET = 5,
    ALLDAY_APPOINTMENT_MAX_VERTICAL_OFFSET = 20;
var toMs = _date2.default.dateToMilliseconds;
var VerticalRenderingStrategy = function(_BaseAppointmentsStra) {
    _inherits(VerticalRenderingStrategy, _BaseAppointmentsStra);

    function VerticalRenderingStrategy() {
        _classCallCheck(this, VerticalRenderingStrategy);
        return _possibleConstructorReturn(this, (VerticalRenderingStrategy.__proto__ || Object.getPrototypeOf(VerticalRenderingStrategy)).apply(this, arguments))
    }
    _createClass(VerticalRenderingStrategy, [{
        key: "getDeltaTime",
        value: function(args, initialSize, appointment) {
            var deltaTime = 0;
            if (this.isAllDay(appointment)) {
                deltaTime = this._getDeltaWidth(args, initialSize) * toMs("day")
            } else {
                var deltaHeight = args.height - initialSize.height;
                deltaTime = toMs("minute") * Math.round(deltaHeight / this.getDefaultCellHeight() * this.instance.getAppointmentDurationInMinutes())
            }
            return deltaTime
        }
    }, {
        key: "getAppointmentGeometry",
        value: function(coordinates) {
            var result, allDay = coordinates.allDay;
            if (allDay) {
                result = this._getAllDayAppointmentGeometry(coordinates)
            } else {
                result = this._getVerticalAppointmentGeometry(coordinates)
            }
            return _get(VerticalRenderingStrategy.prototype.__proto__ || Object.getPrototypeOf(VerticalRenderingStrategy.prototype), "getAppointmentGeometry", this).call(this, result)
        }
    }, {
        key: "_getItemPosition",
        value: function(item) {
            var allDay = this.isAllDay(item),
                isRecurring = !!this.instance.fire("getField", "recurrenceRule", item);
            if (allDay) {
                return _get(VerticalRenderingStrategy.prototype.__proto__ || Object.getPrototypeOf(VerticalRenderingStrategy.prototype), "_getItemPosition", this).call(this, item)
            }
            var position = this._getAppointmentCoordinates(item),
                result = [];
            for (var j = 0; j < position.length; j++) {
                var height = this.calculateAppointmentHeight(item, position[j], isRecurring),
                    width = this.calculateAppointmentWidth(item, position[j], isRecurring),
                    resultHeight = height,
                    appointmentReduced = null,
                    multiDaysAppointmentParts = [],
                    currentMaxAllowedPosition = position[j].vMax;
                if (this._isMultiDayAppointment(position[j], height)) {
                    appointmentReduced = "head";
                    resultHeight = this._reduceMultiDayAppointment(height, {
                        top: position[j].top,
                        bottom: currentMaxAllowedPosition
                    });
                    multiDaysAppointmentParts = this._getAppointmentParts({
                        sourceAppointmentHeight: height,
                        reducedHeight: resultHeight,
                        width: width
                    }, position[j])
                }(0, _extend.extend)(position[j], {
                    height: resultHeight,
                    width: width,
                    allDay: allDay,
                    appointmentReduced: appointmentReduced
                });
                result = this._getAppointmentPartsPosition(multiDaysAppointmentParts, position[j], result)
            }
            return result
        }
    }, {
        key: "_isMultiDayAppointment",
        value: function(position, height) {
            var maxTop = position.vMax,
                result = height > maxTop - position.top;
            return result
        }
    }, {
        key: "_reduceMultiDayAppointment",
        value: function(sourceAppointmentHeight, bound) {
            sourceAppointmentHeight = bound.bottom - Math.floor(bound.top);
            return sourceAppointmentHeight
        }
    }, {
        key: "_getAppointmentParts",
        value: function(appointmentGeometry, appointmentSettings) {
            var tailHeight = appointmentGeometry.sourceAppointmentHeight - appointmentGeometry.reducedHeight,
                width = appointmentGeometry.width,
                result = [],
                currentPartTop = this.instance.fire("getGroupTop", appointmentSettings.groupIndex),
                offset = this.instance.fire("isGroupedByDate") ? this.getDefaultCellWidth() * this.instance.fire("getGroupCount") : this.getDefaultCellWidth(),
                left = appointmentSettings.left + offset;
            if (tailHeight) {
                var minHeight = this.getAppointmentMinSize();
                if (tailHeight < minHeight) {
                    tailHeight = minHeight
                }
                currentPartTop += this.instance.fire("getOffsetByAllDayPanel", appointmentSettings.groupIndex);
                result.push((0, _extend.extend)(true, {}, appointmentSettings, {
                    top: currentPartTop,
                    left: left,
                    height: tailHeight,
                    width: width,
                    appointmentReduced: "tail",
                    rowIndex: ++appointmentSettings.rowIndex
                }))
            }
            return result
        }
    }, {
        key: "_getMinuteHeight",
        value: function() {
            return this.getDefaultCellHeight() / this.instance.getAppointmentDurationInMinutes()
        }
    }, {
        key: "_getCompactLeftCoordinate",
        value: function(itemLeft, index) {
            var cellBorderSize = 1,
                cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();
            return itemLeft + (cellBorderSize + cellWidth) * index
        }
    }, {
        key: "_checkLongCompactAppointment",
        value: function(item, result) {
            this._splitLongCompactAppointment(item, result);
            return result
        }
    }, {
        key: "_getVerticalAppointmentGeometry",
        value: function(coordinates) {
            var overlappingMode = this.instance.fire("getMaxAppointmentsPerCell");
            if (overlappingMode) {
                var config = this._calculateVerticalGeometryConfig(coordinates);
                return this._customizeVerticalCoordinates(coordinates, config.width, config.appointmentCountPerCell, config.offset)
            } else {
                var width = this._getAppointmentMaxWidth() / coordinates.count,
                    height = coordinates.height,
                    top = coordinates.top,
                    left = coordinates.left + coordinates.index * width;
                if (width < APPOINTMENT_MIN_WIDTH) {
                    width = APPOINTMENT_MIN_WIDTH
                }
                return {
                    height: height,
                    width: width,
                    top: top,
                    left: left,
                    empty: this._isAppointmentEmpty(height, width)
                }
            }
        }
    }, {
        key: "_customizeVerticalCoordinates",
        value: function(coordinates, width, appointmentCountPerCell, topOffset, isAllDay) {
            var compactAppointmentDefaultSize, compactAppointmentDefaultOffset, index = coordinates.index,
                appointmentWidth = Math.max(width / appointmentCountPerCell, width / coordinates.count),
                height = coordinates.height,
                appointmentLeft = coordinates.left + coordinates.index * appointmentWidth,
                top = coordinates.top;
            if (coordinates.isCompact) {
                compactAppointmentDefaultSize = this.getCompactAppointmentDefaultWidth();
                compactAppointmentDefaultOffset = this.getCompactAppointmentLeftOffset();
                top = coordinates.top + compactAppointmentDefaultOffset;
                appointmentLeft = coordinates.left + (index - appointmentCountPerCell) * (compactAppointmentDefaultSize + compactAppointmentDefaultOffset) + compactAppointmentDefaultOffset;
                appointmentWidth = compactAppointmentDefaultSize;
                width = compactAppointmentDefaultSize;
                this._markAppointmentAsVirtual(coordinates, isAllDay)
            }
            return {
                height: height,
                width: appointmentWidth,
                top: top,
                left: appointmentLeft,
                empty: this._isAppointmentEmpty(height, width)
            }
        }
    }, {
        key: "_calculateVerticalGeometryConfig",
        value: function(coordinates) {
            var overlappingMode = this.instance.fire("getMaxAppointmentsPerCell"),
                offsets = this._getOffsets(),
                appointmentDefaultOffset = this._getAppointmentDefaultOffset();
            var appointmentCountPerCell = this._getAppointmentCount(overlappingMode, coordinates);
            var ratio = this._getDefaultRatio(coordinates, appointmentCountPerCell);
            var maxWidth = this._getMaxWidth();
            if (!appointmentCountPerCell) {
                appointmentCountPerCell = coordinates.count;
                ratio = (maxWidth - offsets.unlimited) / maxWidth
            }
            var topOffset = (1 - ratio) * maxWidth;
            if ("auto" === overlappingMode || (0, _type.isNumeric)(overlappingMode)) {
                ratio = 1;
                maxWidth -= appointmentDefaultOffset;
                topOffset = 0
            }
            return {
                width: ratio * maxWidth,
                appointmentCountPerCell: appointmentCountPerCell,
                offset: topOffset
            }
        }
    }, {
        key: "_getMaxWidth",
        value: function() {
            return this.getDefaultCellWidth() || this.invoke("getCellWidth")
        }
    }, {
        key: "isAllDay",
        value: function(appointmentData) {
            var allDay = this.instance.fire("getField", "allDay", appointmentData);
            if (allDay) {
                return true
            }
            return this.instance.appointmentTakesAllDay(appointmentData)
        }
    }, {
        key: "_getAppointmentMaxWidth",
        value: function() {
            var offset = "desktop" === _devices2.default.current().deviceType && !this.instance.fire("isAdaptive") ? WEEK_APPOINTMENT_DEFAULT_OFFSET : WEEK_APPOINTMENT_MOBILE_OFFSET,
                width = this.getDefaultCellWidth() - offset;
            return width > 0 ? width : this.getAppointmentMinSize()
        }
    }, {
        key: "calculateAppointmentWidth",
        value: function(appointment, position, isRecurring) {
            if (!this.isAllDay(appointment)) {
                return 0
            }
            var startDate = new Date(this.startDate(appointment, false, position)),
                endDate = this.endDate(appointment, position, isRecurring),
                cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();
            startDate = _date2.default.trimTime(startDate);
            var durationInHours = (endDate.getTime() - startDate.getTime()) / toMs("hour");
            var width = Math.ceil(durationInHours / 24) * cellWidth;
            width = this.cropAppointmentWidth(width, cellWidth);
            return width
        }
    }, {
        key: "calculateAppointmentHeight",
        value: function(appointment, position, isRecurring) {
            var endDate = this.endDate(appointment, position, isRecurring),
                startDate = this.startDate(appointment, false, position),
                allDay = this.instance.fire("getField", "allDay", appointment);
            if (this.isAllDay(appointment)) {
                return 0
            }
            var fullDuration = this._getAppointmentDurationInMs(startDate, endDate, allDay),
                durationInMinutes = this._adjustDurationByDaylightDiff(fullDuration, startDate, endDate) / toMs("minute");
            var height = durationInMinutes * this._getMinuteHeight();
            return height
        }
    }, {
        key: "getDirection",
        value: function() {
            return "vertical"
        }
    }, {
        key: "_sortCondition",
        value: function(a, b) {
            var allDayCondition = a.allDay - b.allDay,
                isAllDay = a.allDay && b.allDay,
                condition = "vertical" === this.instance._groupOrientation && isAllDay ? this._columnCondition(a, b) : this._rowCondition(a, b),
                result = allDayCondition ? allDayCondition : condition;
            return this._fixUnstableSorting(result, a, b)
        }
    }, {
        key: "hasAllDayAppointments",
        value: function() {
            return true
        }
    }, {
        key: "_getAllDayAppointmentGeometry",
        value: function(coordinates) {
            var config = this._calculateGeometryConfig(coordinates);
            return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset, true)
        }
    }, {
        key: "_calculateGeometryConfig",
        value: function(coordinates) {
            if (!this.instance._allowResizing() || !this.instance._allowAllDayResizing()) {
                coordinates.skipResizing = true
            }
            var config = _get(VerticalRenderingStrategy.prototype.__proto__ || Object.getPrototypeOf(VerticalRenderingStrategy.prototype), "_calculateGeometryConfig", this).call(this, coordinates);
            if (coordinates.count <= this._getDynamicAppointmentCountPerCell().allDay) {
                config.offset = 0
            }
            return config
        }
    }, {
        key: "_getAppointmentCount",
        value: function(overlappingMode, coordinates) {
            return "auto" !== overlappingMode && 1 === coordinates.count && !(0, _type.isNumeric)(overlappingMode) ? coordinates.count : this._getMaxAppointmentCountPerCellByType(coordinates.allDay)
        }
    }, {
        key: "_getDefaultRatio",
        value: function(coordinates, appointmentCountPerCell) {
            return coordinates.count > this.instance.option("_appointmentCountPerCell") ? .65 : 1
        }
    }, {
        key: "_getOffsets",
        value: function() {
            return {
                unlimited: ALLDAY_APPOINTMENT_MIN_VERTICAL_OFFSET,
                auto: ALLDAY_APPOINTMENT_MAX_VERTICAL_OFFSET
            }
        }
    }, {
        key: "_getMaxHeight",
        value: function() {
            return this.getDefaultAllDayCellHeight() || this.getAppointmentMinSize()
        }
    }, {
        key: "_needVerticalGroupBounds",
        value: function(allDay) {
            return !allDay
        }
    }, {
        key: "_needHorizontalGroupBounds",
        value: function() {
            return false
        }
    }]);
    return VerticalRenderingStrategy
}(_uiSchedulerAppointmentsStrategy2.default);
module.exports = VerticalRenderingStrategy;
