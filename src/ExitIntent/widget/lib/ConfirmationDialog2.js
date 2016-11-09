define([
    "mxui/dom", "dojo/_base/declare"
], function (dom, declare) {
	var $ = dom.create;
	var theDialog = declare(mxui.widget.Dialog, {
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
