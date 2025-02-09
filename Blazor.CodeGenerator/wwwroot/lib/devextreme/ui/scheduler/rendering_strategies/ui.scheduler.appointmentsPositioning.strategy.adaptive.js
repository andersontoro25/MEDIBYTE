/**
 * DevExtreme (ui/scheduler/rendering_strategies/ui.scheduler.appointmentsPositioning.strategy.adaptive.js)
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
var _uiSchedulerAppointmentsPositioningStrategy = require("./ui.scheduler.appointmentsPositioning.strategy.base");
var _uiSchedulerAppointmentsPositioningStrategy2 = _interopRequireDefault(_uiSchedulerAppointmentsPositioningStrategy);

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
var COLLECTOR_ADAPTIVE_SIZE = 28;
var COLLECTOR_ADAPTIVE_BOTTOM_OFFSET = 40;
var ADAPTIVE_APPOINTMENT_DEFAULT_OFFSET = 35;
var ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH = 30;
var AdaptivePositioningStrategy = function(_BasePositioningStrat) {
    _inherits(AdaptivePositioningStrategy, _BasePositioningStrat);

    function AdaptivePositioningStrategy() {
        _classCallCheck(this, AdaptivePositioningStrategy);
        return _possibleConstructorReturn(this, (AdaptivePositioningStrategy.__proto__ || Object.getPrototypeOf(AdaptivePositioningStrategy)).apply(this, arguments))
    }
    _createClass(AdaptivePositioningStrategy, [{
        key: "getDropDownAppointmentWidth",
        value: function(intervalCount, isAllDay) {
            return this.getDropDownButtonAdaptiveSize()
        }
    }, {
        key: "getDropDownButtonAdaptiveSize",
        value: function() {
            return COLLECTOR_ADAPTIVE_SIZE
        }
    }, {
        key: "getCompactAppointmentTopOffset",
        value: function(allDay) {
            var renderingStrategy = this.getRenderingStrategy();
            if (renderingStrategy.hasAllDayAppointments() && allDay) {
                return (renderingStrategy.getDefaultAllDayCellHeight() - renderingStrategy.getDropDownButtonAdaptiveSize()) / 2
            } else {
                return this.getRenderingStrategy().getDefaultCellHeight() - COLLECTOR_ADAPTIVE_BOTTOM_OFFSET
            }
        }
    }, {
        key: "getCompactAppointmentLeftOffset",
        value: function() {
            return (this.getRenderingStrategy().getDefaultCellWidth() - COLLECTOR_ADAPTIVE_SIZE) / 2
        }
    }, {
        key: "getAppointmentDefaultOffset",
        value: function() {
            return ADAPTIVE_APPOINTMENT_DEFAULT_OFFSET
        }
    }, {
        key: "getDynamicAppointmentCountPerCell",
        value: function() {
            var renderingStrategy = this.getRenderingStrategy();
            if (renderingStrategy.hasAllDayAppointments()) {
                return {
                    allDay: 0,
                    simple: this._calculateDynamicAppointmentCountPerCell() || this._getAppointmentMinCount()
                }
            } else {
                return 0
            }
        }
    }, {
        key: "getDropDownAppointmentHeight",
        value: function() {
            return COLLECTOR_ADAPTIVE_SIZE
        }
    }, {
        key: "_getAppointmentMinCount",
        value: function() {
            return 0
        }
    }, {
        key: "_getAppointmentDefaultWidth",
        value: function() {
            var renderingStrategy = this.getRenderingStrategy();
            if (renderingStrategy.hasAllDayAppointments()) {
                return ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH
            }
            return _get(AdaptivePositioningStrategy.prototype.__proto__ || Object.getPrototypeOf(AdaptivePositioningStrategy.prototype), "_getAppointmentDefaultWidth", this).call(this)
        }
    }, {
        key: "_calculateDynamicAppointmentCountPerCell",
        value: function() {
            return Math.floor(this.getRenderingStrategy()._getAppointmentMaxWidth() / this.getRenderingStrategy()._getAppointmentDefaultWidth())
        }
    }]);
    return AdaptivePositioningStrategy
}(_uiSchedulerAppointmentsPositioningStrategy2.default);
module.exports = AdaptivePositioningStrategy;
