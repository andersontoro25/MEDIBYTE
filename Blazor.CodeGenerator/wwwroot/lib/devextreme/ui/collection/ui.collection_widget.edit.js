/**
 * DevExtreme (ui/collection/ui.collection_widget.edit.js)
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
var _uiCollection_widget = require("./ui.collection_widget.base");
var _uiCollection_widget2 = _interopRequireDefault(_uiCollection_widget);
var _ui = require("../widget/ui.errors");
var _ui2 = _interopRequireDefault(_ui);
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _common = require("../../core/utils/common");
var _type = require("../../core/utils/type");
var _uiCollection_widgetEditStrategy = require("./ui.collection_widget.edit.strategy.plain");
var _uiCollection_widgetEditStrategy2 = _interopRequireDefault(_uiCollection_widgetEditStrategy);
var _data = require("../../core/utils/data");
var _data_source = require("../../data/data_source/data_source");
var _selection = require("../selection/selection");
var _selection2 = _interopRequireDefault(_selection);
var _deferred = require("../../core/utils/deferred");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var ITEM_DELETING_DATA_KEY = "dxItemDeleting",
    NOT_EXISTING_INDEX = -1;
var indexExists = function(index) {
    return index !== NOT_EXISTING_INDEX
};
var CollectionWidget = _uiCollection_widget2.default.inherit({
    _setOptionsByReference: function() {
        this.callBase();
        (0, _extend.extend)(this._optionsByReference, {
            selectedItem: true
        })
    },
    _getDefaultOptions: function() {
        return (0, _extend.extend)(this.callBase(), {
            selectionMode: "none",
            selectionRequired: false,
            selectionByClick: true,
            selectedItems: [],
            selectedItemKeys: [],
            maxFilterLengthInRequest: 1500,
            keyExpr: null,
            selectedIndex: NOT_EXISTING_INDEX,
            selectedItem: null,
            onSelectionChanged: null,
            onItemReordered: null,
            onItemDeleting: null,
            onItemDeleted: null
        })
    },
    ctor: function(element, options) {
        this._userOptions = options || {};
        this.callBase(element, options)
    },
    _init: function() {
        this._initEditStrategy();
        this.callBase();
        this._initKeyGetter();
        this._initSelectionModule();
        if ("multi" === this.option("selectionMode")) {
            this._showDeprecatedSelectionMode()
        }
    },
    _initKeyGetter: function() {
        this._keyGetter = (0, _data.compileGetter)(this.option("keyExpr"))
    },
    _getKeysByItems: function(selectedItems) {
        return this._editStrategy.getKeysByItems(selectedItems)
    },
    _getItemsByKeys: function(selectedItemKeys, selectedItems) {
        return this._editStrategy.getItemsByKeys(selectedItemKeys, selectedItems)
    },
    _getKeyByIndex: function(index) {
        return this._editStrategy.getKeyByIndex(index)
    },
    _getIndexByKey: function(key) {
        return this._editStrategy.getIndexByKey(key)
    },
    _getIndexByItemData: function(itemData) {
        return this._editStrategy.getIndexByItemData(itemData)
    },
    _isKeySpecified: function() {
        return !!(this._dataSource && this._dataSource.key())
    },
    _getCombinedFilter: function() {
        return this._dataSource && this._dataSource.filter()
    },
    key: function() {
        if (this.option("keyExpr")) {
            return this.option("keyExpr")
        }
        return this._dataSource && this._dataSource.key()
    },
    keyOf: function(item) {
        var key = item,
            store = this._dataSource && this._dataSource.store();
        if (this.option("keyExpr")) {
            key = this._keyGetter(item)
        } else {
            if (store) {
                key = store.keyOf(item)
            }
        }
        return key
    },
    _initSelectionModule: function() {
        var that = this,
            itemsGetter = that._editStrategy.itemsGetter;
        this._selection = new _selection2.default({
            mode: this.option("selectionMode"),
            maxFilterLengthInRequest: this.option("maxFilterLengthInRequest"),
            equalByReference: !this._isKeySpecified(),
            onSelectionChanged: function(args) {
                if (args.addedItemKeys.length || args.removedItemKeys.length) {
                    that.option("selectedItems", that._getItemsByKeys(args.selectedItemKeys, args.selectedItems));
                    that._updateSelectedItems(args)
                }
            },
            filter: that._getCombinedFilter.bind(that),
            totalCount: function() {
                var items = that.option("items");
                var dataSource = that._dataSource;
                return dataSource && dataSource.totalCount() >= 0 ? dataSource.totalCount() : items.length
            },
            key: that.key.bind(that),
            keyOf: that.keyOf.bind(that),
            load: function(options) {
                if (that._dataSource) {
                    var loadOptions = that._dataSource.loadOptions();
                    options.customQueryParams = loadOptions.customQueryParams;
                    options.userData = that._dataSource._userData
                }
                var store = that._dataSource && that._dataSource.store();
                if (store) {
                    return store.load(options).done(function(loadResult) {
                        if (that._disposed) {
                            return
                        }
                        var items = (0, _data_source.normalizeLoadResult)(loadResult).data;
                        that._dataSource._applyMapFunction(items)
                    })
                } else {
                    return (new _deferred.Deferred).resolve(this.plainItems())
                }
            },
            dataFields: function() {
                return that._dataSource && that._dataSource.select()
            },
            plainItems: itemsGetter.bind(that._editStrategy)
        })
    },
    _initEditStrategy: function() {
        var Strategy = _uiCollection_widgetEditStrategy2.default;
        this._editStrategy = new Strategy(this)
    },
    _getSelectedItemIndices: function(keys) {
        var that = this,
            indices = [];
        keys = keys || this._selection.getSelectedItemKeys();
        that._editStrategy.beginCache();
        (0, _iterator.each)(keys, function(_, key) {
            var selectedIndex = that._getIndexByKey(key);
            if (indexExists(selectedIndex)) {
                indices.push(selectedIndex)
            }
        });
        that._editStrategy.endCache();
        return indices
    },
    _initMarkup: function() {
        var _this = this;
        this._rendering = true;
        if (!this._dataSource || !this._dataSource.isLoading()) {
            this._syncSelectionOptions().done(function() {
                return _this._normalizeSelectedItems()
            })
        }
        this.callBase()
    },
    _render: function() {
        this.callBase();
        this._rendering = false
    },
    _fireContentReadyAction: function() {
        this._rendering = false;
        this._rendered = true;
        this.callBase.apply(this, arguments)
    },
    _syncSelectionOptions: function(byOption) {
        byOption = byOption || this._chooseSelectOption();
        var selectedItem, selectedIndex;
        switch (byOption) {
            case "selectedIndex":
                selectedItem = this._editStrategy.getItemDataByIndex(this.option("selectedIndex"));
                if ((0, _type.isDefined)(selectedItem)) {
                    this._setOptionSilent("selectedItems", [selectedItem]);
                    this._setOptionSilent("selectedItem", selectedItem);
                    this._setOptionSilent("selectedItemKeys", this._editStrategy.getKeysByItems([selectedItem]))
                } else {
                    this._setOptionSilent("selectedItems", []);
                    this._setOptionSilent("selectedItemKeys", []);
                    this._setOptionSilent("selectedItem", null)
                }
                break;
            case "selectedItems":
                var selectedItems = this.option("selectedItems") || [];
                selectedIndex = this._editStrategy.getIndexByItemData(selectedItems[0]);
                if (this.option("selectionRequired") && !indexExists(selectedIndex)) {
                    return this._syncSelectionOptions("selectedIndex")
                }
                this._setOptionSilent("selectedItem", selectedItems[0]);
                this._setOptionSilent("selectedIndex", selectedIndex);
                this._setOptionSilent("selectedItemKeys", this._editStrategy.getKeysByItems(selectedItems));
                break;
            case "selectedItem":
                selectedItem = this.option("selectedItem");
                selectedIndex = this._editStrategy.getIndexByItemData(selectedItem);
                if (this.option("selectionRequired") && !indexExists(selectedIndex)) {
                    return this._syncSelectionOptions("selectedIndex")
                }
                if ((0, _type.isDefined)(selectedItem)) {
                    this._setOptionSilent("selectedItems", [selectedItem]);
                    this._setOptionSilent("selectedIndex", selectedIndex);
                    this._setOptionSilent("selectedItemKeys", this._editStrategy.getKeysByItems([selectedItem]))
                } else {
                    this._setOptionSilent("selectedItems", []);
                    this._setOptionSilent("selectedItemKeys", []);
                    this._setOptionSilent("selectedIndex", NOT_EXISTING_INDEX)
                }
                break;
            case "selectedItemKeys":
                var selectedItemKeys = this.option("selectedItemKeys");
                if (this.option("selectionRequired")) {
                    var selectedItemIndex = this._getIndexByKey(selectedItemKeys[0]);
                    if (!indexExists(selectedItemIndex)) {
                        return this._syncSelectionOptions("selectedIndex")
                    }
                }
                return this._selection.setSelection(selectedItemKeys)
        }
        return (new _deferred.Deferred).resolve().promise()
    },
    _chooseSelectOption: function() {
        var optionName = "selectedIndex";
        var isOptionDefined = function(optionName) {
            var optionValue = this.option(optionName),
                length = (0, _type.isDefined)(optionValue) && optionValue.length;
            return length || optionName in this._userOptions
        }.bind(this);
        if (isOptionDefined("selectedItems")) {
            optionName = "selectedItems"
        } else {
            if (isOptionDefined("selectedItem")) {
                optionName = "selectedItem"
            } else {
                if (isOptionDefined("selectedItemKeys")) {
                    optionName = "selectedItemKeys"
                }
            }
        }
        return optionName
    },
    _compareKeys: function(oldKeys, newKeys) {
        if (oldKeys.length !== newKeys.length) {
            return false
        }
        for (var i = 0; i < newKeys.length; i++) {
            if (oldKeys[i] !== newKeys[i]) {
                return false
            }
        }
        return true
    },
    _normalizeSelectedItems: function() {
        if ("none" === this.option("selectionMode")) {
            this._setOptionSilent("selectedItems", []);
            this._syncSelectionOptions("selectedItems")
        } else {
            if ("single" === this.option("selectionMode")) {
                var newSelection = this.option("selectedItems");
                if (newSelection.length > 1 || !newSelection.length && this.option("selectionRequired") && this.option("items") && this.option("items").length) {
                    var currentSelection = this._selection.getSelectedItems();
                    var normalizedSelection = void 0 === newSelection[0] ? currentSelection[0] : newSelection[0];
                    if (void 0 === normalizedSelection) {
                        normalizedSelection = this._editStrategy.itemsGetter()[0]
                    }
                    if (this.option("grouped") && normalizedSelection && normalizedSelection.items) {
                        normalizedSelection.items = [normalizedSelection.items[0]]
                    }
                    this._selection.setSelection(this._getKeysByItems([normalizedSelection]));
                    this._setOptionSilent("selectedItems", [normalizedSelection]);
                    return this._syncSelectionOptions("selectedItems")
                } else {
                    this._selection.setSelection(this._getKeysByItems(newSelection))
                }
            } else {
                var newKeys = this._getKeysByItems(this.option("selectedItems"));
                var oldKeys = this._selection.getSelectedItemKeys();
                if (!this._compareKeys(oldKeys, newKeys)) {
                    this._selection.setSelection(newKeys)
                }
            }
        }
        return (new _deferred.Deferred).resolve().promise()
    },
    _itemClickHandler: function(e) {
        this._createAction(function(e) {
            this._itemSelectHandler(e.event)
        }.bind(this), {
            validatingTargetName: "itemElement"
        })({
            itemElement: (0, _renderer2.default)(e.currentTarget),
            event: e
        });
        this.callBase.apply(this, arguments)
    },
    _itemSelectHandler: function(e) {
        if (!this.option("selectionByClick")) {
            return
        }
        var $itemElement = e.currentTarget;
        if (this.isItemSelected($itemElement)) {
            this.unselectItem(e.currentTarget)
        } else {
            this.selectItem(e.currentTarget)
        }
    },
    _selectedItemElement: function(index) {
        return this._itemElements().eq(index)
    },
    _postprocessRenderItem: function(args) {
        if ("none" !== this.option("selectionMode")) {
            var $itemElement = (0, _renderer2.default)(args.itemElement),
                normalizedItemIndex = this._editStrategy.getNormalizedIndex($itemElement),
                isItemSelected = this._isItemSelected(normalizedItemIndex);
            this._processSelectableItem($itemElement, isItemSelected)
        }
    },
    _processSelectableItem: function($itemElement, isSelected) {
        $itemElement.toggleClass(this._selectedItemClass(), isSelected);
        this._setAriaSelected($itemElement, String(isSelected))
    },
    _updateSelectedItems: function(args) {
        var that = this,
            addedItemKeys = args.addedItemKeys,
            removedItemKeys = args.removedItemKeys;
        if (that._rendered && (addedItemKeys.length || removedItemKeys.length)) {
            var selectionChangePromise = that._selectionChangePromise;
            if (!that._rendering) {
                var normalizedIndex, i, addedSelection = [],
                    removedSelection = [];
                that._editStrategy.beginCache();
                for (i = 0; i < addedItemKeys.length; i++) {
                    normalizedIndex = that._getIndexByKey(addedItemKeys[i]);
                    addedSelection.push(normalizedIndex);
                    that._addSelection(normalizedIndex)
                }
                for (i = 0; i < removedItemKeys.length; i++) {
                    normalizedIndex = that._getIndexByKey(removedItemKeys[i]);
                    removedSelection.push(normalizedIndex);
                    that._removeSelection(normalizedIndex)
                }
                that._editStrategy.endCache();
                that._updateSelection(addedSelection, removedSelection)
            }(0, _deferred.when)(selectionChangePromise).done(function() {
                that._fireSelectionChangeEvent(args.addedItems, args.removedItems)
            })
        }
    },
    _fireSelectionChangeEvent: function(addedItems, removedItems) {
        this._createActionByOption("onSelectionChanged", {
            excludeValidators: ["disabled", "readOnly"]
        })({
            addedItems: addedItems,
            removedItems: removedItems
        })
    },
    _updateSelection: _common.noop,
    _setAriaSelected: function($target, value) {
        this.setAria("selected", value, $target)
    },
    _removeSelection: function(normalizedIndex) {
        var $itemElement = this._editStrategy.getItemElement(normalizedIndex);
        if (indexExists(normalizedIndex)) {
            this._processSelectableItem($itemElement, false);
            _events_engine2.default.triggerHandler($itemElement, "stateChanged", false)
        }
    },
    _showDeprecatedSelectionMode: function() {
        _ui2.default.log("W0001", this.NAME, "selectionMode: 'multi'", "16.1", "Use selectionMode: 'multiple' instead");
        this.option("selectionMode", "multiple")
    },
    _addSelection: function(normalizedIndex) {
        var $itemElement = this._editStrategy.getItemElement(normalizedIndex);
        if (indexExists(normalizedIndex)) {
            this._processSelectableItem($itemElement, true);
            _events_engine2.default.triggerHandler($itemElement, "stateChanged", true)
        }
    },
    _isItemSelected: function(index) {
        var key = this._getKeyByIndex(index);
        return this._selection.isItemSelected(key)
    },
    _optionChanged: function(args) {
        var _this2 = this;
        switch (args.name) {
            case "selectionMode":
                if ("multi" === args.value) {
                    this._showDeprecatedSelectionMode()
                } else {
                    this._invalidate()
                }
                break;
            case "dataSource":
                if (!args.value || Array.isArray(args.value) && !args.value.length) {
                    this.option("selectedItemKeys", [])
                }
                this.callBase(args);
                break;
            case "selectedIndex":
            case "selectedItem":
            case "selectedItems":
            case "selectedItemKeys":
                this._syncSelectionOptions(args.name).done(function() {
                    return _this2._normalizeSelectedItems()
                });
                break;
            case "keyExpr":
                this._initKeyGetter();
                break;
            case "selectionRequired":
                this._normalizeSelectedItems();
                break;
            case "selectionByClick":
            case "onSelectionChanged":
            case "onItemDeleting":
            case "onItemDeleted":
            case "onItemReordered":
            case "maxFilterLengthInRequest":
                break;
            default:
                this.callBase(args)
        }
    },
    _clearSelectedItems: function() {
        this._setOptionSilent("selectedItems", []);
        this._syncSelectionOptions("selectedItems")
    },
    _waitDeletingPrepare: function($itemElement) {
        if ($itemElement.data(ITEM_DELETING_DATA_KEY)) {
            return (new _deferred.Deferred).resolve().promise()
        }
        $itemElement.data(ITEM_DELETING_DATA_KEY, true);
        var deferred = new _deferred.Deferred,
            deletingActionArgs = {
                cancel: false
            },
            deletePromise = this._itemEventHandler($itemElement, "onItemDeleting", deletingActionArgs, {
                excludeValidators: ["disabled", "readOnly"]
            });
        (0, _deferred.when)(deletePromise).always(function(value) {
            var deletePromiseExists = !deletePromise,
                deletePromiseResolved = !deletePromiseExists && "resolved" === deletePromise.state(),
                argumentsSpecified = !!arguments.length,
                shouldDelete = deletePromiseExists || deletePromiseResolved && !argumentsSpecified || deletePromiseResolved && value;
            (0, _deferred.when)((0, _deferred.fromPromise)(deletingActionArgs.cancel)).always(function() {
                $itemElement.data(ITEM_DELETING_DATA_KEY, false)
            }).done(function(cancel) {
                shouldDelete && !cancel ? deferred.resolve() : deferred.reject()
            }).fail(deferred.reject)
        }.bind(this));
        return deferred.promise()
    },
    _deleteItemFromDS: function($item) {
        if (!this._dataSource) {
            return (new _deferred.Deferred).resolve().promise()
        }
        var deferred = new _deferred.Deferred,
            disabledState = this.option("disabled"),
            dataStore = this._dataSource.store();
        this.option("disabled", true);
        if (!dataStore.remove) {
            throw _ui2.default.Error("E1011")
        }
        dataStore.remove(dataStore.keyOf(this._getItemData($item))).done(function(key) {
            if (void 0 !== key) {
                deferred.resolve()
            } else {
                deferred.reject()
            }
        }).fail(function() {
            deferred.reject()
        });
        deferred.always(function() {
            this.option("disabled", disabledState)
        }.bind(this));
        return deferred
    },
    _tryRefreshLastPage: function() {
        var deferred = new _deferred.Deferred;
        if (this._isLastPage() || this.option("grouped")) {
            deferred.resolve()
        } else {
            this._refreshLastPage().done(function() {
                deferred.resolve()
            })
        }
        return deferred.promise()
    },
    _refreshLastPage: function() {
        this._expectLastItemLoading();
        return this._dataSource.load()
    },
    _updateSelectionAfterDelete: function(index) {
        var key = this._getKeyByIndex(index);
        this._selection.deselect([key])
    },
    _updateIndicesAfterIndex: function(index) {
        var itemElements = this._itemElements();
        for (var i = index + 1; i < itemElements.length; i++) {
            (0, _renderer2.default)(itemElements[i]).data(this._itemIndexKey(), i - 1)
        }
    },
    _simulateOptionChange: function(optionName) {
        var optionValue = this.option(optionName);
        if (optionValue instanceof _data_source.DataSource) {
            return
        }
        this._optionChangedAction({
            name: optionName,
            fullName: optionName,
            value: optionValue
        })
    },
    isItemSelected: function(itemElement) {
        return this._isItemSelected(this._editStrategy.getNormalizedIndex(itemElement))
    },
    selectItem: function(itemElement) {
        if ("none" === this.option("selectionMode")) {
            return
        }
        var itemIndex = this._editStrategy.getNormalizedIndex(itemElement);
        if (!indexExists(itemIndex)) {
            return
        }
        var key = this._getKeyByIndex(itemIndex);
        if (this._selection.isItemSelected(key)) {
            return
        }
        if ("single" === this.option("selectionMode")) {
            this._selection.setSelection([key])
        } else {
            var selectedItemKeys = this.option("selectedItemKeys");
            selectedItemKeys.push(key);
            this._selection.setSelection(selectedItemKeys)
        }
    },
    unselectItem: function(itemElement) {
        var itemIndex = this._editStrategy.getNormalizedIndex(itemElement);
        if (!indexExists(itemIndex)) {
            return
        }
        var selectedItemKeys = this._selection.getSelectedItemKeys();
        if (this.option("selectionRequired") && selectedItemKeys.length <= 1) {
            return
        }
        var key = this._getKeyByIndex(itemIndex);
        if (!this._selection.isItemSelected(key)) {
            return
        }
        this._selection.deselect([key])
    },
    _deleteItemElementByIndex: function(index) {
        this._updateSelectionAfterDelete(index);
        this._updateIndicesAfterIndex(index);
        this._editStrategy.deleteItemAtIndex(index)
    },
    _afterItemElementDeleted: function($item, deletedActionArgs) {
        var changingOption = this._dataSource ? "dataSource" : "items";
        this._simulateOptionChange(changingOption);
        this._itemEventHandler($item, "onItemDeleted", deletedActionArgs, {
            beforeExecute: function() {
                $item.remove()
            },
            excludeValidators: ["disabled", "readOnly"]
        });
        this._renderEmptyMessage()
    },
    deleteItem: function(itemElement) {
        var that = this,
            deferred = new _deferred.Deferred,
            $item = this._editStrategy.getItemElement(itemElement),
            index = this._editStrategy.getNormalizedIndex(itemElement),
            itemResponseWaitClass = this._itemResponseWaitClass();
        if (indexExists(index)) {
            this._waitDeletingPrepare($item).done(function() {
                $item.addClass(itemResponseWaitClass);
                var deletedActionArgs = that._extendActionArgs($item);
                that._deleteItemFromDS($item).done(function() {
                    that._deleteItemElementByIndex(index);
                    that._afterItemElementDeleted($item, deletedActionArgs);
                    that._tryRefreshLastPage().done(function() {
                        deferred.resolveWith(that)
                    })
                }).fail(function() {
                    $item.removeClass(itemResponseWaitClass);
                    deferred.rejectWith(that)
                })
            }).fail(function() {
                deferred.rejectWith(that)
            })
        } else {
            deferred.rejectWith(that)
        }
        return deferred.promise()
    },
    reorderItem: function(itemElement, toItemElement) {
        var deferred = new _deferred.Deferred,
            that = this,
            strategy = this._editStrategy,
            $movingItem = strategy.getItemElement(itemElement),
            $destinationItem = strategy.getItemElement(toItemElement),
            movingIndex = strategy.getNormalizedIndex(itemElement),
            destinationIndex = strategy.getNormalizedIndex(toItemElement),
            changingOption = this._dataSource ? "dataSource" : "items";
        var canMoveItems = indexExists(movingIndex) && indexExists(destinationIndex) && movingIndex !== destinationIndex;
        if (canMoveItems) {
            deferred.resolveWith(this)
        } else {
            deferred.rejectWith(this)
        }
        return deferred.promise().done(function() {
            $destinationItem[strategy.itemPlacementFunc(movingIndex, destinationIndex)]($movingItem);
            strategy.moveItemAtIndexToIndex(movingIndex, destinationIndex);
            this._updateIndicesAfterIndex(movingIndex);
            that.option("selectedItems", that._getItemsByKeys(that._selection.getSelectedItemKeys(), that._selection.getSelectedItems()));
            if ("items" === changingOption) {
                that._simulateOptionChange(changingOption)
            }
            that._itemEventHandler($movingItem, "onItemReordered", {
                fromIndex: strategy.getIndex(movingIndex),
                toIndex: strategy.getIndex(destinationIndex)
            }, {
                excludeValidators: ["disabled", "readOnly"]
            })
        })
    }
});
module.exports = CollectionWidget;
