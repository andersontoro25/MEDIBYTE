/**
 * DevExtreme (ui/scheduler/rendering_strategies/ui.scheduler.appointmentsPositioning.strategy.base.js)
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
var _type = require("../../../core/utils/type");
var _type2 = _interopRequireDefault(_type);

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
var COLLECTOR_DEFAULT_WIDTH = 24;
var COMPACT_APPOINTMENT_DEFAULT_OFFSET = 3;
var COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET = 22;
var APPOINTMENT_MIN_COUNT = 1;
var APPOINTMENT_DEFAULT_WIDTH = 40;
var COLLECTOR_WIDTH_IN_PERCENTS = 75;
var APPOINTMENT_INCREASED_WIDTH = 50;
var AppointmentPositioningStrategy = function() {
    function AppointmentPositioningStrategy(renderingStrategy) {
        _classCallCheck(this, AppointmentPositioningStrategy);
        this._renderingStrategy = renderingStrategy
    }
    _createClass(AppointmentPositioningStrategy, [{
        key: "getRenderingStrategy",
        value: function() {
            return this._renderingStrategy
        }
    }, {
        key: "getDropDownAppointmentWidth",
        value: function(intervalCount, isAllDay) {
            if (isAllDay || !_type2.default.isDefined(isAllDay)) {
                return COLLECTOR_WIDTH_IN_PERCENTS * this.getRenderingStrategy().getDefaultCellWidth() / 100
            } else {
                return COLLECTOR_DEFAULT_WIDTH
            }
        }
    }, {
        key: "getCompactAppointmentTopOffset",
        value: function() {
            return COMPACT_APPOINTMENT_DEFAULT_OFFSET
        }
    }, {
        key: "getCompactAppointmentLeftOffset",
        value: function() {
            return COMPACT_APPOINTMENT_DEFAULT_OFFSET
        }
    }, {
        key: "getAppointmentDefaultOffset",
        value: function() {
            if (this.getRenderingStrategy()._isCompactTheme()) {
                return COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET
            }
            return this.getRenderingStrategy().instance.option("_appointmentOffset")
        }
    }, {
        key: "getDynamicAppointmentCountPerCell",
        value: function() {
            var renderingStrategy = this.getRenderingStrategy();
            var cellHeight = renderingStrategy.instance.fire("getCellHeight");
            var allDayCount = Math.floor((cellHeight - renderingStrategy._getAppointmentDefaultOffset()) / renderingStrategy._getAppointmentDefaultHeight()) || this._getAppointmentMinCount();
            if (renderingStrategy.hasAllDayAppointments()) {
                return {
                    allDay: "vertical" === renderingStrategy.instance._groupOrientation ? allDayCount : renderingStrategy.instance.option("_appointmentCountPerCell"),
                    simple: this._calculateDynamicAppointmentCountPerCell() || this._getAppointmentMinCount()
                }
            } else {
                return allDayCount
            }
        }
    }, {
        key: "getDropDownAppointmentHeight",
        value: function() {
            return
        }
    }, {
        key: "_getAppointmentMinCount",
        value: function() {
            return APPOINTMENT_MIN_COUNT
        }
    }, {
        key: "_calculateDynamicAppointmentCountPerCell",
        value: function() {
            return Math.floor(this.getRenderingStrategy()._getAppointmentMaxWidth() / APPOINTMENT_INCREASED_WIDTH)
        }
    }, {
        key: "_getAppointmentDefaultWidth",
        value: function() {
            return APPOINTMENT_DEFAULT_WIDTH
        }
    }]);
    return AppointmentPositioningStrategy
}();
module.exports = AppointmentPositioningStrategy;
