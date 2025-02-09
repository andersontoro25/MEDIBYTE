/**
 * DevExtreme (ui/file_manager/ui.file_manager.dialog.js)
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
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _extend = require("../../core/utils/extend");
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);
var _popup = require("../popup");
var _popup2 = _interopRequireDefault(_popup);

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
var FILE_MANAGER_DIALOG_CONTENT = "dx-filemanager-dialog";
var FILE_MANAGER_DIALOG_POPUP = "dx-filemanager-dialog-popup";
var FileManagerDialogBase = function(_Widget) {
    _inherits(FileManagerDialogBase, _Widget);

    function FileManagerDialogBase() {
        _classCallCheck(this, FileManagerDialogBase);
        return _possibleConstructorReturn(this, (FileManagerDialogBase.__proto__ || Object.getPrototypeOf(FileManagerDialogBase)).apply(this, arguments))
    }
    _createClass(FileManagerDialogBase, [{
        key: "_initMarkup",
        value: function() {
            _get(FileManagerDialogBase.prototype.__proto__ || Object.getPrototypeOf(FileManagerDialogBase.prototype), "_initMarkup", this).call(this);
            this._createOnClosedAction();
            var options = this._getDialogOptions();
            var $popup = (0, _renderer2.default)("<div>").addClass(FILE_MANAGER_DIALOG_POPUP).appendTo(this.$element());
            if (options.popupCssClass) {
                $popup.addClass(options.popupCssClass)
            }
            this._popup = this._createComponent($popup, _popup2.default, {
                showTitle: true,
                title: options.title,
                visible: false,
                closeOnOutsideClick: true,
                contentTemplate: this._createContentTemplate.bind(this),
                toolbarItems: [{
                    widget: "dxButton",
                    toolbar: "bottom",
                    location: "after",
                    options: {
                        text: options.buttonText,
                        onClick: this._onButtonClick.bind(this)
                    }
                }],
                onHidden: this._onPopupHidden.bind(this),
                onShown: this._onPopupShown.bind(this)
            })
        }
    }, {
        key: "show",
        value: function() {
            this._dialogResult = null;
            this._popup.show()
        }
    }, {
        key: "_getDialogOptions",
        value: function() {
            return {
                title: "Title",
                buttonText: "ButtonText",
                contentCssClass: "",
                popupCssClass: ""
            }
        }
    }, {
        key: "_createContentTemplate",
        value: function(element) {
            this._$contentElement = (0, _renderer2.default)("<div>").appendTo(element).addClass(FILE_MANAGER_DIALOG_CONTENT);
            var cssClass = this._getDialogOptions().contentCssClass;
            if (cssClass) {
                this._$contentElement.addClass(cssClass)
            }
        }
    }, {
        key: "_getDialogResult",
        value: function() {
            return null
        }
    }, {
        key: "_onButtonClick",
        value: function() {
            var result = this._getDialogResult();
            if (result) {
                this._dialogResult = result;
                this._popup.hide()
            }
        }
    }, {
        key: "_onPopupHidden",
        value: function() {
            this._onClosedAction({
                dialogResult: this._dialogResult
            })
        }
    }, {
        key: "_onPopupShown",
        value: function() {}
    }, {
        key: "_createOnClosedAction",
        value: function() {
            this._onClosedAction = this._createActionByOption("onClosed")
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerDialogBase.prototype.__proto__ || Object.getPrototypeOf(FileManagerDialogBase.prototype), "_getDefaultOptions", this).call(this), {
                onClosed: null
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "onClosed":
                    this._createOnPathChangedAction();
                    break;
                default:
                    _get(FileManagerDialogBase.prototype.__proto__ || Object.getPrototypeOf(FileManagerDialogBase.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }]);
    return FileManagerDialogBase
}(_ui2.default);
module.exports = FileManagerDialogBase;
