/**
 * DevExtreme (ui/file_manager/ui.file_manager.dialog.name_editor.js)
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
var _text_box = require("../text_box");
var _text_box2 = _interopRequireDefault(_text_box);
var _uiFile_managerDialog = require("./ui.file_manager.dialog.js");
var _uiFile_managerDialog2 = _interopRequireDefault(_uiFile_managerDialog);

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
var FILE_MANAGER_DIALOG_NAME_EDITOR = "dx-filemanager-dialog-name-editor";
var FILE_MANAGER_DIALOG_NAME_EDITOR_POPUP = "dx-filemanager-dialog-name-editor-popup";
var FileManagerNameEditorDialog = function(_FileManagerDialogBas) {
    _inherits(FileManagerNameEditorDialog, _FileManagerDialogBas);

    function FileManagerNameEditorDialog() {
        _classCallCheck(this, FileManagerNameEditorDialog);
        return _possibleConstructorReturn(this, (FileManagerNameEditorDialog.__proto__ || Object.getPrototypeOf(FileManagerNameEditorDialog)).apply(this, arguments))
    }
    _createClass(FileManagerNameEditorDialog, [{
        key: "show",
        value: function(name) {
            name = name || "";
            if (this._nameTextBox) {
                this._nameTextBox.option("value", name)
            } else {
                this._initialNameValue = name
            }
            _get(FileManagerNameEditorDialog.prototype.__proto__ || Object.getPrototypeOf(FileManagerNameEditorDialog.prototype), "show", this).call(this)
        }
    }, {
        key: "_onPopupShown",
        value: function() {
            if (!this._nameTextBox) {
                return
            }
            var $textBoxInput = this._nameTextBox._input();
            $textBoxInput.length && $textBoxInput[0].select();
            this._nameTextBox.focus()
        }
    }, {
        key: "_getDialogOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerNameEditorDialog.prototype.__proto__ || Object.getPrototypeOf(FileManagerNameEditorDialog.prototype), "_getDialogOptions", this).call(this), {
                title: this.option("title"),
                buttonText: this.option("buttonText"),
                contentCssClass: FILE_MANAGER_DIALOG_NAME_EDITOR,
                popupCssClass: FILE_MANAGER_DIALOG_NAME_EDITOR_POPUP
            })
        }
    }, {
        key: "_createContentTemplate",
        value: function(element) {
            _get(FileManagerNameEditorDialog.prototype.__proto__ || Object.getPrototypeOf(FileManagerNameEditorDialog.prototype), "_createContentTemplate", this).call(this, element);
            this._nameTextBox = this._createComponent((0, _renderer2.default)("<div>"), _text_box2.default, {
                value: this._initialNameValue
            });
            this._$contentElement.append(this._nameTextBox.$element())
        }
    }, {
        key: "_getDialogResult",
        value: function() {
            var nameValue = this._nameTextBox.option("value");
            return nameValue ? {
                name: nameValue
            } : null
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerNameEditorDialog.prototype.__proto__ || Object.getPrototypeOf(FileManagerNameEditorDialog.prototype), "_getDefaultOptions", this).call(this), {
                title: "",
                buttonText: ""
            })
        }
    }]);
    return FileManagerNameEditorDialog
}(_uiFile_managerDialog2.default);
module.exports = FileManagerNameEditorDialog;
