/**
 * DevExtreme (ui/text_box/utils.caret.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _type = require("../../core/utils/type");
var _browser = require("../../core/utils/browser");
var _browser2 = _interopRequireDefault(_browser);
var _dom_adapter = require("../../core/dom_adapter");
var _dom_adapter2 = _interopRequireDefault(_dom_adapter);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var isFocusingOnCaretChange = _browser2.default.msie || _browser2.default.safari;
var getCaret = function(input) {
    var range = void 0;
    try {
        range = {
            start: input.selectionStart,
            end: input.selectionEnd
        }
    } catch (e) {
        range = {
            start: 0,
            end: 0
        }
    }
    return range
};
var setCaret = function(input, position) {
    if (!_dom_adapter2.default.getBody().contains(input)) {
        return
    }
    try {
        input.selectionStart = position.start;
        input.selectionEnd = position.end
    } catch (e) {}
};
var caret = function(input, position) {
    input = (0, _renderer2.default)(input).get(0);
    if (!(0, _type.isDefined)(position)) {
        return getCaret(input)
    }
    if (isFocusingOnCaretChange && _dom_adapter2.default.getActiveElement() !== input) {
        return
    }
    setCaret(input, position)
};
module.exports = caret;
