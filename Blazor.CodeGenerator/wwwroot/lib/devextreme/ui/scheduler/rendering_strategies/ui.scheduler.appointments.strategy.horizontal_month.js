/**
 * DevExtreme (ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.horizontal_month.js)
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
var _uiSchedulerAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.horizontal_month_line");
var _uiSchedulerAppointmentsStrategy2 = _interopRequireDefault(_uiSchedulerAppointmentsStrategy);
var _extend = require("../../../core/utils/extend");

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
var MONTH_APPOINTMENT_HEIGHT_RATIO = .6,
    MONTH_APPOINTMENT_MIN_OFFSET = 26,
    MONTH_APPOINTMENT_MAX_OFFSET = 30,
    MONTH_DROPDOWN_APPOINTMENT_MIN_RIGHT_OFFSET = 36,
    MONTH_DROPDOWN_APPOINTMENT_MAX_RIGHT_OFFSET = 60;
var HorizontalMonthRenderingStrategy = function(_HorizontalMonthLineA) {
    _inherits(HorizontalMonthRenderingStrategy, _HorizontalMonthLineA);

    function HorizontalMonthRenderingStrategy() {
        _classCallCheck(this, HorizontalMonthRenderingStrategy);
        return _possibleConstructorReturn(this, (HorizontalMonthRenderingStrategy.__proto__ || Object.getPrototypeOf(HorizontalMonthRenderingStrategy)).apply(this, arguments))
    }
    _createClass(HorizontalMonthRenderingStrategy, [{
        key: "_getAppointmentParts",
        value: function(appointmentGeometry, appointmentSettings, startDate) {
            var deltaWidth = appointmentGeometry.sourceAppointmentWidth - appointmentGeometry.reducedWidth,
                height = appointmentGeometry.height,
                fullWeekAppointmentWidth = this._getFullWeekAppointmentWidth(appointmentSettings.groupIndex),
                maxAppointmentWidth = this._getMaxAppointmentWidth(startDate),
                longPartCount = Math.ceil(deltaWidth / fullWeekAppointmentWidth) - 1,
                tailWidth = Math.floor(deltaWidth % fullWeekAppointmentWidth) || fullWeekAppointmentWidth,
                result = [],
                totalWidth = appointmentGeometry.reducedWidth + tailWidth,
                currentPartTop = appointmentSettings.top + this.getDefaultCellHeight(),
                left = this._calculateMultiWeekAppointmentLeftOffset(appointmentSettings.hMax, fullWeekAppointmentWidth);
            if ("vertical" === this.instance._groupOrientation) {
                left += this.instance.fire("getWorkSpaceDateTableOffset")
            }
            for (var i = 0; i < longPartCount; i++) {
                if (totalWidth > maxAppointmentWidth) {
                    break
                }
                result.push((0, _extend.extend)(true, {}, appointmentSettings, {
                    top: currentPartTop,
                    left: left,
                    height: height,
                    width: fullWeekAppointmentWidth,
                    appointmentReduced: "body",
                    rowIndex: ++appointmentSettings.rowIndex,
                    cellIndex: 0
                }));
                currentPartTop += this.getDefaultCellHeight();
                totalWidth += fullWeekAppointmentWidth
            }
            if (tailWidth) {
                if (this._isRtl()) {
                    left += fullWeekAppointmentWidth - tailWidth
                }
                result.push((0, _extend.extend)(true, {}, appointmentSettings, {
                    top: currentPartTop,
                    left: left,
                    height: height,
                    width: tailWidth,
                    appointmentReduced: "tail",
                    rowIndex: ++appointmentSettings.rowIndex,
                    cellIndex: 0
                }))
            }
            return result
        }
    }, {
        key: "_calculateMultiWeekAppointmentLeftOffset",
        value: function(max, width) {
            return this._isRtl() ? max : max - width
        }
    }, {
        key: "_correctRtlCoordinatesParts",
        value: function() {}
    }, {
        key: "_getFullWeekAppointmentWidth",
        value: function(groupIndex) {
            this.instance.fire("getFullWeekAppointmentWidth", {
                groupIndex: groupIndex,
                callback: function(width) {
                    this._maxFullWeekAppointmentWidth = width
                }.bind(this)
            });
            return this._maxFullWeekAppointmentWidth
        }
    }, {
        key: "_getAppointmentDefaultHeight",
        value: function() {
            return this._getAppointmentHeightByTheme()
        }
    }, {
        key: "_getAppointmentMinHeight",
        value: function() {
            return this._getAppointmentDefaultHeight()
        }
    }, {
        key: "_checkLongCompactAppointment",
        value: function(item, result) {
            this._splitLongCompactAppointment(item, result);
            return result
        }
    }, {
        key: "_columnCondition",
        value: function(a, b) {
            var isSomeEdge = this._isSomeEdge(a, b);
            var columnCondition = this._normalizeCondition(a.left, b.left, isSomeEdge),
                rowCondition = this._normalizeCondition(a.top, b.top, isSomeEdge),
                cellPositionCondition = this._normalizeCondition(a.cellPosition, b.cellPosition, isSomeEdge);
            return rowCondition ? rowCondition : columnCondition ? columnCondition : cellPositionCondition ? cellPositionCondition : a.isStart - b.isStart
        }
    }, {
        key: "createTaskPositionMap",
        value: function(items) {
            return _get(HorizontalMonthRenderingStrategy.prototype.__proto__ || Object.getPrototypeOf(HorizontalMonthRenderingStrategy.prototype), "createTaskPositionMap", this).call(this, items, true)
        }
    }, {
        key: "_getSortedPositions",
        value: function(map) {
            return _get(HorizontalMonthRenderingStrategy.prototype.__proto__ || Object.getPrototypeOf(HorizontalMonthRenderingStrategy.prototype), "_getSortedPositions", this).call(this, map, true)
        }
    }, {
        key: "_customizeAppointmentGeometry",
        value: function(coordinates) {
            var config = this._calculateGeometryConfig(coordinates);
            return this._customizeCoordinates(coordinates, config.height, config.appointmentCountPerCell, config.offset)
        }
    }, {
        key: "_getDefaultRatio",
        value: function() {
            return MONTH_APPOINTMENT_HEIGHT_RATIO
        }
    }, {
        key: "_getOffsets",
        value: function() {
            return {
                unlimited: MONTH_APPOINTMENT_MIN_OFFSET,
                auto: MONTH_APPOINTMENT_MAX_OFFSET
            }
        }
    }, {
        key: "getDropDownAppointmentWidth",
        value: function(intervalCount) {
            if (this.instance.fire("isAdaptive")) {
                return this.getDropDownButtonAdaptiveSize()
            }
            var offset = intervalCount > 1 ? MONTH_DROPDOWN_APPOINTMENT_MAX_RIGHT_OFFSET : MONTH_DROPDOWN_APPOINTMENT_MIN_RIGHT_OFFSET;
            return this.getDefaultCellWidth() - offset
        }
    }, {
        key: "needCorrectAppointmentDates",
        value: function() {
            return false
        }
    }, {
        key: "_needVerticalGroupBounds",
        value: function() {
            return false
        }
    }, {
        key: "_needHorizontalGroupBounds",
        value: function() {
            return true
        }
    }]);
    return HorizontalMonthRenderingStrategy
}(_uiSchedulerAppointmentsStrategy2.default);
module.exports = HorizontalMonthRenderingStrategy;
