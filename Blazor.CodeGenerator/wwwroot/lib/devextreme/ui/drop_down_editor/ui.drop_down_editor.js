/**
 * DevExtreme (ui/drop_down_editor/ui.drop_down_editor.js)
 * Version: 19.1.6
 * Build date: Wed Sep 11 2019
 *
 * Copyright (c) 2012 - 2019 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    AsyncTemplateMixin = require("../shared/async_template_mixin"),
    eventsEngine = require("../../events/core/events_engine"),
    Guid = require("../../core/guid"),
    registerComponent = require("../../core/component_registrator"),
    commonUtils = require("../../core/utils/common"),
    domUtils = require("../../core/utils/dom"),
    focused = require("../widget/selectors").focused,
    each = require("../../core/utils/iterator").each,
    isDefined = require("../../core/utils/type").isDefined,
    extend = require("../../core/utils/extend").extend,
    getPublicElement = require("../../core/utils/dom").getPublicElement,
    errors = require("../widget/ui.errors"),
    positionUtils = require("../../animation/position"),
    getDefaultAlignment = require("../../core/utils/position").getDefaultAlignment,
    DropDownButton = require("./ui.drop_down_button").default,
    messageLocalization = require("../../localization/message"),
    eventUtils = require("../../events/utils"),
    TextBox = require("../text_box"),
    clickEvent = require("../../events/click"),
    FunctionTemplate = require("../widget/function_template"),
    Popup = require("../popup");
var DROP_DOWN_EDITOR_CLASS = "dx-dropdowneditor",
    DROP_DOWN_EDITOR_INPUT_WRAPPER = "dx-dropdowneditor-input-wrapper",
    DROP_DOWN_EDITOR_BUTTON_ICON = "dx-dropdowneditor-icon",
    DROP_DOWN_EDITOR_OVERLAY = "dx-dropdowneditor-overlay",
    DROP_DOWN_EDITOR_OVERLAY_FLIPPED = "dx-dropdowneditor-overlay-flipped",
    DROP_DOWN_EDITOR_ACTIVE = "dx-dropdowneditor-active",
    DROP_DOWN_EDITOR_FIELD_CLICKABLE = "dx-dropdowneditor-field-clickable",
    DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER = "dx-dropdowneditor-field-template-wrapper";
var DropDownEditor = TextBox.inherit({
    _supportedKeys: function() {
        var homeEndHandler = function(e) {
            if (this.option("opened")) {
                e.preventDefault();
                return true
            }
            return false
        };
        return extend({}, this.callBase(), {
            tab: function(e) {
                if (!this.option("opened")) {
                    return
                }
                if ("instantly" === this.option("applyValueMode")) {
                    this.close();
                    return
                }
                var $focusableElement = e.shiftKey ? this._getLastPopupElement() : this._getFirstPopupElement();
                $focusableElement && eventsEngine.trigger($focusableElement, "focus");
                e.preventDefault()
            },
            escape: function(e) {
                if (this.option("opened")) {
                    e.preventDefault()
                }
                this.close()
            },
            upArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.altKey) {
                    this.close();
                    return false
                }
                return true
            },
            downArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.altKey) {
                    this._validatedOpening();
                    return false
                }
                return true
            },
            enter: function(e) {
                if (this.option("opened")) {
                    e.preventDefault();
                    this._valueChangeEventHandler(e)
                }
                return true
            },
            home: homeEndHandler,
            end: homeEndHandler
        })
    },
    _getDefaultButtons: function() {
        return this.callBase().concat([{
            name: "dropDown",
            Ctor: DropDownButton
        }])
    },
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            value: null,
            onOpened: null,
            onClosed: null,
            opened: false,
            acceptCustomValue: true,
            applyValueMode: "instantly",
            deferRendering: true,
            activeStateEnabled: true,
            dropDownButtonTemplate: "dropDownButton",
            fieldTemplate: null,
            contentTemplate: null,
            openOnFieldClick: false,
            showDropDownButton: true,
            buttons: void 0,
            dropDownOptions: {},
            popupPosition: this._getDefaultPopupPosition(),
            onPopupInitialized: null,
            applyButtonText: messageLocalization.format("OK"),
            cancelButtonText: messageLocalization.format("Cancel"),
            buttonsLocation: "default",
            showPopupTitle: false,
            useHiddenSubmitElement: false
        })
    },
    _getDefaultPopupPosition: function() {
        var position = getDefaultAlignment(this.option("rtlEnabled"));
        return {
            offset: {
                h: 0,
                v: -1
            },
            my: position + " top",
            at: position + " bottom",
            collision: "flip flip"
        }
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function(_device) {
                var isGeneric = "generic" === _device.platform;
                return isGeneric
            },
            options: {
                popupPosition: {
                    offset: {
                        v: 0
                    }
                }
            }
        }])
    },
    _inputWrapper: function() {
        return this.$element().find("." + DROP_DOWN_EDITOR_INPUT_WRAPPER)
    },
    _init: function() {
        this.callBase();
        this._initVisibilityActions();
        this._initPopupInitializedAction();
        this._initInnerOptionCache("dropDownOptions")
    },
    _initVisibilityActions: function() {
        this._openAction = this._createActionByOption("onOpened", {
            excludeValidators: ["disabled", "readOnly"]
        });
        this._closeAction = this._createActionByOption("onClosed", {
            excludeValidators: ["disabled", "readOnly"]
        })
    },
    _initPopupInitializedAction: function() {
        this._popupInitializedAction = this._createActionByOption("onPopupInitialized", {
            excludeValidators: ["disabled", "readOnly"]
        })
    },
    _initMarkup: function() {
        this._renderSubmitElement();
        this.callBase();
        this.$element().addClass(DROP_DOWN_EDITOR_CLASS);
        this.setAria("role", "combobox")
    },
    _render: function() {
        this.callBase();
        this._renderOpenHandler();
        this._renderOpenedState()
    },
    _renderContentImpl: function() {
        if (!this.option("deferRendering")) {
            this._createPopup()
        }
    },
    _renderInput: function() {
        this.callBase();
        this.$element().wrapInner($("<div>").addClass(DROP_DOWN_EDITOR_INPUT_WRAPPER));
        this._$container = this.$element().children().eq(0);
        this._setDefaultAria()
    },
    _setDefaultAria: function() {
        this.setAria({
            haspopup: "true",
            autocomplete: "list"
        })
    },
    _readOnlyPropValue: function() {
        return !this.option("acceptCustomValue") || this.callBase()
    },
    _cleanFocusState: function() {
        this.callBase();
        if (this.option("fieldTemplate")) {
            eventsEngine.off(this._input(), "focusin focusout beforeactivate")
        }
    },
    _getFieldTemplate: function() {
        return this.option("fieldTemplate") && this._getTemplateByOption("fieldTemplate")
    },
    _renderField: function() {
        var fieldTemplate = this._getFieldTemplate();
        fieldTemplate && this._renderTemplatedField(fieldTemplate, this._fieldRenderData())
    },
    _renderPlaceholder: function() {
        var hasFieldTemplate = !!this._getFieldTemplate();
        if (!hasFieldTemplate) {
            this.callBase()
        }
    },
    _renderValue: function() {
        if (this.option("useHiddenSubmitElement")) {
            this._setSubmitValue()
        }
        var promise = this.callBase();
        promise.always(this._renderField.bind(this))
    },
    _renderTemplatedField: function(fieldTemplate, data) {
        var _this = this;
        var isFocused = focused(this._input());
        var $container = this._$container;
        this._disposeKeyboardProcessor();
        var beforeButtonsContainerParent = this._$beforeButtonsContainer && this._$beforeButtonsContainer[0].parentNode;
        var afterButtonsContainerParent = this._$afterButtonsContainer && this._$afterButtonsContainer[0].parentNode;
        beforeButtonsContainerParent && beforeButtonsContainerParent.removeChild(this._$beforeButtonsContainer[0]);
        afterButtonsContainerParent && afterButtonsContainerParent.removeChild(this._$afterButtonsContainer[0]);
        this._detachFocusEvents();
        $container.empty();
        var $templateWrapper = $("<div>").addClass(DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER).appendTo($container);
        fieldTemplate.render({
            model: data,
            container: domUtils.getPublicElement($templateWrapper),
            onRendered: function() {
                var $input = _this._input();
                if (!$input.length) {
                    throw errors.Error("E1010")
                }
                _this._refreshEvents();
                _this._refreshValueChangeEvent();
                _this._renderFocusState();
                isFocused && eventsEngine.trigger($input, "focus")
            }
        });
        $container.prepend(this._$beforeButtonsContainer);
        $container.append(this._$afterButtonsContainer)
    },
    _fieldRenderData: function() {
        return this.option("value")
    },
    _initTemplates: function() {
        this.callBase();
        this._defaultTemplates.dropDownButton = new FunctionTemplate(function(options) {
            var $icon = $("<div>").addClass(DROP_DOWN_EDITOR_BUTTON_ICON);
            $(options.container).append($icon)
        }, this)
    },
    _renderOpenHandler: function() {
        var that = this,
            $inputWrapper = that._inputWrapper(),
            eventName = eventUtils.addNamespace(clickEvent.name, that.NAME),
            openOnFieldClick = that.option("openOnFieldClick");
        eventsEngine.off($inputWrapper, eventName);
        eventsEngine.on($inputWrapper, eventName, that._getInputClickHandler(openOnFieldClick));
        that.$element().toggleClass(DROP_DOWN_EDITOR_FIELD_CLICKABLE, openOnFieldClick);
        if (openOnFieldClick) {
            that._openOnFieldClickAction = that._createAction(that._openHandler.bind(that))
        }
    },
    _getInputClickHandler: function(openOnFieldClick) {
        var that = this;
        return openOnFieldClick ? function(e) {
            that._executeOpenAction(e)
        } : function(e) {
            that._focusInput()
        }
    },
    _openHandler: function() {
        this._toggleOpenState()
    },
    _executeOpenAction: function(e) {
        this._openOnFieldClickAction({
            event: e
        })
    },
    _keyboardEventBindingTarget: function() {
        return this._input()
    },
    _focusInput: function() {
        if (this.option("disabled")) {
            return false
        }
        if (this.option("focusStateEnabled") && !focused(this._input())) {
            eventsEngine.trigger(this._input(), "focus")
        }
        return true
    },
    _toggleOpenState: function(isVisible) {
        if (!this._focusInput()) {
            return
        }
        if (!this.option("readOnly")) {
            isVisible = arguments.length ? isVisible : !this.option("opened");
            this.option("opened", isVisible)
        }
    },
    _renderOpenedState: function() {
        var opened = this.option("opened");
        if (opened) {
            this._createPopup()
        }
        this.$element().toggleClass(DROP_DOWN_EDITOR_ACTIVE, opened);
        this._setPopupOption("visible", opened);
        this.setAria({
            expanded: opened
        });
        this.setAria("owns", (opened || void 0) && this._popupContentId, this.$element())
    },
    _createPopup: function() {
        if (this._$popup) {
            return
        }
        this._$popup = $("<div>").addClass(DROP_DOWN_EDITOR_OVERLAY).addClass(this.option("customOverlayCssClass")).appendTo(this.$element());
        this._renderPopup();
        this._renderPopupContent()
    },
    _renderPopup: function() {
        this._popup = this._createComponent(this._$popup, Popup, extend(this._popupConfig(), this._getInnerOptionsCache("dropDownOptions")));
        this._popup.on({
            showing: this._popupShowingHandler.bind(this),
            shown: this._popupShownHandler.bind(this),
            hiding: this._popupHidingHandler.bind(this),
            hidden: this._popupHiddenHandler.bind(this)
        });
        this._popup.option("onContentReady", this._contentReadyHandler.bind(this));
        this._contentReadyHandler();
        this._setPopupContentId(this._popup.$content());
        this._bindInnerWidgetOptions(this._popup, "dropDownOptions")
    },
    _setPopupContentId: function($popupContent) {
        this._popupContentId = "dx-" + new Guid;
        this.setAria("id", this._popupContentId, $popupContent)
    },
    _contentReadyHandler: commonUtils.noop,
    _popupConfig: function() {
        return {
            onInitialized: this._popupInitializedHandler(),
            position: extend(this.option("popupPosition"), {
                of: this.$element()
            }),
            showTitle: this.option("showPopupTitle"),
            width: "auto",
            height: "auto",
            shading: false,
            closeOnTargetScroll: true,
            closeOnOutsideClick: this._closeOutsideDropDownHandler.bind(this),
            animation: {
                show: {
                    type: "fade",
                    duration: 0,
                    from: 0,
                    to: 1
                },
                hide: {
                    type: "fade",
                    duration: 400,
                    from: 1,
                    to: 0
                }
            },
            deferRendering: false,
            focusStateEnabled: false,
            showCloseButton: false,
            toolbarItems: this._getPopupToolbarItems(),
            onPositioned: this._popupPositionedHandler.bind(this),
            fullScreen: false
        }
    },
    _popupInitializedHandler: function() {
        if (!this.option("onPopupInitialized")) {
            return
        }
        return function(e) {
            this._popupInitializedAction({
                popup: e.component
            })
        }.bind(this)
    },
    _popupPositionedHandler: function(e) {
        e.position && this._popup.overlayContent().toggleClass(DROP_DOWN_EDITOR_OVERLAY_FLIPPED, e.position.v.flip)
    },
    _popupShowingHandler: commonUtils.noop,
    _popupHidingHandler: function() {
        this.option("opened", false)
    },
    _popupShownHandler: function() {
        this._openAction();
        if (this._$validationMessage) {
            this._$validationMessage.dxOverlay("option", "position", this._getValidationMessagePosition())
        }
    },
    _popupHiddenHandler: function() {
        this._closeAction();
        if (this._$validationMessage) {
            this._$validationMessage.dxOverlay("option", "position", this._getValidationMessagePosition())
        }
    },
    _getValidationMessagePosition: function() {
        var positionRequest = "below";
        if (this._popup && this._popup.option("visible")) {
            var myTop = positionUtils.setup(this.$element()).top,
                popupTop = positionUtils.setup(this._popup.$content()).top;
            positionRequest = myTop + this.option("popupPosition").offset.v > popupTop ? "below" : "above"
        }
        return this.callBase(positionRequest)
    },
    _renderPopupContent: function() {
        var contentTemplate = this._getTemplateByOption("contentTemplate");
        if (!(contentTemplate && this.option("contentTemplate"))) {
            return
        }
        var $popupContent = this._popup.$content(),
            templateData = {
                value: this._fieldRenderData(),
                component: this
            };
        $popupContent.empty();
        contentTemplate.render({
            container: domUtils.getPublicElement($popupContent),
            model: templateData
        })
    },
    _closeOutsideDropDownHandler: function(_ref) {
        var target = _ref.target;
        var $target = $(target);
        var dropDownButton = this.getButton("dropDown");
        var $dropDownButton = dropDownButton && dropDownButton.$element();
        var isInputClicked = !!$target.closest(this.$element()).length;
        var isDropDownButtonClicked = !!$target.closest($dropDownButton).length;
        var isOutsideClick = !isInputClicked && !isDropDownButtonClicked;
        return isOutsideClick
    },
    _clean: function() {
        delete this._openOnFieldClickAction;
        if (this._$popup) {
            this._$popup.remove();
            delete this._$popup;
            delete this._popup
        }
        this.callBase()
    },
    _setPopupOption: function(optionName, value) {
        this._setWidgetOption("_popup", arguments)
    },
    _validatedOpening: function() {
        if (!this.option("readOnly")) {
            this._toggleOpenState(true)
        }
    },
    _getPopupToolbarItems: function() {
        return "useButtons" === this.option("applyValueMode") ? this._popupToolbarItemsConfig() : []
    },
    _getFirstPopupElement: function() {
        return this._popup._wrapper().find(".dx-popup-done.dx-button")
    },
    _getLastPopupElement: function() {
        return this._popup._wrapper().find(".dx-popup-cancel.dx-button")
    },
    _popupElementTabHandler: function(e) {
        var $element = $(e.currentTarget);
        if (e.shiftKey && $element.is(this._getFirstPopupElement()) || !e.shiftKey && $element.is(this._getLastPopupElement())) {
            eventsEngine.trigger(this._input(), "focus");
            e.preventDefault()
        }
    },
    _popupElementEscHandler: function() {
        eventsEngine.trigger(this._input(), "focus");
        this.close()
    },
    _popupButtonInitializedHandler: function(e) {
        e.component.registerKeyHandler("tab", this._popupElementTabHandler.bind(this));
        e.component.registerKeyHandler("escape", this._popupElementEscHandler.bind(this))
    },
    _popupToolbarItemsConfig: function() {
        var buttonsConfig = [{
            shortcut: "done",
            options: {
                onClick: this._applyButtonHandler.bind(this),
                text: this.option("applyButtonText"),
                onInitialized: this._popupButtonInitializedHandler.bind(this)
            }
        }, {
            shortcut: "cancel",
            options: {
                onClick: this._cancelButtonHandler.bind(this),
                text: this.option("cancelButtonText"),
                onInitialized: this._popupButtonInitializedHandler.bind(this)
            }
        }];
        return this._applyButtonsLocation(buttonsConfig)
    },
    _applyButtonsLocation: function(buttonsConfig) {
        var buttonsLocation = this.option("buttonsLocation"),
            resultConfig = buttonsConfig;
        if ("default" !== buttonsLocation) {
            var position = commonUtils.splitPair(buttonsLocation);
            each(resultConfig, function(_, element) {
                extend(element, {
                    toolbar: position[0],
                    location: position[1]
                })
            })
        }
        return resultConfig
    },
    _applyButtonHandler: function() {
        this.close();
        this.option("focusStateEnabled") && this.focus()
    },
    _cancelButtonHandler: function() {
        this.close();
        this.option("focusStateEnabled") && this.focus()
    },
    _updatePopupWidth: commonUtils.noop,
    _popupOptionChanged: function(args) {
        var options = this._getOptionsFromContainer(args);
        this._setPopupOption(options);
        if (Object.keys(options).indexOf("width") !== -1 && void 0 === options.width) {
            this._updatePopupWidth()
        }
    },
    _renderSubmitElement: function() {
        if (this.option("useHiddenSubmitElement")) {
            this._$submitElement = $("<input>").attr("type", "hidden").appendTo(this.$element())
        }
    },
    _setSubmitValue: function() {
        this._getSubmitElement().val(this.option("value"))
    },
    _getSubmitElement: function() {
        if (this.option("useHiddenSubmitElement")) {
            return this._$submitElement
        } else {
            return this.callBase()
        }
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "opened":
                this._renderOpenedState();
                break;
            case "onOpened":
            case "onClosed":
                this._initVisibilityActions();
                break;
            case "onPopupInitialized":
                this._initPopupInitializedAction();
                break;
            case "fieldTemplate":
                if (isDefined(args.value)) {
                    this._renderField()
                } else {
                    this._invalidate()
                }
                break;
            case "contentTemplate":
            case "acceptCustomValue":
            case "openOnFieldClick":
                this._invalidate();
                break;
            case "dropDownButtonTemplate":
            case "showDropDownButton":
                this._updateButtons(["dropDown"]);
                break;
            case "dropDownOptions":
                this._popupOptionChanged(args);
                this._cacheInnerOptions("dropDownOptions", args.value);
                break;
            case "popupPosition":
            case "deferRendering":
                break;
            case "applyValueMode":
            case "applyButtonText":
            case "cancelButtonText":
            case "buttonsLocation":
                this._setPopupOption("toolbarItems", this._getPopupToolbarItems());
                break;
            case "showPopupTitle":
                this._setPopupOption("showTitle", args.value);
                break;
            case "useHiddenSubmitElement":
                if (this._$submitElement) {
                    this._$submitElement.remove();
                    this._$submitElement = void 0
                }
                this._renderSubmitElement();
                break;
            default:
                this.callBase(args)
        }
    },
    open: function() {
        this.option("opened", true)
    },
    close: function() {
        this.option("opened", false)
    },
    field: function() {
        return getPublicElement(this._input())
    },
    content: function() {
        return this._popup ? this._popup.content() : null
    }
}).include(AsyncTemplateMixin);
registerComponent("dxDropDownEditor", DropDownEditor);
module.exports = DropDownEditor;
module.exports.default = module.exports;
