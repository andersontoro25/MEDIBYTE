/**
 * DevExtreme (ui/pivot_grid/ui.sortable.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _events_engine = require("../../events/core/events_engine");
var _events_engine2 = _interopRequireDefault(_events_engine);
var _type = require("../../core/utils/type");
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _utils = require("../../events/utils");
var _component_registrator = require("../../core/component_registrator");
var _component_registrator2 = _interopRequireDefault(_component_registrator);
var _dom_component = require("../../core/dom_component");
var _dom_component2 = _interopRequireDefault(_dom_component);
var _drag = require("../../events/drag");
var _drag2 = _interopRequireDefault(_drag);
var _swatch_container = require("../widget/swatch_container");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var SORTABLE_NAMESPACE = "dxSortable",
    SORTABLE_CLASS = "dx-sortable",
    SCROLL_STEP = 2,
    START_SCROLL_OFFSET = 20,
    SCROLL_TIMEOUT = 10;

function elementHasPoint(element, x, y) {
    var $item = (0, _renderer2.default)(element),
        offset = $item.offset();
    if (x >= offset.left && x <= offset.left + $item.outerWidth(true)) {
        if (y >= offset.top && y <= offset.top + $item.outerHeight(true)) {
            return true
        }
    }
}

function checkHorizontalPosition(position, itemOffset, rtl) {
    if ((0, _type.isDefined)(itemOffset.posHorizontal)) {
        return rtl ? position > itemOffset.posHorizontal : position < itemOffset.posHorizontal
    } else {
        return true
    }
}

function getIndex($items, $item) {
    var index = -1,
        itemElement = $item.get(0);
    (0, _iterator.each)($items, function(elementIndex, element) {
        var $element = (0, _renderer2.default)(element);
        if (!($element.attr("item-group") && $element.attr("item-group") === $items.eq(elementIndex - 1).attr("item-group"))) {
            index++
        }
        if (element === itemElement) {
            return false
        }
    });
    return index === $items.length ? -1 : index
}

function getTargetGroup(e, $groups) {
    var result;
    (0, _iterator.each)($groups, function() {
        if (elementHasPoint(this, e.pageX, e.pageY)) {
            result = (0, _renderer2.default)(this)
        }
    });
    return result
}

function getItemsOffset($elements, isVertical, $itemsContainer) {
    var result = [],
        $item = [];
    for (var i = 0; i < $elements.length; i += $item.length) {
        $item = $elements.eq(i);
        if ($item.attr("item-group")) {
            $item = $itemsContainer.find("[item-group='" + $item.attr("item-group") + "']")
        }
        if ($item.is(":visible")) {
            var offset = {
                item: $item,
                index: result.length,
                posHorizontal: isVertical ? void 0 : ($item.last().outerWidth(true) + $item.last().offset().left + $item.offset().left) / 2
            };
            if (isVertical) {
                offset.posVertical = ($item.last().offset().top + $item.offset().top + $item.last().outerHeight(true)) / 2
            } else {
                offset.posVertical = $item.last().outerHeight(true) + $item.last().offset().top
            }
            result.push(offset)
        }
    }
    return result
}

function getScrollWrapper(scrollable) {
    var timeout = null,
        scrollTop = scrollable.scrollTop(),
        $element = scrollable.$element(),
        top = $element.offset().top,
        height = $element.height(),
        delta = 0;

    function onScroll(e) {
        scrollTop = e.scrollOffset.top
    }
    scrollable.on("scroll", onScroll);

    function move() {
        stop();
        scrollable.scrollTo(scrollTop += delta);
        timeout = setTimeout(move, SCROLL_TIMEOUT)
    }

    function stop() {
        clearTimeout(timeout)
    }

    function moveIfNeed(event) {
        if (event.pageY <= top + START_SCROLL_OFFSET) {
            delta = -SCROLL_STEP
        } else {
            if (event.pageY >= top + height - START_SCROLL_OFFSET) {
                delta = SCROLL_STEP
            } else {
                delta = 0;
                stop();
                return
            }
        }
        move()
    }
    return {
        moveIfNeed: moveIfNeed,
        element: function() {
            return $element
        },
        dispose: function() {
            stop();
            scrollable.off("scroll", onScroll)
        }
    }
}
var Sortable = _dom_component2.default.inherit({
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            onChanged: null,
            onDragging: null,
            itemRender: null,
            groupSelector: null,
            itemSelector: ".dx-sort-item",
            itemContainerSelector: ".dx-sortable",
            sourceClass: "dx-drag-source",
            dragClass: "dx-drag",
            targetClass: "dx-drag-target",
            direction: "vertical",
            allowDragging: true,
            groupFilter: null,
            useIndicator: false
        })
    },
    _renderItem: function($sourceItem, target) {
        var $item, itemRender = this.option("itemRender");
        if (itemRender) {
            $item = itemRender($sourceItem, target)
        } else {
            $item = $sourceItem.clone();
            $item.css({
                width: $sourceItem.width(),
                height: $sourceItem.height()
            })
        }
        return $item
    },
    _renderIndicator: function($item, isVertical, $targetGroup, isLast) {
        var height = $item.outerHeight(true),
            width = $item.outerWidth(true),
            top = $item.offset().top - $targetGroup.offset().top,
            left = $item.offset().left - $targetGroup.offset().left;
        this._indicator.css({
            position: "absolute",
            top: isLast && isVertical ? top + height : top,
            left: isLast && !isVertical ? left + width : left
        }).toggleClass("dx-position-indicator-horizontal", !isVertical).toggleClass("dx-position-indicator-vertical", !!isVertical).toggleClass("dx-position-indicator-last", !!isLast).height("").width("").appendTo($targetGroup);
        isVertical ? this._indicator.width(width) : this._indicator.height(height)
    },
    _renderDraggable: function($sourceItem) {
        this._$draggable && this._$draggable.remove();
        this._$draggable = this._renderItem($sourceItem, "drag").addClass(this.option("dragClass")).appendTo((0, _swatch_container.getSwatchContainer)($sourceItem)).css({
            zIndex: 1e6,
            position: "absolute"
        })
    },
    _detachEventHandlers: function() {
        var dragEventsString = [_drag2.default.move, _drag2.default.start, _drag2.default.end, _drag2.default.enter, _drag2.default.leave, _drag2.default.drop].join(" ");
        _events_engine2.default.off(this._getEventListener(), (0, _utils.addNamespace)(dragEventsString, SORTABLE_NAMESPACE))
    },
    _getItemOffset: function(isVertical, itemsOffset, e) {
        for (var i = 0; i < itemsOffset.length; i++) {
            var shouldInsert, sameLine = e.pageY < itemsOffset[i].posVertical;
            if (isVertical) {
                shouldInsert = sameLine
            } else {
                if (sameLine) {
                    shouldInsert = checkHorizontalPosition(e.pageX, itemsOffset[i], this.option("rtlEnabled"));
                    if (!shouldInsert && itemsOffset[i + 1] && itemsOffset[i + 1].posVertical > itemsOffset[i].posVertical) {
                        shouldInsert = true
                    }
                }
            }
            if (shouldInsert) {
                return itemsOffset[i]
            }
        }
    },
    _getEventListener: function() {
        var groupSelector = this.option("groupSelector"),
            element = this.$element();
        return groupSelector ? element.find(groupSelector) : element
    },
    _attachEventHandlers: function() {
        var $sourceItem, sourceIndex, $targetItem, $targetGroup, startPositions, sourceGroup, $groups, that = this,
            itemSelector = that.option("itemSelector"),
            itemContainerSelector = that.option("itemContainerSelector"),
            groupSelector = that.option("groupSelector"),
            sourceClass = that.option("sourceClass"),
            targetClass = that.option("targetClass"),
            onDragging = that.option("onDragging"),
            groupFilter = that.option("groupFilter"),
            element = that.$element(),
            scrollWrapper = null,
            targetIndex = -1;
        var setStartPositions = function() {
            startPositions = [];
            (0, _iterator.each)($sourceItem, function(_, item) {
                startPositions.push((0, _renderer2.default)(item).offset())
            })
        };
        var createGroups = function() {
            if (!groupSelector) {
                return element
            } else {
                return groupFilter ? (0, _renderer2.default)(groupSelector).filter(groupFilter) : element.find(groupSelector)
            }
        };
        var disposeScrollWrapper = function() {
            scrollWrapper && scrollWrapper.dispose();
            scrollWrapper = null
        };
        var invokeOnDraggingEvent = function() {
            var draggingArgs = {
                sourceGroup: sourceGroup,
                sourceIndex: sourceIndex,
                sourceElement: $sourceItem,
                targetGroup: $targetGroup.attr("group"),
                targetIndex: $targetGroup.find(itemSelector).index($targetItem)
            };
            onDragging && onDragging(draggingArgs);
            if (draggingArgs.cancel) {
                $targetGroup = void 0
            }
        };
        that._detachEventHandlers();
        if (that.option("allowDragging")) {
            var $eventListener = that._getEventListener();
            _events_engine2.default.on($eventListener, (0, _utils.addNamespace)(_drag2.default.start, SORTABLE_NAMESPACE), itemSelector, function(e) {
                $sourceItem = (0, _renderer2.default)(e.currentTarget);
                var $sourceGroup = $sourceItem.closest(groupSelector);
                sourceGroup = $sourceGroup.attr("group");
                sourceIndex = getIndex((groupSelector ? $sourceGroup : element).find(itemSelector), $sourceItem);
                if ($sourceItem.attr("item-group")) {
                    $sourceItem = $sourceGroup.find("[item-group='" + $sourceItem.attr("item-group") + "']")
                }
                that._renderDraggable($sourceItem);
                $targetItem = that._renderItem($sourceItem, "target").addClass(targetClass);
                $sourceItem.addClass(sourceClass);
                setStartPositions();
                $groups = createGroups();
                that._indicator = (0, _renderer2.default)("<div>").addClass("dx-position-indicator")
            });
            _events_engine2.default.on($eventListener, (0, _utils.addNamespace)(_drag2.default.move, SORTABLE_NAMESPACE), function(e) {
                var $item, $itemContainer, $items, $lastItem, isVertical, itemOffset, $prevItem, itemsOffset = [];
                if (!$sourceItem) {
                    return
                }
                targetIndex = -1;
                that._indicator.detach();
                (0, _iterator.each)(that._$draggable, function(index, draggableElement) {
                    (0, _renderer2.default)(draggableElement).css({
                        top: startPositions[index].top + e.offset.y,
                        left: startPositions[index].left + e.offset.x
                    })
                });
                $targetGroup && $targetGroup.removeClass(targetClass);
                $targetGroup = getTargetGroup(e, $groups);
                $targetGroup && invokeOnDraggingEvent();
                if ($targetGroup && scrollWrapper && $targetGroup.get(0) !== scrollWrapper.element().get(0)) {
                    disposeScrollWrapper()
                }
                scrollWrapper && scrollWrapper.moveIfNeed(e);
                if (!$targetGroup) {
                    $targetItem.detach();
                    return
                }
                if (!scrollWrapper && $targetGroup.attr("allow-scrolling")) {
                    scrollWrapper = getScrollWrapper($targetGroup.dxScrollable("instance"))
                }
                $targetGroup.addClass(targetClass);
                $itemContainer = $targetGroup.find(itemContainerSelector);
                $items = $itemContainer.find(itemSelector);
                var targetSortable = $targetGroup.closest("." + SORTABLE_CLASS).data("dxSortable"),
                    useIndicator = targetSortable.option("useIndicator");
                isVertical = "vertical" === (targetSortable || that).option("direction");
                itemsOffset = getItemsOffset($items, isVertical, $itemContainer);
                itemOffset = that._getItemOffset(isVertical, itemsOffset, e);
                if (itemOffset) {
                    $item = itemOffset.item;
                    $prevItem = itemsOffset[itemOffset.index - 1] && itemsOffset[itemOffset.index - 1].item;
                    if ($item.hasClass(sourceClass) || $prevItem && $prevItem.hasClass(sourceClass) && $prevItem.is(":visible")) {
                        $targetItem.detach();
                        return
                    }
                    targetIndex = itemOffset.index;
                    if (!useIndicator) {
                        $targetItem.insertBefore($item);
                        return
                    }
                    var isAnotherGroup = $targetGroup.attr("group") !== sourceGroup,
                        isSameIndex = targetIndex === sourceIndex,
                        isNextIndex = targetIndex === sourceIndex + 1;
                    if (isAnotherGroup) {
                        that._renderIndicator($item, isVertical, $targetGroup, that.option("rtlEnabled") && !isVertical);
                        return
                    }
                    if (!isSameIndex && !isNextIndex) {
                        that._renderIndicator($item, isVertical, $targetGroup, that.option("rtlEnabled") && !isVertical)
                    }
                } else {
                    $lastItem = $items.last();
                    if ($lastItem.is(":visible") && $lastItem.hasClass(sourceClass)) {
                        return
                    }
                    if ($itemContainer.length) {
                        targetIndex = itemsOffset.length ? itemsOffset[itemsOffset.length - 1].index + 1 : 0
                    }
                    if (useIndicator) {
                        $items.length && that._renderIndicator($lastItem, isVertical, $targetGroup, !that.option("rtlEnabled") || isVertical)
                    } else {
                        $targetItem.appendTo($itemContainer)
                    }
                }
            });
            _events_engine2.default.on($eventListener, (0, _utils.addNamespace)(_drag2.default.end, SORTABLE_NAMESPACE), function() {
                disposeScrollWrapper();
                if (!$sourceItem) {
                    return
                }
                var onChanged = that.option("onChanged"),
                    changedArgs = {
                        sourceIndex: sourceIndex,
                        sourceElement: $sourceItem,
                        sourceGroup: sourceGroup,
                        targetIndex: targetIndex,
                        removeSourceElement: true,
                        removeTargetElement: false,
                        removeSourceClass: true
                    };
                if ($targetGroup) {
                    $targetGroup.removeClass(targetClass);
                    changedArgs.targetGroup = $targetGroup.attr("group");
                    if (sourceGroup !== changedArgs.targetGroup || targetIndex > -1) {
                        onChanged && onChanged(changedArgs);
                        changedArgs.removeSourceElement && $sourceItem.remove()
                    }
                }
                that._indicator.detach();
                changedArgs.removeSourceClass && $sourceItem.removeClass(sourceClass);
                $sourceItem = null;
                that._$draggable.remove();
                that._$draggable = null;
                changedArgs.removeTargetElement && $targetItem.remove();
                $targetItem.removeClass(targetClass);
                $targetItem = null
            })
        }
    },
    _init: function() {
        this.callBase();
        this._attachEventHandlers()
    },
    _render: function() {
        this.callBase();
        this.$element().addClass(SORTABLE_CLASS)
    },
    _dispose: function() {
        var that = this;
        that.callBase.apply(that, arguments);
        that._$draggable && that._$draggable.detach();
        that._indicator && that._indicator.detach()
    },
    _optionChanged: function(args) {
        var that = this;
        switch (args.name) {
            case "onDragging":
            case "onChanged":
            case "itemRender":
            case "groupSelector":
            case "itemSelector":
            case "itemContainerSelector":
            case "sourceClass":
            case "targetClass":
            case "dragClass":
            case "allowDragging":
            case "groupFilter":
            case "useIndicator":
                that._attachEventHandlers();
                break;
            case "direction":
                break;
            default:
                that.callBase(args)
        }
    }
});
(0, _component_registrator2.default)("dxSortable", Sortable);
module.exports = Sortable;
