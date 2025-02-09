/**
 * DevExtreme (viz/series/line_series.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var series = require("./scatter_series"),
    chartScatterSeries = series.chart,
    polarScatterSeries = series.polar,
    objectUtils = require("../../core/utils/object"),
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    vizUtils = require("../core/utils"),
    mathUtils = require("../../core/utils/math"),
    normalizeAngle = vizUtils.normalizeAngle,
    DISCRETE = "discrete",
    _map = vizUtils.map,
    _extend = extend,
    _each = each;
exports.chart = {};
exports.polar = {};

function clonePoint(point, newX, newY, newAngle) {
    var p = objectUtils.clone(point);
    p.x = newX;
    p.y = newY;
    p.angle = newAngle;
    return p
}

function getTangentPoint(point, prevPoint, centerPoint, tan, nextStepAngle) {
    var correctAngle = point.angle + nextStepAngle,
        cosSin = vizUtils.getCosAndSin(correctAngle),
        x = centerPoint.x + (point.radius + tan * nextStepAngle) * cosSin.cos,
        y = centerPoint.y - (point.radius + tan * nextStepAngle) * cosSin.sin;
    return clonePoint(prevPoint, x, y, correctAngle)
}

function obtainCubicBezierTCoef(p, p0, p1, p2, p3) {
    var d = p0 - p;
    var c = 3 * p1 - 3 * p0;
    var b = 3 * p2 - 6 * p1 + 3 * p0;
    var a = p3 - 3 * p2 + 3 * p1 - p0;
    return mathUtils.solveCubicEquation(a, b, c, d)
}
var lineMethods = {
    autoHidePointMarkersEnabled: function() {
        return true
    },
    _applyGroupSettings: function(style, settings, group) {
        var that = this;
        settings = _extend(settings, style);
        that._applyElementsClipRect(settings);
        group.attr(settings)
    },
    _setGroupsSettings: function(animationEnabled) {
        var that = this,
            style = that._styles.normal;
        that._applyGroupSettings(style.elements, {
            "class": "dxc-elements"
        }, that._elementsGroup);
        that._bordersGroup && that._applyGroupSettings(style.border, {
            "class": "dxc-borders"
        }, that._bordersGroup);
        chartScatterSeries._setGroupsSettings.call(that, animationEnabled);
        animationEnabled && that._markersGroup && that._markersGroup.attr({
            opacity: .001
        })
    },
    _createGroups: function() {
        var that = this;
        that._createGroup("_elementsGroup", that, that._group);
        that._areBordersVisible() && that._createGroup("_bordersGroup", that, that._group);
        chartScatterSeries._createGroups.call(that)
    },
    _areBordersVisible: function() {
        return false
    },
    _getDefaultSegment: function(segment) {
        return {
            line: _map(segment.line || [], function(pt) {
                return pt.getDefaultCoords()
            })
        }
    },
    _prepareSegment: function(points) {
        return {
            line: points
        }
    },
    _parseLineOptions: function(options, defaultColor) {
        return {
            stroke: options.color || defaultColor,
            "stroke-width": options.width,
            dashStyle: options.dashStyle || "solid"
        }
    },
    _parseStyle: function(options, defaultColor) {
        return {
            elements: this._parseLineOptions(options, defaultColor)
        }
    },
    _applyStyle: function(style) {
        var that = this;
        that._elementsGroup && that._elementsGroup.attr(style.elements);
        _each(that._graphics || [], function(_, graphic) {
            graphic.line && graphic.line.attr({
                "stroke-width": style.elements["stroke-width"]
            }).sharp()
        })
    },
    _drawElement: function(segment, group) {
        return {
            line: this._createMainElement(segment.line, {
                "stroke-width": this._styles.normal.elements["stroke-width"]
            }).append(group)
        }
    },
    _removeElement: function(element) {
        element.line.remove()
    },
    _updateElement: function(element, segment, animate, animationComplete) {
        var params = {
                points: segment.line
            },
            lineElement = element.line;
        animate ? lineElement.animate(params, {}, animationComplete) : lineElement.attr(params)
    },
    _animateComplete: function() {
        var that = this;
        chartScatterSeries._animateComplete.call(that);
        that._markersGroup && that._markersGroup.animate({
            opacity: 1
        }, {
            duration: that._defaultDuration
        })
    },
    _animate: function() {
        var that = this,
            lastIndex = that._graphics.length - 1;
        _each(that._graphics || [], function(i, elem) {
            var complete;
            if (i === lastIndex) {
                complete = function() {
                    that._animateComplete()
                }
            }
            that._updateElement(elem, that._segments[i], true, complete)
        })
    },
    _drawPoint: function(options) {
        chartScatterSeries._drawPoint.call(this, {
            point: options.point,
            groups: options.groups
        })
    },
    _createMainElement: function(points, settings) {
        return this._renderer.path(points, "line").attr(settings).sharp()
    },
    _sortPoints: function(points, rotated) {
        return rotated ? points.sort(function(p1, p2) {
            return p2.y - p1.y
        }) : points.sort(function(p1, p2) {
            return p1.x - p2.x
        })
    },
    _drawSegment: function(points, animationEnabled, segmentCount, lastSegment) {
        var that = this,
            rotated = that._options.rotated,
            forceDefaultSegment = false,
            segment = that._prepareSegment(points, rotated, lastSegment);
        that._segments.push(segment);
        if (!that._graphics[segmentCount]) {
            that._graphics[segmentCount] = that._drawElement(animationEnabled ? that._getDefaultSegment(segment) : segment, that._elementsGroup)
        } else {
            if (!animationEnabled) {
                that._updateElement(that._graphics[segmentCount], segment)
            } else {
                if (forceDefaultSegment) {
                    that._updateElement(that._graphics[segmentCount], that._getDefaultSegment(segment))
                }
            }
        }
    },
    _getTrackerSettings: function() {
        var that = this,
            defaultTrackerWidth = that._defaultTrackerWidth,
            strokeWidthFromElements = that._styles.normal.elements["stroke-width"];
        return {
            "stroke-width": strokeWidthFromElements > defaultTrackerWidth ? strokeWidthFromElements : defaultTrackerWidth,
            fill: "none"
        }
    },
    _getMainPointsFromSegment: function(segment) {
        return segment.line
    },
    _drawTrackerElement: function(segment) {
        return this._createMainElement(this._getMainPointsFromSegment(segment), this._getTrackerSettings(segment))
    },
    _updateTrackerElement: function(segment, element) {
        var settings = this._getTrackerSettings(segment);
        settings.points = this._getMainPointsFromSegment(segment);
        element.attr(settings)
    },
    checkSeriesViewportCoord: function(axis, coord) {
        if (0 === this._points.length) {
            return false
        }
        var range = axis.isArgumentAxis ? this.getArgumentRange() : this.getViewport();
        var min = axis.getTranslator().translate(range.categories ? range.categories[0] : range.min);
        var max = axis.getTranslator().translate(range.categories ? range.categories[range.categories.length - 1] : range.max);
        var rotated = this.getOptions().rotated;
        var inverted = axis.getOptions().inverted;
        return axis.isArgumentAxis && (!rotated && !inverted || rotated && inverted) || !axis.isArgumentAxis && (rotated && !inverted || !rotated && inverted) ? coord >= min && coord <= max : coord >= max && coord <= min
    },
    getSeriesPairCoord: function(coord, isArgument) {
        var that = this;
        var oppositeCoord = null;
        var nearestPoints = this.getNearestPointsByCoord(coord, isArgument);
        var needValueCoord = isArgument && !that._options.rotated || !isArgument && that._options.rotated;
        for (var i = 0; i < nearestPoints.length; i++) {
            var p = nearestPoints[i];
            var k = (p[1].vy - p[0].vy) / (p[1].vx - p[0].vx);
            var b = p[0].vy - p[0].vx * k;
            var tmpCoord = void 0;
            if (p[1].vx - p[0].vx === 0) {
                tmpCoord = needValueCoord ? p[0].vy : p[0].vx
            } else {
                tmpCoord = needValueCoord ? k * coord + b : (coord - b) / k
            }
            if (this.checkAxisVisibleAreaCoord(!isArgument, tmpCoord)) {
                oppositeCoord = tmpCoord;
                break
            }
        }
        return oppositeCoord
    }
};
var lineSeries = exports.chart.line = _extend({}, chartScatterSeries, lineMethods, {
    getPointCenterByArg: function(arg) {
        var value = this.getArgumentAxis().getTranslator().translate(arg);
        return {
            x: value,
            y: value
        }
    }
});
exports.chart.stepline = _extend({}, lineSeries, {
    _calculateStepLinePoints: function(points) {
        var segment = [];
        var coordName = this._options.rotated ? "x" : "y";
        _each(points, function(i, pt) {
            var point = void 0;
            if (!i) {
                segment.push(pt);
                return
            }
            var step = segment[segment.length - 1][coordName];
            if (step !== pt[coordName]) {
                point = objectUtils.clone(pt);
                point[coordName] = step;
                segment.push(point)
            }
            segment.push(pt)
        });
        return segment
    },
    _prepareSegment: function(points) {
        return lineSeries._prepareSegment(this._calculateStepLinePoints(points))
    },
    getSeriesPairCoord: function(coord, isArgument) {
        var oppositeCoord = void 0;
        var rotated = this._options.rotated;
        var isOpposite = !isArgument && !rotated || isArgument && rotated;
        var coordName = !isOpposite ? "vx" : "vy";
        var oppositeCoordName = !isOpposite ? "vy" : "vx";
        var nearestPoints = this.getNearestPointsByCoord(coord, isArgument);
        for (var i = 0; i < nearestPoints.length; i++) {
            var p = nearestPoints[i];
            var tmpCoord = void 0;
            if (isArgument) {
                tmpCoord = coord !== p[1][coordName] ? p[0][oppositeCoordName] : p[1][oppositeCoordName]
            } else {
                tmpCoord = coord === p[0][coordName] ? p[0][oppositeCoordName] : p[1][oppositeCoordName]
            }
            if (this.checkAxisVisibleAreaCoord(!isArgument, tmpCoord)) {
                oppositeCoord = tmpCoord;
                break
            }
        }
        return oppositeCoord
    }
});
exports.chart.spline = _extend({}, lineSeries, {
    _calculateBezierPoints: function(src, rotated) {
        var bezierPoints = [],
            pointsCopy = src,
            checkExtremum = function(otherPointCoord, pointCoord, controlCoord) {
                return otherPointCoord > pointCoord && controlCoord > otherPointCoord || otherPointCoord < pointCoord && controlCoord < otherPointCoord ? otherPointCoord : controlCoord
            };
        if (1 !== pointsCopy.length) {
            pointsCopy.forEach(function(curPoint, i) {
                var leftControlX, leftControlY, rightControlX, rightControlY, xCur, yCur, x1, x2, y1, y2, curIsExtremum, leftPoint, rightPoint, a, b, c, xc, yc, shift, prevPoint = pointsCopy[i - 1],
                    nextPoint = pointsCopy[i + 1],
                    lambda = .5;
                if (!i || i === pointsCopy.length - 1) {
                    bezierPoints.push(curPoint, curPoint);
                    return
                }
                xCur = curPoint.x;
                yCur = curPoint.y;
                x1 = prevPoint.x;
                x2 = nextPoint.x;
                y1 = prevPoint.y;
                y2 = nextPoint.y;
                curIsExtremum = !!(!rotated && (yCur <= prevPoint.y && yCur <= nextPoint.y || yCur >= prevPoint.y && yCur >= nextPoint.y) || rotated && (xCur <= prevPoint.x && xCur <= nextPoint.x || xCur >= prevPoint.x && xCur >= nextPoint.x));
                if (curIsExtremum) {
                    if (!rotated) {
                        rightControlY = leftControlY = yCur;
                        rightControlX = (xCur + nextPoint.x) / 2;
                        leftControlX = (xCur + prevPoint.x) / 2
                    } else {
                        rightControlX = leftControlX = xCur;
                        rightControlY = (yCur + nextPoint.y) / 2;
                        leftControlY = (yCur + prevPoint.y) / 2
                    }
                } else {
                    a = y2 - y1;
                    b = x1 - x2;
                    c = y1 * x2 - x1 * y2;
                    if (!rotated) {
                        if (!b) {
                            bezierPoints.push(curPoint, curPoint, curPoint);
                            return
                        }
                        xc = xCur;
                        yc = -1 * (a * xc + c) / b;
                        shift = yc - yCur;
                        y1 -= shift;
                        y2 -= shift
                    } else {
                        if (!a) {
                            bezierPoints.push(curPoint, curPoint, curPoint);
                            return
                        }
                        yc = yCur;
                        xc = -1 * (b * yc + c) / a;
                        shift = xc - xCur;
                        x1 -= shift;
                        x2 -= shift
                    }
                    rightControlX = (xCur + lambda * x2) / (1 + lambda);
                    rightControlY = (yCur + lambda * y2) / (1 + lambda);
                    leftControlX = (xCur + lambda * x1) / (1 + lambda);
                    leftControlY = (yCur + lambda * y1) / (1 + lambda)
                }
                if (!rotated) {
                    leftControlY = checkExtremum(prevPoint.y, yCur, leftControlY);
                    rightControlY = checkExtremum(nextPoint.y, yCur, rightControlY)
                } else {
                    leftControlX = checkExtremum(prevPoint.x, xCur, leftControlX);
                    rightControlX = checkExtremum(nextPoint.x, xCur, rightControlX)
                }
                leftPoint = clonePoint(curPoint, leftControlX, leftControlY);
                rightPoint = clonePoint(curPoint, rightControlX, rightControlY);
                bezierPoints.push(leftPoint, curPoint, rightPoint)
            })
        } else {
            bezierPoints.push(pointsCopy[0])
        }
        return bezierPoints
    },
    _prepareSegment: function(points, rotated) {
        return lineSeries._prepareSegment(this._calculateBezierPoints(points, rotated))
    },
    _createMainElement: function(points, settings) {
        return this._renderer.path(points, "bezier").attr(settings).sharp()
    },
    getSeriesPairCoord: function(coord, isArgument) {
        var that = this;
        var oppositeCoord = null;
        var isOpposite = !isArgument && !this._options.rotated || isArgument && this._options.rotated;
        var coordName = !isOpposite ? "vx" : "vy";
        var bezierCoordName = !isOpposite ? "x" : "y";
        var oppositeCoordName = !isOpposite ? "vy" : "vx";
        var bezierOppositeCoordName = !isOpposite ? "y" : "x";
        var axis = !isArgument ? that.getArgumentAxis() : that.getValueAxis();
        var visibleArea = axis.getVisibleArea();
        var nearestPoints = this.getNearestPointsByCoord(coord, isArgument);
        var _loop = function(i) {
            var p = nearestPoints[i];
            if (1 === p.length) {
                visibleArea[0] <= p[0][oppositeCoordName] && visibleArea[1] >= p[0][oppositeCoordName] && (oppositeCoord = p[0][oppositeCoordName])
            } else {
                var ts = obtainCubicBezierTCoef(coord, p[0][coordName], p[1][bezierCoordName], p[2][bezierCoordName], p[3][coordName]);
                ts.forEach(function(t) {
                    if (t >= 0 && t <= 1) {
                        var tmpCoord = Math.pow(1 - t, 3) * p[0][oppositeCoordName] + 3 * Math.pow(1 - t, 2) * t * p[1][bezierOppositeCoordName] + 3 * (1 - t) * t * t * p[2][bezierOppositeCoordName] + t * t * t * p[3][oppositeCoordName];
                        if (visibleArea[0] <= tmpCoord && visibleArea[1] >= tmpCoord) {
                            oppositeCoord = tmpCoord
                        }
                    }
                })
            }
            if (null !== oppositeCoord) {
                return "break"
            }
        };
        for (var i = 0; i < nearestPoints.length; i++) {
            var _ret = _loop(i);
            if ("break" === _ret) {
                break
            }
        }
        return oppositeCoord
    },
    getNearestPointsByCoord: function(coord, isArgument) {
        var that = this;
        var rotated = that.getOptions().rotated;
        var isOpposite = !isArgument && !rotated || isArgument && rotated;
        var coordName = isOpposite ? "vy" : "vx";
        var points = that.getVisiblePoints();
        var allPoints = that.getPoints();
        var bezierPoints = that._segments.length > 0 ? that._segments.reduce(function(a, seg) {
            return a.concat(seg.line)
        }, []) : [];
        var nearestPoints = [];
        if (that.isVisible() && allPoints.length > 0) {
            if (allPoints.length > 1) {
                that.findNeighborPointsByCoord(coord, coordName, points.slice(0), allPoints, function(point, nextPoint) {
                    var index = bezierPoints.indexOf(point);
                    nearestPoints.push([point, bezierPoints[index + 1], bezierPoints[index + 2], nextPoint])
                })
            } else {
                if (allPoints[0][coordName] === coord) {
                    nearestPoints.push([allPoints[0]])
                }
            }
        }
        return nearestPoints
    }
});
exports.polar.line = _extend({}, polarScatterSeries, lineMethods, {
    _sortPoints: function(points) {
        return points
    },
    _prepareSegment: function(points, rotated, lastSegment) {
        var i, preparedPoints = [],
            centerPoint = this.getValueAxis().getCenter();
        lastSegment && this._closeSegment(points);
        if (this.argumentAxisType !== DISCRETE && this.valueAxisType !== DISCRETE) {
            for (i = 1; i < points.length; i++) {
                preparedPoints = preparedPoints.concat(this._getTangentPoints(points[i], points[i - 1], centerPoint))
            }
            if (!preparedPoints.length) {
                preparedPoints = points
            }
        } else {
            return lineSeries._prepareSegment.call(this, points)
        }
        return {
            line: preparedPoints
        }
    },
    _getRemainingAngle: function(angle) {
        var normAngle = normalizeAngle(angle);
        return angle >= 0 ? 360 - normAngle : -normAngle
    },
    _closeSegment: function(points) {
        var point, differenceAngle;
        if (this._segments.length) {
            point = this._segments[0].line[0]
        } else {
            point = clonePoint(points[0], points[0].x, points[0].y, points[0].angle)
        }
        if (points[points.length - 1].angle !== point.angle) {
            if (normalizeAngle(Math.round(points[points.length - 1].angle)) === normalizeAngle(Math.round(point.angle))) {
                point.angle = points[points.length - 1].angle
            } else {
                differenceAngle = points[points.length - 1].angle - point.angle;
                point.angle = points[points.length - 1].angle + this._getRemainingAngle(differenceAngle)
            }
            points.push(point)
        }
    },
    _getTangentPoints: function(point, prevPoint, centerPoint) {
        var i, tangentPoints = [],
            betweenAngle = Math.round(prevPoint.angle - point.angle),
            tan = (prevPoint.radius - point.radius) / betweenAngle;
        if (0 === betweenAngle) {
            tangentPoints = [prevPoint, point]
        } else {
            if (betweenAngle > 0) {
                for (i = betweenAngle; i >= 0; i--) {
                    tangentPoints.push(getTangentPoint(point, prevPoint, centerPoint, tan, i))
                }
            } else {
                for (i = 0; i >= betweenAngle; i--) {
                    tangentPoints.push(getTangentPoint(point, prevPoint, centerPoint, tan, betweenAngle - i))
                }
            }
        }
        return tangentPoints
    }
});
