/**
* DevExtreme (viz/range_selector.d.ts)
* Version: 19.1.6
* Build date: Wed Sep 11 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxRangeSelector(): JQuery;
    dxRangeSelector(options: "instance"): DevExpress.viz.dxRangeSelector;
    dxRangeSelector(options: string): any;
    dxRangeSelector(options: string, ...params: any[]): any;
    dxRangeSelector(options: DevExpress.viz.dxRangeSelectorOptions): JQuery;
}
}
export default DevExpress.viz.dxRangeSelector;
export type Options = DevExpress.viz.dxRangeSelectorOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.viz.dxRangeSelectorOptions;