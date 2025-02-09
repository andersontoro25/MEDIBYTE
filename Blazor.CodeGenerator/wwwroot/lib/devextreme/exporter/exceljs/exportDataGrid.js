/**
 * DevExtreme (exporter/exceljs/exportDataGrid.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MAX_EXCEL_COLUMN_WIDTH = exports.exportDataGrid = void 0;
var _type = require("../../core/utils/type");
var MAX_DIGIT_WIDTH_IN_PIXELS = 7;
var MAX_EXCEL_COLUMN_WIDTH = 255;

function exportDataGrid(options) {
    if (!(0, _type.isDefined)(options)) {
        return
    }
    var customizeCell = options.customizeCell,
        component = options.component,
        worksheet = options.worksheet,
        _options$topLeftCell = options.topLeftCell,
        topLeftCell = void 0 === _options$topLeftCell ? {
            row: 1,
            column: 1
        } : _options$topLeftCell,
        excelFilterEnabled = options.excelFilterEnabled,
        _options$keepColumnWi = options.keepColumnWidths,
        keepColumnWidths = void 0 === _options$keepColumnWi ? true : _options$keepColumnWi,
        _options$selectedRows = options.selectedRowsOnly,
        selectedRowsOnly = void 0 === _options$selectedRows ? false : _options$selectedRows;
    worksheet.properties.outlineProperties = {
        summaryBelow: false,
        summaryRight: false
    };
    var result = {
        from: {
            row: topLeftCell.row,
            column: topLeftCell.column
        },
        to: {
            row: topLeftCell.row,
            column: topLeftCell.column
        }
    };
    var dataProvider = component.getDataProvider(selectedRowsOnly);
    return new Promise(function(resolve) {
        dataProvider.ready().done(function() {
            var columns = dataProvider.getColumns();
            var headerRowCount = dataProvider.getHeaderRowCount();
            var dataRowsCount = dataProvider.getRowsCount();
            if (keepColumnWidths) {
                _setColumnsWidth(worksheet, columns, result.from.column)
            }
            for (var rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                var row = worksheet.getRow(result.from.row + rowIndex);
                _exportRow(rowIndex, columns.length, row, result.from.column, dataProvider, customizeCell);
                if (rowIndex >= headerRowCount) {
                    row.outlineLevel = dataProvider.getGroupLevel(rowIndex)
                }
                if (rowIndex >= 1) {
                    result.to.row++
                }
            }
            result.to.column += columns.length > 0 ? columns.length - 1 : 0;
            if (true === excelFilterEnabled) {
                if (dataRowsCount > 0) {
                    worksheet.autoFilter = result
                }
                worksheet.views = [{
                    state: "frozen",
                    ySplit: result.from.row + dataProvider.getFrozenArea().y - 1
                }]
            }
            resolve(result)
        })
    })
}

function _exportRow(rowIndex, cellCount, row, startColumnIndex, dataProvider, customizeCell) {
    for (var cellIndex = 0; cellIndex < cellCount; cellIndex++) {
        var cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
        var gridCell = cellData.cellSourceData;
        var excelCell = row.getCell(startColumnIndex + cellIndex);
        excelCell.value = cellData.value;
        if ((0, _type.isDefined)(customizeCell)) {
            customizeCell({
                cell: excelCell,
                excelCell: excelCell,
                gridCell: gridCell
            })
        }
    }
}

function _setColumnsWidth(worksheet, columns, startColumnIndex) {
    if (!(0, _type.isDefined)(columns)) {
        return
    }
    for (var i = 0; i < columns.length; i++) {
        var columnWidth = columns[i].width;
        if ("number" === typeof columnWidth && isFinite(columnWidth)) {
            worksheet.getColumn(startColumnIndex + i).width = Math.min(MAX_EXCEL_COLUMN_WIDTH, Math.floor(columnWidth / MAX_DIGIT_WIDTH_IN_PIXELS * 100) / 100)
        }
    }
}
exports.exportDataGrid = exportDataGrid;
exports.MAX_EXCEL_COLUMN_WIDTH = MAX_EXCEL_COLUMN_WIDTH;
