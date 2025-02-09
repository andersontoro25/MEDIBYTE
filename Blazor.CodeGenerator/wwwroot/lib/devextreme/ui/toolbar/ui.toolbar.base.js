/**
 * DevExtreme (ui/toolbar/ui.toolbar.base.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _themes = require("../themes");
var _themes2 = _interopRequireDefault(_themes);
var _common = require("../../core/utils/common");
var _common2 = _interopRequireDefault(_common);
var _type = require("../../core/utils/type");
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _array = require("../../core/utils/array");
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _uiCollection_widget = require("../collection/ui.collection_widget.async");
var _uiCollection_widget2 = _interopRequireDefault(_uiCollection_widget);
var _promise = require("../../core/polyfills/promise");
var _promise2 = _interopRequireDefault(_promise);
var _bindable_template = require("../widget/bindable_template");
var _bindable_template2 = _interopRequireDefault(_bindable_template);
var _fx = require("../../animation/fx");
var _fx2 = _interopRequireDefault(_fx);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var TOOLBAR_CLASS = "dx-toolbar";
var TOOLBAR_BEFORE_CLASS = "dx-toolbar-before";
var TOOLBAR_CENTER_CLASS = "dx-toolbar-center";
var TOOLBAR_AFTER_CLASS = "dx-toolbar-after";
var TOOLBAR_BOTTOM_CLASS = "dx-toolbar-bottom";
var TOOLBAR_MINI_CLASS = "dx-toolbar-mini";
var TOOLBAR_ITEM_CLASS = "dx-toolbar-item";
var TOOLBAR_LABEL_CLASS = "dx-toolbar-label";
var TOOLBAR_BUTTON_CLASS = "dx-toolbar-button";
var TOOLBAR_ITEMS_CONTAINER_CLASS = "dx-toolbar-items-container";
var TOOLBAR_GROUP_CLASS = "dx-toolbar-group";
var TOOLBAR_COMPACT_CLASS = "dx-toolbar-compact";
var TOOLBAR_LABEL_SELECTOR = "." + TOOLBAR_LABEL_CLASS;
var TEXT_BUTTON_MODE = "text";
var DEFAULT_BUTTON_TYPE = "default";
var TOOLBAR_ITEM_DATA_KEY = "dxToolbarItemDataKey";
var ToolbarBase = _uiCollection_widget2.default.inherit({
    compactMode: false,
    ctor: function(element, options) {
        this._userOptions = options || {};
        this.callBase(element, options);
        this._synchronizableOptionsForCreateComponent = this._synchronizableOptionsForCreateComponent.filter(function(item) {
            return "disabled" !== item
        })
    },
    _initTemplates: function() {
        this.callBase();
        var template = new _bindable_template2.default(function($container, data, rawModel) {
            if ((0, _type.isPlainObject)(data)) {
                if (data.text) {
                    $container.text(data.text).wrapInner("<div>")
                }
                if (data.html) {
                    $container.html(data.html)
                }
                if ("dxButton" === data.widget) {
                    if (this.option("useFlatButtons")) {
                        data.options = data.options || {};
                        data.options.stylingMode = data.options.stylingMode || TEXT_BUTTON_MODE
                    }
                    if (this.option("useDefaultButtons")) {
                        data.options = data.options || {};
                        data.options.type = data.options.type || DEFAULT_BUTTON_TYPE
                    }
                }
            } else {
                $container.text(String(data))
            }
            this._getTemplate("dx-polymorph-widget").render({
                container: $container,
                model: rawModel,
                parent: this
            })
        }.bind(this), ["text", "html", "widget", "options"], this.option("integrationOptions.watchMethod"));
        this._defaultTemplates.item = template;
        this._defaultTemplates.menuItem = template
    },
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            renderAs: "topToolbar",
            grouped: false,
            useFlatButtons: false,
            useDefaultButtons: false
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                return _themes2.default.isMaterial()
            },
            options: {
                useFlatButtons: true
            }
        }])
    },
    _itemContainer: function() {
        return this._$toolbarItemsContainer.find(["." + TOOLBAR_BEFORE_CLASS, "." + TOOLBAR_CENTER_CLASS, "." + TOOLBAR_AFTER_CLASS].join(","))
    },
    _itemClass: function() {
        return TOOLBAR_ITEM_CLASS
    },
    _itemDataKey: function() {
        return TOOLBAR_ITEM_DATA_KEY
    },
    _buttonClass: function() {
        return TOOLBAR_BUTTON_CLASS
    },
    _dimensionChanged: function() {
        this._arrangeItems();
        this._applyCompactMode()
    },
    _initMarkup: function() {
        this._renderToolbar();
        this._renderSections();
        this.callBase();
        this.setAria("role", "toolbar")
    },
    _waitParentAnimationFinished: function() {
        var $element = this.$element();
        var timeout = 15;
        return new _promise2.default(function(resolve) {
            var check = function() {
                var readyToResolve = true;
                $element.parents().each(function(_, parent) {
                    if (_fx2.default.isAnimating((0, _renderer2.default)(parent))) {
                        readyToResolve = false;
                        return false
                    }
                });
                if (readyToResolve) {
                    resolve()
                }
                return readyToResolve
            };
            var runCheck = function runCheck() {
                setTimeout(function() {
                    return check() || runCheck()
                }, timeout)
            };
            $element.width() > 0 && check() || runCheck()
        })
    },
    _render: function() {
        this.callBase();
        this._renderItemsAsync();
        if (_themes2.default.isMaterial()) {
            _promise2.default.all([this._waitParentAnimationFinished(), this._checkWebFontForLabelsLoaded()]).then(this._dimensionChanged.bind(this))
        }
    },
    _postProcessRenderItems: function() {
        this._arrangeItems()
    },
    _renderToolbar: function() {
        this.$element().addClass(TOOLBAR_CLASS).toggleClass(TOOLBAR_BOTTOM_CLASS, "bottomToolbar" === this.option("renderAs"));
        this._$toolbarItemsContainer = (0, _renderer2.default)("<div>").addClass(TOOLBAR_ITEMS_CONTAINER_CLASS).appendTo(this.$element())
    },
    _renderSections: function() {
        var $container = this._$toolbarItemsContainer,
            that = this;
        (0, _iterator.each)(["before", "center", "after"], function() {
            var sectionClass = "dx-toolbar-" + this,
                $section = $container.find("." + sectionClass);
            if (!$section.length) {
                that["_$" + this + "Section"] = $section = (0, _renderer2.default)("<div>").addClass(sectionClass).appendTo($container)
            }
        })
    },
    _checkWebFontForLabelsLoaded: function() {
        var $labels = this.$element().find(TOOLBAR_LABEL_SELECTOR);
        var promises = [];
        $labels.each(function(_, label) {
            var text = (0, _renderer2.default)(label).text();
            var fontWeight = (0, _renderer2.default)(label).css("fontWeight");
            promises.push(_themes2.default.waitWebFont(text, fontWeight))
        });
        return _promise2.default.all(promises)
    },
    _arrangeItems: function(elementWidth) {
        elementWidth = elementWidth || this.$element().width();
        this._$centerSection.css({
            margin: "0 auto",
            "float": "none"
        });
        var beforeRect = this._$beforeSection.get(0).getBoundingClientRect(),
            afterRect = this._$afterSection.get(0).getBoundingClientRect();
        this._alignCenterSection(beforeRect, afterRect, elementWidth);
        var $label = this._$toolbarItemsContainer.find(TOOLBAR_LABEL_SELECTOR).eq(0),
            $section = $label.parent();
        if (!$label.length) {
            return
        }
        var labelOffset = beforeRect.width ? beforeRect.width : $label.position().left,
            widthBeforeSection = $section.hasClass(TOOLBAR_BEFORE_CLASS) ? 0 : labelOffset,
            widthAfterSection = $section.hasClass(TOOLBAR_AFTER_CLASS) ? 0 : afterRect.width,
            elemsAtSectionWidth = 0;
        $section.children().not(TOOLBAR_LABEL_SELECTOR).each(function() {
            elemsAtSectionWidth += (0, _renderer2.default)(this).outerWidth()
        });
        var freeSpace = elementWidth - elemsAtSectionWidth,
            sectionMaxWidth = Math.max(freeSpace - widthBeforeSection - widthAfterSection, 0);
        if ($section.hasClass(TOOLBAR_BEFORE_CLASS)) {
            this._alignSection(this._$beforeSection, sectionMaxWidth)
        } else {
            var labelPaddings = $label.outerWidth() - $label.width();
            $label.css("maxWidth", sectionMaxWidth - labelPaddings)
        }
    },
    _alignCenterSection: function(beforeRect, afterRect, elementWidth) {
        this._alignSection(this._$centerSection, elementWidth - beforeRect.width - afterRect.width);
        var isRTL = this.option("rtlEnabled"),
            leftRect = isRTL ? afterRect : beforeRect,
            rightRect = isRTL ? beforeRect : afterRect,
            centerRect = this._$centerSection.get(0).getBoundingClientRect();
        if (leftRect.right > centerRect.left || centerRect.right > rightRect.left) {
            this._$centerSection.css({
                marginLeft: leftRect.width,
                marginRight: rightRect.width,
                "float": leftRect.width > rightRect.width ? "none" : "right"
            })
        }
    },
    _alignSection: function($section, maxWidth) {
        var $labels = $section.find(TOOLBAR_LABEL_SELECTOR),
            labels = $labels.toArray();
        maxWidth -= this._getCurrentLabelsPaddings(labels);
        var currentWidth = this._getCurrentLabelsWidth(labels),
            difference = Math.abs(currentWidth - maxWidth);
        if (maxWidth < currentWidth) {
            labels = labels.reverse();
            this._alignSectionLabels(labels, difference, false)
        } else {
            this._alignSectionLabels(labels, difference, true)
        }
    },
    _alignSectionLabels: function(labels, difference, expanding) {
        var getRealLabelWidth = function(label) {
            return label.getBoundingClientRect().width
        };
        for (var i = 0; i < labels.length; i++) {
            var labelMaxWidth, $label = (0, _renderer2.default)(labels[i]),
                currentLabelWidth = Math.ceil(getRealLabelWidth(labels[i]));
            if (expanding) {
                $label.css("maxWidth", "inherit")
            }
            var possibleLabelWidth = Math.ceil(expanding ? getRealLabelWidth(labels[i]) : currentLabelWidth);
            if (possibleLabelWidth < difference) {
                labelMaxWidth = expanding ? possibleLabelWidth : 0;
                difference -= possibleLabelWidth
            } else {
                labelMaxWidth = expanding ? currentLabelWidth + difference : currentLabelWidth - difference;
                $label.css("maxWidth", labelMaxWidth);
                break
            }
            $label.css("maxWidth", labelMaxWidth)
        }
    },
    _applyCompactMode: function() {
        var $element = this.$element();
        $element.removeClass(TOOLBAR_COMPACT_CLASS);
        if (this.option("compactMode") && this._getSummaryItemsWidth(this.itemElements(), true) > $element.width()) {
            $element.addClass(TOOLBAR_COMPACT_CLASS)
        }
    },
    _getCurrentLabelsWidth: function(labels) {
        var width = 0;
        labels.forEach(function(label, index) {
            width += (0, _renderer2.default)(label).outerWidth()
        });
        return width
    },
    _getCurrentLabelsPaddings: function(labels) {
        var padding = 0;
        labels.forEach(function(label, index) {
            padding += (0, _renderer2.default)(label).outerWidth() - (0, _renderer2.default)(label).width()
        });
        return padding
    },
    _renderItem: function(index, item, itemContainer, $after) {
        var location = item.location || "center",
            container = itemContainer || this["_$" + location + "Section"],
            itemHasText = !!(item.text || item.html),
            itemElement = this.callBase(index, item, container, $after);
        itemElement.toggleClass(this._buttonClass(), !itemHasText).toggleClass(TOOLBAR_LABEL_CLASS, itemHasText).addClass(item.cssClass);
        return itemElement
    },
    _renderGroupedItems: function() {
        var that = this;
        (0, _iterator.each)(this.option("items"), function(groupIndex, group) {
            var groupItems = group.items,
                $container = (0, _renderer2.default)("<div>").addClass(TOOLBAR_GROUP_CLASS),
                location = group.location || "center";
            if (!groupItems || !groupItems.length) {
                return
            }(0, _iterator.each)(groupItems, function(itemIndex, item) {
                that._renderItem(itemIndex, item, $container, null)
            });
            that._$toolbarItemsContainer.find(".dx-toolbar-" + location).append($container)
        })
    },
    _renderItems: function(items) {
        var grouped = this.option("grouped") && items.length && items[0].items;
        grouped ? this._renderGroupedItems() : this.callBase(items)
    },
    _getToolbarItems: function() {
        return this.option("items") || []
    },
    _renderContentImpl: function() {
        var items = this._getToolbarItems();
        this.$element().toggleClass(TOOLBAR_MINI_CLASS, 0 === items.length);
        if (this._renderedItemsCount) {
            this._renderItems(items.slice(this._renderedItemsCount))
        } else {
            this._renderItems(items)
        }
        this._applyCompactMode()
    },
    _renderEmptyMessage: _common2.default.noop,
    _clean: function() {
        this._$toolbarItemsContainer.children().empty();
        this.$element().empty()
    },
    _visibilityChanged: function(visible) {
        if (visible) {
            this._arrangeItems()
        }
    },
    _isVisible: function() {
        return this.$element().width() > 0 && this.$element().height() > 0
    },
    _getIndexByItem: function(item) {
        return (0, _array.inArray)(item, this._getToolbarItems())
    },
    _itemOptionChanged: function(item, property, value) {
        this.callBase.apply(this, [item, property, value]);
        this._arrangeItems()
    },
    _optionChanged: function(args) {
        var name = args.name;
        switch (name) {
            case "width":
                this.callBase.apply(this, arguments);
                this._dimensionChanged();
                break;
            case "renderAs":
            case "useFlatButtons":
            case "useDefaultButtons":
                this._invalidate();
                break;
            case "compactMode":
                this._applyCompactMode();
                break;
            case "grouped":
                break;
            default:
                this.callBase.apply(this, arguments)
        }
    }
});
(0, _component_registrator2.default)("dxToolbarBase", ToolbarBase);
module.exports = ToolbarBase;
