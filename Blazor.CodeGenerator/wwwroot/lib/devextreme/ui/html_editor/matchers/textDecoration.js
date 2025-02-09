/**
 * DevExtreme (ui/html_editor/matchers/textDecoration.js)
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
var _extend2 = require("../../../core/utils/extend");
var _type = require("../../../core/utils/type");

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
}

function getMatcher(quill) {
    var Delta = quill.import("delta");
    var applyFormat = function applyFormat(delta, format, value) {
        if ((0, _type.isObject)(format)) {
            return Object.keys(format).reduce(function(newDelta, key) {
                return applyFormat(newDelta, key, format[key])
            }, delta)
        }
        return delta.reduce(function(newDelta, op) {
            var attributes = op.attributes,
                insert = op.insert;
            if (attributes && attributes[format]) {
                return newDelta.push(op)
            }
            return newDelta.insert(insert, (0, _extend2.extend)({}, _defineProperty({}, format, value), attributes))
        }, new Delta)
    };
    return function(node, delta) {
        var formats = {};
        var _ref = node.style || {},
            textDecoration = _ref.textDecoration;
        var isLineThrough = textDecoration && textDecoration.indexOf("line-through") !== -1;
        var isUnderline = textDecoration && textDecoration.indexOf("underline") !== -1;
        if (isLineThrough) {
            formats.strike = true
        }
        if (isUnderline) {
            formats.underline = true
        }
        if (isLineThrough || isUnderline) {
            delta = applyFormat(delta, formats)
        }
        return delta
    }
}
exports.default = getMatcher;
