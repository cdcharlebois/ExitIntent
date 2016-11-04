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

], function(declare, _WidgetBase, aspect,
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
        saveMf: "",
        cancelMf: "",
        promptText: "",
        proceedText: "",
        cancelText: "",
        modalText: "",

        // Internal variables.
        _handles: null,
        _contextObj: null,

        postCreate: function() {
            // console.log(this)
            logger.debug(this.id + ".postCreate");

            this.handle = aspect.around(window.mx.router, "openFormInContent", dojoLang.hitch(this, this._aroundFunc));

        },

        _aroundFunc: function(origOpenFormInContent) {
            // console.log('hi');
            var self = this;
            var confirm2 = function(args) {
                new confirmationDialog2({
                    caption: args.caption,
                    content: args.content,
                    proceed: args.proceed || this.translate("mxui.widget.DialogMessage", "ok"),
                    cancel: args.cancel || this.translate("mxui.widget.DialogMessage", "cancel"),
                    handler: args.handler,
                    cancelHandler: args.cancelHandler
                }).show();
            };

            return function() {
                var origNav = origOpenFormInContent;
                var args = arguments;
                var theWidget = self;
                var theRouter = this;

                // check for changes
                var guidsOnPage = self.mxform._formData._getObjectsFromProviders().map(function(o){return o._guid})
                ,   guidsChanged = false

                guidsOnPage.forEach(function(g){
                  if (!self._isEmptyObject(mx.data.getChanges(g))) {
                    guidsChanged = true;
                  }
                })

                if (guidsChanged){
                  confirm2({
                      caption: theWidget.modalText,
                      content: theWidget.promptText,
                      proceed: theWidget.proceedText,
                      cancel: theWidget.cancelText,
                      handler: function() {
                          origNav.apply(theRouter, args);
                          theWidget._runSaveMicroflow(self._contextObj)
                          // theWidget._commitChanges(objectsChanged)
                      },
                      cancelHandler: function() {
                          // console.log("cancel handler");
                          origNav.apply(theRouter, args);
                          if (self.cancelMf){
                              theWidget._runCancelMicroflow(self._contextObj)
                          }

                      }
                  })
                }
                else {
                  origNav.apply(theRouter, args);
                }
                return;
            };
        },

        update: function(obj, cb) {
            if (obj) {
                this._contextObj = obj
            }
            cb();
        },

        uninitialize: function() {
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

        _runSaveMicroflow: function(obj) {
            if (!obj)
                return;
            console.log('saving ' + obj.getGuid())
            mx.data.action({
                params: {
                    actionname: this.saveMf,
                    applyto: 'selection',
                    guids: [obj.getGuid()]
                },
                callback: function(res) {
                    console.log('success')
                },
                error: function(err) {
                    console.log('err')
                }
            })
        },
        _runCancelMicroflow: function(obj) {
            if (!obj)
                return;
            console.log('saving ' + obj.getGuid())
            mx.data.action({
                params: {
                    actionname: this.cancelMf,
                    applyto: 'selection',
                    guids: [obj.getGuid()]
                },
                callback: function(res) {
                    console.log('success')
                },
                error: function(err) {
                    console.log('err')
                }
            })
        },

        _isEmptyObject: function(obj){
            for(var prop in obj) {
              if(obj.hasOwnProperty(prop))
              return false;
            }
            return JSON.stringify(obj) === JSON.stringify({});
        }

    });
});

require(["ExitIntent/widget/ExitIntent"]);
