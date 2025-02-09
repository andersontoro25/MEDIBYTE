/**
* DevExtreme (viz/pie_chart.d.ts)
* Version: 19.1.6
* Build date: Wed Sep 11 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxPieChart(): JQuery;
    dxPieChart(options: "instance"): DevExpress.viz.dxPieChart;
    dxPieChart(options: string): any;
    dxPieChart(options: string, ...params: any[]): any;
    dxPieChart(options: DevExpress.viz.dxPieChartOptions): JQuery;
}
}
export default DevExpress.viz.dxPieChart;
export type Options = DevExpress.viz.dxPieChartOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.viz.dxPieChartOptions;