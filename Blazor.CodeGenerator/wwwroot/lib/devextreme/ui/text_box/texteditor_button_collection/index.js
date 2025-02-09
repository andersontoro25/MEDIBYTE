/**
 * DevExtreme (ui/text_box/texteditor_button_collection/index.js)
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
var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
    return typeof obj
} : function(obj) {
    return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
};
var _renderer = require("../../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _custom = require("./custom");
var _custom2 = _interopRequireDefault(_custom);
var _extend = require("../../../core/utils/extend");
var _array = require("../../../core/utils/array");
var _ui = require("../../widget/ui.errors");
var _ui2 = _interopRequireDefault(_ui);

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
var TEXTEDITOR_BUTTONS_CONTAINER_CLASS = "dx-texteditor-buttons-container";

function checkButtonInfo(buttonInfo) {
    var checkButtonType = function() {
        if (!buttonInfo || "object" !== ("undefined" === typeof buttonInfo ? "undefined" : _typeof(buttonInfo)) || Array.isArray(buttonInfo)) {
            throw _ui2.default.Error("E1053")
        }
    };
    var checkLocation = function() {
        var location = buttonInfo.location;
        if ("location" in buttonInfo && "after" !== location && "before" !== location) {
            buttonInfo.location = "after"
        }
    };
    var checkNameIsDefined = function() {
        if (!("name" in buttonInfo)) {
            throw _ui2.default.Error("E1054")
        }
    };
    var checkNameIsString = function() {
        var name = buttonInfo.name;
        if ("string" !== typeof name) {
            throw _ui2.default.Error("E1055")
        }
    };
    checkButtonType();
    checkNameIsDefined();
    checkNameIsString();
    checkLocation()
}

function checkNamesUniqueness(existingNames, newName) {
    if (existingNames.indexOf(newName) !== -1) {
        throw _ui2.default.Error("E1055", newName)
    }
    existingNames.push(newName)
}

function isPredefinedButtonName(name, predefinedButtonsInfo) {
    return !!(0, _array.find)(predefinedButtonsInfo, function(info) {
        return info.name === name
    })
}
var TextEditorButtonCollection = function() {
    function TextEditorButtonCollection(editor, defaultButtonsInfo) {
        _classCallCheck(this, TextEditorButtonCollection);
        this.buttons = [];
        this.defaultButtonsInfo = defaultButtonsInfo;
        this.editor = editor
    }
    _createClass(TextEditorButtonCollection, [{
        key: "_compileButtonInfo",
        value: function(buttons) {
            var _this = this;
            var names = [];
            return buttons.map(function(button) {
                var isStringButton = "string" === typeof button;
                if (!isStringButton) {
                    checkButtonInfo(button)
                }
                var isDefaultButton = isStringButton || isPredefinedButtonName(button.name, _this.defaultButtonsInfo);
                if (isDefaultButton) {
                    var defaultButtonInfo = (0, _array.find)(_this.defaultButtonsInfo, function(_ref) {
                        var name = _ref.name;
                        return name === button || name === button.name
                    });
                    if (!defaultButtonInfo) {
                        throw _ui2.default.Error("E1056", _this.editor.NAME, button)
                    }
                    checkNamesUniqueness(names, button);
                    return defaultButtonInfo
                } else {
                    var name = button.name;
                    checkNamesUniqueness(names, name);
                    return (0, _extend.extend)(button, {
                        Ctor: _custom2.default
                    })
                }
            })
        }
    }, {
        key: "_createButton",
        value: function(buttonsInfo) {
            var Ctor = buttonsInfo.Ctor,
                options = buttonsInfo.options,
                name = buttonsInfo.name;
            var button = new Ctor(name, this.editor, options);
            this.buttons.push(button);
            return button
        }
    }, {
        key: "_renderButtons",
        value: function(buttons, $container, targetLocation) {
            var _this2 = this;
            var $buttonsContainer = null;
            var buttonsInfo = buttons ? this._compileButtonInfo(buttons) : this.defaultButtonsInfo;
            var getButtonsContainer = function() {
                $buttonsContainer = $buttonsContainer || (0, _renderer2.default)("<div>").addClass(TEXTEDITOR_BUTTONS_CONTAINER_CLASS);
                "before" === targetLocation ? $container.prepend($buttonsContainer) : $container.append($buttonsContainer);
                return $buttonsContainer
            };
            buttonsInfo.forEach(function(buttonsInfo) {
                var _buttonsInfo$location = buttonsInfo.location,
                    location = void 0 === _buttonsInfo$location ? "after" : _buttonsInfo$location;
                if (location === targetLocation) {
                    _this2._createButton(buttonsInfo).render(getButtonsContainer())
                }
            });
            return $buttonsContainer
        }
    }, {
        key: "clean",
        value: function() {
            this.buttons.forEach(function(button) {
                return button.dispose()
            });
            this.buttons = []
        }
    }, {
        key: "getButton",
        value: function(buttonName) {
            var button = (0, _array.find)(this.buttons, function(_ref2) {
                var name = _ref2.name;
                return name === buttonName
            });
            return button && button.instance
        }
    }, {
        key: "renderAfterButtons",
        value: function(buttons, $container) {
            return this._renderButtons(buttons, $container, "after")
        }
    }, {
        key: "renderBeforeButtons",
        value: function(buttons, $container) {
            return this._renderButtons(buttons, $container, "before")
        }
    }, {
        key: "updateButtons",
        value: function(names) {
            this.buttons.forEach(function(button) {
                if (!names || names.indexOf(button.name) !== -1) {
                    button.update()
                }
            })
        }
    }]);
    return TextEditorButtonCollection
}();
exports.default = TextEditorButtonCollection;
