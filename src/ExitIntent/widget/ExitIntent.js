/**
 * Exit Intent Widget
 * @author Conner Charlebois (Mendix)
 * --- @since Jul 3, 2018 @version 1.0.2 ---
 * Upgrade to work with Mx 7.15
 * - change name of advisor target from mx.router.openFormInContent to mx.ui.openPage
 * - return a promise from advisor function
 * --- /@since ---
 */
define([
    "dojo/_base/declare", "mxui/widget/_WidgetBase", "dojo/aspect",

    // "mxui/dom",
    // "dojo/dom",
    // "dojo/dom-prop",
    // "dojo/dom-geometry",
    // "dojo/dom-class",
    // "dojo/dom-style",
    // "dojo/dom-construct",
    // "dojo/_base/array",
    "dojo/_base/lang",
    // "dojo/text",
    // "dojo/html",
    // "dojo/_base/event",
    "ExitIntent/widget/lib/ConfirmationDialog2"

], function (declare, _WidgetBase, aspect,
    // dom,
    // dojoDom,
    // dojoProp,
    // dojoGeometry,
    // dojoClass,
    // dojoStyle,
    // dojoConstruct,
    // dojoArray,
    dojoLang,
    // dojoText,
    // dojoHtml,
    // dojoEvent
    confirmationDialog2) {
        "use strict";

        return declare("ExitIntent.widget.ExitIntent", [_WidgetBase], {

            // from modeler
            changesMf: "",
            yesMf: "",
            noMf: "",
            promptText: "",
            yesText: "",
            noText: "",
            cancelText: "",
            modalText: "",

            // Internal variables.
            _handles: null,
            _contextObj: null,
            _pageForm: null,

            postCreate: function () {
                // console.log(this)
                logger.debug(this.id + ".postCreate");

                this.handle = aspect.around(window.mx.ui, "openPage", dojoLang.hitch(this, this._aroundFunc));
                this._pageForm = this.mxform;
            },

            _aroundFunc: function (origOpenFormInContent) {
                // console.log('hi');
                var self = this;
                var confirm2 = function (args) {
                    new confirmationDialog2({
                        caption: args.caption,
                        content: args.content,
                        yes: args.yes || this.translate("mxui.widget.DialogMessage", "ok"),
                        no: args.no,
                        cancel: args.cancel || this.translate("mxui.widget.DialogMessage", "cancel"),
                        yesHandler: args.yesHandler,
                        noHandler: args.noHandler,
                        cancelHandler: args.cancelHandler
                    }).show();
                };

                return function () {
                    var origNav = origOpenFormInContent;
                    var args = arguments;
                    var theWidget = self;
                    var theRouter = this;

                    // check for changes
                    // var guidsOnPage = self.mxform._formData._getObjectsFromProviders().map(function(o) {
                    //         return o._guid
                    //     }),
                    //     guidsChanged = false
                    //
                    // guidsOnPage.forEach(function(g) {
                    //     if (!self._isEmptyObject(mx.data.getChanges(g))) {
                    //         guidsChanged = true;
                    //     }
                    // })

                    mx.data.action({
                        params: {
                            actionname: theWidget.changesMf,
                            applyto: 'selection',
                            guids: [theWidget._contextObj.getGuid()]
                        },
                        callback: function (guidsChanged) {
                            console.log(guidsChanged)
                            if (guidsChanged) {
                                confirm2({
                                    caption: theWidget.modalText,
                                    content: theWidget.promptText,
                                    yes: theWidget.yesText,
                                    no: theWidget.noText,
                                    cancel: theWidget.cancelText,
                                    yesHandler: function () {
                                        // origNav.apply(theRouter, args);
                                        theWidget._runMicroflow(self.yesMf, self._contextObj, origNav, theRouter, args)
                                        // theWidget._commitChanges(objectsChanged)
                                    },
                                    noHandler: function () {
                                        // console.log("cancel handler");
                                        // origNav.apply(theRouter, args);
                                        if (self.noMf) {
                                            theWidget._runMicroflow(self.noMf, self._contextObj, origNav, theRouter, args)
                                        }

                                    },
                                    cancelHandler: function () { }
                                })
                            } else {
                                origNav.apply(theRouter, args);
                            }

                        },
                        error: function (err) {
                            console.log(err)
                        }
                    });

                    return Promise.resolve();
                };
            },

            update: function (obj, cb) {
                if (obj) {
                    this._contextObj = obj
                }
                cb();
            },

            uninitialize: function () {
                this.handle.remove();
            },

            // striaght commit --
            // ------------------
            // use this if you want the widget to commit
            // ------------------
            // _commitChanges: function(objects){
            //   mx.data.commit({
            //     mxobjs: objects,
            //     callback: function() {
            //       console.log('success')
            //     },
            //     error: function(err) {
            //       console.log(err)
            //     }
            //   })
            // },

            _runMicroflow: function (mf, obj, cb, scope, args) {
                if (!obj) return;
                // console.log('saving ' + obj.getGuid())
                mx.data.action({
                    params: {
                        actionname: mf,
                        applyto: 'selection',
                        guids: [obj.getGuid()],
                    },
                    origin: this._pageForm,
                    callback: function (res) {
                        // should the navigation occur?
                        // @since Apr 17, 2018
                        if (res) {
                            cb.apply(scope, args);
                        } else {
                            console.debug("We're cancelling the navigation because the handler function returned false.");
                        }
                    },
                    error: function (err) {
                        console.log('err')
                    }
                })
            },

            _isEmptyObject: function (obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop))
                        return false;
                }
                return JSON.stringify(obj) === JSON.stringify({});
            }

        });
    });

require(["ExitIntent/widget/ExitIntent"]);