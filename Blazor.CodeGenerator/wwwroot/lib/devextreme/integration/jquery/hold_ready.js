/**
 * DevExtreme (integration/jquery/hold_ready.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var jQuery = require("jquery"),
    themes_callback = require("../../ui/themes_callback"),
    ready = require("../../core/utils/ready_callbacks").add;
if (jQuery && !themes_callback.fired()) {
    var holdReady = jQuery.holdReady || jQuery.fn.holdReady;
    holdReady(true);
    themes_callback.add(function() {
        ready(function() {
            holdReady(false)
        })
    })
}
