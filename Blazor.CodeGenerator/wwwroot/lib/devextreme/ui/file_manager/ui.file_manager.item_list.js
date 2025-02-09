/**
 * DevExtreme (ui/file_manager/ui.file_manager.item_list.js)
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
var _extend = require("../../core/utils/extend");
var _double_click = require("../../events/double_click");
var _utils = require("../../events/utils");
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _icon = require("../../core/utils/icon");
var _ui = require("../widget/ui.widget");
var _ui2 = _interopRequireDefault(_ui);

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
var FILE_MANAGER_FILES_VIEW_CLASS = "dx-filemanager-files-view";
var FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE = "dxFileManager_open";
var FileManagerItemListBase = function(_Widget) {
    _inherits(FileManagerItemListBase, _Widget);

    function FileManagerItemListBase() {
        _classCallCheck(this, FileManagerItemListBase);
        return _possibleConstructorReturn(this, (FileManagerItemListBase.__proto__ || Object.getPrototypeOf(FileManagerItemListBase)).apply(this, arguments))
    }
    _createClass(FileManagerItemListBase, [{
        key: "_initMarkup",
        value: function() {
            this._initActions();
            this.$element().addClass(FILE_MANAGER_FILES_VIEW_CLASS);
            var dblClickEventName = (0, _utils.addNamespace)(_double_click.name, FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE);
            _events_engine2.default.on(this.$element(), dblClickEventName, this._getItemSelector(), this._onItemDblClick.bind(this));
            _get(FileManagerItemListBase.prototype.__proto__ || Object.getPrototypeOf(FileManagerItemListBase.prototype), "_initMarkup", this).call(this)
        }
    }, {
        key: "_initActions",
        value: function() {
            this._actions = {
                onError: this._createActionByOption("onError"),
                onSelectionChanged: this._createActionByOption("onSelectionChanged"),
                onSelectedItemOpened: this._createActionByOption("onSelectedItemOpened")
            }
        }
    }, {
        key: "_getDefaultOptions",
        value: function() {
            return (0, _extend.extend)(_get(FileManagerItemListBase.prototype.__proto__ || Object.getPrototypeOf(FileManagerItemListBase.prototype), "_getDefaultOptions", this).call(this), {
                selectionMode: "single",
                contextMenu: null,
                getItems: null,
                getItemThumbnail: null,
                onError: null,
                onSelectionChanged: null,
                onSelectedItemOpened: null
            })
        }
    }, {
        key: "_optionChanged",
        value: function(args) {
            var name = args.name;
            switch (name) {
                case "selectionMode":
                case "contextMenu":
                case "getItems":
                case "getItemThumbnail":
                    this.repaint();
                    break;
                case "onError":
                case "onSelectedItemOpened":
                case "onSelectionChanged":
                    this._actions[name] = this._createActionByOption(name);
                    break;
                default:
                    _get(FileManagerItemListBase.prototype.__proto__ || Object.getPrototypeOf(FileManagerItemListBase.prototype), "_optionChanged", this).call(this, args)
            }
        }
    }, {
        key: "_getItems",
        value: function() {
            var itemsGetter = this.option("getItems");
            return itemsGetter ? itemsGetter() : []
        }
    }, {
        key: "_raiseOnError",
        value: function(error) {
            this._actions.onError({
                error: error
            })
        }
    }, {
        key: "_raiseSelectionChanged",
        value: function() {
            this._actions.onSelectionChanged()
        }
    }, {
        key: "_raiseSelectedItemOpened",
        value: function(item) {
            this._actions.onSelectedItemOpened({
                item: item
            })
        }
    }, {
        key: "_getItemThumbnail",
        value: function(item) {
            var itemThumbnailGetter = this.option("getItemThumbnail");
            return itemThumbnailGetter ? itemThumbnailGetter(item) : {
                thumbnail: ""
            }
        }
    }, {
        key: "_getItemThumbnailContainer",
        value: function(item) {
            var _getItemThumbnail2 = this._getItemThumbnail(item),
                thumbnail = _getItemThumbnail2.thumbnail,
                cssClass = _getItemThumbnail2.cssClass;
            var $itemThumbnail = (0, _icon.getImageContainer)(thumbnail).addClass(this._getItemThumbnailCssClass());
            if (cssClass) {
                $itemThumbnail.addClass(cssClass)
            }
            return $itemThumbnail
        }
    }, {
        key: "_getItemThumbnailCssClass",
        value: function() {
            return ""
        }
    }, {
        key: "_getItemSelector",
        value: function() {}
    }, {
        key: "_onItemDblClick",
        value: function(e) {}
    }, {
        key: "_showContextMenu",
        value: function(items, element, offset) {
            this._contextMenu.showAt(items, element, offset)
        }
    }, {
        key: "refreshData",
        value: function() {}
    }, {
        key: "getSelectedItems",
        value: function() {}
    }, {
        key: "clearSelection",
        value: function() {}
    }, {
        key: "selectItem",
        value: function() {}
    }, {
        key: "_contextMenu",
        get: function() {
            return this.option("contextMenu")
        }
    }]);
    return FileManagerItemListBase
}(_ui2.default);
module.exports = FileManagerItemListBase;
