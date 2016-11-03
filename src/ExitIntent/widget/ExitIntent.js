define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dojo/aspect",

    // "mxui/dom",
    // "dojo/dom",
    // "dojo/dom-prop",
    // "dojo/dom-geometry",
    // "dojo/dom-class",
    // "dojo/dom-style",
    // "dojo/dom-construct",
    // "dojo/_base/array",
    "dojo/_base/lang"
    // "dojo/text",
    // "dojo/html",
    // "dojo/_base/event",


], function (declare,
_WidgetBase,
aspect,
// dom,
// dojoDom,
// dojoProp,
// dojoGeometry,
// dojoClass,
// dojoStyle,
// dojoConstruct,
// dojoArray,
dojoLang
// dojoText,
// dojoHtml,
// dojoEvent
) {
    "use strict";

    return declare("ExitIntent.widget.ExitIntent", [ _WidgetBase ], {


        // Internal variables.
        _handles: null,
        _contextObj: null,


        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            // window.hooked = window.hooked || false
            var self = this
            // console.log(this.mxform.navigateTo)
            // console.log(this)
            // var self = this;
            // if (!window.hooked){
            //working with before
            // self.handle = aspect.before(
            //   self.mxform, // target
            //   "navigateTo", // method name
            //   function(){
            //     console.log(self._contextObj)
            //     if (!self._contextObj) return
            //     // var c = confirm('do you want to save to this customer? (If you select "no", your changes will not be saved.)')
            //     // if (c) {
            //     //   self._runSaveMicroflow(self._contextObj)
            //     // }
            //     // if the object is modified
            //     mx.ui.confirmation({
            //       content:"do you want to save to this customer? (If you select 'no', your changes will not be saved.)",
            //       proceed:"Yes, save",
            //       cancel:"No, discard my changes",
            //       handler: function(){
            //         self._runSaveMicroflow(self._contextObj)
            //       }
            //     })
            //   }
            // );
            aspect.around(self.mxform, "navigateTo", dojoLang.hitch(self, self._aroundFunc));

              // window.hooked = true
            // }
        },

        _aroundFunc: function(originalNav){
          console.log('hi');
          return function(){
            // doing something before the original call
            var deferred = originalNav.apply(self, arguments);
            // doing something after the original call
            return deferred;
          };
        },

        update: function(obj, cb){
          if (obj){
            this._contextObj = obj
          }
          cb();
        },

        uninitialize: function() {
          this.handle.remove();
        },

        _runSaveMicroflow: function(obj){
          if (!obj) return;
          console.log('saving ' + obj.getGuid())
          mx.data.action({
            params: {
              actionname: 'TestSuite.IVK_SaveForgottenPerson',
              applyto: 'selection',
              guids: [obj.getGuid()]
            },
            callback: function(res){
              console.log('success')
            },
            error: function(err){
              console.log('err')
            }
          })
        }


    });
});

require(["ExitIntent/widget/ExitIntent"]);
