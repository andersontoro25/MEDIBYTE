/**
 * DevExtreme (events.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var eventsEngine = require("./events/core/events_engine");
exports.on = eventsEngine.on;
exports.one = eventsEngine.one;
exports.off = eventsEngine.off;
exports.trigger = eventsEngine.trigger;
exports.triggerHandler = eventsEngine.triggerHandler;
exports.Event = eventsEngine.Event;
