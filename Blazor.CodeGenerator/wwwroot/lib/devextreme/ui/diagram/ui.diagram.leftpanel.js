/**
 * DevExtreme (ui/diagram/ui.diagram.leftpanel.js)
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
var _diagram = require("./diagram.panel");
var _diagram2 = _interopRequireDefault(_diagram);
var _accordion = require("../accordion");
var _accordion2 = _interopRequireDefault(_accordion);
var _scroll_view = require("../scroll_view");
var _scroll_view2 = _interopRequireDefault(_scroll_view);
var _uiDiagramShape = require("./ui.diagram.shape.categories");
var _uiDiagramShape2 = _interopRequireDefault(_uiDiagramShape);
var _deferred = require("../../core/utils/deferred");

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
var DIAGRAM_LEFT_PANEL_CLASS = "dx-diagram-left-panel";
var DiagramLeftPanel = function(_DiagramPanel) {
    _inherits(DiagramLeftPanel, _DiagramPanel);

    function DiagramLeftPanel() {
        _classCallCheck(this, DiagramLeftPanel);
        return _possibleConstructorReturn(this, (DiagramLeftPanel.__proto__ || Object.getPrototypeOf(DiagramLeftPanel)).apply(this, arguments))
    }
    _createClass(DiagramLeftPanel, [{
        key: "_init",
        value: function() {
            _get(DiagramLeftPanel.prototype.__proto__ || Object.getPrototypeOf(DiagramLeftPanel.prototype), "_init", this).call(this);
            this._dataSources = this.option("dataSources") || {};
            this._customShapes = this.option("customShapes") || [];
            this._onShapeCategoryRenderedAction = this._createActionByOption("onShapeCategoryRendered");
            this._onDataToolboxRenderedAction = this._createActionByOption("onDataToolboxRendered")
        }
    }, {
        key: "_initMarkup",
        value: function() {
            _get(DiagramLeftPanel.prototype.__proto__ || Object.getPrototypeOf(DiagramLeftPanel.prototype), "_initMarkup", this).call(this);
            this.$element().addClass(DIAGRAM_LEFT_PANEL_CLASS);
            var $scrollViewWrapper = (0, _renderer2.default)("<div>").appendTo(this.$element());
            this._scrollView = this._createComponent($scrollViewWrapper, _scroll_view2.default);
            var $accordion = (0, _renderer2.default)("<div>").appendTo(this._scrollView.content());
            this._renderAccordion($accordion)
        }
    }, {
        key: "_getAccordionDataSource",
        value: function() {
            var _this2 = this;
            var result = [];
            var categories = _uiDiagramShape2.default.load(this._customShapes.length > 0);
            for (var i = 0; i < categories.length; i++) {
                result.push({
                    category: categories[i].category,
                    title: categories[i].title,
                    onTemplate: function(widget, $element, data) {
                        _this2._onShapeCategoryRenderedAction({
                            category: data.category,
                            $element: $element
                        })
                    }
                })
            }
            for (var key in this._dataSources) {
                if (Object.prototype.hasOwnProperty.call(this._dataSources, key)) {
                    result.push({
                        key: key,
                        title: this._dataSources[key].title,
                        onTemplate: function(widget, $element, data) {
                            _this2._onDataToolboxRenderedAction({
                                key: data.key,
                                $element: $element
                            })
                        }
                    });
                    this._hasDataSources = true
                }
            }
            return result
        }
    }, {
        key: "_renderAccordion",
        value: function($container) {
            var _this3 = this;
            var data = this._getAccordionDataSource();
            this._accordionInstance = this._createComponent($container, _accordion2.default, {
                multiple: true,
                collapsible: true,
                displayExpr: "title",
                dataSource: data,
                itemTemplate: function(data, index, $element) {
                    return data.onTemplate(_this3, $element, data)
                },
                onContentReady: function(e) {
                    _this3._updateScrollAnimateSubscription(e.component)
                }
            });
            if (this._customShapes.length > 0 || this._hasDataSources) {
                this._accordionInstance.collapseItem(0);
                this._accordionInstance.expandItem(data.length - 1)
            }
        }
    }, {
        key: "_updateScrollAnimateSubscription",
        value: function(component) {
            var _this4 = this;
            component._deferredAnimate = new _deferred.Deferred;
            component._deferredAnimate.done(function() {
                _this4._scrollView.update();
                _this4._updateScrollAnimateSubscription(component)
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "customShapes":
                    this._customShapes = args.value || [];
                    this._invalidate();
                    break;
                case "dataSources":
                    this._dataSources = args.value || {};
                    this._invalidate();
                    break;
                default:
                    _get(DiagramLeftPanel.prototype.__proto__ || Object.getPrototypeOf(DiagramLeftPanel.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }]);
    return DiagramLeftPanel
}(_diagram2.default);
module.exports = DiagramLeftPanel;
