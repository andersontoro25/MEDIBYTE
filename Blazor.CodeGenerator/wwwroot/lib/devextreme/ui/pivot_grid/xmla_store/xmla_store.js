/**
 * DevExtreme (ui/pivot_grid/xmla_store/xmla_store.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _renderer = require("../../../core/renderer");
var _renderer2 = _interopRequireDefault(_renderer);
var _window = require("../../../core/utils/window");
var _class = require("../../../core/class");
var _class2 = _interopRequireDefault(_class);
var _string = require("../../../core/utils/string");
var _errors = require("../../../data/errors");
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _type = require("../../../core/utils/type");
var _iterator = require("../../../core/utils/iterator");
var _array = require("../../../core/utils/array");
var _uiPivot_grid = require("../ui.pivot_grid.utils");
var _deferred = require("../../../core/utils/deferred");
var _language_codes = require("../../../localization/language_codes");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    }
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i]
        }
        return arr2
    } else {
        return Array.from(arr)
    }
}
var window = (0, _window.getWindow)();
exports.XmlaStore = _class2.default.inherit(function() {
    var discover = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><Discover xmlns="urn:schemas-microsoft-com:xml-analysis"><RequestType>{2}</RequestType><Restrictions><RestrictionList><CATALOG_NAME>{0}</CATALOG_NAME><CUBE_NAME>{1}</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>{0}</Catalog>{3}</PropertyList></Properties></Discover></Body></Envelope>',
        execute = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><Execute xmlns="urn:schemas-microsoft-com:xml-analysis"><Command><Statement>{0}</Statement></Command><Properties><PropertyList><Catalog>{1}</Catalog><ShowHiddenCubes>True</ShowHiddenCubes><SspropInitAppName>Microsoft SQL Server Management Studio</SspropInitAppName><Timeout>3600</Timeout>{2}</PropertyList></Properties></Execute></Body></Envelope>',
        mdx = "SELECT {2} FROM {0} {1} CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS",
        mdxFilterSelect = "(SELECT {0} FROM {1})",
        mdxSubset = "Subset({0}, {1}, {2})",
        mdxOrder = "Order({0}, {1}, {2})",
        mdxWith = "{0} {1} as {2}",
        mdxSlice = "WHERE ({0})",
        mdxNonEmpty = "NonEmpty({0}, {1})",
        mdxAxis = "{0} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME, MEMBER_VALUE ON {1}",
        mdxCrossJoin = "CrossJoin({0})",
        mdxSet = "{{0}}",
        MEASURE_DEMENSION_KEY = "DX_MEASURES",
        MD_DIMTYPE_MEASURE = "2";

    function execXMLA(requestOptions, data) {
        var deferred = new _deferred.Deferred,
            beforeSend = requestOptions.beforeSend,
            ajaxSettings = {
                url: requestOptions.url,
                dataType: "text",
                data: data,
                headers: {
                    "Content-Type": "text/xml"
                },
                xhrFields: {},
                method: "POST"
            };
        if ((0, _type.isFunction)(beforeSend)) {
            beforeSend(ajaxSettings)
        }(0, _uiPivot_grid.sendRequest)(ajaxSettings).fail(function() {
            deferred.reject(arguments)
        }).done(function(text) {
            var parser = new window.DOMParser;
            var xml;
            try {
                try {
                    xml = parser.parseFromString(text, "text/xml")
                } catch (e) {
                    xml = void 0
                }
                if (!xml || xml.getElementsByTagName("parsererror").length || 0 === xml.childNodes.length) {
                    throw new _errors.errors.Error("E4023", text)
                }
            } catch (e) {
                deferred.reject({
                    statusText: e.message,
                    stack: e.stack,
                    responseText: text
                })
            }
            deferred.resolve(xml)
        });
        return deferred
    }

    function getLocaleIdProperty() {
        var languageId = (0, _language_codes.getLanguageId)();
        if (void 0 !== languageId) {
            return (0, _string.format)("<LocaleIdentifier>{0}</LocaleIdentifier>", languageId)
        }
        return ""
    }

    function mdxDescendants(level, levelMember, nextLevel) {
        var memberExpression = levelMember ? levelMember : level;
        return "Descendants({" + memberExpression + "}, " + nextLevel + ", SELF_AND_BEFORE)"
    }

    function getAllMember(dimension) {
        return (dimension.hierarchyName || dimension.dataField) + ".[All]"
    }

    function getAllMembers(field) {
        var result = field.dataField + ".allMembers",
            searchValue = field.searchValue;
        if (searchValue) {
            searchValue = searchValue.replace(/'/g, "''");
            result = "Filter(" + result + ", instr(" + field.dataField + ".currentmember.member_caption,'" + searchValue + "') > 0)"
        }
        return result
    }

    function crossJoinElements(elements) {
        var elementsString = elements.join(",");
        return elements.length > 1 ? (0, _string.format)(mdxCrossJoin, elementsString) : elementsString
    }

    function union(elements) {
        var elementsString = elements.join(",");
        return elements.length > 1 ? "Union(" + elementsString + ")" : elementsString
    }

    function generateCrossJoin(path, expandLevel, expandAllCount, expandIndex, slicePath, options, axisName, take) {
        var dataField, allMember, hierarchyName, arg, prevDimension, prevHierarchyName, isLastDimensionInGroup, isFirstDimensionInGroup, expandAllIndex, field, member, i, crossJoinArgs = [],
            dimensions = options[axisName],
            fields = [];
        for (i = expandIndex; i <= expandLevel; i++) {
            field = dimensions[i];
            dataField = field.dataField;
            prevHierarchyName = dimensions[i - 1] && dimensions[i - 1].hierarchyName;
            hierarchyName = field.hierarchyName;
            isLastDimensionInGroup = !hierarchyName || !dimensions[i + 1] || dimensions[i + 1].hierarchyName !== hierarchyName;
            expandAllIndex = path.length + expandAllCount + expandIndex;
            arg = null;
            fields.push(field);
            if (i < path.length) {
                if (isLastDimensionInGroup) {
                    arg = "(" + dataField + "." + preparePathValue(path[i], dataField) + ")"
                }
            } else {
                if (i <= expandAllIndex) {
                    if (0 === i && 0 === expandAllCount) {
                        allMember = getAllMember(dimensions[expandIndex]);
                        if (!hierarchyName) {
                            arg = getAllMembers(dimensions[expandIndex])
                        } else {
                            arg = allMember + "," + dimensions[expandIndex].dataField
                        }
                    } else {
                        if (hierarchyName) {
                            member = preparePathValue(slicePath[slicePath.length - 1]);
                            if (isLastDimensionInGroup || i === expandAllIndex) {
                                if (prevHierarchyName === hierarchyName) {
                                    if (slicePath.length) {
                                        prevDimension = dimensions[slicePath.length - 1]
                                    }
                                    if (!prevDimension || prevDimension.hierarchyName !== hierarchyName) {
                                        prevDimension = dimensions[i - 1];
                                        member = ""
                                    }
                                    arg = mdxDescendants(prevDimension.dataField, member, dataField)
                                } else {
                                    arg = getAllMembers(field)
                                }
                            }
                        } else {
                            arg = getAllMembers(field)
                        }
                    }
                } else {
                    isFirstDimensionInGroup = !hierarchyName || prevHierarchyName !== hierarchyName;
                    if (isFirstDimensionInGroup) {
                        arg = "(" + getAllMember(field) + ")"
                    }
                }
            }
            if (arg) {
                arg = (0, _string.format)(mdxSet, arg);
                if (take) {
                    var sortBy = (field.hierarchyName || field.dataField) + ("displayText" === field.sortBy ? ".MEMBER_CAPTION" : ".MEMBER_VALUE");
                    arg = (0, _string.format)(mdxOrder, arg, sortBy, "desc" === field.sortOrder ? "DESC" : "ASC")
                }
                crossJoinArgs.push(arg)
            }
        }
        return crossJoinElements(crossJoinArgs)
    }

    function fillCrossJoins(crossJoins, path, expandLevel, expandIndex, slicePath, options, axisName, cellsString, take, totalsOnly) {
        var dimensionIndex, expandAllCount = -1,
            dimensions = options[axisName];
        do {
            expandAllCount++;
            dimensionIndex = path.length + expandAllCount + expandIndex;
            var crossJoin = generateCrossJoin(path, expandLevel, expandAllCount, expandIndex, slicePath, options, axisName, take);
            if (!take && !totalsOnly) {
                crossJoin = (0, _string.format)(mdxNonEmpty, crossJoin, cellsString)
            }
            crossJoins.push(crossJoin)
        } while (dimensions[dimensionIndex] && dimensions[dimensionIndex + 1] && dimensions[dimensionIndex].expanded)
    }

    function declare(expression, withArray, name, type) {
        name = name || "[DX_Set_" + withArray.length + "]";
        type = type || "set";
        withArray.push((0, _string.format)(mdxWith, type, name, expression));
        return name
    }

    function generateAxisMdx(options, axisName, cells, withArray, parseOptions) {
        var dimensions = options[axisName],
            crossJoins = [],
            path = [],
            expandedPaths = [],
            expandIndex = 0,
            expandLevel = 0,
            result = [],
            cellsString = (0, _string.format)(mdxSet, cells.join(","));
        if (dimensions && dimensions.length) {
            if (options.headerName === axisName) {
                path = options.path;
                expandIndex = path.length
            } else {
                if (options.headerName && options.oppositePath) {
                    path = options.oppositePath;
                    expandIndex = path.length
                } else {
                    expandedPaths = ("columns" === axisName ? options.columnExpandedPaths : options.rowExpandedPaths) || expandedPaths
                }
            }
            expandLevel = (0, _uiPivot_grid.getExpandedLevel)(options, axisName);
            fillCrossJoins(crossJoins, [], expandLevel, expandIndex, path, options, axisName, cellsString, "rows" === axisName ? options.rowTake : options.columnTake, options.totalsOnly);
            (0, _iterator.each)(expandedPaths, function(_, expandedPath) {
                fillCrossJoins(crossJoins, expandedPath, expandLevel, expandIndex, expandedPath, options, axisName, cellsString)
            });
            for (var i = expandLevel; i >= path.length; i--) {
                if (dimensions[i].hierarchyName) {
                    parseOptions.visibleLevels[dimensions[i].hierarchyName] = parseOptions.visibleLevels[dimensions[i].hierarchyName] || [];
                    parseOptions.visibleLevels[dimensions[i].hierarchyName].push(dimensions[i].dataField)
                }
            }
        }
        if (crossJoins.length) {
            var expression = union(crossJoins);
            if ("rows" === axisName && options.rowTake) {
                expression = (0, _string.format)(mdxSubset, expression, options.rowSkip > 0 ? options.rowSkip + 1 : 0, options.rowSkip > 0 ? options.rowTake : options.rowTake + 1)
            }
            if ("columns" === axisName && options.columnTake) {
                expression = (0, _string.format)(mdxSubset, expression, options.columnSkip > 0 ? options.columnSkip + 1 : 0, options.columnSkip > 0 ? options.columnTake : options.columnTake + 1)
            }
            var axisSet = "[DX_" + axisName + "]";
            result.push(declare(expression, withArray, axisSet));
            if (options.totalsOnly) {
                result.push(declare("COUNT(" + axisSet + ")", withArray, "[DX_" + axisName + "_count]", "member"))
            }
        }
        if ("columns" === axisName && cells.length && !options.skipValues) {
            result.push(cellsString)
        }
        return (0, _string.format)(mdxAxis, crossJoinElements(result), axisName)
    }

    function generateAxisFieldsFilter(fields) {
        var filterMembers = [];
        (0, _iterator.each)(fields, function(_, field) {
            var filterStringExpression, dataField = field.dataField,
                filterExpression = [],
                filterValues = field.filterValues || [];
            if (field.hierarchyName && (0, _type.isNumeric)(field.groupIndex)) {
                return
            }(0, _iterator.each)(filterValues, function(_, filterValue) {
                var filterMdx = dataField + "." + preparePathValue(Array.isArray(filterValue) ? filterValue[filterValue.length - 1] : filterValue, dataField);
                if ("exclude" === field.filterType) {
                    filterExpression.push(filterMdx + ".parent");
                    filterMdx = "Descendants(" + filterMdx + ")"
                }
                filterExpression.push(filterMdx)
            });
            if (filterValues.length) {
                filterStringExpression = (0, _string.format)(mdxSet, filterExpression.join(","));
                if ("exclude" === field.filterType) {
                    filterStringExpression = "Except(" + getAllMembers(field) + "," + filterStringExpression + ")"
                }
                filterMembers.push(filterStringExpression)
            }
        });
        return filterMembers.length ? crossJoinElements(filterMembers) : ""
    }

    function generateFrom(columnsFilter, rowsFilter, filter, cubeName) {
        var from = "[" + cubeName + "]";
        (0, _iterator.each)([columnsFilter, rowsFilter, filter], function(_, filter) {
            if (filter) {
                from = (0, _string.format)(mdxFilterSelect, filter + "on 0", from)
            }
        });
        return from
    }

    function generateMdxCore(axisStrings, withArray, columns, rows, filters, slice, cubeName) {
        var options = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : {};
        var mdxString = "",
            withString = (withArray.length ? "with " + withArray.join(" ") : "") + " ";
        if (axisStrings.length) {
            var select = void 0;
            if (options.totalsOnly) {
                var countMembers = [];
                if (rows.length) {
                    countMembers.push("[DX_rows_count]")
                }
                if (columns.length) {
                    countMembers.push("[DX_columns_count]")
                }
                select = "{" + countMembers.join(",") + "} on columns"
            } else {
                select = axisStrings.join(",")
            }
            mdxString = withString + (0, _string.format)(mdx, generateFrom(generateAxisFieldsFilter(columns), generateAxisFieldsFilter(rows), generateAxisFieldsFilter(filters || []), cubeName), slice.length ? (0, _string.format)(mdxSlice, slice.join(",")) : "", select)
        }
        return mdxString
    }

    function prepareDataFields(withArray, valueFields) {
        return (0, _iterator.map)(valueFields, function(cell) {
            if ((0, _type.isString)(cell.expression)) {
                declare(cell.expression, withArray, cell.dataField, "member")
            }
            return cell.dataField
        })
    }

    function addSlices(slices, options, headerName, path) {
        (0, _iterator.each)(path, function(index, value) {
            var dimension = options[headerName][index];
            if (!dimension.hierarchyName || dimension.hierarchyName !== options[headerName][index + 1].hierarchyName) {
                slices.push(dimension.dataField + "." + preparePathValue(value, dimension.dataField))
            }
        })
    }

    function generateMDX(options, cubeName, parseOptions) {
        var columns = options.columns || [],
            rows = options.rows || [],
            values = options.values && options.values.length ? options.values : [{
                dataField: "[Measures]"
            }],
            slice = [],
            withArray = [],
            axisStrings = [],
            dataFields = prepareDataFields(withArray, values);
        parseOptions.measureCount = options.skipValues ? 1 : values.length;
        parseOptions.visibleLevels = {};
        if (options.headerName && options.path) {
            addSlices(slice, options, options.headerName, options.path)
        }
        if (options.headerName && options.oppositePath) {
            addSlices(slice, options, "rows" === options.headerName ? "columns" : "rows", options.oppositePath)
        }
        if (columns.length || dataFields.length) {
            axisStrings.push(generateAxisMdx(options, "columns", dataFields, withArray, parseOptions))
        }
        if (rows.length) {
            axisStrings.push(generateAxisMdx(options, "rows", dataFields, withArray, parseOptions))
        }
        return generateMdxCore(axisStrings, withArray, columns, rows, options.filters, slice, cubeName, options)
    }

    function createDrillDownAxisSlice(slice, fields, path) {
        (0, _iterator.each)(path, function(index, value) {
            var field = fields[index];
            if (field.hierarchyName && (fields[index + 1] || {}).hierarchyName === field.hierarchyName) {
                return
            }
            slice.push(field.dataField + "." + preparePathValue(value, field.dataField))
        })
    }

    function generateDrillDownMDX(options, cubeName, params) {
        var coreMDX, columns = options.columns || [],
            rows = options.rows || [],
            values = options.values && options.values.length ? options.values : [{
                dataField: "[Measures]"
            }],
            slice = [],
            withArray = [],
            axisStrings = [],
            dataFields = prepareDataFields(withArray, values),
            maxRowCount = params.maxRowCount,
            customColumns = params.customColumns || [],
            customColumnsString = customColumns.length > 0 ? " return " + customColumns.join(",") : "";
        createDrillDownAxisSlice(slice, columns, params.columnPath || []);
        createDrillDownAxisSlice(slice, rows, params.rowPath || []);
        if (columns.length || columns.length || dataFields.length) {
            axisStrings.push([(dataFields[params.dataIndex] || dataFields[0]) + " on 0"])
        }
        coreMDX = generateMdxCore(axisStrings, withArray, columns, rows, options.filters, slice, cubeName);
        return coreMDX ? "drillthrough" + (maxRowCount > 0 ? " maxrows " + maxRowCount : "") + coreMDX + customColumnsString : coreMDX
    }

    function getNumber(str) {
        return parseInt(str, 10)
    }

    function parseValue(valueText) {
        return (0, _type.isNumeric)(valueText) ? parseFloat(valueText) : valueText
    }

    function getFirstChild(node, tagName) {
        return (node.getElementsByTagName(tagName) || [])[0]
    }

    function getFirstChildText(node, childTagName) {
        return getNodeText(getFirstChild(node, childTagName))
    }

    function parseAxes(xml, skipValues) {
        var axes = [];
        (0, _iterator.each)(xml.getElementsByTagName("Axis"), function(_, axisElement) {
            var name = axisElement.getAttribute("name"),
                axis = [],
                index = 0;
            if (0 === name.indexOf("Axis") && (0, _type.isNumeric)(getNumber(name.substr(4)))) {
                axes.push(axis);
                (0, _iterator.each)(axisElement.getElementsByTagName("Tuple"), function(_, tupleElement) {
                    var tuple, level, i, tupleMembers = tupleElement.childNodes,
                        levelSum = 0,
                        members = [],
                        membersCount = skipValues ? tupleMembers.length : tupleMembers.length - 1,
                        isAxisWithMeasure = 1 === axes.length;
                    if (isAxisWithMeasure) {
                        membersCount--
                    }
                    axis.push(members);
                    for (i = membersCount; i >= 0; i--) {
                        tuple = tupleMembers[i];
                        level = getNumber(getFirstChildText(tuple, "LNum"));
                        members[i] = {
                            caption: getFirstChildText(tuple, "Caption"),
                            value: parseValue(getFirstChildText(tuple, "MEMBER_VALUE")),
                            level: level,
                            index: index++,
                            hasValue: !levelSum && (!!level || 0 === i),
                            name: getFirstChildText(tuple, "UName"),
                            hierarchyName: tupleMembers[i].getAttribute("Hierarchy"),
                            parentName: getFirstChildText(tuple, "PARENT_UNIQUE_NAME"),
                            levelName: getFirstChildText(tuple, "LName")
                        };
                        levelSum += level
                    }
                })
            }
        });
        while (axes.length < 2) {
            axes.push([
                [{
                    level: 0
                }]
            ])
        }
        return axes
    }

    function getNodeText(node) {
        return node && node && (node.textContent || node.text || node.innerHTML) || ""
    }

    function parseCells(xml, axes, measureCount) {
        var measureIndex, row, cells = [],
            cell = [],
            index = 0,
            cellsOriginal = [],
            cellElements = xml.getElementsByTagName("Cell"),
            errorDictionary = {};
        for (var i = 0; i < cellElements.length; i++) {
            var xmlCell = cellElements[i],
                valueElement = xmlCell.getElementsByTagName("Value")[0],
                errorElements = valueElement && valueElement.getElementsByTagName("Error") || [],
                text = 0 === errorElements.length ? getNodeText(valueElement) : "#N/A",
                value = parseFloat(text),
                isNumeric = text - value + 1 > 0,
                cellOrdinal = getNumber(xmlCell.getAttribute("CellOrdinal"));
            if (errorElements.length) {
                errorDictionary[getNodeText(errorElements[0].getElementsByTagName("ErrorCode")[0])] = getNodeText(errorElements[0].getElementsByTagName("Description")[0])
            }
            cellsOriginal[cellOrdinal] = {
                value: isNumeric ? value : text || null
            }
        }(0, _iterator.each)(axes[1], function() {
            row = [];
            cells.push(row);
            (0, _iterator.each)(axes[0], function() {
                measureIndex = index % measureCount;
                if (0 === measureIndex) {
                    cell = [];
                    row.push(cell)
                }
                cell.push(cellsOriginal[index] ? cellsOriginal[index].value : null);
                index++
            })
        });
        Object.keys(errorDictionary).forEach(function(key) {
            _errors.errors.log("W4002", errorDictionary[key])
        });
        return cells
    }

    function preparePathValue(pathValue, dataField) {
        if (pathValue) {
            pathValue = (0, _type.isString)(pathValue) && pathValue.indexOf("&") !== -1 ? pathValue : "[" + pathValue + "]";
            if (dataField && 0 === pathValue.indexOf(dataField + ".")) {
                pathValue = pathValue.slice(dataField.length + 1, pathValue.length)
            }
        }
        return pathValue
    }

    function getItem(hash, name, member, index) {
        var item = hash[name];
        if (!item) {
            item = {};
            hash[name] = item
        }
        if (!(0, _type.isDefined)(item.value) && member) {
            item.text = member.caption;
            item.value = member.value;
            item.key = name ? name : "";
            item.levelName = member.levelName;
            item.hierarchyName = member.hierarchyName;
            item.parentName = member.parentName;
            item.index = index;
            item.level = member.level
        }
        return item
    }

    function getVisibleChildren(item, visibleLevels) {
        var result = [],
            children = item.children && (item.children.length ? item.children : Object.keys(item.children.grandTotalHash || {}).reduce(function(result, name) {
                return result.concat(item.children.grandTotalHash[name].children)
            }, [])),
            firstChild = children && children[0];
        if (firstChild && (visibleLevels[firstChild.hierarchyName] && (0, _array.inArray)(firstChild.levelName, visibleLevels[firstChild.hierarchyName]) !== -1 || !visibleLevels[firstChild.hierarchyName] || 0 === firstChild.level)) {
            var newChildren = children.filter(function(child) {
                return child.hierarchyName === firstChild.hierarchyName
            });
            newChildren.grandTotalHash = children.grandTotalHash;
            return newChildren
        } else {
            if (firstChild) {
                for (var i = 0; i < children.length; i++) {
                    if (children[i].hierarchyName === firstChild.hierarchyName) {
                        result.push.apply(result, getVisibleChildren(children[i], visibleLevels))
                    }
                }
            }
        }
        return result
    }

    function processMember(dataIndex, member, parentItem) {
        var currentItem, children = parentItem.children = parentItem.children || [],
            hash = children.hash = children.hash || {},
            grandTotalHash = children.grandTotalHash = children.grandTotalHash || {};
        if (member.parentName) {
            parentItem = getItem(hash, member.parentName);
            children = parentItem.children = parentItem.children || []
        }
        currentItem = getItem(hash, member.name, member, dataIndex);
        if (member.hasValue && !currentItem.added) {
            currentItem.index = dataIndex;
            currentItem.added = true;
            children.push(currentItem)
        }
        if ((!parentItem.value || !parentItem.parentName) && member.parentName) {
            grandTotalHash[member.parentName] = parentItem
        } else {
            if (grandTotalHash[parentItem.name]) {
                delete grandTotalHash[member.parentName]
            }
        }
        return currentItem
    }

    function getGrandTotalIndex(parentItem, visibleLevels) {
        var grandTotalIndex;
        if (1 === parentItem.children.length && "" === parentItem.children[0].parentName) {
            grandTotalIndex = parentItem.children[0].index;
            var grandTotalHash = parentItem.children.grandTotalHash;
            parentItem.children = parentItem.children[0].children || [];
            parentItem.children.grandTotalHash = grandTotalHash;
            parentItem.children = getVisibleChildren(parentItem, visibleLevels)
        } else {
            if (0 === parentItem.children.length) {
                grandTotalIndex = 0
            }
        }
        return grandTotalIndex
    }

    function fillDataSourceAxes(dataSourceAxis, axisTuples, measureCount, visibleLevels) {
        var grandTotalIndex, result = [];
        (0, _iterator.each)(axisTuples, function(tupleIndex, members) {
            var parentItem = {
                    children: result
                },
                dataIndex = (0, _type.isDefined)(measureCount) ? Math.floor(tupleIndex / measureCount) : tupleIndex;
            (0, _iterator.each)(members, function(_, member) {
                parentItem = processMember(dataIndex, member, parentItem)
            })
        });
        var parentItem = {
            children: result
        };
        parentItem.children = getVisibleChildren(parentItem, visibleLevels);
        grandTotalIndex = getGrandTotalIndex(parentItem, visibleLevels);
        (0, _uiPivot_grid.foreachTree)(parentItem.children, function(items) {
            var item = items[0],
                children = getVisibleChildren(item, visibleLevels);
            if (children.length) {
                item.children = children
            } else {
                delete item.children
            }
            delete item.levelName;
            delete item.hierarchyName;
            delete item.added;
            delete item.parentName;
            delete item.level
        }, true);
        (0, _iterator.each)(parentItem.children || [], function(_, e) {
            dataSourceAxis.push(e)
        });
        return grandTotalIndex
    }

    function checkError(xml) {
        var description, error, faultElementNS = xml.getElementsByTagName("soap:Fault"),
            faultElement = xml.getElementsByTagName("Fault"),
            errorElement = (0, _renderer2.default)([].slice.call(faultElement.length ? faultElement : faultElementNS)).find("Error");
        if (errorElement.length) {
            description = errorElement.attr("Description");
            error = new _errors.errors.Error("E4000", description);
            _errors.errors.log("E4000", description);
            return error
        }
        return null
    }

    function parseResult(xml, parseOptions) {
        var axes, dataSource = {
                columns: [],
                rows: []
            },
            measureCount = parseOptions.measureCount;
        axes = parseAxes(xml, parseOptions.skipValues);
        dataSource.grandTotalColumnIndex = fillDataSourceAxes(dataSource.columns, axes[0], measureCount, parseOptions.visibleLevels);
        dataSource.grandTotalRowIndex = fillDataSourceAxes(dataSource.rows, axes[1], void 0, parseOptions.visibleLevels);
        dataSource.values = parseCells(xml, axes, measureCount);
        return dataSource
    }

    function parseDiscoverRowSet(xml, schema, dimensions, translatedDisplayFolders) {
        var result = [],
            isMeasure = "MEASURE" === schema,
            displayFolderField = isMeasure ? "MEASUREGROUP_NAME" : schema + "_DISPLAY_FOLDER";
        (0, _iterator.each)(xml.getElementsByTagName("row"), function(_, row) {
            var hierarchyName = "LEVEL" === schema ? getFirstChildText(row, "HIERARCHY_UNIQUE_NAME") : void 0,
                levelNumber = getFirstChildText(row, "LEVEL_NUMBER"),
                displayFolder = getFirstChildText(row, displayFolderField);
            if (isMeasure) {
                displayFolder = translatedDisplayFolders[displayFolder] || displayFolder
            }
            if (("0" !== levelNumber || "true" !== getFirstChildText(row, schema + "_IS_VISIBLE")) && getFirstChildText(row, "DIMENSION_TYPE") !== MD_DIMTYPE_MEASURE) {
                var dimension = isMeasure ? MEASURE_DEMENSION_KEY : getFirstChildText(row, "DIMENSION_UNIQUE_NAME"),
                    dataField = getFirstChildText(row, schema + "_UNIQUE_NAME");
                result.push({
                    dimension: dimensions.names[dimension] || dimension,
                    groupIndex: levelNumber ? getNumber(levelNumber) - 1 : void 0,
                    dataField: dataField,
                    caption: getFirstChildText(row, schema + "_CAPTION"),
                    hierarchyName: hierarchyName,
                    groupName: hierarchyName,
                    displayFolder: displayFolder,
                    isMeasure: isMeasure,
                    isDefault: !!dimensions.defaultHierarchies[dataField]
                })
            }
        });
        return result
    }

    function parseMeasureGroupDiscoverRowSet(xml) {
        var measureGroups = {};
        (0, _iterator.each)(xml.getElementsByTagName("row"), function(_, row) {
            measureGroups[getFirstChildText(row, "MEASUREGROUP_NAME")] = getFirstChildText(row, "MEASUREGROUP_CAPTION")
        });
        return measureGroups
    }

    function parseDimensionsDiscoverRowSet(xml) {
        var result = {
            names: {},
            defaultHierarchies: {}
        };
        (0, _iterator.each)((0, _renderer2.default)(xml).find("row"), function() {
            var $row = (0, _renderer2.default)(this),
                type = $row.children("DIMENSION_TYPE").text(),
                dimensionName = type === MD_DIMTYPE_MEASURE ? MEASURE_DEMENSION_KEY : $row.children("DIMENSION_UNIQUE_NAME").text();
            result.names[dimensionName] = $row.children("DIMENSION_CAPTION").text();
            result.defaultHierarchies[$row.children("DEFAULT_HIERARCHY").text()] = true
        });
        return result
    }

    function parseStringWithUnicodeSymbols(str) {
        str = str.replace(/_x(....)_/g, function(whole, group1) {
            return String.fromCharCode(parseInt(group1, 16))
        });
        var stringArray = str.match(/\[.+?\]/gi);
        if (stringArray && stringArray.length) {
            str = stringArray[stringArray.length - 1]
        }
        return str.replace(/\[/gi, "").replace(/\]/gi, "").replace(/\$/gi, "").replace(/\./gi, " ")
    }

    function parseDrillDownRowSet(xml) {
        var rows = xml.getElementsByTagName("row"),
            result = [],
            columnNames = {};
        for (var i = 0; i < rows.length; i++) {
            var children = rows[i].childNodes,
                item = {};
            for (var j = 0; j < children.length; j++) {
                var tagName = children[j].tagName,
                    name = columnNames[tagName] = columnNames[tagName] || parseStringWithUnicodeSymbols(tagName);
                item[name] = getNodeText(children[j])
            }
            result.push(item)
        }
        return result
    }

    function sendQuery(storeOptions, mdxString) {
        mdxString = (0, _renderer2.default)("<div>").text(mdxString).html();
        return execXMLA(storeOptions, (0, _string.format)(execute, mdxString, storeOptions.catalog, getLocaleIdProperty()))
    }

    function processTotalCount(data, options, totalCountXml) {
        var axes = [];
        var columnOptions = options.columns || [];
        var rowOptions = options.rows || [];
        if (columnOptions.length) {
            axes.push({})
        }
        if (rowOptions.length) {
            axes.push({})
        }
        var cells = parseCells(totalCountXml, [
            [{}],
            [{}, {}]
        ], 1);
        if (!columnOptions.length && rowOptions.length) {
            data.rowCount = Math.max(cells[0][0][0] - 1, 0)
        }
        if (!rowOptions.length && columnOptions.length) {
            data.columnCount = Math.max(cells[0][0][0] - 1, 0)
        }
        if (rowOptions.length && columnOptions.length) {
            data.rowCount = Math.max(cells[0][0][0] - 1, 0);
            data.columnCount = Math.max(cells[1][0][0] - 1, 0)
        }
        if (void 0 !== data.rowCount && options.rowTake) {
            data.rows = [].concat(_toConsumableArray(Array(options.rowSkip))).concat(data.rows);
            data.rows.length = data.rowCount;
            for (var i = 0; i < data.rows.length; i++) {
                data.rows[i] = data.rows[i] || {}
            }
        }
        if (void 0 !== data.columnCount && options.columnTake) {
            data.columns = [].concat(_toConsumableArray(Array(options.columnSkip))).concat(data.columns);
            data.columns.length = data.columnCount;
            for (var _i = 0; _i < data.columns.length; _i++) {
                data.columns[_i] = data.columns[_i] || {}
            }
        }
    }
    return {
        ctor: function(options) {
            this._options = options
        },
        getFields: function() {
            var options = this._options,
                catalog = options.catalog,
                cube = options.cube,
                localeIdProperty = getLocaleIdProperty(),
                dimensionsRequest = execXMLA(options, (0, _string.format)(discover, catalog, cube, "MDSCHEMA_DIMENSIONS", localeIdProperty)),
                measuresRequest = execXMLA(options, (0, _string.format)(discover, catalog, cube, "MDSCHEMA_MEASURES", localeIdProperty)),
                hierarchiesRequest = execXMLA(options, (0, _string.format)(discover, catalog, cube, "MDSCHEMA_HIERARCHIES", localeIdProperty)),
                levelsRequest = execXMLA(options, (0, _string.format)(discover, catalog, cube, "MDSCHEMA_LEVELS", localeIdProperty)),
                result = new _deferred.Deferred;
            (0, _deferred.when)(dimensionsRequest, measuresRequest, hierarchiesRequest, levelsRequest).then(function(dimensionsResponse, measuresResponse, hierarchiesResponse, levelsResponse) {
                execXMLA(options, (0, _string.format)(discover, catalog, cube, "MDSCHEMA_MEASUREGROUPS", localeIdProperty)).done(function(measureGroupsResponse) {
                    var dimensions = parseDimensionsDiscoverRowSet(dimensionsResponse),
                        hierarchies = parseDiscoverRowSet(hierarchiesResponse, "HIERARCHY", dimensions),
                        levels = parseDiscoverRowSet(levelsResponse, "LEVEL", dimensions),
                        measureGroups = parseMeasureGroupDiscoverRowSet(measureGroupsResponse),
                        fields = parseDiscoverRowSet(measuresResponse, "MEASURE", dimensions, measureGroups).concat(hierarchies),
                        levelsByHierarchy = {};
                    (0, _iterator.each)(levels, function(_, level) {
                        levelsByHierarchy[level.hierarchyName] = levelsByHierarchy[level.hierarchyName] || [];
                        levelsByHierarchy[level.hierarchyName].push(level)
                    });
                    (0, _iterator.each)(hierarchies, function(_, hierarchy) {
                        if (levelsByHierarchy[hierarchy.dataField] && levelsByHierarchy[hierarchy.dataField].length > 1) {
                            hierarchy.groupName = hierarchy.hierarchyName = hierarchy.dataField;
                            fields.push.apply(fields, levelsByHierarchy[hierarchy.hierarchyName])
                        }
                    });
                    result.resolve(fields)
                }).fail(result.reject)
            }).fail(result.reject);
            return result
        },
        load: function load(options) {
            var result = new _deferred.Deferred,
                storeOptions = this._options,
                parseOptions = {
                    skipValues: options.skipValues
                },
                mdxString = generateMDX(options, storeOptions.cube, parseOptions);
            var rowCountMdx = void 0;
            if (options.rowSkip || options.rowTake || options.columnTake || options.columnSkip) {
                rowCountMdx = generateMDX((0, _extend.extend)({}, options, {
                    totalsOnly: true,
                    rowSkip: null,
                    rowTake: null,
                    columnSkip: null,
                    columnTake: null
                }), storeOptions.cube, {})
            }
            var load = function() {
                if (mdxString) {
                    (0, _deferred.when)(sendQuery(storeOptions, mdxString), rowCountMdx && sendQuery(storeOptions, rowCountMdx)).done(function(executeXml, rowCountXml) {
                        var error = checkError(executeXml) || rowCountXml && checkError(rowCountXml);
                        if (!error) {
                            var response = parseResult(executeXml, parseOptions);
                            if (rowCountXml) {
                                processTotalCount(response, options, rowCountXml)
                            }
                            result.resolve(response)
                        } else {
                            result.reject(error)
                        }
                    }).fail(result.reject)
                } else {
                    result.resolve({
                        columns: [],
                        rows: [],
                        values: [],
                        grandTotalColumnIndex: 0,
                        grandTotalRowIndex: 0
                    })
                }
            };
            if (options.delay) {
                setTimeout(load, options.delay)
            } else {
                load()
            }
            return result
        },
        supportPaging: function() {
            return true
        },
        getDrillDownItems: function(options, params) {
            var result = new _deferred.Deferred,
                storeOptions = this._options,
                mdxString = generateDrillDownMDX(options, storeOptions.cube, params);
            if (mdxString) {
                (0, _deferred.when)(sendQuery(storeOptions, mdxString)).done(function(executeXml) {
                    var error = checkError(executeXml);
                    if (!error) {
                        result.resolve(parseDrillDownRowSet(executeXml))
                    } else {
                        result.reject(error)
                    }
                }).fail(result.reject)
            } else {
                result.resolve([])
            }
            return result
        },
        key: _common.noop,
        filter: _common.noop
    }
}()).include(_uiPivot_grid.storeDrillDownMixin);
