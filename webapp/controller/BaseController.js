sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.lonwyr.PathfinderChronicler.controller.BaseController", {

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		navigate: function (event) {
			this.getRouter().navTo(event.getSource().getSelectedKey());
		}
	});
});