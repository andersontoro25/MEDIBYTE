/**
 * DevExtreme (ui/diagram/ui.diagram.toolbar.js)
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
var _toolbar = require("../toolbar");
var _toolbar2 = _interopRequireDefault(_toolbar);
var _context_menu = require("../context_menu");
var _context_menu2 = _interopRequireDefault(_context_menu);
var _uiDiagram = require("./ui.diagram.commands");
var _uiDiagram2 = _interopRequireDefault(_uiDiagram);
var _diagram_bar = require("./diagram_bar");
var _diagram_bar2 = _interopRequireDefault(_diagram_bar);
var _extend = require("../../core/utils/extend");
require("../select_box");
require("../color_box");
require("../check_box");

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
var ACTIVE_FORMAT_CLASS = "dx-format-active";
var TOOLBAR_CLASS = "dx-diagram-toolbar";
var WIDGET_COMMANDS = [{
    command: "options",
    icon: "preferences",
    hint: "Show Properties",
    text: "Properties"
}];
var TOOLBAR_SEPARATOR_CLASS = "dx-diagram-toolbar-separator";
var TOOLBAR_MENU_SEPARATOR_CLASS = "dx-diagram-toolbar-menu-separator";
var DiagramToolbar = function(_DiagramPanel) {
    _inherits(DiagramToolbar, _DiagramPanel);

    function DiagramToolbar() {
        _classCallCheck(this, DiagramToolbar);
        return _possibleConstructorReturn(this, (DiagramToolbar.__proto__ || Object.getPrototypeOf(DiagramToolbar)).apply(this, arguments))
    }
    _createClass(DiagramToolbar, [{
        key: "_init",
        value: function() {
            this.bar = new ToolbarDiagramBar(this);
            this._itemHelpers = {};
            this._contextMenus = [];
            this._createOnWidgetCommand();
            _get(DiagramToolbar.prototype.__proto__ || Object.getPrototypeOf(DiagramToolbar.prototype), "_init", this).call(this)
        }
    }, {
        key: "_initMarkup",
        value: function() {
            _get(DiagramToolbar.prototype.__proto__ || Object.getPrototypeOf(DiagramToolbar.prototype), "_initMarkup", this).call(this);
            var $toolbar = (0, _renderer2.default)("<div>").addClass(TOOLBAR_CLASS).appendTo(this._$element);
            this._renderToolbar($toolbar)
        }
    }, {
        key: "_renderToolbar",
        value: function($toolbar) {
            var dataSource = this._prepareToolbarItems(_uiDiagram2.default.getToolbar(), "before", this._execDiagramCommand);
            dataSource = dataSource.concat(this._prepareToolbarItems(WIDGET_COMMANDS, "after", this._execWidgetCommand));
            this._toolbarInstance = this._createComponent($toolbar, _toolbar2.default, {
                dataSource: dataSource
            })
        }
    }, {
        key: "_prepareToolbarItems",
        value: function(items, location, actionHandler) {
            var _this2 = this;
            return items.map(function(item) {
                return (0, _extend.extend)(true, {
                    location: location,
                    locateInMenu: "auto"
                }, _this2._createItem(item, location, actionHandler), _this2._createItemOptions(item), _this2._createItemActionOptions(item, actionHandler))
            })
        }
    }, {
        key: "_createItem",
        value: function(item, location, actionHandler) {
            var _this3 = this;
            if ("separator" === item.widget) {
                return {
                    template: function(data, index, element) {
                        (0, _renderer2.default)(element).addClass(TOOLBAR_SEPARATOR_CLASS)
                    },
                    menuItemTemplate: function(data, index, element) {
                        (0, _renderer2.default)(element).addClass(TOOLBAR_MENU_SEPARATOR_CLASS)
                    }
                }
            }
            return {
                widget: item.widget || "dxButton",
                cssClass: item.cssClass,
                options: {
                    stylingMode: "text",
                    text: item.text,
                    hint: item.hint,
                    icon: item.icon,
                    onInitialized: function(e) {
                        return _this3._onItemInitialized(e.component, item)
                    },
                    onContentReady: function(e) {
                        return _this3._onItemContentReady(e.component, item, actionHandler)
                    }
                }
            }
        }
    }, {
        key: "_createItemOptions",
        value: function(_ref) {
            var widget = _ref.widget,
                items = _ref.items,
                valueExpr = _ref.valueExpr,
                displayExpr = _ref.displayExpr,
                showText = _ref.showText,
                hint = _ref.hint,
                icon = _ref.icon;
            if ("dxSelectBox" === widget) {
                return this._createSelectBoxItemOptions(hint, items, valueExpr, displayExpr)
            } else {
                if ("dxColorBox" === widget) {
                    return this._createColorBoxItemOptions(hint, icon)
                } else {
                    if (!widget || "dxButton" === widget) {
                        return {
                            showText: showText || "inMenu"
                        }
                    }
                }
            }
        }
    }, {
        key: "_createSelectBoxItemOptions",
        value: function(hint, items, valueExpr, displayExpr) {
            var options = this._createSelectBoxBaseItemOptions(hint);
            options = (0, _extend.extend)(true, options, {
                options: {
                    items: items,
                    valueExpr: valueExpr,
                    displayExpr: displayExpr
                }
            });
            var isSelectButton = items.every(function(i) {
                return void 0 !== i.icon
            });
            if (isSelectButton) {
                options = (0, _extend.extend)(true, options, {
                    options: {
                        fieldTemplate: function(data, container) {
                            (0, _renderer2.default)("<i>").addClass(data && data.icon).appendTo(container);
                            (0, _renderer2.default)("<div>").dxTextBox({
                                readOnly: true,
                                stylingMode: "outlined"
                            }).appendTo(container)
                        },
                        itemTemplate: function(data) {
                            return '<i class="' + data.icon + '"' + (data.hint && ' title="' + data.hint) + '"}></i>'
                        }
                    }
                })
            }
            return options
        }
    }, {
        key: "_createColorBoxItemOptions",
        value: function(hint, icon) {
            var options = this._createSelectBoxBaseItemOptions(hint);
            if (icon) {
                options = (0, _extend.extend)(true, options, {
                    options: {
                        openOnFieldClick: true,
                        fieldTemplate: function(data, container) {
                            (0, _renderer2.default)("<i>").addClass(icon).css("borderBottomColor", data).appendTo(container);
                            (0, _renderer2.default)("<div>").dxTextBox({
                                readOnly: true,
                                stylingMode: "outlined"
                            }).appendTo(container)
                        }
                    }
                })
            }
            return options
        }
    }, {
        key: "_createSelectBoxBaseItemOptions",
        value: function(hint) {
            return {
                options: {
                    stylingMode: "filled",
                    hint: hint
                }
            }
        }
    }, {
        key: "_createItemActionOptions",
        value: function(item, handler) {
            var _this4 = this;
            switch (item.widget) {
                case "dxSelectBox":
                case "dxColorBox":
                    return {
                        options: {
                            onValueChanged: function(e) {
                                var parameter = _this4._getExecCommandParameter(item, e.component.option("value"));
                                handler.call(_this4, item.command, parameter)
                            }
                        }
                    };
                default:
                    if (!item.items) {
                        return {
                            options: {
                                onClick: function(e) {
                                    var parameter = _this4._getExecCommandParameter(item);
                                    handler.call(_this4, item.command, parameter)
                                }
                            }
                        }
                    }
            }
        }
    }, {
        key: "_getExecCommandParameter",
        value: function(item, widgetValue) {
            if (item.getParameter) {
                return item.getParameter(this, widgetValue)
            }
            return widgetValue
        }
    }, {
        key: "_onItemInitialized",
        value: function(widget, item) {
            if (void 0 !== item.command) {
                this._itemHelpers[item.command] = new ToolbarItemHelper(widget)
            }
        }
    }, {
        key: "_onItemContentReady",
        value: function(widget, item, actionHandler) {
            var _this5 = this;
            if ("dxButton" === widget.NAME && item.items) {
                var $menuContainer = (0, _renderer2.default)("<div>").appendTo(this.$element());
                this._createComponent($menuContainer, _context_menu2.default, {
                    dataSource: item.items,
                    displayExpr: "text",
                    valueExpr: "command",
                    target: widget.$element(),
                    showEvent: "dxclick",
                    position: {
                        at: "left bottom"
                    },
                    onItemClick: function(_ref2) {
                        var itemData = _ref2.itemData;
                        if (void 0 !== itemData.command) {
                            var parameter = _this5._getExecCommandParameter(itemData);
                            actionHandler.call(_this5, itemData.command, parameter)
                        }
                    },
                    onInitialized: function(_ref3) {
                        var component = _ref3.component;
                        return _this5._onContextMenuInitialized(component, item)
                    },
                    onDisposing: function(_ref4) {
                        var component = _ref4.component;
                        return _this5._onContextMenuDisposing(component, item)
                    }
                })
            }
        }
    }, {
        key: "_onContextMenuInitialized",
        value: function(widget, item) {
            var _this6 = this;
            this._contextMenus.push(widget);
            item.items.forEach(function(item, index) {
                _this6._itemHelpers[item.command] = new ContextMenuItemHelper(widget, index)
            })
        }
    }, {
        key: "_onContextMenuDisposing",
        value: function(widget, item) {
            this._contextMenus = this._contextMenus.filter(function(cm) {
                return cm !== widget
            })
        }
    }, {
        key: "_execDiagramCommand",
        value: function(command, value) {
            if (!this._updateLocked) {
                this.bar.raiseBarCommandExecuted(command, value)
            }
        }
    }, {
        key: "_execWidgetCommand",
        value: function(command) {
            if (!this._updateLocked) {
                this._onWidgetCommandAction({
                    name: command
                })
            }
        }
    }, {
        key: "_createOnWidgetCommand",
        value: function() {
            this._onWidgetCommandAction = this._createActionByOption("onWidgetCommand")
        }
    }, {
        key: "_setItemEnabled",
        value: function(command, enabled) {
            if (command in this._itemHelpers) {
                this._itemHelpers[command].setEnabled(enabled)
            }
        }
    }, {
        key: "_setEnabled",
        value: function(enabled) {
            this._toolbarInstance.option("disabled", !enabled);
            this._contextMenus.forEach(function(cm) {
                return cm.option("disabled", !enabled)
            })
        }
    }, {
        key: "_setItemValue",
        value: function(command, value) {
            try {
                this._updateLocked = true;
                if (command in this._itemHelpers) {
                    this._itemHelpers[command].setValue(value)
                }
            } finally {
                this._updateLocked = false
            }
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            switch (args.name) {
                case "onWidgetCommand":
                    this._createOnWidgetCommand();
                    break;
                case "export":
                    break;
                default:
                    _get(DiagramToolbar.prototype.__proto__ || Object.getPrototypeOf(DiagramToolbar.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(DiagramToolbar.prototype.__proto__ || Object.getPrototypeOf(DiagramToolbar.prototype), "_getDefaultOptions", this).call(this), {
                "export": {
                    fileName: "Diagram",
                    proxyUrl: void 0
                }
            })
        }
    }]);
    return DiagramToolbar
}(_diagram2.default);
var ToolbarDiagramBar = function(_DiagramBar) {
    _inherits(ToolbarDiagramBar, _DiagramBar);

    function ToolbarDiagramBar() {
        _classCallCheck(this, ToolbarDiagramBar);
        return _possibleConstructorReturn(this, (ToolbarDiagramBar.__proto__ || Object.getPrototypeOf(ToolbarDiagramBar)).apply(this, arguments))
    }
    _createClass(ToolbarDiagramBar, [{
        key: "getCommandKeys",
        value: function() {
            return _uiDiagram2.default.getToolbar().reduce(function(commands, i) {
                if (void 0 !== i.command) {
                    commands.push(i.command)
                }
                return i.items ? commands.concat(i.items.filter(function(ci) {
                    return void 0 !== ci.command
                }).map(function(ci) {
                    return ci.command
                })) : commands
            }, [])
        }
    }, {
        key: "setItemValue",
        value: function(key, value) {
            this._owner._setItemValue(key, value)
        }
    }, {
        key: "setItemEnabled",
        value: function(key, enabled) {
            this._owner._setItemEnabled(key, enabled)
        }
    }, {
        key: "setEnabled",
        value: function(enabled) {
            this._owner._setEnabled(enabled)
        }
    }]);
    return ToolbarDiagramBar
}(_diagram_bar2.default);
var ToolbarItemHelper = function() {
    function ToolbarItemHelper(widget) {
        _classCallCheck(this, ToolbarItemHelper);
        this._widget = widget
    }
    _createClass(ToolbarItemHelper, [{
        key: "setEnabled",
        value: function(enabled) {
            this._widget.option("disabled", !enabled)
        }
    }, {
        key: "setValue",
        value: function(value) {
            if ("value" in this._widget.option()) {
                this._widget.option("value", value)
            } else {
                if (void 0 !== value) {
                    this._widget.$element().toggleClass(ACTIVE_FORMAT_CLASS, value)
                }
            }
        }
    }]);
    return ToolbarItemHelper
}();
var ContextMenuItemHelper = function(_ToolbarItemHelper) {
    _inherits(ContextMenuItemHelper, _ToolbarItemHelper);

    function ContextMenuItemHelper(widget, index) {
        _classCallCheck(this, ContextMenuItemHelper);
        var _this8 = _possibleConstructorReturn(this, (ContextMenuItemHelper.__proto__ || Object.getPrototypeOf(ContextMenuItemHelper)).call(this, widget));
        _this8._index = index;
        return _this8
    }
    _createClass(ContextMenuItemHelper, [{
        key: "setEnabled",
        value: function(enabled) {
            this._widget.option("items[" + this._index + "].disabled", !enabled)
        }
    }, {
        key: "setValue",
        value: function(value) {}
    }]);
    return ContextMenuItemHelper
}(ToolbarItemHelper);
module.exports = DiagramToolbar;
