/**
* DevExtreme (ui/speed_dial_action.d.ts)
* Version: 19.1.6
* Build date: Wed Sep 11 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxSpeedDialAction(): JQuery;
    dxSpeedDialAction(options: "instance"): DevExpress.ui.dxSpeedDialAction;
    dxSpeedDialAction(options: string): any;
    dxSpeedDialAction(options: string, ...params: any[]): any;
    dxSpeedDialAction(options: DevExpress.ui.dxSpeedDialActionOptions): JQuery;
}
}
export default DevExpress.ui.dxSpeedDialAction;
export type Options = DevExpress.ui.dxSpeedDialActionOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.ui.dxSpeedDialActionOptions;