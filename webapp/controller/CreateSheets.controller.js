
sap.ui.define([
	"./BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/core/ListItem",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (
	BaseController,
	Fragment,
	ListItem,
	Filter,
	FilterOperator
) {
	"use strict"

	function findById(array, id) {
		return array.find(item => {
			return item.id === id
		})
	}

	function drawCenteredText(helveticaFont, page, textProperties) {
		const textWidth = helveticaFont.widthOfTextAtSize(textProperties.text, textProperties.size)

		page.drawText(textProperties.text, {
			size: textProperties.size,
			x: textProperties.x - textWidth / 2,
			y: textProperties.y
		})
	}

	function drawRightAlignedText(helveticaFont, page, textProperties) {
		const textWidth = helveticaFont.widthOfTextAtSize(textProperties.text, textProperties.size)

		page.drawText(textProperties.text, {
			size: textProperties.size,
			x: textProperties.x - textWidth,
			y: textProperties.y
		})
	}

	function addHeaderTexts(helveticaFont, page, player, type, characterData) {
		const headerY = 666

		if (player) {
			drawCenteredText(
				helveticaFont,
				page,
				{
					text: type === "player" ? player.name : player.name + "(GM)",
					size: 10,
					x: 95,
					y: headerY
				}
			)
			drawRightAlignedText(
				helveticaFont,
				page,
				{
					text: player.id,
					size: 12,
					x: 341.5,
					y: headerY
				}
			)
		}

		if (characterData) {
			drawCenteredText(
				helveticaFont,
				page,
				{
					text: characterData.name,
					size: 10,
					x: 220,
					y: headerY
				}
			)
			page.drawText(characterData.id.substring(1), {
				size: 12,
				x: 363,
				y: headerY
			})
		}
	}

	function addFactionReputationTexts(page) {

	}

	function addRewardTexts(helveticaFont, page, xp, bundleValues, level, treasureBundles, fame) {
		const rewardSectionX = 525

		if (xp) {
			drawCenteredText(
				helveticaFont,
				page,
				{
					text: xp.toString(),
					size: 12,
					x: rewardSectionX,
					y: 460
				}
			)
		}

		if (level && treasureBundles) {
			const gp = bundleValues[level-1] * treasureBundles

			drawCenteredText(
				helveticaFont,
				page,
				{
					text: gp.toString(),
					size: 12,
					x: rewardSectionX,
					y: 350
				}
			)
		}

		if (fame) {
			drawCenteredText(
				helveticaFont,
				page,
				{
					text: fame.toString(),
					size: 12,
					x: rewardSectionX,
					y: 130
				}
			)
		}
	}

	function addGmTexts(helveticaFont, page, event, date, gm) {
		const gmSectionY = 55

		if (event) {
			drawCenteredText(
				helveticaFont,
				page,
				{
					text: event.name,
					size: 10,
					x: 100,
					y: gmSectionY
				}
			)

			drawCenteredText(
				helveticaFont,
				page,
				{
					text: event.id,
					size: 12,
					x: 190,
					y: gmSectionY
				}
			)
		}

		if (date) {
			drawCenteredText(
				helveticaFont,
				page,
				{
					text: date,
					size: 12,
					x: 270,
					y: gmSectionY
					}
				)
		}
		if (gm) {
			drawCenteredText(
				helveticaFont,
				page,
				{
					text: gm.id,
					size: 12,
					x: 520,
					y: gmSectionY
				}
			)
		}
	}

	async function createChronicleForCharacter(PDFDocument, sFileContent, StandardFonts, data, player, printOptions, treasures, event, gm) {
		const pdfDoc = await PDFDocument.load(sFileContent, {ignoreEncryption: true})
		// Embed the Helvetica font
		const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

		// Get the first page of the document
		const pages = pdfDoc.getPages()
		const page = pages[0]

		const playerData = findById(data.players, player.playerId)
		const characterData = playerData && findById(playerData.characters, player.characterId)

		addHeaderTexts(
			helveticaFont,
			page,
			playerData,
			player.type,
			characterData
		)
		addFactionReputationTexts(
			helveticaFont,
			page
		)
		addRewardTexts(
			helveticaFont,
			page,
			printOptions.xp,
			treasures.bundleValues,
			characterData && characterData.level,
			printOptions.treasureBundles,
			printOptions.fame
		)
		addGmTexts(
			helveticaFont,
			page,
			event,
			printOptions.date,
			gm
		)

		// Serialize the PDFDocument to bytes (a Uint8Array)
		const pdfBytes = await pdfDoc.save()

		// Trigger the browser to download the PDF document
		download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf")
	}

	return BaseController.extend("com.lonwyr.PathfinderChronicler.controller.CreateSheets", {
		formatPlayerTitle: (option, players) => {
			return findById(players, option.playerId).name
		},

		formatPlayerId: function (option, players) {
			return findById(players, option.playerId).id
		},

		formatCharacterButtonText: function (option, players) {
			if (!option.characterId) {
				return this.getResourceBundle().getText("noCharacterSelected")
			}

			const player = findById(players, option.playerId)
			const character = findById(player.characters, option.characterId)
			return character.name + " (" + character.id + ")"
		},

		addPlayerToSession: function () {
			if (!this.byId("addPlayer")) {
				const view = this.getView()
				// load asynchronous XML fragment
				Fragment.load({
					id: view.getId(),
					name: "com.lonwyr.PathfinderChronicler.fragments.AddPlayerToSession",
					controller: this
				}).then( dialog => {
					view.addDependent(dialog)
					dialog.open()
				})
			} else {
				this.byId("addPlayer").getBinding("items").filter([]);
				this.byId("addPlayer").open()
			}
		},

		formatAddPlayerVisibility: function (playerId, players) {
			return players.every(player => {return player.playerId !== playerId})
		},

		search: function (event) {
			const value = event.getParameter("value")
			const nameFilter = new Filter("name", FilterOperator.Contains, value)
			const idFilter = new Filter("id", FilterOperator.Contains, value)
			const combinedFilter = new Filter({
				filters: [nameFilter, idFilter],
				and: false
			})
			const binding = event.getParameter("itemsBinding")
			binding.filter([combinedFilter])
		},

		addPlayer: function (event) {
			const bindingContext = event.getParameter("selectedItem").getBindingContext("data")
			const bindingPath = bindingContext.getPath()
			const playerId = bindingContext.getModel().getProperty(bindingPath).id
			let players = this.getModel("printOptions").getProperty("/players")
			players.push({
				playerId: playerId,
				characterId: undefined,
				type: "player"
			})
			this.getModel("printOptions").setProperty("/players", players)
		},

		deleteCharacterFromSession: function (event) {
			const list = event.getSource()
			const item = event.getParameter("listItem")
			const path = item.getBindingContext("printOptions").getPath()
			const characterIndex = Number.parseInt(path.substring("/players/".length))

			list.attachEventOnce("updateFinished", list.focus, list)

			let model = this.getModel("printOptions")

			let players = model.getProperty("/players")
			players.splice(characterIndex, 1)
			model.setProperty("/players", players)
		},

		changeCharacter: async function (event) {
			const bindingContext = event.getSource().getBindingContext("printOptions")
			const bindingPath = bindingContext.getPath()
			const playerId = bindingContext.getModel().getProperty(bindingPath).playerId
			// find correct player
			const dataModel = this.getModel("data")
			const dataModelPlayerIndex = dataModel.getProperty("/players").findIndex(p => {return p.id === playerId})
			const dataBindingContext = dataModel.createBindingContext("/players/" + dataModelPlayerIndex)

			let dialog = this.byId("selectCharacter")
			if (!dialog) {
				const view = this.getView()
				dialog = await Fragment.load({
					id: view.getId(),
					name: "com.lonwyr.PathfinderChronicler.fragments.SelectCharacterForSession",
					controller: this
				})
				view.addDependent(dialog)
			}

			dialog.getBinding("items").filter([])
			dialog.setBindingContext(dataBindingContext, "data")
			dialog.getCustomData()[0].setValue(bindingPath)
			dialog.open()
		},

		selectCharacter: function (event) {
			const bindingContext = event.getParameter("selectedItem").getBindingContext("data")
			const bindingPath = bindingContext.getPath()
			const characterId = bindingContext.getModel().getProperty(bindingPath).id
			const printOptionsBindingPath = event.getSource().getCustomData()[0].getValue()
			this.getModel("printOptions").setProperty(printOptionsBindingPath + "/characterId", characterId)
			this.getModel("printOptions").updateBindings(true)
		},

		createSheets: function(oEvent) {
			var file = oEvent.getParameter("files") && oEvent.getParameter("files")[0]

			const printOptions = this.getModel("printOptions").getData()
			const data = this.getModel("data").getData()
			const treasures = this.getModel("treasures").getData()

			const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib

			const gmPlayer = printOptions.players.find(player => {return player.type === "gm"})
			const gm = gmPlayer && findById(data.players, gmPlayer.playerId)

			const eventKey = this.byId("eventSelect").getSelectedKey()
			const event = findById(data.events, eventKey)

			if (file && window.FileReader) {
				var oReader = new FileReader();
				oReader.onload = async function (evn) {
					var sFileContent = evn.target.result

					printOptions.players.map(async (player) => {
						// Load a PDFDocument from the existing PDF bytes
						createChronicleForCharacter(PDFDocument, sFileContent, StandardFonts, data, player, printOptions, treasures, event, gm);
					})
					if (printOptions.additionalSheet) {
						createChronicleForCharacter(PDFDocument, sFileContent, StandardFonts, data, {type: "player"}, printOptions, treasures, event, gm);
					}

				}
				oReader.readAsArrayBuffer(file)
			}
		}
	});
});