sap.ui.define([
	"./BaseController"
], function (
	BaseController
) {
	"use strict";

	return BaseController.extend("com.lonwyr.PathfinderChronicler.controller.App", {
		onInit: function () {
			this.getRouter().attachRouteMatched(this._onRouteMatched.bind(this))

		},

		_onRouteMatched: function (oEvent) {
			const routeName = oEvent.getParameter("name")
			this.getModel("navigation").setData(routeName)
		}
	});
});