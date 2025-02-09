/**
 * DevExtreme (ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.horizontal.js)
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
var MAX_APPOINTMENT_HEIGHT = 100,
    DEFAULT_APPOINTMENT_HEIGHT = 60,
    MIN_APPOINTMENT_HEIGHT = 35,
    DROP_DOWN_BUTTON_OFFSET = 2,
    BOTTOM_CELL_GAP = 20;
var toMs = _date2.default.dateToMilliseconds;
var HorizontalRenderingStrategy = function(_BaseAppointmentsStra) {
    _inherits(HorizontalRenderingStrategy, _BaseAppointmentsStra);

    function HorizontalRenderingStrategy() {
        _classCallCheck(this, HorizontalRenderingStrategy);
        return _possibleConstructorReturn(this, (HorizontalRenderingStrategy.__proto__ || Object.getPrototypeOf(HorizontalRenderingStrategy)).apply(this, arguments))
    }
    _createClass(HorizontalRenderingStrategy, [{
        key: "_needVerifyItemSize",
        value: function() {
            return true
        }
    }, {
        key: "calculateAppointmentWidth",
        value: function(appointment, position, isRecurring) {
            var width, cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize(),
                allDay = this.instance.fire("getField", "allDay", appointment);
            var startDate = this.startDate(appointment, false, position),
                endDate = this.endDate(appointment, position, isRecurring),
                appointmentDuration = this._getAppointmentDurationInMs(startDate, endDate, allDay);
            appointmentDuration = this._adjustDurationByDaylightDiff(appointmentDuration, startDate, endDate);
            var cellDuration = this.instance.getAppointmentDurationInMinutes() * toMs("minute"),
                durationInCells = appointmentDuration / cellDuration;
            width = durationInCells * cellWidth;
            width = this.cropAppointmentWidth(width, cellWidth);
            return width
        }
    }, {
        key: "_needAdjustDuration",
        value: function(diff) {
            return diff < 0
        }
    }, {
        key: "getAppointmentGeometry",
        value: function(coordinates) {
            var result = this._customizeAppointmentGeometry(coordinates);
            return _get(HorizontalRenderingStrategy.prototype.__proto__ || Object.getPrototypeOf(HorizontalRenderingStrategy.prototype), "getAppointmentGeometry", this).call(this, result)
        }
    }, {
        key: "_customizeAppointmentGeometry",
        value: function(coordinates) {
            var overlappingMode = this.instance.fire("getMaxAppointmentsPerCell");
            if (overlappingMode) {
                var config = this._calculateGeometryConfig(coordinates);
                return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset)
            } else {
                var cellHeight = (this.getDefaultCellHeight() || this.getAppointmentMinSize()) - BOTTOM_CELL_GAP,
                    height = cellHeight / coordinates.count;
                if (height > MAX_APPOINTMENT_HEIGHT) {
                    height = MAX_APPOINTMENT_HEIGHT
                }
                var top = coordinates.top + coordinates.index * height;
                return {
                    height: height,
                    width: coordinates.width,
                    top: top,
                    left: coordinates.left
                }
            }
        }
    }, {
        key: "_getOffsets",
        value: function() {
            return {
                unlimited: 0,
                auto: 0
            }
        }
    }, {
        key: "_checkLongCompactAppointment",
        value: function(item, result) {
            var overlappingMode = this.instance.fire("getMaxAppointmentsPerCell");
            if (overlappingMode) {
                this._splitLongCompactAppointment(item, result);
                return result
            }
        }
    }, {
        key: "_getCompactLeftCoordinate",
        value: function(itemLeft, index) {
            var cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();
            return itemLeft + cellWidth * index
        }
    }, {
        key: "_getMaxHeight",
        value: function() {
            return this.getDefaultCellHeight() || this.getAppointmentMinSize()
        }
    }, {
        key: "_getAppointmentCount",
        value: function(overlappingMode, coordinates) {
            return this._getMaxAppointmentCountPerCellByType(false)
        }
    }, {
        key: "_getAppointmentDefaultHeight",
        value: function() {
            return DEFAULT_APPOINTMENT_HEIGHT
        }
    }, {
        key: "_getAppointmentMinHeight",
        value: function() {
            return MIN_APPOINTMENT_HEIGHT
        }
    }, {
        key: "_correctRtlCoordinatesParts",
        value: function(coordinates, width) {
            for (var i = 1; i < coordinates.length; i++) {
                coordinates[i].left -= width
            }
            return coordinates
        }
    }, {
        key: "_sortCondition",
        value: function(a, b) {
            var result = this._columnCondition(a, b);
            return this._fixUnstableSorting(result, a, b)
        }
    }, {
        key: "_getMaxAppointmentWidth",
        value: function(startDate) {
            var result;
            this.instance.fire("getMaxAppointmentWidth", {
                date: startDate,
                callback: function(width) {
                    result = width
                }
            });
            return result
        }
    }, {
        key: "getDropDownAppointmentWidth",
        value: function() {
            return this.getDefaultCellWidth() - 2 * DROP_DOWN_BUTTON_OFFSET
        }
    }, {
        key: "getDeltaTime",
        value: function(args, initialSize) {
            var deltaTime = 0,
                deltaWidth = args.width - initialSize.width;
            deltaTime = toMs("minute") * Math.round(deltaWidth / this.getDefaultCellWidth() * this.instance.getAppointmentDurationInMinutes());
            return deltaTime
        }
    }, {
        key: "isAllDay",
        value: function(appointmentData) {
            return this.instance.fire("getField", "allDay", appointmentData)
        }
    }, {
        key: "needSeparateAppointment",
        value: function() {
            return this.instance.fire("isGroupedByDate")
        }
    }]);
    return HorizontalRenderingStrategy
}(_uiSchedulerAppointmentsStrategy2.default);
module.exports = HorizontalRenderingStrategy;
