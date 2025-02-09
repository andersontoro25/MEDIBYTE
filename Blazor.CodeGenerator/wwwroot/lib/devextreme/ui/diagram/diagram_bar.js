/**
 * DevExtreme (ui/diagram/diagram_bar.js)
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
var _diagram_importer = require("./diagram_importer");

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function")
    }
}
var DiagramBar = function() {
    function DiagramBar(owner) {
        _classCallCheck(this, DiagramBar);
        var _getDiagram = (0, _diagram_importer.getDiagram)(),
            EventDispatcher = _getDiagram.EventDispatcher;
        this.onChanged = new EventDispatcher;
        this._owner = owner
    }
    _createClass(DiagramBar, [{
        key: "raiseBarCommandExecuted",
        value: function(key, parameter) {
            this.onChanged.raise("NotifyBarCommandExecuted", parseInt(key), parameter)
        }
    }, {
        key: "getCommandKeys",
        value: function() {
            throw "Not Implemented"
        }
    }, {
        key: "setItemValue",
        value: function(key, value) {}
    }, {
        key: "setItemEnabled",
        value: function(key, enabled) {}
    }, {
        key: "setItemVisible",
        value: function(key, enabled) {}
    }, {
        key: "setEnabled",
        value: function(enabled) {}
    }, {
        key: "setItemSubItems",
        value: function(key, items) {}
    }, {
        key: "isVisible",
        value: function() {
            return true
        }
    }]);
    return DiagramBar
}();
module.exports = DiagramBar;
