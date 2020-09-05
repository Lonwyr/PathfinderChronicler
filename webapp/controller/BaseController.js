sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.lonwyr.PfsChronicleFiller.controller.BaseController", {

		backNavigationRoute: "characterCreation",

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		navToMain: function () {
			this.getRouter().navTo(this.backNavigationRoute);
		}
	});
});