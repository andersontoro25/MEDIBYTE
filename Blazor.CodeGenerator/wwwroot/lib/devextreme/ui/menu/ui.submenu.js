/**
 * DevExtreme (ui/menu/ui.submenu.js)
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
var _common = require("../../core/utils/common");
var _dom = require("../../core/utils/dom");
var _position = require("../../animation/position");
var _extend = require("../../core/utils/extend");
var _context_menu = require("../context_menu");
var _context_menu2 = _interopRequireDefault(_context_menu);

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
var DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS = "dx-context-menu-content-delimiter";
var DX_SUBMENU_CLASS = "dx-submenu";
var Submenu = function(_ContextMenu) {
    _inherits(Submenu, _ContextMenu);

    function Submenu() {
        _classCallCheck(this, Submenu);
        return _possibleConstructorReturn(this, (Submenu.__proto__ || Object.getPrototypeOf(Submenu)).apply(this, arguments))
    }
    _createClass(Submenu, [{
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(Submenu.prototype.__proto__ || Object.getPrototypeOf(Submenu.prototype), "_getDefaultOptions", this).call(this), {
                orientation: "horizontal",
                tabIndex: null,
                onHoverStart: _common.noop
            })
        }
    }, {
        key: "_initDataAdapter",
        value: function() {
            this._dataAdapter = this.option("_dataAdapter");
            if (!this._dataAdapter) {
                _get(Submenu.prototype.__proto__ || Object.getPrototypeOf(Submenu.prototype), "_initDataAdapter", this).call(this)
            }
        }
    }, {
        key: "_renderContentImpl",
        value: function() {
            this._renderContextMenuOverlay();
            _get(Submenu.prototype.__proto__ || Object.getPrototypeOf(Submenu.prototype), "_renderContentImpl", this).call(this);
            var node = this._dataAdapter.getNodeByKey(this.option("_parentKey"));
            node && this._renderItems(this._getChildNodes(node));
            this._renderDelimiter()
        }
    }, {
        key: "_renderDelimiter",
        value: function() {
            this.$contentDelimiter = (0, _renderer2.default)("<div>").appendTo(this._itemContainer()).addClass(DX_CONTEXT_MENU_CONTENT_DELIMITER_CLASS)
        }
    }, {
        key: "_getOverlayOptions",
        value: function() {
            return (0, _extend.extend)(_get(Submenu.prototype.__proto__ || Object.getPrototypeOf(Submenu.prototype), "_getOverlayOptions", this).call(this), {
                onPositioned: this._overlayPositionedActionHandler.bind(this)
            })
        }
    }, {
        key: "_overlayPositionedActionHandler",
        value: function(arg) {
            this._showDelimiter(arg)
        }
    }, {
        key: "_hoverEndHandler",
        value: function(e) {
            _get(Submenu.prototype.__proto__ || Object.getPrototypeOf(Submenu.prototype), "_hoverEndHandler", this).call(this, e);
            this._toggleFocusClass(false, e.currentTarget)
        }
    }, {
        key: "_isMenuHorizontal",
        value: function() {
            return "horizontal" === this.option("orientation")
        }
    }, {
        key: "_hoverStartHandler",
        value: function(e) {
            var hoverStartAction = this.option("onHoverStart");
            hoverStartAction(e);
            _get(Submenu.prototype.__proto__ || Object.getPrototypeOf(Submenu.prototype), "_hoverStartHandler", this).call(this, e);
            this._toggleFocusClass(true, e.currentTarget)
        }
    }, {
        key: "_drawSubmenu",
        value: function($rootItem) {
            this._actions.onShowing({
                rootItem: (0, _dom.getPublicElement)($rootItem),
                submenu: this
            });
            _get(Submenu.prototype.__proto__ || Object.getPrototypeOf(Submenu.prototype), "_drawSubmenu", this).call(this, $rootItem);
            this._actions.onShown({
                rootItem: (0, _dom.getPublicElement)($rootItem),
                submenu: this
            })
        }
    }, {
        key: "_hideSubmenu",
        value: function($rootItem) {
            this._actions.onHiding({
                cancel: true,
                rootItem: (0, _dom.getPublicElement)($rootItem),
                submenu: this
            });
            _get(Submenu.prototype.__proto__ || Object.getPrototypeOf(Submenu.prototype), "_hideSubmenu", this).call(this, $rootItem);
            this._actions.onHidden({
                rootItem: (0, _dom.getPublicElement)($rootItem),
                submenu: this
            })
        }
    }, {
        key: "_showDelimiter",
        value: function(arg) {
            if (!this.$contentDelimiter) {
                return
            }
            var $submenu = this._itemContainer().children("." + DX_SUBMENU_CLASS).eq(0);
            var $rootItem = this.option("position").of;
            var position = {
                of: $submenu
            };
            var containerOffset = arg.position;
            var vLocation = containerOffset.v.location;
            var hLocation = containerOffset.h.location;
            var rootOffset = $rootItem.offset();
            var offsetLeft = Math.round(rootOffset.left);
            var offsetTop = Math.round(rootOffset.top);
            var rootWidth = $rootItem.width();
            var rootHeight = $rootItem.height();
            var submenuWidth = $submenu.width();
            var submenuHeight = $submenu.height();
            this.$contentDelimiter.css("display", "block");
            this.$contentDelimiter.width(this._isMenuHorizontal() ? rootWidth < submenuWidth ? rootWidth - 2 : submenuWidth : 2);
            this.$contentDelimiter.height(this._isMenuHorizontal() ? 2 : rootHeight < submenuHeight ? rootHeight - 2 : submenuHeight);
            if (this._isMenuHorizontal()) {
                if (vLocation > offsetTop) {
                    if (Math.round(hLocation) === offsetLeft) {
                        position.offset = "1 -1";
                        position.at = position.my = "left top"
                    } else {
                        position.offset = "-1 -1";
                        position.at = position.my = "right top"
                    }
                } else {
                    this.$contentDelimiter.height(5);
                    if (Math.round(hLocation) === offsetLeft) {
                        position.offset = "1 4";
                        position.at = position.my = "left bottom"
                    } else {
                        position.offset = "-1 2";
                        position.at = position.my = "right bottom"
                    }
                }
            } else {
                if (hLocation > offsetLeft) {
                    if (Math.round(vLocation) === offsetTop) {
                        position.offset = "-1 1";
                        position.at = position.my = "left top"
                    } else {
                        position.offset = "-1 -1";
                        position.at = position.my = "left bottom"
                    }
                } else {
                    if (Math.round(vLocation) === offsetTop) {
                        position.offset = "1 1";
                        position.at = position.my = "right top"
                    } else {
                        position.offset = "1 -1";
                        position.at = position.my = "right bottom"
                    }
                }
            }(0, _position.setup)(this.$contentDelimiter, position)
        }
    }, {
        key: "_getContextMenuPosition",
        value: function() {
            return this.option("position")
        }
    }, {
        key: "isOverlayVisible",
        value: function() {
            return this._overlay.option("visible")
        }
    }, {
        key: "getOverlayContent",
        value: function() {
            return this._overlay.$content()
        }
    }]);
    return Submenu
}(_context_menu2.default);
module.exports = Submenu;
