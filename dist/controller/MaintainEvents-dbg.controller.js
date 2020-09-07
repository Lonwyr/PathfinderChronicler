
sap.ui.define([
	"./BaseController",
	"sap/ui/core/Fragment"
], function (
	BaseController,
	Fragment
) {
	"use strict";

	function openDialog(id, fragmentName, bindingContextPath) {
		if (!this.byId(id)) {
			const view = this.getView()
			// load asynchronous XML fragment
			return Fragment.load({
				id: view.getId(id),
				name: "com.lonwyr.PathfinderChronicler.fragments." + fragmentName,
				controller: this
			}).then(dialog => {
				view.addDependent(dialog)
				if (bindingContextPath) {
					dialog.getCustomData()[0].setKey(bindingContextPath)
				}
				dialog.open()
				return dialog
			})
		}

		if (bindingContextPath) {
			this.byId(id).getCustomData()[0].setKey(bindingContextPath)
		}
		this.byId(id).open()
		return Promise.resolve(this.byId(id))
	}

	function deleteEntry(model, bindingContext) {
		let propertyHierarchy = bindingContext.getPath().split("/")
		propertyHierarchy.shift()
		let data = model.getData()
		propertyHierarchy.forEach((property, index) => {
			if (index === propertyHierarchy.length - 1) {
				data.splice(Number.parseInt(property), 1)
			} else {
				data = data[property]
			}
		})
		model.updateBindings(true)
	}

	return BaseController.extend("com.lonwyr.PathfinderChronicler.controller.MaintainEvents", {
		onInit: function () {
		},

		openAddEvent: function () {
			openDialog.call(this, "addEvent", "AddEvent")
		},

		addEvent: function () {
			const dataModel = this.getModel("data")
			var data = dataModel.getData()
			data.events.push({
				name: this.byId("addEvent_name").getValue(),
				id: this.byId("addEvent_id").getValue()
			})
			dataModel.setData(data)
			dataModel.updateBindings(true)
			this.closeAddEvent()
		},

		closeAddEvent: function () {
			this.byId("addEvent").close()
		},

		editEvent: function (event) {
			const dataBindingContext = event.getSource().getBindingContext("data")
			openDialog.call(this, "editEvent", "EditEvent").then(dialog => {
				dialog.setBindingContext(dataBindingContext, "data")
			})
		},

		closeEditEvent: function () {
			this.byId("editEvent").close()
		},

		deleteEvent: function (event) {
			const bindingContext = event.getSource().getBindingContext("data")
			const dataModel = this.getModel("data")
			deleteEntry(dataModel, bindingContext)
			this.closeEditEvent()
		},

		openAddPlayer: function () {
			openDialog.call(this, "addPlayer", "AddPlayer")
		},

		addPlayer: function (event) {
			const dataModel = this.getModel("data")
			var data = dataModel.getData()
			data.players.push({
				name: this.byId("addPlayer_name").getValue(),
				id: this.byId("addPlayer_id").getValue(),
				characters: []
			})
			dataModel.setData(data)
			dataModel.updateBindings(true)
			this.closeAddPlayer()
		},

		closeAddPlayer: function () {
			this.byId("addPlayer").close()
		},

		editPlayer: function (event) {
			const dataBindingContext = event.getSource().getBindingContext("data")
			openDialog.call(this, "editPlayer", "EditPlayer").then(dialog => {
				dialog.setBindingContext(dataBindingContext, "data")
			})
		},

		closeEditPlayer: function () {
			this.byId("editPlayer").close()
		},

		deletePlayer: function (event) {
			const bindingContext = event.getSource().getBindingContext("data")
			const dataModel = this.getModel("data")
			deleteEntry(dataModel, bindingContext)
			this.closeEditPlayer()
		},

		openAddCharacter: function (event) {
			const bindingContextPath = event.getSource().getBindingContext("data").getPath()
			openDialog.call(this, "addCharacter", "AddCharacter", bindingContextPath).then(() => {
				this.byId("addCharacter_level").setValue("")
				this.byId("addCharacter_name").setValue("")
				this.byId("addCharacter_id").setValue("")
			})
		},

		closeAddCharacter: function () {
			this.byId("addCharacter").close()
		},

		addCharacter: function () {
			const bindingContextPath = this.byId("addCharacter").getCustomData()[0].getKey()
			const level = Number.parseInt(this.byId("addCharacter_level").getValue())
			const character = {
				name: this.byId("addCharacter_name").getValue(),
				id: this.byId("addCharacter_id").getValue(),
				level: Number.isInteger(level) ? level : undefined

			}

			const dataModel = this.getModel("data")
			dataModel.getProperty(bindingContextPath).characters.push(character)
			dataModel.updateBindings(true)
			this.closeAddCharacter()
		},

		editCharacter: function (event) {
			const dataBindingContext = event.getSource().getBindingContext("data")
			openDialog.call(this, "editCharacter", "EditCharacter").then(dialog => {
				dialog.setBindingContext(dataBindingContext, "data")
			})
		},

		closeEditCharacter: function () {
			this.byId("editCharacter").close()
		},

		deleteCharacter: function (event) {
			const bindingContext = event.getSource().getBindingContext("data")
			const dataModel = this.getModel("data")
			deleteEntry(dataModel, bindingContext)
			this.closeEditCharacter()
		}
	});
});