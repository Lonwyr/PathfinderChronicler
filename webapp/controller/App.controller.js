sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	const mainPages = [
		"master",
		"createSheets",
		"maintainData"
	];

	return BaseController.extend("com.lonwyr.PfsChronicleFiller.controller.App", {
		onInit: function () {
			this.getRouter().attachRouteMatched(this._onRouteMatched.bind(this));

		},

		_onRouteMatched: function (oEvent) {
			let layout = "TwoColumnsMidExpanded";
			const routeName = oEvent.getParameter("name");

			if (mainPages.includes(routeName))
				layout = "OneColumn";

			if (routeName.startsWith("characterCreationSchoolDetails"))
				layout = "ThreeColumnsEndExpanded";

			let flexibleColumnLayout = this.getView().byId("flexibleColumnLayout");
			flexibleColumnLayout.setLayout(layout);
		},
	});
});