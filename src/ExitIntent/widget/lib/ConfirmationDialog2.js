define([
    "mxui/widget/Dialog", "mxui/dom", "mendix/logger", "dojo/_base/declare"
], function (dialog, dom, logger, declare) {
	var $ = dom.create;
	var theDialog = declare(dialog, {
		declaredClass: "ExitIntent.widget.ConfirmationDialog2",
		cancel: "",
		yes: "",
		no: "",
		yesHandler: null ,
		cancelHandler: null,
		noHandler: null,
		buildRendering: function() {
			this.caption = this.caption || this.translate("caption");
			this.inherited(arguments);
			var cancelBtn = $("button", {
				"class": "btn"
			}, this.cancel)
			  , yesBtn = $("button", {
				"class": "btn btn-primary"
			}, this.yes)
			  , noBtn = $("button", {
			  "class": "btn"
		    }, this.no)
			  , contentNode = $("p");
			contentNode.innerHTML = dom.convertNlToBr(dom.escapeString(this.content));
			this.setContent(contentNode);
			this.setButtons([yesBtn, noBtn, cancelBtn]);
			this.connect(cancelBtn, "click", function() {
				this.hide();
				this.cancelHandler();
			});
			this.connect(yesBtn, "click", function() {
				this.hide();
				this.yesHandler();
			});
			this.connect(noBtn, "click", function() {
				this.hide();
				this.noHandler();
			});
		},
		show: function() {
			this.inherited(arguments, [true]);
		}
	});
	return theDialog;
});

require(["ExitIntent/widget/lib/ConfirmationDialog2"]);
