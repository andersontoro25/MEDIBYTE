/**
* DevExtreme (ui/html_editor.d.ts)
* Version: 19.1.6
* Build date: Wed Sep 11 2019
*
* Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxHtmlEditor(): JQuery;
    dxHtmlEditor(options: "instance"): DevExpress.ui.dxHtmlEditor;
    dxHtmlEditor(options: string): any;
    dxHtmlEditor(options: string, ...params: any[]): any;
    dxHtmlEditor(options: DevExpress.ui.dxHtmlEditorOptions): JQuery;
}
}
export default DevExpress.ui.dxHtmlEditor;
export type Options = DevExpress.ui.dxHtmlEditorOptions;

/** @deprecated use Options instead */
export type IOptions = DevExpress.ui.dxHtmlEditorOptions;