/**
* DevExtreme (viz/tree_map.d.ts)
* Version: 19.1.6
* Build date: Wed Sep 11 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxTreeMap(): JQuery;
    dxTreeMap(options: "instance"): DevExpress.viz.dxTreeMap;
    dxTreeMap(options: string): any;
    dxTreeMap(options: string, ...params: any[]): any;
    dxTreeMap(options: DevExpress.viz.dxTreeMapOptions): JQuery;
}
}
export default DevExpress.viz.dxTreeMap;
export type Options = DevExpress.viz.dxTreeMapOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.viz.dxTreeMapOptions;