/**
* DevExtreme (ui/menu.d.ts)
* Version: 19.1.6
* Build date: Wed Sep 11 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxMenu(): JQuery;
    dxMenu(options: "instance"): DevExpress.ui.dxMenu;
    dxMenu(options: string): any;
    dxMenu(options: string, ...params: any[]): any;
    dxMenu(options: DevExpress.ui.dxMenuOptions): JQuery;
}
}
export default DevExpress.ui.dxMenu;
export type Options = DevExpress.ui.dxMenuOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.ui.dxMenuOptions;