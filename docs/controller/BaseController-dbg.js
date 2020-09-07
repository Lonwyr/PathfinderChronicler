sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/File",
	"sap/m/MessageBox"
], function (
	Controller,
	File,
	MessageBox
) {
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
		},

		loadConfig: function(event) {
			try {
				var file = event.getParameter("files") && event.getParameter("files")[0]
				if (file && window.FileReader) {
					var reader = new FileReader()
					reader.onload = function (evn) {
						var fileContent = evn.target.result;
						var settings = JSON.parse(fileContent)
						this.getModel("data").setData(settings.data)
						this.getModel("printOptions").setData(settings.printOptions)

					}.bind(this);
					reader.readAsText(file);
				}
			} catch (e) {
				MessageBox.error(
					"The loading of the data was not successful.\n" + e.message
				);
			}
		},

		downloadConfig: function () {
			try {
				const data = this.getModel("data").getData()
				const printOptions = this.getModel("printOptions").getData()
				const dataBundle = JSON.stringify({
					data: data,
					printOptions: printOptions
				})
				File.save(dataBundle, "pathfinderChroniclerSettings", "pfcconfig")
			} catch (e) {
				MessageBox.error(
					"The export of the data was not successful.\n" + e.message
				);
			}
		}
	});
});