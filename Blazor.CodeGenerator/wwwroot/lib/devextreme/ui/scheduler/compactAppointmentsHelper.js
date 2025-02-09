/**
 * DevExtreme (ui/scheduler/compactAppointmentsHelper.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CompactAppointmentsHelper = void 0;
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
var _button = require("../button");
var _button2 = _interopRequireDefault(_button);
var _translator = require("../../animation/translator");
var _translator2 = _interopRequireDefault(_translator);
var _message = require("../../localization/message");
var _message2 = _interopRequireDefault(_message);
var _function_template = require("../widget/function_template");
var _function_template2 = _interopRequireDefault(_function_template);
var _deferred = require("../../core/utils/deferred");
var _deferred2 = _interopRequireDefault(_deferred);

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
var APPOINTMENT_COLLECTOR_CLASS = "dx-scheduler-appointment-collector",
    COMPACT_APPOINTMENT_COLLECTOR_CLASS = APPOINTMENT_COLLECTOR_CLASS + "-compact",
    APPOINTMENT_COLLECTOR_CONTENT_CLASS = APPOINTMENT_COLLECTOR_CLASS + "-content";
var WEEK_VIEW_COLLECTOR_OFFSET = 5;
var COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET = 1;
var CompactAppointmentsHelper = exports.CompactAppointmentsHelper = function() {
    function CompactAppointmentsHelper(instance) {
        _classCallCheck(this, CompactAppointmentsHelper);
        this.instance = instance;
        this.elements = []
    }
    _createClass(CompactAppointmentsHelper, [{
        key: "render",
        value: function(options) {
            var $container = options.$container,
                width = options.width,
                height = options.height,
                items = options.items,
                isCompact = options.isCompact,
                applyOffset = options.applyOffset,
                coordinates = options.coordinates,
                buttonColor = options.buttonColor;
            var template = this._createTemplate(items.data.length, isCompact);
            var button = this._createCompactButton($container, width, height, template, items, isCompact, applyOffset, coordinates);
            var $button = button.$element();
            this._makeBackgroundColor($button, items.colors, buttonColor);
            this._makeBackgroundDarker($button);
            this.elements.push($button);
            $button.data("items", this._createAppointmentsData(items));
            return $button
        }
    }, {
        key: "clear",
        value: function() {
            this.elements.forEach(function(button) {
                button.detach();
                button.remove()
            });
            this.elements = []
        }
    }, {
        key: "_createAppointmentsData",
        value: function(items) {
            return items.data.map(function(item, index) {
                return {
                    data: item,
                    color: items.colors[index]
                }
            })
        }
    }, {
        key: "_onButtonClick",
        value: function(e) {
            var $button = (0, _renderer2.default)(e.element);
            this.instance.showAppointmentTooltipCore($button, $button.data("items"))
        }
    }, {
        key: "_getCollectorOffset",
        value: function(width) {
            return this.instance.fire("getCellWidth") - width - this._getCollectorRightOffset()
        }
    }, {
        key: "_getCollectorRightOffset",
        value: function() {
            return this.instance.getRenderingStrategyInstance()._isCompactTheme() ? COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET : WEEK_VIEW_COLLECTOR_OFFSET
        }
    }, {
        key: "_makeBackgroundDarker",
        value: function(button) {
            button.css("boxShadow", "inset " + button.get(0).getBoundingClientRect().width + "px 0 0 0 rgba(0, 0, 0, 0.3)")
        }
    }, {
        key: "_makeBackgroundColor",
        value: function($button, colors, color) {
            _deferred2.default.when.apply(null, colors).done(function() {
                this._makeBackgroundColorCore($button, color, arguments)
            }.bind(this))
        }
    }, {
        key: "_makeBackgroundColorCore",
        value: function($button, color, itemsColors) {
            var paintButton = true,
                currentItemColor = void 0;
            color && color.done(function(color) {
                if (itemsColors.length) {
                    currentItemColor = itemsColors[0];
                    for (var i = 1; i < itemsColors.length; i++) {
                        if (currentItemColor !== itemsColors[i]) {
                            paintButton = false;
                            break
                        }
                        currentItemColor = color
                    }
                }
                color && paintButton && $button.css("backgroundColor", color)
            }.bind(this))
        }
    }, {
        key: "_setPosition",
        value: function(element, position) {
            _translator2.default.move(element, {
                top: position.top,
                left: position.left
            })
        }
    }, {
        key: "_createCompactButton",
        value: function($container, width, height, template, items, isCompact, applyOffset, coordinates) {
            var _this = this;
            var $button = this._createCompactButtonElement($container, width, isCompact, applyOffset, coordinates);
            return this.instance._createComponent($button, _button2.default, {
                type: "default",
                width: width,
                height: height,
                onClick: function(e) {
                    return _this._onButtonClick(e)
                },
                template: this._renderTemplate(template, items, isCompact)
            })
        }
    }, {
        key: "_createCompactButtonElement",
        value: function($container, width, isCompact, applyOffset, coordinates) {
            var result = (0, _renderer2.default)("<div>").addClass(APPOINTMENT_COLLECTOR_CLASS).toggleClass(COMPACT_APPOINTMENT_COLLECTOR_CLASS, isCompact).appendTo($container);
            var offset = applyOffset ? this._getCollectorOffset(width) : 0;
            this._setPosition(result, {
                top: coordinates.top,
                left: coordinates.left + offset
            });
            return result
        }
    }, {
        key: "_renderTemplate",
        value: function(template, items, isCompact) {
            return new _function_template2.default(function(options) {
                return template.render({
                    model: {
                        appointmentCount: items.data.length,
                        isCompact: isCompact
                    },
                    container: options.container
                })
            })
        }
    }, {
        key: "_createTemplate",
        value: function(count, isCompact) {
            this._initButtonTemplate(count, isCompact);
            return this.instance._getAppointmentTemplate("appointmentCollectorTemplate")
        }
    }, {
        key: "_initButtonTemplate",
        value: function(count, isCompact) {
            var _this2 = this;
            this.instance._defaultTemplates.appointmentCollector = new _function_template2.default(function(options) {
                return _this2._createButtonTemplate(count, (0, _renderer2.default)(options.container), isCompact)
            })
        }
    }, {
        key: "_createButtonTemplate",
        value: function(appointmentCount, element, isCompact) {
            var text = isCompact ? appointmentCount : _message2.default.getFormatter("dxScheduler-moreAppointments")(appointmentCount);
            return element.append((0, _renderer2.default)("<span>").text(text)).addClass(APPOINTMENT_COLLECTOR_CONTENT_CLASS)
        }
    }]);
    return CompactAppointmentsHelper
}();
