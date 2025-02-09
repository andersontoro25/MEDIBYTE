/**
 * DevExtreme (ui/html_editor/formats/mention.js)
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
var _quill_importer = require("../quill_importer");
var _renderer = require("../../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);

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
var quill = (0, _quill_importer.getQuill)();
var Embed = quill.import("blots/embed");
var MENTION_CLASS = "dx-mention";
var Mention = function(_Embed) {
    _inherits(Mention, _Embed);

    function Mention() {
        _classCallCheck(this, Mention);
        return _possibleConstructorReturn(this, (Mention.__proto__ || Object.getPrototypeOf(Mention)).apply(this, arguments))
    }
    _createClass(Mention, null, [{
        key: "create",
        value: function(data) {
            var node = _get(Mention.__proto__ || Object.getPrototypeOf(Mention), "create", this).call(this);
            node.setAttribute("spellcheck", false);
            node.dataset.marker = data.marker;
            node.dataset.mentionValue = data.value;
            node.dataset.id = data.id;
            this.renderContent(node, data);
            return node
        }
    }, {
        key: "value",
        value: function(node) {
            return {
                marker: node.dataset.marker,
                id: node.dataset.id,
                value: node.dataset.mentionValue
            }
        }
    }, {
        key: "renderContent",
        value: function(node, data) {
            var template = this._templates.get(data.marker);
            if (template) {
                template.render({
                    model: data,
                    container: node
                })
            } else {
                this.baseContentRender(node, data)
            }
        }
    }, {
        key: "baseContentRender",
        value: function(node, data) {
            var $marker = (0, _renderer2.default)("<span>").text(data.marker);
            (0, _renderer2.default)(node).append($marker).append(data.value)
        }
    }, {
        key: "addTemplate",
        value: function(marker, template) {
            this._templates.set(marker, template)
        }
    }, {
        key: "removeTemplate",
        value: function(marker) {
            this._templates.delete(marker)
        }
    }]);
    return Mention
}(Embed);
Mention.blotName = "mention";
Mention.tagName = "span";
Mention.className = MENTION_CLASS;
Mention._templates = new Map;
exports.default = Mention;
