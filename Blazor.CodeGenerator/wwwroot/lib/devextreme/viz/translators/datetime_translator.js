/**
 * DevExtreme (viz/translators/datetime_translator.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";

function parse(value) {
    return null !== value ? new Date(value) : value
}
module.exports = {
    _fromValue: parse,
    _toValue: parse,
    _add: require("../../core/utils/date").addDateInterval
};
