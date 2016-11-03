define([
    "mxui/widget/Dialog", "mxui/dom", "mendix/logger", "dojo/_base/declare"
], function (dialog, dom, logger, declare) {
	var $ = dom.create;
	var theDialog = declare(dialog, {
		declaredClass: "ExitIntent.widget.ConfirmationDialog2",
		cancel: "",
		proceed: "",
		handler: null ,
		cancelHandler: null,
		buildRendering: function() {
			this.caption = this.caption || this.translate("caption");
			this.inherited(arguments);
			var cancelBtn = $("button", {
				"class": "btn"
			}, this.cancel)
			  , proceedBtn = $("button", {
				"class": "btn btn-primary"
			}, this.proceed)
			  , contentNode = $("p");
			contentNode.innerHTML = dom.convertNlToBr(dom.escapeString(this.content));
			this.setContent(contentNode);
			this.setButtons([proceedBtn, cancelBtn]);
			this.connect(cancelBtn, "click", function() {
				this.hide();
				this.cancelHandler();
			});
			this.connect(proceedBtn, "click", function() {
				this.hide();
				this.handler();
			});
		},
		show: function() {
			this.inherited(arguments, [true]);
		}
	});
	return theDialog;
});

require(["ExitIntent/widget/lib/ConfirmationDialog2"]);
