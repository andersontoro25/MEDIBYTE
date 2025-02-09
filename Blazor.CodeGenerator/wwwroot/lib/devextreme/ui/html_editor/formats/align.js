/**
 * DevExtreme (ui/html_editor/formats/align.js)
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
var _quill_importer = require("../quill_importer");
var quill = (0, _quill_importer.getQuill)();
var AlignStyle = quill.import("attributors/style/align");
AlignStyle.whitelist.push("left");
exports.default = AlignStyle;
