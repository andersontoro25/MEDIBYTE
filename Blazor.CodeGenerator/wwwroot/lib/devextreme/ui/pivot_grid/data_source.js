/**
 * DevExtreme (ui/pivot_grid/data_source.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _data_source = require("../../data/data_source/data_source");
var _abstract_store = require("../../data/abstract_store");
var _abstract_store2 = _interopRequireDefault(_abstract_store);
var _common = require("../../core/utils/common");
var _type = require("../../core/utils/type");
var _extend = require("../../core/utils/extend");
var _array = require("../../core/utils/array");
var _iterator = require("../../core/utils/iterator");
var _deferred = require("../../core/utils/deferred");
var _class = require("../../core/class");
var _class2 = _interopRequireDefault(_class);
var _events_mixin = require("../../core/events_mixin");
var _events_mixin2 = _interopRequireDefault(_events_mixin);
var _inflector = require("../../core/utils/inflector");
var _local_store = require("./local_store");
var _remote_store = require("./remote_store");
var _remote_store2 = _interopRequireDefault(_remote_store);
var _xmla_store = require("./xmla_store/xmla_store");
var _uiPivot_grid = require("./ui.pivot_grid.summary_display_modes");
var _uiPivot_grid2 = require("./ui.pivot_grid.utils");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var DESCRIPTION_NAME_BY_AREA = {
        row: "rows",
        column: "columns",
        data: "values",
        filter: "filters"
    },
    STATE_PROPERTIES = ["area", "areaIndex", "sortOrder", "filterType", "filterValues", "sortBy", "sortBySummaryField", "sortBySummaryPath", "expanded", "summaryType", "summaryDisplayMode"],
    CALCULATED_PROPERTIES = ["format", "selector", "customizeText", "caption"],
    ALL_CALCULATED_PROPERTIES = CALCULATED_PROPERTIES.concat(["allowSorting", "allowSortingBySummary", "allowFiltering", "allowExpandAll"]);

function createCaption(field) {
    var caption = field.dataField || field.groupName || "",
        summaryType = (field.summaryType || "").toLowerCase();
    if ((0, _type.isString)(field.groupInterval)) {
        caption += "_" + field.groupInterval
    }
    if (summaryType && "custom" !== summaryType) {
        summaryType = summaryType.replace(/^./, summaryType[0].toUpperCase());
        if (caption.length) {
            summaryType = " (" + summaryType + ")"
        }
    } else {
        summaryType = ""
    }
    return (0, _inflector.titleize)(caption) + summaryType
}

function resetFieldState(field, properties) {
    var initialProperties = field._initProperties || {};
    (0, _iterator.each)(properties, function(_, prop) {
        if (Object.prototype.hasOwnProperty.call(initialProperties, prop)) {
            field[prop] = initialProperties[prop]
        }
    })
}

function updateCalculatedFieldProperties(field, calculatedProperties) {
    resetFieldState(field, calculatedProperties);
    if (!(0, _type.isDefined)(field.caption)) {
        (0, _uiPivot_grid2.setFieldProperty)(field, "caption", createCaption(field))
    }
}

function areExpressionsUsed(dataFields) {
    return dataFields.some(function(field) {
        return field.summaryDisplayMode || field.calculateSummaryValue
    })
}

function isRunningTotalUsed(dataFields) {
    return dataFields.some(function(field) {
        return !!field.runningTotal
    })
}

function isDataExists(data) {
    return data.rows.length || data.columns.length || data.values.length
}
module.exports = _class2.default.inherit(function() {
    var findHeaderItem = function(headerItems, path) {
        if (headerItems._cacheByPath) {
            return headerItems._cacheByPath[path.join(".")] || null
        }
    };
    var getHeaderItemsLastIndex = function getHeaderItemsLastIndex(headerItems, grandTotalIndex) {
        var i, headerItem, lastIndex = -1;
        if (headerItems) {
            for (i = 0; i < headerItems.length; i++) {
                headerItem = headerItems[i];
                if (void 0 !== headerItem.index) {
                    lastIndex = Math.max(lastIndex, headerItem.index)
                }
                if (headerItem.children) {
                    lastIndex = Math.max(lastIndex, getHeaderItemsLastIndex(headerItem.children))
                } else {
                    if (headerItem.collapsedChildren) {
                        lastIndex = Math.max(lastIndex, getHeaderItemsLastIndex(headerItem.collapsedChildren))
                    }
                }
            }
        }
        if ((0, _type.isDefined)(grandTotalIndex)) {
            lastIndex = Math.max(lastIndex, grandTotalIndex)
        }
        return lastIndex
    };
    var updateHeaderItemChildren = function(headerItems, headerItem, children, grandTotalIndex) {
        var index, applyingHeaderItemsCount = getHeaderItemsLastIndex(children) + 1,
            emptyIndex = getHeaderItemsLastIndex(headerItems, grandTotalIndex) + 1,
            applyingItemIndexesToCurrent = [],
            needIndexUpdate = false,
            d = new _deferred.Deferred;
        if (headerItem.children && headerItem.children.length === children.length) {
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (void 0 !== child.index) {
                    if (void 0 === headerItem.children[i].index) {
                        child.index = applyingItemIndexesToCurrent[child.index] = emptyIndex++;
                        headerItem.children[i] = child
                    } else {
                        applyingItemIndexesToCurrent[child.index] = headerItem.children[i].index
                    }
                }
            }
        } else {
            needIndexUpdate = true;
            for (index = 0; index < applyingHeaderItemsCount; index++) {
                applyingItemIndexesToCurrent[index] = emptyIndex++
            }
            headerItem.children = children
        }(0, _deferred.when)((0, _uiPivot_grid2.foreachTreeAsync)(headerItem.children, function(items) {
            if (needIndexUpdate) {
                items[0].index = applyingItemIndexesToCurrent[items[0].index]
            }
        })).done(function() {
            d.resolve(applyingItemIndexesToCurrent)
        });
        return d
    };
    var updateHeaderItems = function(headerItems, newHeaderItems, grandTotalIndex) {
        var d = new _deferred.Deferred,
            emptyIndex = grandTotalIndex >= 0 && getHeaderItemsLastIndex(headerItems, grandTotalIndex) + 1;
        var applyingItemIndexesToCurrent = [];
        (0, _deferred.when)((0, _uiPivot_grid2.foreachTreeAsync)(headerItems, function(items) {
            delete items[0].collapsedChildren
        })).done(function() {
            (0, _deferred.when)((0, _uiPivot_grid2.foreachTreeAsync)(newHeaderItems, function(newItems, index) {
                var newItem = newItems[0];
                if (newItem.index >= 0) {
                    var headerItem = findHeaderItem(headerItems, (0, _uiPivot_grid2.createPath)(newItems));
                    if (headerItem && headerItem.index >= 0) {
                        applyingItemIndexesToCurrent[newItem.index] = headerItem.index
                    } else {
                        if (emptyIndex) {
                            var path = (0, _uiPivot_grid2.createPath)(newItems.slice(1));
                            headerItem = findHeaderItem(headerItems, path);
                            var parentItems = path.length ? headerItem && headerItem.children : headerItems;
                            if (parentItems) {
                                parentItems[index] = newItem;
                                newItem.index = applyingItemIndexesToCurrent[newItem.index] = emptyIndex++
                            }
                        }
                    }
                }
            })).done(function() {
                d.resolve(applyingItemIndexesToCurrent)
            })
        });
        return d
    };
    var updateDataSourceCells = function(dataSource, newDataSourceCells, newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) {
        var newRowIndex, newColumnIndex, newRowCells, newCell, rowIndex, columnIndex, dataSourceCells = dataSource.values;
        if (newDataSourceCells) {
            for (newRowIndex = 0; newRowIndex <= newDataSourceCells.length; newRowIndex++) {
                newRowCells = newDataSourceCells[newRowIndex];
                rowIndex = newRowItemIndexesToCurrent[newRowIndex];
                if (!(0, _type.isDefined)(rowIndex)) {
                    rowIndex = dataSource.grandTotalRowIndex
                }
                if (newRowCells && (0, _type.isDefined)(rowIndex)) {
                    if (!dataSourceCells[rowIndex]) {
                        dataSourceCells[rowIndex] = []
                    }
                    for (newColumnIndex = 0; newColumnIndex <= newRowCells.length; newColumnIndex++) {
                        newCell = newRowCells[newColumnIndex];
                        columnIndex = newColumnItemIndexesToCurrent[newColumnIndex];
                        if (!(0, _type.isDefined)(columnIndex)) {
                            columnIndex = dataSource.grandTotalColumnIndex
                        }
                        if ((0, _type.isDefined)(newCell) && (0, _type.isDefined)(columnIndex)) {
                            dataSourceCells[rowIndex][columnIndex] = newCell
                        }
                    }
                }
            }
        }
    };

    function createLocalOrRemoteStore(dataSourceOptions, notifyProgress) {
        var StoreConstructor = dataSourceOptions.remoteOperations || dataSourceOptions.paginate ? _remote_store2.default : _local_store.LocalStore;
        return new StoreConstructor((0, _extend.extend)((0, _data_source.normalizeDataSourceOptions)(dataSourceOptions), {
            onChanged: null,
            onLoadingChanged: null,
            onProgressChanged: notifyProgress
        }))
    }

    function createStore(dataSourceOptions, notifyProgress) {
        var store, storeOptions;
        if ((0, _type.isPlainObject)(dataSourceOptions) && dataSourceOptions.load) {
            store = createLocalOrRemoteStore(dataSourceOptions, notifyProgress)
        } else {
            if (dataSourceOptions && !dataSourceOptions.store) {
                dataSourceOptions = {
                    store: dataSourceOptions
                }
            }
            storeOptions = dataSourceOptions.store;
            if ("xmla" === storeOptions.type) {
                store = new _xmla_store.XmlaStore(storeOptions)
            } else {
                if ((0, _type.isPlainObject)(storeOptions) && storeOptions.type || storeOptions instanceof _abstract_store2.default || Array.isArray(storeOptions)) {
                    store = createLocalOrRemoteStore(dataSourceOptions, notifyProgress)
                } else {
                    if (storeOptions instanceof _class2.default) {
                        store = storeOptions
                    }
                }
            }
        }
        return store
    }

    function equalFields(fields, prevFields, count) {
        for (var i = 0; i < count; i++) {
            if (!fields[i] || !prevFields[i] || fields[i].index !== prevFields[i].index) {
                return false
            }
        }
        return true
    }

    function getExpandedPaths(dataSource, loadOptions, dimensionName, prevLoadOptions) {
        var result = [],
            fields = loadOptions && loadOptions[dimensionName] || [],
            prevFields = prevLoadOptions && prevLoadOptions[dimensionName] || [];
        (0, _uiPivot_grid2.foreachTree)(dataSource[dimensionName], function(items) {
            var item = items[0],
                path = (0, _uiPivot_grid2.createPath)(items);
            if (item.children && fields[path.length - 1] && !fields[path.length - 1].expanded) {
                if (path.length < fields.length && (!prevLoadOptions || equalFields(fields, prevFields, path.length))) {
                    result.push(path.slice())
                }
            }
        }, true);
        return result
    }

    function setFieldProperties(field, srcField, skipInitPropertySave, properties) {
        if (srcField) {
            (0, _iterator.each)(properties, function(_, name) {
                if (skipInitPropertySave) {
                    field[name] = srcField[name]
                } else {
                    if (("summaryType" === name || "summaryDisplayMode" === name) && void 0 === srcField[name]) {
                        return
                    }(0, _uiPivot_grid2.setFieldProperty)(field, name, srcField[name])
                }
            })
        } else {
            resetFieldState(field, properties)
        }
        return field
    }

    function getFieldsState(fields, properties) {
        var result = [];
        (0, _iterator.each)(fields, function(_, field) {
            result.push(setFieldProperties({
                dataField: field.dataField,
                name: field.name
            }, field, true, properties))
        });
        return result
    }

    function getFieldStateId(field) {
        if (field.name) {
            return field.name
        }
        return field.dataField + ""
    }

    function getFieldsById(fields, id) {
        var result = [];
        (0, _iterator.each)(fields || [], function(_, field) {
            if (getFieldStateId(field) === id) {
                result.push(field)
            }
        });
        return result
    }

    function setFieldsStateCore(stateFields, fields) {
        stateFields = stateFields || [];
        (0, _iterator.each)(fields, function(index, field) {
            setFieldProperties(field, stateFields[index], false, STATE_PROPERTIES);
            updateCalculatedFieldProperties(field, CALCULATED_PROPERTIES)
        });
        return fields
    }

    function setFieldsState(stateFields, fields) {
        stateFields = stateFields || [];
        var id, fieldsById = {};
        (0, _iterator.each)(fields, function(_, field) {
            id = getFieldStateId(field);
            if (!fieldsById[id]) {
                fieldsById[id] = getFieldsById(fields, getFieldStateId(field))
            }
        });
        (0, _iterator.each)(fieldsById, function(id, fields) {
            setFieldsStateCore(getFieldsById(stateFields, id), fields)
        });
        return fields
    }

    function getFieldsByGroup(fields, groupingField) {
        return fields.filter(function(field) {
            return field.groupName === groupingField.groupName && (0, _type.isNumeric)(field.groupIndex) && false !== field.visible
        }).map(function(field) {
            return (0, _extend.extend)(field, {
                areaIndex: groupingField.areaIndex,
                area: groupingField.area,
                expanded: (0, _type.isDefined)(field.expanded) ? field.expanded : groupingField.expanded,
                dataField: field.dataField || groupingField.dataField,
                dataType: field.dataType || groupingField.dataType,
                sortBy: field.sortBy || groupingField.sortBy,
                sortOrder: field.sortOrder || groupingField.sortOrder,
                sortBySummaryField: field.sortBySummaryField || groupingField.sortBySummaryField,
                sortBySummaryPath: field.sortBySummaryPath || groupingField.sortBySummaryPath,
                visible: field.visible || groupingField.visible,
                showTotals: (0, _type.isDefined)(field.showTotals) ? field.showTotals : groupingField.showTotals,
                showGrandTotals: (0, _type.isDefined)(field.showGrandTotals) ? field.showGrandTotals : groupingField.showGrandTotals
            })
        }).sort(function(a, b) {
            return a.groupIndex - b.groupIndex
        })
    }

    function sortFieldsByAreaIndex(fields) {
        fields.sort(function(field1, field2) {
            return field1.areaIndex - field2.areaIndex || field1.groupIndex - field2.groupIndex
        })
    }

    function isAreaField(field, area) {
        var canAddFieldInArea = "data" === area || false !== field.visible;
        return field.area === area && !(0, _type.isDefined)(field.groupIndex) && canAddFieldInArea
    }

    function getFieldId(field, retrieveFieldsOptionValue) {
        var groupName = field.groupName || "";
        return (field.dataField || groupName) + (field.groupInterval ? groupName + field.groupInterval : "NOGROUP") + (retrieveFieldsOptionValue ? "" : groupName)
    }

    function mergeFields(fields, storeFields, retrieveFieldsOptionValue) {
        var result = [],
            fieldsDictionary = {},
            removedFields = {},
            mergedGroups = [],
            dataTypes = (0, _uiPivot_grid2.getFieldsDataType)(fields);
        if (storeFields) {
            (0, _iterator.each)(storeFields, function(_, field) {
                fieldsDictionary[getFieldId(field, retrieveFieldsOptionValue)] = field
            });
            (0, _iterator.each)(fields, function(_, field) {
                var mergedField, fieldKey = getFieldId(field, retrieveFieldsOptionValue),
                    storeField = fieldsDictionary[fieldKey] || removedFields[fieldKey];
                if (storeField) {
                    if (storeField._initProperties) {
                        resetFieldState(storeField, ALL_CALCULATED_PROPERTIES)
                    }
                    mergedField = (0, _extend.extend)({}, storeField, field, {
                        _initProperties: null
                    })
                } else {
                    fieldsDictionary[fieldKey] = mergedField = field
                }(0, _extend.extend)(mergedField, {
                    dataType: dataTypes[field.dataField]
                });
                delete fieldsDictionary[fieldKey];
                removedFields[fieldKey] = storeField;
                result.push(mergedField)
            });
            if (retrieveFieldsOptionValue) {
                (0, _iterator.each)(fieldsDictionary, function(_, field) {
                    result.push(field)
                })
            }
        } else {
            result = fields
        }
        result.push.apply(result, mergedGroups);
        return result
    }

    function getFields(that) {
        var mergedFields, result = new _deferred.Deferred,
            store = that._store,
            storeFields = store && store.getFields(that._fields);
        (0, _deferred.when)(storeFields).done(function(storeFields) {
            that._storeFields = storeFields;
            mergedFields = mergeFields(that._fields, storeFields, that._retrieveFields);
            result.resolve(mergedFields)
        }).fail(result.reject);
        return result
    }

    function getSliceIndex(items, path) {
        var index = null,
            pathValue = (path || []).join(".");
        if (pathValue.length) {
            (0, _uiPivot_grid2.foreachTree)(items, function(items) {
                var item = items[0],
                    itemPath = (0, _uiPivot_grid2.createPath)(items).join("."),
                    textPath = (0, _iterator.map)(items, function(item) {
                        return item.text
                    }).reverse().join(".");
                if (pathValue === itemPath || item.key && textPath === pathValue) {
                    index = items[0].index;
                    return false
                }
            })
        }
        return index
    }

    function getFieldSummaryValueSelector(field, dataSource, loadOptions, dimensionName) {
        var values = dataSource.values,
            sortBySummaryFieldIndex = (0, _uiPivot_grid2.findField)(loadOptions.values, field.sortBySummaryField),
            areRows = "rows" === dimensionName,
            sortByDimension = areRows ? dataSource.columns : dataSource.rows,
            grandTotalIndex = areRows ? dataSource.grandTotalRowIndex : dataSource.grandTotalColumnIndex,
            sortBySummaryPath = field.sortBySummaryPath || [],
            sliceIndex = sortBySummaryPath.length ? getSliceIndex(sortByDimension, sortBySummaryPath) : grandTotalIndex;
        if (values && values.length && sortBySummaryFieldIndex >= 0 && (0, _type.isDefined)(sliceIndex)) {
            return function(field) {
                var rowIndex = areRows ? field.index : sliceIndex,
                    columnIndex = areRows ? sliceIndex : field.index,
                    value = ((values[rowIndex] || [
                        []
                    ])[columnIndex] || [])[sortBySummaryFieldIndex];
                return (0, _type.isDefined)(value) ? value : null
            }
        }
    }

    function getMemberForSortBy(sortBy, getAscOrder) {
        var member = "text";
        if ("none" === sortBy) {
            member = "index"
        } else {
            if (getAscOrder || "displayText" !== sortBy) {
                member = "value"
            }
        }
        return member
    }

    function getSortingMethod(field, dataSource, loadOptions, dimensionName, getAscOrder) {
        var sortOrder = getAscOrder ? "asc" : field.sortOrder,
            sortBy = getMemberForSortBy(field.sortBy, getAscOrder),
            defaultCompare = field.sortingMethod ? function(a, b) {
                return field.sortingMethod(a, b)
            } : (0, _uiPivot_grid2.getCompareFunction)(function(item) {
                return item[sortBy]
            }),
            summaryValueSelector = !getAscOrder && getFieldSummaryValueSelector(field, dataSource, loadOptions, dimensionName),
            summaryCompare = summaryValueSelector && (0, _uiPivot_grid2.getCompareFunction)(summaryValueSelector),
            sortingMethod = function(a, b) {
                var result = summaryCompare && summaryCompare(a, b) || defaultCompare(a, b);
                return "desc" === sortOrder ? -result : result
            };
        return sortingMethod
    }

    function sortDimension(dataSource, loadOptions, dimensionName, getAscOrder) {
        var fields = loadOptions[dimensionName] || [],
            baseIndex = loadOptions.headerName === dimensionName ? loadOptions.path.length : 0,
            sortingMethodByLevel = [];
        (0, _uiPivot_grid2.foreachDataLevel)(dataSource[dimensionName], function(item, index) {
            var field = fields[index] || {},
                sortingMethod = sortingMethodByLevel[index] = sortingMethodByLevel[index] || getSortingMethod(field, dataSource, loadOptions, dimensionName, getAscOrder);
            item.sort(sortingMethod)
        }, baseIndex)
    }

    function sort(loadOptions, dataSource, getAscOrder) {
        sortDimension(dataSource, loadOptions, "rows", getAscOrder);
        sortDimension(dataSource, loadOptions, "columns", getAscOrder)
    }

    function formatHeaderItems(data, loadOptions, headerName) {
        return (0, _uiPivot_grid2.foreachTreeAsync)(data[headerName], function(items) {
            var item = items[0];
            item.text = item.text || (0, _uiPivot_grid2.formatValue)(item.value, loadOptions[headerName][(0, _uiPivot_grid2.createPath)(items).length - 1])
        })
    }

    function formatHeaders(loadOptions, data) {
        return (0, _deferred.when)(formatHeaderItems(data, loadOptions, "columns"), formatHeaderItems(data, loadOptions, "rows"))
    }

    function updateCache(headerItems) {
        var d = new _deferred.Deferred;
        var cacheByPath = {};
        (0, _deferred.when)((0, _uiPivot_grid2.foreachTreeAsync)(headerItems, function(items) {
            var path = (0, _uiPivot_grid2.createPath)(items).join(".");
            cacheByPath[path] = items[0]
        })).done(d.resolve);
        headerItems._cacheByPath = cacheByPath;
        return d
    }

    function _getAreaFields(fields, area) {
        var areaFields = [];
        (0, _iterator.each)(fields, function() {
            if (isAreaField(this, area)) {
                areaFields.push(this)
            }
        });
        return areaFields
    }
    return {
        ctor: function(options) {
            options = options || {};
            var that = this,
                store = createStore(options, function(progress) {
                    that.fireEvent("progressChanged", [progress])
                });
            that._store = store;
            that._paginate = !!options.paginate;
            that._pageSize = options.pageSize || 40;
            that._data = {
                rows: [],
                columns: [],
                values: []
            };
            that._loadingCount = 0;
            that._isFieldsModified = false;
            (0, _iterator.each)(["changed", "loadError", "loadingChanged", "progressChanged", "fieldsPrepared", "expandValueChanging"], function(_, eventName) {
                var optionName = "on" + eventName[0].toUpperCase() + eventName.slice(1);
                if (Object.prototype.hasOwnProperty.call(options, optionName)) {
                    this.on(eventName, options[optionName])
                }
            }.bind(this));
            that._retrieveFields = (0, _type.isDefined)(options.retrieveFields) ? options.retrieveFields : true;
            that._fields = options.fields || [];
            that._descriptions = options.descriptions ? (0, _extend.extend)(that._createDescriptions(), options.descriptions) : void 0;
            if (!store) {
                (0, _extend.extend)(true, that._data, options.store || options)
            }
        },
        getData: function() {
            return this._data
        },
        getAreaFields: function(area, collectGroups) {
            var descriptions, areaFields = [];
            if (collectGroups || "data" === area) {
                areaFields = _getAreaFields(this._fields, area);
                sortFieldsByAreaIndex(areaFields)
            } else {
                descriptions = this._descriptions || {};
                areaFields = descriptions[DESCRIPTION_NAME_BY_AREA[area]] || []
            }
            return areaFields
        },
        fields: function(_fields) {
            var that = this;
            if (_fields) {
                that._fields = mergeFields(_fields, that._storeFields, that._retrieveFields);
                that._fieldsPrepared(that._fields)
            }
            return that._fields
        },
        field: function field(id, options) {
            var levels, that = this,
                fields = that._fields,
                field = fields && fields[(0, _type.isNumeric)(id) ? id : (0, _uiPivot_grid2.findField)(fields, id)];
            if (field && options) {
                (0, _iterator.each)(options, function(optionName, optionValue) {
                    var isInitialization = (0, _array.inArray)(optionName, STATE_PROPERTIES) < 0;
                    (0, _uiPivot_grid2.setFieldProperty)(field, optionName, optionValue, isInitialization);
                    if ("sortOrder" === optionName) {
                        levels = field.levels || [];
                        for (var i = 0; i < levels.length; i++) {
                            levels[i][optionName] = optionValue
                        }
                    }
                });
                updateCalculatedFieldProperties(field, CALCULATED_PROPERTIES);
                that._descriptions = that._createDescriptions(field);
                that._isFieldsModified = true;
                that.fireEvent("fieldChanged", [field])
            }
            return field
        },
        getFieldValues: function(index, applyFilters, options) {
            var searchValue, that = this,
                field = this._fields && this._fields[index],
                store = this.store(),
                loadFields = [],
                loadOptions = {
                    columns: loadFields,
                    rows: [],
                    values: this.getAreaFields("data"),
                    filters: applyFilters ? this._fields.filter(function(f) {
                        return f !== field && f.area && f.filterValues && f.filterValues.length
                    }) : [],
                    skipValues: true
                },
                d = new _deferred.Deferred;
            if (options) {
                searchValue = options.searchValue;
                loadOptions.columnSkip = options.skip;
                loadOptions.columnTake = options.take
            }
            if (field && store) {
                (0, _iterator.each)(field.levels || [field], function() {
                    loadFields.push((0, _extend.extend)({}, this, {
                        expanded: true,
                        filterValues: null,
                        sortOrder: "asc",
                        sortBySummaryField: null,
                        searchValue: searchValue
                    }))
                });
                store.load(loadOptions).done(function(data) {
                    if (loadOptions.columnSkip) {
                        data.columns = data.columns.slice(loadOptions.columnSkip)
                    }
                    if (loadOptions.columnTake) {
                        data.columns = data.columns.slice(0, loadOptions.columnTake)
                    }
                    formatHeaders(loadOptions, data);
                    if (!loadOptions.columnTake) {
                        that._sort(loadOptions, data)
                    }
                    d.resolve(data.columns)
                }).fail(d)
            } else {
                d.reject()
            }
            return d
        },
        reload: function() {
            return this.load({
                reload: true
            })
        },
        filter: function() {
            var store = this._store;
            return store.filter.apply(store, arguments)
        },
        load: function(options) {
            var that = this,
                d = new _deferred.Deferred;
            options = options || {};
            that.beginLoading();
            d.fail(function(e) {
                that.fireEvent("loadError", [e])
            }).always(function() {
                that.endLoading()
            });

            function loadTask() {
                that._delayedLoadTask = void 0;
                if (!that._descriptions) {
                    (0, _deferred.when)(getFields(that)).done(function(fields) {
                        that._fieldsPrepared(fields);
                        that._loadCore(options, d)
                    }).fail(d.reject).fail(that._loadErrorHandler)
                } else {
                    that._loadCore(options, d)
                }
            }
            if (that.store()) {
                that._delayedLoadTask = (0, _common.executeAsync)(loadTask)
            } else {
                loadTask()
            }
            return d
        },
        createDrillDownDataSource: function(params) {
            return this._store.createDrillDownDataSource(this._descriptions, params)
        },
        _createDescriptions: function(currentField) {
            var that = this,
                fields = that.fields(),
                descriptions = {
                    rows: [],
                    columns: [],
                    values: [],
                    filters: []
                };
            (0, _iterator.each)(["row", "column", "data", "filter"], function(_, areaName) {
                (0, _array.normalizeIndexes)(_getAreaFields(fields, areaName), "areaIndex", currentField)
            });
            (0, _iterator.each)(fields || [], function(_, field) {
                var descriptionName = DESCRIPTION_NAME_BY_AREA[field.area],
                    dimension = descriptions[descriptionName],
                    groupName = field.groupName;
                if (groupName && !(0, _type.isNumeric)(field.groupIndex)) {
                    field.levels = getFieldsByGroup(fields, field)
                }
                if (!dimension || groupName && (0, _type.isNumeric)(field.groupIndex) || false === field.visible && "data" !== field.area && "filter" !== field.area) {
                    return
                }
                if (field.levels && dimension !== descriptions.filters && dimension !== descriptions.values) {
                    dimension.push.apply(dimension, field.levels);
                    if (field.filterValues && field.filterValues.length) {
                        descriptions.filters.push(field)
                    }
                } else {
                    dimension.push(field)
                }
            });
            (0, _iterator.each)(descriptions, function(_, fields) {
                sortFieldsByAreaIndex(fields)
            });
            var indices = {};
            (0, _iterator.each)(descriptions.values, function(_, field) {
                var expression = field.calculateSummaryValue;
                if ((0, _type.isFunction)(expression)) {
                    var summaryCell = (0, _uiPivot_grid.createMockSummaryCell)(descriptions, fields, indices);
                    expression(summaryCell)
                }
            });
            return descriptions
        },
        _fieldsPrepared: function(fields) {
            var that = this;
            that._fields = fields;
            (0, _iterator.each)(fields, function(index, field) {
                field.index = index;
                updateCalculatedFieldProperties(field, ALL_CALCULATED_PROPERTIES)
            });
            var currentFieldState = getFieldsState(fields, ["caption"]);
            that.fireEvent("fieldsPrepared", [fields]);
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].caption !== currentFieldState[i].caption) {
                    (0, _uiPivot_grid2.setFieldProperty)(fields[i], "caption", fields[i].caption, true)
                }
            }
            that._descriptions = that._createDescriptions()
        },
        isLoading: function() {
            return this._loadingCount > 0
        },
        state: function(_state, skipLoading) {
            var that = this;
            if (arguments.length) {
                _state = (0, _extend.extend)({
                    rowExpandedPaths: [],
                    columnExpandedPaths: []
                }, _state);
                if (!that._descriptions) {
                    that.beginLoading();
                    (0, _deferred.when)(getFields(that)).done(function(fields) {
                        that._fields = setFieldsState(_state.fields, fields);
                        that._fieldsPrepared(fields);
                        !skipLoading && that.load(_state)
                    }).always(function() {
                        that.endLoading()
                    })
                } else {
                    that._fields = setFieldsState(_state.fields, that._fields);
                    that._descriptions = that._createDescriptions();
                    !skipLoading && that.load(_state)
                }
            } else {
                return {
                    fields: getFieldsState(that._fields, STATE_PROPERTIES),
                    columnExpandedPaths: getExpandedPaths(that._data, that._descriptions, "columns"),
                    rowExpandedPaths: getExpandedPaths(that._data, that._descriptions, "rows")
                }
            }
        },
        beginLoading: function() {
            this._changeLoadingCount(1)
        },
        endLoading: function() {
            this._changeLoadingCount(-1)
        },
        _changeLoadingCount: function(increment) {
            var newLoading, oldLoading = this.isLoading();
            this._loadingCount += increment;
            newLoading = this.isLoading();
            if (oldLoading ^ newLoading) {
                this.fireEvent("loadingChanged", [newLoading])
            }
        },
        _hasPagingValues: function(options, area, oppositeIndex) {
            var takeField = area + "Take",
                skipField = area + "Skip",
                values = this._data.values,
                items = this._data[area + "s"],
                oppositeArea = "row" === area ? "column" : "row",
                indices = [];
            if (options.path && options.area === area) {
                var headerItem = findHeaderItem(items, options.path);
                items = headerItem && headerItem.children;
                if (!items) {
                    return false
                }
            }
            if (options.oppositePath && options.area === oppositeArea) {
                var _headerItem = findHeaderItem(items, options.oppositePath);
                items = _headerItem && _headerItem.children;
                if (!items) {
                    return false
                }
            }
            for (var i = options[skipField]; i < options[skipField] + options[takeField]; i++) {
                if (items[i]) {
                    indices.push(items[i].index)
                }
            }
            return indices.every(function(index) {
                if (void 0 !== index) {
                    if ("row" === area) {
                        return (values[index] || [])[oppositeIndex]
                    } else {
                        return (values[oppositeIndex] || [])[index]
                    }
                }
            })
        },
        _processPagingCacheByArea: function(options, pageSize, area) {
            var item, takeField = area + "Take",
                skipField = area + "Skip",
                items = this._data[area + "s"],
                oppositeArea = "row" === area ? "column" : "row";
            if (options[takeField]) {
                if (options.path && options.area === area) {
                    var headerItem = findHeaderItem(items, options.path);
                    items = headerItem && headerItem.children || []
                }
                if (options.oppositePath && options.area === oppositeArea) {
                    var _headerItem2 = findHeaderItem(items, options.oppositePath);
                    items = _headerItem2 && _headerItem2.children || []
                }
                do {
                    item = items[options[skipField]];
                    if (item && void 0 !== item.index) {
                        if (this._hasPagingValues(options, oppositeArea, item.index)) {
                            options[skipField]++;
                            options[takeField]--
                        } else {
                            break
                        }
                    }
                } while (item && void 0 !== item.index && options[takeField]);
                if (options[takeField]) {
                    var start = Math.floor(options[skipField] / pageSize) * pageSize;
                    var end = Math.ceil((options[skipField] + options[takeField]) / pageSize) * pageSize;
                    options[skipField] = start;
                    options[takeField] = end - start
                }
            }
        },
        _processPagingCache: function(storeLoadOptions) {
            var pageSize = this._pageSize;
            if (pageSize < 0) {
                return
            }
            for (var i = 0; i < storeLoadOptions.length; i++) {
                this._processPagingCacheByArea(storeLoadOptions[i], pageSize, "row");
                this._processPagingCacheByArea(storeLoadOptions[i], pageSize, "column")
            }
        },
        _loadCore: function(options, deferred) {
            var that = this,
                store = this._store,
                descriptions = this._descriptions,
                reload = options.reload || this.paginate() && that._isFieldsModified,
                paginate = this.paginate(),
                headerName = DESCRIPTION_NAME_BY_AREA[options.area];
            options = options || {};
            if (store) {
                (0, _extend.extend)(options, descriptions);
                options.columnExpandedPaths = options.columnExpandedPaths || getExpandedPaths(this._data, options, "columns", that._lastLoadOptions);
                options.rowExpandedPaths = options.rowExpandedPaths || getExpandedPaths(this._data, options, "rows", that._lastLoadOptions);
                if (paginate) {
                    options.pageSize = this._pageSize
                }
                if (headerName) {
                    options.headerName = headerName
                }
                that.beginLoading();
                deferred.always(function() {
                    that.endLoading()
                });
                var storeLoadOptions = [options];
                that.fireEvent("customizeStoreLoadOptions", [storeLoadOptions, reload]);
                if (!reload) {
                    that._processPagingCache(storeLoadOptions)
                }
                storeLoadOptions = storeLoadOptions.filter(function(options) {
                    return !(options.rows.length && 0 === options.rowTake) && !(options.columns.length && 0 === options.columnTake)
                });
                if (!storeLoadOptions.length) {
                    that._update(deferred);
                    return
                }
                var results = storeLoadOptions.map(function(options) {
                    return store.load(options)
                });
                _deferred.when.apply(null, results).done(function() {
                    var results = arguments;
                    for (var i = 0; i < results.length; i++) {
                        var options = storeLoadOptions[i],
                            data = results[i],
                            isLast = i === results.length - 1;
                        if (options.path) {
                            that.applyPartialDataSource(options.area, options.path, data, isLast ? deferred : false, options.oppositePath)
                        } else {
                            if (paginate && !reload && isDataExists(that._data)) {
                                that.mergePartialDataSource(data, isLast ? deferred : false)
                            } else {
                                (0, _extend.extend)(that._data, data);
                                that._lastLoadOptions = options;
                                that._update(isLast ? deferred : false)
                            }
                        }
                    }
                }).fail(deferred.reject)
            } else {
                that._update(deferred)
            }
        },
        _sort: function(descriptions, data, getAscOrder) {
            var store = this._store;
            if (store && !this._paginate) {
                sort(descriptions, data, getAscOrder)
            }
        },
        paginate: function() {
            return this._paginate && this._store && this._store.supportPaging()
        },
        isEmpty: function() {
            var dataFields = this.getAreaFields("data"),
                data = this.getData();
            return !dataFields.length || !data.values.length
        },
        _update: function(deferred) {
            var that = this,
                descriptions = that._descriptions,
                loadedData = that._data,
                dataFields = descriptions.values,
                expressionsUsed = areExpressionsUsed(dataFields);
            (0, _deferred.when)(formatHeaders(descriptions, loadedData), updateCache(loadedData.rows), updateCache(loadedData.columns)).done(function() {
                if (expressionsUsed) {
                    that._sort(descriptions, loadedData, expressionsUsed);
                    !that.isEmpty() && (0, _uiPivot_grid.applyDisplaySummaryMode)(descriptions, loadedData)
                }
                that._sort(descriptions, loadedData);
                !that.isEmpty() && isRunningTotalUsed(dataFields) && (0, _uiPivot_grid.applyRunningTotal)(descriptions, loadedData);
                that._data = loadedData;
                false !== deferred && (0, _deferred.when)(deferred).done(function() {
                    that._isFieldsModified = false;
                    that.fireEvent("changed");
                    if ((0, _type.isDefined)(that._data.grandTotalRowIndex)) {
                        loadedData.grandTotalRowIndex = that._data.grandTotalRowIndex
                    }
                    if ((0, _type.isDefined)(that._data.grandTotalColumnIndex)) {
                        loadedData.grandTotalColumnIndex = that._data.grandTotalColumnIndex
                    }
                });
                deferred && deferred.resolve(that._data)
            });
            return deferred
        },
        store: function() {
            return this._store
        },
        collapseHeaderItem: function(area, path) {
            var that = this,
                headerItems = "column" === area ? that._data.columns : that._data.rows,
                headerItem = findHeaderItem(headerItems, path),
                field = that.getAreaFields(area)[path.length - 1];
            if (headerItem && headerItem.children) {
                that.fireEvent("expandValueChanging", [{
                    area: area,
                    path: path,
                    expanded: false
                }]);
                if (field) {
                    field.expanded = false
                }
                headerItem.collapsedChildren = headerItem.children;
                delete headerItem.children;
                that._update();
                if (that.paginate()) {
                    that.load()
                }
                return true
            }
            return false
        },
        collapseAll: function(id) {
            var _this = this;
            var dataChanged = false,
                field = this.field(id) || {},
                areaOffsets = [(0, _array.inArray)(field, this.getAreaFields(field.area))];
            field.expanded = false;
            if (field && field.levels) {
                areaOffsets = [];
                field.levels.forEach(function(f) {
                    areaOffsets.push((0, _array.inArray)(f, _this.getAreaFields(field.area)));
                    f.expanded = false
                })
            }(0, _uiPivot_grid2.foreachTree)(this._data[field.area + "s"], function(items) {
                var item = items[0],
                    path = (0, _uiPivot_grid2.createPath)(items);
                if (item && item.children && areaOffsets.indexOf(path.length - 1) !== -1) {
                    item.collapsedChildren = item.children;
                    delete item.children;
                    dataChanged = true
                }
            }, true);
            dataChanged && this._update()
        },
        expandAll: function(id) {
            var field = this.field(id);
            if (field && field.area) {
                field.expanded = true;
                if (field && field.levels) {
                    field.levels.forEach(function(f) {
                        f.expanded = true
                    })
                }
                this.load()
            }
        },
        expandHeaderItem: function(area, path) {
            var hasCache, options, that = this,
                headerItems = "column" === area ? that._data.columns : that._data.rows,
                headerItem = findHeaderItem(headerItems, path);
            if (headerItem && !headerItem.children) {
                hasCache = !!headerItem.collapsedChildren;
                options = {
                    area: area,
                    path: path,
                    expanded: true,
                    needExpandData: !hasCache
                };
                that.fireEvent("expandValueChanging", [options]);
                if (hasCache) {
                    headerItem.children = headerItem.collapsedChildren;
                    delete headerItem.collapsedChildren;
                    that._update()
                } else {
                    that.load(options)
                }
                return hasCache
            }
            return false
        },
        mergePartialDataSource: function(dataSource, deferred) {
            var newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent, that = this,
                loadedData = that._data;
            if (dataSource && dataSource.values) {
                dataSource.rows = dataSource.rows || [];
                dataSource.columns = dataSource.columns || [];
                newRowItemIndexesToCurrent = updateHeaderItems(loadedData.rows, dataSource.rows, loadedData.grandTotalColumnIndex);
                newColumnItemIndexesToCurrent = updateHeaderItems(loadedData.columns, dataSource.columns, loadedData.grandTotalColumnIndex);
                (0, _deferred.when)(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent).done(function(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) {
                    if (newRowItemIndexesToCurrent.length || newColumnItemIndexesToCurrent.length) {
                        updateDataSourceCells(loadedData, dataSource.values, newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent)
                    }
                    that._update(deferred)
                })
            }
        },
        applyPartialDataSource: function(area, path, dataSource, deferred, oppositePath) {
            var headerItem, oppositeHeaderItem, newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent, that = this,
                loadedData = that._data,
                headerItems = "column" === area ? loadedData.columns : loadedData.rows,
                oppositeHeaderItems = "column" === area ? loadedData.rows : loadedData.columns;
            if (dataSource && dataSource.values) {
                dataSource.rows = dataSource.rows || [];
                dataSource.columns = dataSource.columns || [];
                headerItem = findHeaderItem(headerItems, path);
                oppositeHeaderItem = oppositePath && findHeaderItem(oppositeHeaderItems, oppositePath);
                if (headerItem) {
                    if ("column" === area) {
                        newColumnItemIndexesToCurrent = updateHeaderItemChildren(headerItems, headerItem, dataSource.columns, loadedData.grandTotalColumnIndex);
                        if (oppositeHeaderItem) {
                            newRowItemIndexesToCurrent = updateHeaderItemChildren(oppositeHeaderItems, oppositeHeaderItem, dataSource.rows, loadedData.grandTotalRowIndex)
                        } else {
                            newRowItemIndexesToCurrent = updateHeaderItems(loadedData.rows, dataSource.rows, loadedData.grandTotalRowIndex)
                        }
                    } else {
                        newRowItemIndexesToCurrent = updateHeaderItemChildren(headerItems, headerItem, dataSource.rows, loadedData.grandTotalRowIndex);
                        if (oppositeHeaderItem) {
                            newColumnItemIndexesToCurrent = updateHeaderItemChildren(oppositeHeaderItems, oppositeHeaderItem, dataSource.columns, loadedData.grandTotalColumnIndex)
                        } else {
                            newColumnItemIndexesToCurrent = updateHeaderItems(loadedData.columns, dataSource.columns, loadedData.grandTotalColumnIndex)
                        }
                    }(0, _deferred.when)(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent).done(function(newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent) {
                        if ("row" === area && newRowItemIndexesToCurrent.length || "column" === area && newColumnItemIndexesToCurrent.length) {
                            updateDataSourceCells(loadedData, dataSource.values, newRowItemIndexesToCurrent, newColumnItemIndexesToCurrent)
                        }
                        that._update(deferred)
                    })
                }
            }
        },
        dispose: function() {
            var that = this,
                delayedLoadTask = that._delayedLoadTask;
            this._disposeEvents();
            if (delayedLoadTask) {
                delayedLoadTask.abort()
            }
            this._isDisposed = true
        },
        isDisposed: function() {
            return !!this._isDisposed
        }
    }
}()).include(_events_mixin2.default);
module.exports.default = module.exports;
