/**
 * DevExtreme (ui/text_area.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _events_engine = require("../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _common = require("../core/utils/common");
var _window = require("../core/utils/window");
var _window2 = _interopRequireDefault(_window);
var _component_registrator = require("../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _extend = require("../core/utils/extend");
var _type = require("../core/utils/type");
var _utils = require("../events/utils");
var _utils2 = _interopRequireDefault(_utils);
var _pointer = require("../events/pointer");
var _pointer2 = _interopRequireDefault(_pointer);
var _uiEventsEmitterGesture = require("../ui/scroll_view/ui.events.emitter.gesture.scroll");
var _uiEventsEmitterGesture2 = _interopRequireDefault(_uiEventsEmitterGesture);
var _size = require("../core/utils/size");
var _size2 = _interopRequireDefault(_size);
var _text_box = require("./text_box");
var _text_box2 = _interopRequireDefault(_text_box);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var TEXTAREA_CLASS = "dx-textarea";
var TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";
var TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE = "dx-texteditor-input-auto-resize";
var TextArea = _text_box2.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            spellcheck: true,
            minHeight: void 0,
            maxHeight: void 0,
            autoResizeEnabled: false
        })
    },
    _initMarkup: function() {
        this.$element().addClass(TEXTAREA_CLASS);
        this.callBase();
        this.setAria("multiline", "true")
    },
    _renderContentImpl: function() {
        this._updateInputHeight();
        this.callBase()
    },
    _renderInput: function() {
        this.callBase();
        this._renderScrollHandler()
    },
    _createInput: function() {
        var $input = (0, _renderer2.default)("<textarea>");
        this._applyInputAttributes($input, this.option("inputAttr"));
        this._updateInputAutoResizeAppearance($input);
        return $input
    },
    _applyInputAttributes: function($input, customAttributes) {
        $input.attr(customAttributes).addClass(TEXTEDITOR_INPUT_CLASS)
    },
    _renderScrollHandler: function() {
        var _this = this;
        this._eventY = 0;
        var $input = this._input();
        var initScrollData = {
            validate: function(e) {
                if (_utils2.default.isDxMouseWheelEvent(e) && (0, _renderer2.default)(e.target).is(_this._input())) {
                    if (_this._allowScroll(-e.delta, e.shiftKey)) {
                        e._needSkipEvent = true;
                        return true
                    }
                    return false
                }
            }
        };
        _events_engine2.default.on($input, _utils2.default.addNamespace(_uiEventsEmitterGesture2.default.init, this.NAME), initScrollData, _common.noop);
        _events_engine2.default.on($input, _utils2.default.addNamespace(_pointer2.default.down, this.NAME), this._pointerDownHandler.bind(this));
        _events_engine2.default.on($input, _utils2.default.addNamespace(_pointer2.default.move, this.NAME), this._pointerMoveHandler.bind(this))
    },
    _pointerDownHandler: function(e) {
        this._eventY = _utils2.default.eventData(e).y
    },
    _pointerMoveHandler: function(e) {
        var currentEventY = _utils2.default.eventData(e).y;
        var delta = this._eventY - currentEventY;
        if (this._allowScroll(delta)) {
            e.isScrollingEvent = true;
            e.stopPropagation()
        } else {
            return false
        }
        this._eventY = currentEventY
    },
    _allowScroll: function(delta, shiftKey) {
        var $input = this._input();
        var scrollTopPos = shiftKey ? $input.scrollLeft() : $input.scrollTop();
        var prop = shiftKey ? "Width" : "Height";
        var scrollBottomPos = $input.prop("scroll" + prop) - $input.prop("client" + prop) - scrollTopPos;
        if (0 === scrollTopPos && 0 === scrollBottomPos) {
            return false
        }
        var isScrollFromTop = 0 === scrollTopPos && delta >= 0;
        var isScrollFromBottom = 0 === scrollBottomPos && delta <= 0;
        var isScrollFromMiddle = scrollTopPos > 0 && scrollBottomPos > 0;
        if (isScrollFromTop || isScrollFromBottom || isScrollFromMiddle) {
            return true
        }
    },
    _renderDimensions: function() {
        var $element = this.$element();
        var element = $element.get(0);
        var width = this._getOptionValue("width", element);
        var height = this._getOptionValue("height", element);
        var minHeight = this.option("minHeight");
        var maxHeight = this.option("maxHeight");
        $element.css({
            minHeight: void 0 !== minHeight ? minHeight : "",
            maxHeight: void 0 !== maxHeight ? maxHeight : "",
            width: width,
            height: height
        })
    },
    _resetDimensions: function() {
        this.$element().css({
            height: "",
            minHeight: "",
            maxHeight: ""
        })
    },
    _renderEvents: function() {
        if (this.option("autoResizeEnabled")) {
            _events_engine2.default.on(this._input(), _utils2.default.addNamespace("input paste", this.NAME), this._updateInputHeight.bind(this))
        }
        this.callBase()
    },
    _refreshEvents: function() {
        _events_engine2.default.off(this._input(), _utils2.default.addNamespace("input paste", this.NAME));
        this.callBase()
    },
    _getHeightDifference: function($input) {
        return _size2.default.getVerticalOffsets(this._$element.get(0), false) + _size2.default.getVerticalOffsets(this._$textEditorContainer.get(0), false) + _size2.default.getVerticalOffsets(this._$textEditorInputContainer.get(0), false) + _size2.default.getElementBoxParams("height", _window2.default.getWindow().getComputedStyle($input.get(0))).margin
    },
    _updateInputHeight: function() {
        var $input = this._input();
        var autoHeightResizing = void 0 === this.option("height") && this.option("autoResizeEnabled");
        if (!autoHeightResizing) {
            $input.css("height", "");
            return
        } else {
            this._resetDimensions();
            this._$element.css("height", this._$element.outerHeight())
        }
        $input.css("height", 0);
        var heightDifference = this._getHeightDifference($input);
        this._renderDimensions();
        var minHeight = this._getBoundaryHeight("minHeight"),
            maxHeight = this._getBoundaryHeight("maxHeight"),
            inputHeight = $input[0].scrollHeight;
        if (void 0 !== minHeight) {
            inputHeight = Math.max(inputHeight, minHeight - heightDifference)
        }
        if (void 0 !== maxHeight) {
            inputHeight = Math.min(inputHeight, maxHeight - heightDifference)
        }
        $input.css("height", inputHeight);
        if (autoHeightResizing) {
            this._$element.css("height", "auto")
        }
    },
    _getBoundaryHeight: function(optionName) {
        var boundaryValue = this.option(optionName);
        if ((0, _type.isDefined)(boundaryValue)) {
            return "number" === typeof boundaryValue ? boundaryValue : _size2.default.parseHeight(boundaryValue, this._$textEditorContainer.get(0))
        }
    },
    _renderInputType: _common.noop,
    _visibilityChanged: function(visible) {
        if (visible) {
            this._updateInputHeight()
        }
    },
    _updateInputAutoResizeAppearance: function($input) {
        if ($input) {
            $input.toggleClass(TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE, this.option("autoResizeEnabled"))
        }
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "autoResizeEnabled":
                this._updateInputAutoResizeAppearance(this._input());
                this._refreshEvents();
                this._updateInputHeight();
                break;
            case "value":
            case "height":
                this.callBase(args);
                this._updateInputHeight();
                break;
            case "minHeight":
            case "maxHeight":
                this._renderDimensions();
                this._updateInputHeight();
                break;
            case "visible":
                this.callBase(args);
                args.value && this._updateInputHeight();
                break;
            default:
                this.callBase(args)
        }
    }
});
(0, _component_registrator2.default)("dxTextArea", TextArea);
module.exports = TextArea;
module.exports.default = module.exports;
