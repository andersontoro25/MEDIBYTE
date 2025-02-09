/**
 * DevExtreme (ui/pivot_grid/ui.pivot_grid.utils.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _type = require("../../core/utils/type");
var _ajax = require("../../core/utils/ajax");
var _data = require("../../core/utils/data");
var _iterator = require("../../core/utils/iterator");
var _extend = require("../../core/utils/extend");
var _date = require("../../localization/date");
var _format_helper = require("../../format_helper");
var _data_source = require("../../data/data_source/data_source");
var _array_store = require("../../data/array_store");
var _array_store2 = _interopRequireDefault(_array_store);
var _deferred = require("../../core/utils/deferred");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}
var setFieldProperty = exports.setFieldProperty = function(field, property, value, isInitialization) {
    var initProperties = field._initProperties = field._initProperties || {},
        initValue = isInitialization ? value : field[property];
    if (!Object.prototype.hasOwnProperty.call(initProperties, property) || isInitialization) {
        initProperties[property] = initValue
    }
    field[property] = value
};
exports.sendRequest = function(options) {
    return (0, _ajax.sendRequest)(options)
};
var foreachTreeAsyncDate = new Date;

function createForeachTreeFunc(isAsync) {
    var foreachTreeFunc = function foreachTreeFunc(items, callback, parentAtFirst, members, index, isChildrenProcessing) {
        members = members || [];
        items = items || [];
        var item, i, deferred, childrenDeferred;
        index = index || 0;

        function createForeachTreeAsyncHandler(deferred, i, isChildrenProcessing) {
            (0, _deferred.when)(foreachTreeFunc(items, callback, parentAtFirst, members, i, isChildrenProcessing)).done(deferred.resolve)
        }
        for (i = index; i < items.length; i++) {
            if (isAsync && i > index && i % 1e4 === 0 && new Date - foreachTreeAsyncDate >= 300) {
                foreachTreeAsyncDate = new Date;
                deferred = new _deferred.Deferred;
                setTimeout(createForeachTreeAsyncHandler(deferred, i, false), 0);
                return deferred
            }
            item = items[i];
            if (!isChildrenProcessing) {
                members.unshift(item);
                if (parentAtFirst && false === callback(members, i)) {
                    return
                }
                if (item.children) {
                    childrenDeferred = foreachTreeFunc(item.children, callback, parentAtFirst, members);
                    if (isAsync && childrenDeferred) {
                        deferred = new _deferred.Deferred;
                        childrenDeferred.done(createForeachTreeAsyncHandler(deferred, i, true));
                        return deferred
                    }
                }
            }
            isChildrenProcessing = false;
            if (!parentAtFirst && false === callback(members, i)) {
                return
            }
            members.shift();
            if (items[i] !== item) {
                i--
            }
        }
    };
    return foreachTreeFunc
}
exports.foreachTree = createForeachTreeFunc(false);
exports.foreachTreeAsync = createForeachTreeFunc(true);
exports.findField = function(fields, id) {
    var i, field;
    if (fields && (0, _type.isDefined)(id)) {
        for (i = 0; i < fields.length; i++) {
            field = fields[i];
            if (field.name === id || field.caption === id || field.dataField === id || field.index === id) {
                return i
            }
        }
    }
    return -1
};
exports.formatValue = function(value, options) {
    var formatObject = {
        value: value,
        valueText: (0, _format_helper.format)(value, options.format) || ""
    };
    return options.customizeText ? options.customizeText.call(options, formatObject) : formatObject.valueText
};
exports.getCompareFunction = function(valueSelector) {
    return function(a, b) {
        var result = 0,
            valueA = valueSelector(a),
            valueB = valueSelector(b),
            aIsDefined = (0, _type.isDefined)(valueA),
            bIsDefined = (0, _type.isDefined)(valueB);
        if (aIsDefined && bIsDefined) {
            if (valueA > valueB) {
                result = 1
            } else {
                if (valueA < valueB) {
                    result = -1
                }
            }
        }
        if (aIsDefined && !bIsDefined) {
            result = 1
        }
        if (!aIsDefined && bIsDefined) {
            result = -1
        }
        return result
    }
};
exports.createPath = function(items) {
    var i, result = [];
    for (i = items.length - 1; i >= 0; i--) {
        result.push(items[i].key || items[i].value)
    }
    return result
};
exports.foreachDataLevel = function foreachDataLevel(data, callback, index, childrenField) {
    var item, i;
    index = index || 0;
    childrenField = childrenField || "children";
    if (data.length) {
        callback(data, index)
    }
    for (i = 0; i < data.length; i++) {
        item = data[i];
        if (item[childrenField] && item[childrenField].length) {
            foreachDataLevel(item[childrenField], callback, index + 1, childrenField)
        }
    }
};
exports.mergeArraysByMaxValue = function(values1, values2) {
    var i, result = [];
    for (i = 0; i < values1.length; i++) {
        result.push(Math.max(values1[i] || 0, values2[i] || 0))
    }
    return result
};
exports.getExpandedLevel = function(options, axisName) {
    var dimensions = options[axisName],
        expandLevel = 0,
        expandedPaths = ("columns" === axisName ? options.columnExpandedPaths : options.rowExpandedPaths) || [];
    if (options.headerName === axisName) {
        expandLevel = options.path.length
    } else {
        if (options.headerName && options.headerName !== axisName && options.oppositePath) {
            expandLevel = options.oppositePath.length
        } else {
            (0, _iterator.each)(expandedPaths, function(_, path) {
                expandLevel = Math.max(expandLevel, path.length)
            })
        }
    }
    while (dimensions[expandLevel + 1] && dimensions[expandLevel].expanded) {
        expandLevel++
    }
    return expandLevel
};

function createGroupFields(item) {
    return (0, _iterator.map)(["year", "quarter", "month"], function(value, index) {
        return (0, _extend.extend)({}, item, {
            groupInterval: value,
            groupIndex: index
        })
    })
}

function parseFields(dataSource, fieldsList, path, fieldsDataType) {
    var result = [];
    (0, _iterator.each)(fieldsList || [], function(field, value) {
        if (field && 0 === field.indexOf("__")) {
            return
        }
        var items, dataIndex = 1,
            currentPath = path.length ? path + "." + field : field,
            dataType = fieldsDataType[currentPath],
            getter = (0, _data.compileGetter)(currentPath);
        while (!(0, _type.isDefined)(value) && dataSource[dataIndex]) {
            value = getter(dataSource[dataIndex]);
            dataIndex++
        }
        if (!dataType && (0, _type.isDefined)(value)) {
            dataType = (0, _type.type)(value)
        }
        items = [{
            dataField: currentPath,
            dataType: dataType,
            groupName: "date" === dataType ? field : void 0,
            groupInterval: void 0,
            displayFolder: path
        }];
        if ("date" === dataType) {
            items = items.concat(createGroupFields(items[0]))
        } else {
            if ("object" === dataType) {
                items = parseFields(dataSource, value, currentPath, fieldsDataType)
            }
        }
        result.push.apply(result, items)
    });
    return result
}
exports.discoverObjectFields = function(items, fields) {
    var fieldsDataType = exports.getFieldsDataType(fields);
    return parseFields(items, items[0], "", fieldsDataType)
};
exports.getFieldsDataType = function(fields) {
    var result = {};
    (0, _iterator.each)(fields, function(_, field) {
        result[field.dataField] = result[field.dataField] || field.dataType
    });
    return result
};
var DATE_INTERVAL_FORMATS = {
    month: function(value) {
        return (0, _date.getMonthNames)()[value - 1]
    },
    quarter: function(value) {
        return (0, _date.format)(new Date(2e3, 3 * value - 1), "quarter")
    },
    dayOfWeek: function(value) {
        return (0, _date.getDayNames)()[value]
    }
};
exports.setDefaultFieldValueFormatting = function(field) {
    if ("date" === field.dataType) {
        if (!field.format) {
            setFieldProperty(field, "format", DATE_INTERVAL_FORMATS[field.groupInterval])
        }
    } else {
        if ("number" === field.dataType) {
            var groupInterval = (0, _type.isNumeric)(field.groupInterval) && field.groupInterval > 0 && field.groupInterval;
            if (groupInterval && !field.customizeText) {
                setFieldProperty(field, "customizeText", function(formatObject) {
                    var secondValue = formatObject.value + groupInterval,
                        secondValueText = (0, _format_helper.format)(secondValue, field.format);
                    return formatObject.valueText && secondValueText ? formatObject.valueText + " - " + secondValueText : ""
                })
            }
        }
    }
};
exports.getFiltersByPath = function(fields, path) {
    var result = [];
    path = path || [];
    for (var i = 0; i < path.length; i++) {
        result.push((0, _extend.extend)({}, fields[i], {
            groupIndex: null,
            groupName: null,
            filterType: "include",
            filterValues: [path[i]]
        }))
    }
    return result
};
exports.storeDrillDownMixin = {
    createDrillDownDataSource: function(descriptions, params) {
        function createCustomStoreMethod(methodName) {
            return function(options) {
                var d;
                if (arrayStore) {
                    d = arrayStore[methodName](options)
                } else {
                    d = new _deferred.Deferred;
                    (0, _deferred.when)(items).done(function(data) {
                        arrayStore = new _array_store2.default(data);
                        arrayStore[methodName](options).done(d.resolve).fail(d.reject)
                    }).fail(d.reject)
                }
                return d
            }
        }
        var arrayStore, items = this.getDrillDownItems(descriptions, params),
            dataSource = new _data_source.DataSource({
                load: createCustomStoreMethod("load"),
                totalCount: createCustomStoreMethod("totalCount"),
                key: this.key()
            });
        return dataSource
    }
};
exports.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
};
