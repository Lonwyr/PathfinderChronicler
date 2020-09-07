//@ui5-bundle com/lonwyr/PathfinderChronicler/Component-preload.js
sap.ui.require.preload({
	"com/lonwyr/PathfinderChronicler/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/core/ComponentSupport"],function(t){"use strict";return t.extend("com.lonwyr.PathfinderChronicler.Component",{metadata:{manifest:"json"},init:function(){t.prototype.init.apply(this,arguments);this.getRouter().initialize()}})});
},
	"com/lonwyr/PathfinderChronicler/controller/App.controller.js":function(){sap.ui.define(["./BaseController"],function(t){"use strict";return t.extend("com.lonwyr.PathfinderChronicler.controller.App",{onInit:function(){this.getRouter().attachRouteMatched(this._onRouteMatched.bind(this))},_onRouteMatched:function(t){const e=t.getParameter("name");this.getModel("navigation").setData(e)}})});
},
	"com/lonwyr/PathfinderChronicler/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/util/File","sap/m/MessageBox"],function(e,t,n){"use strict";return e.extend("com.lonwyr.PathfinderChronicler.controller.BaseController",{getRouter:function(){return this.getOwnerComponent().getRouter()},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},getModel:function(e){return this.getView().getModel(e)},navigate:function(e){this.getRouter().navTo(e.getSource().getSelectedKey())},loadConfig:function(e){try{var t=e.getParameter("files")&&e.getParameter("files")[0];if(t&&window.FileReader){var o=new FileReader;o.onload=function(e){var t=e.target.result;var n=JSON.parse(t);this.getModel("data").setData(n.data);this.getModel("printOptions").setData(n.printOptions)}.bind(this);o.readAsText(t)}}catch(e){n.error("The loading of the data was not successful.\n"+e.message)}},downloadConfig:function(){try{const e=this.getModel("data").getData();const n=this.getModel("printOptions").getData();const o=JSON.stringify({data:e,printOptions:n});t.save(o,"pathfinderChroniclerSettings","pfcconfig")}catch(e){n.error("The export of the data was not successful.\n"+e.message)}}})});
},
	"com/lonwyr/PathfinderChronicler/controller/CreateSheets.controller.js":function(){sap.ui.define(["./BaseController","sap/ui/core/Fragment","sap/ui/core/ListItem","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(e,t,n,a,i){"use strict";function r(e,t){return e.find(e=>e.id===t)}function s(e,t,n){const a=e.widthOfTextAtSize(n.text,n.size);t.drawText(n.text,{size:n.size,x:n.x-a/2,y:n.y})}function o(e,t,n){const a=e.widthOfTextAtSize(n.text,n.size);t.drawText(n.text,{size:n.size,x:n.x-a,y:n.y})}function d(e,t,n,a,i){const r=666;if(n){s(e,t,{text:a==="player"?n.name:n.name+"(GM)",size:10,x:95,y:r});o(e,t,{text:n.id,size:12,x:341.5,y:r})}if(i){s(e,t,{text:i.name,size:10,x:220,y:r});t.drawText(i.id.substring(1),{size:12,x:363,y:r})}}function c(e){}function l(e,t,n,a,i,r,o){const d=525;if(n){s(e,t,{text:n.toString(),size:12,x:d,y:460})}if(i&&r){const n=a[i-1]*r;s(e,t,{text:n.toString(),size:12,x:d,y:350})}if(o){s(e,t,{text:o.toString(),size:12,x:d,y:130})}}function g(e,t,n,a,i){const r=55;if(n){s(e,t,{text:n.name,size:10,x:100,y:r});s(e,t,{text:n.id,size:12,x:190,y:r})}if(a){s(e,t,{text:a,size:12,x:270,y:r})}if(i){s(e,t,{text:i.id,size:12,x:520,y:r})}}async function p(e,t,n,a,i,s,o,p,y){const f=await e.load(t,{ignoreEncryption:true});const u=await f.embedFont(n.Helvetica);const h=f.getPages();const m=h[0];const x=r(a.players,i.playerId);const P=x&&r(x.characters,i.characterId);d(u,m,x,i.type,P);c(u,m);l(u,m,s.xp,o.bundleValues,P&&P.level,s.treasureBundles,s.fame);g(u,m,p,s.date,y);const I=await f.save();download(I,"pdf-lib_modification_example.pdf","application/pdf")}return e.extend("com.lonwyr.PathfinderChronicler.controller.CreateSheets",{formatPlayerTitle:(e,t)=>r(t,e.playerId).name,formatPlayerId:function(e,t){return r(t,e.playerId).id},formatCharacterButtonText:function(e,t){if(!e.characterId){return this.getResourceBundle().getText("noCharacterSelected")}const n=r(t,e.playerId);const a=r(n.characters,e.characterId);return a.name+" ("+a.id+")"},addPlayerToSession:function(){if(!this.byId("addPlayer")){const e=this.getView();t.load({id:e.getId(),name:"com.lonwyr.PathfinderChronicler.fragments.AddPlayerToSession",controller:this}).then(t=>{e.addDependent(t);t.open()})}else{this.byId("addPlayer").getBinding("items").filter([]);this.byId("addPlayer").open()}},formatAddPlayerVisibility:function(e,t){return t.every(t=>t.playerId!==e)},search:function(e){const t=e.getParameter("value");const n=new a("name",i.Contains,t);const r=new a("id",i.Contains,t);const s=new a({filters:[n,r],and:false});const o=e.getParameter("itemsBinding");o.filter([s])},addPlayer:function(e){const t=e.getParameter("selectedItem").getBindingContext("data");const n=t.getPath();const a=t.getModel().getProperty(n).id;let i=this.getModel("printOptions").getProperty("/players");i.push({playerId:a,characterId:undefined,type:"player"});this.getModel("printOptions").setProperty("/players",i)},deleteCharacterFromSession:function(e){const t=e.getSource();const n=e.getParameter("listItem");const a=n.getBindingContext("printOptions").getPath();const i=Number.parseInt(a.substring("/players/".length));t.attachEventOnce("updateFinished",t.focus,t);let r=this.getModel("printOptions");let s=r.getProperty("/players");s.splice(i,1);r.setProperty("/players",s)},changeCharacter:async function(e){const n=e.getSource().getBindingContext("printOptions");const a=n.getPath();const i=n.getModel().getProperty(a).playerId;const r=this.getModel("data");const s=r.getProperty("/players").findIndex(e=>e.id===i);const o=r.createBindingContext("/players/"+s);let d=this.byId("selectCharacter");if(!d){const e=this.getView();d=await t.load({id:e.getId(),name:"com.lonwyr.PathfinderChronicler.fragments.SelectCharacterForSession",controller:this});e.addDependent(d)}d.getBinding("items").filter([]);d.setBindingContext(o,"data");d.getCustomData()[0].setValue(a);d.open()},selectCharacter:function(e){const t=e.getParameter("selectedItem").getBindingContext("data");const n=t.getPath();const a=t.getModel().getProperty(n).id;const i=e.getSource().getCustomData()[0].getValue();this.getModel("printOptions").setProperty(i+"/characterId",a);this.getModel("printOptions").updateBindings(true)},createSheets:function(e){var t=e.getParameter("files")&&e.getParameter("files")[0];const n=this.getModel("printOptions").getData();const a=this.getModel("data").getData();const i=this.getModel("treasures").getData();const{degrees:s,PDFDocument:o,rgb:d,StandardFonts:c}=PDFLib;const l=n.players.find(e=>e.type==="gm");const g=l&&r(a.players,l.playerId);const y=this.byId("eventSelect").getSelectedKey();const f=r(a.events,y);if(t&&window.FileReader){var u=new FileReader;u.onload=async function(e){var t=e.target.result;n.players.map(async e=>{p(o,t,c,a,e,n,i,f,g)});if(n.additionalSheet){p(o,t,c,a,{type:"player"},n,i,f,g)}};u.readAsArrayBuffer(t)}}})});
},
	"com/lonwyr/PathfinderChronicler/controller/MaintainEvents.controller.js":function(){sap.ui.define(["./BaseController","sap/ui/core/Fragment"],function(t,e){"use strict";function a(t,a,d){if(!this.byId(t)){const n=this.getView();return e.load({id:n.getId(t),name:"com.lonwyr.PathfinderChronicler.fragments."+a,controller:this}).then(t=>{n.addDependent(t);if(d){t.getCustomData()[0].setKey(d)}t.open();return t})}if(d){this.byId(t).getCustomData()[0].setKey(d)}this.byId(t).open();return Promise.resolve(this.byId(t))}function d(t,e){let a=e.getPath().split("/");a.shift();let d=t.getData();a.forEach((t,e)=>{if(e===a.length-1){d.splice(Number.parseInt(t),1)}else{d=d[t]}});t.updateBindings(true)}return t.extend("com.lonwyr.PathfinderChronicler.controller.MaintainEvents",{onInit:function(){},openAddEvent:function(){a.call(this,"addEvent","AddEvent")},addEvent:function(){const t=this.getModel("data");var e=t.getData();e.events.push({name:this.byId("addEvent_name").getValue(),id:this.byId("addEvent_id").getValue()});t.setData(e);t.updateBindings(true);this.closeAddEvent()},closeAddEvent:function(){this.byId("addEvent").close()},editEvent:function(t){const e=t.getSource().getBindingContext("data");a.call(this,"editEvent","EditEvent").then(t=>{t.setBindingContext(e,"data")})},closeEditEvent:function(){this.byId("editEvent").close()},deleteEvent:function(t){const e=t.getSource().getBindingContext("data");const a=this.getModel("data");d(a,e);this.closeEditEvent()},openAddPlayer:function(){a.call(this,"addPlayer","AddPlayer")},addPlayer:function(t){const e=this.getModel("data");var a=e.getData();a.players.push({name:this.byId("addPlayer_name").getValue(),id:this.byId("addPlayer_id").getValue(),characters:[]});e.setData(a);e.updateBindings(true);this.closeAddPlayer()},closeAddPlayer:function(){this.byId("addPlayer").close()},editPlayer:function(t){const e=t.getSource().getBindingContext("data");a.call(this,"editPlayer","EditPlayer").then(t=>{t.setBindingContext(e,"data")})},closeEditPlayer:function(){this.byId("editPlayer").close()},deletePlayer:function(t){const e=t.getSource().getBindingContext("data");const a=this.getModel("data");d(a,e);this.closeEditPlayer()},openAddCharacter:function(t){const e=t.getSource().getBindingContext("data").getPath();a.call(this,"addCharacter","AddCharacter",e).then(()=>{this.byId("addCharacter_level").setValue("");this.byId("addCharacter_name").setValue("");this.byId("addCharacter_id").setValue("")})},closeAddCharacter:function(){this.byId("addCharacter").close()},addCharacter:function(){const t=this.byId("addCharacter").getCustomData()[0].getKey();const e=Number.parseInt(this.byId("addCharacter_level").getValue());const a={name:this.byId("addCharacter_name").getValue(),id:this.byId("addCharacter_id").getValue(),level:Number.isInteger(e)?e:undefined};const d=this.getModel("data");d.getProperty(t).characters.push(a);d.updateBindings(true);this.closeAddCharacter()},editCharacter:function(t){const e=t.getSource().getBindingContext("data");a.call(this,"editCharacter","EditCharacter").then(t=>{t.setBindingContext(e,"data")})},closeEditCharacter:function(){this.byId("editCharacter").close()},deleteCharacter:function(t){const e=t.getSource().getBindingContext("data");const a=this.getModel("data");d(a,e);this.closeEditCharacter()}})});
},
	"com/lonwyr/PathfinderChronicler/controller/MaintainPlayers.controller.js":function(){sap.ui.define(["./BaseController","sap/ui/core/Fragment"],function(t,e){"use strict";function a(t,a,d){if(!this.byId(t)){const n=this.getView();return e.load({id:n.getId(t),name:"com.lonwyr.PathfinderChronicler.fragments."+a,controller:this}).then(t=>{n.addDependent(t);if(d){t.getCustomData()[0].setKey(d)}t.open();return t})}if(d){this.byId(t).getCustomData()[0].setKey(d)}this.byId(t).open();return Promise.resolve(this.byId(t))}function d(t,e){let a=e.getPath().split("/");a.shift();let d=t.getData();a.forEach((t,e)=>{if(e===a.length-1){d.splice(Number.parseInt(t),1)}else{d=d[t]}});t.updateBindings(true)}return t.extend("com.lonwyr.PathfinderChronicler.controller.MaintainPlayers",{onInit:function(){},openAddEvent:function(){a.call(this,"addEvent","AddEvent")},addEvent:function(){const t=this.getModel("data");var e=t.getData();e.events.push({name:this.byId("addEvent_name").getValue(),id:this.byId("addEvent_id").getValue()});t.setData(e);t.updateBindings(true);this.closeAddEvent()},closeAddEvent:function(){this.byId("addEvent").close()},editEvent:function(t){const e=t.getSource().getBindingContext("data");a.call(this,"editEvent","EditEvent").then(t=>{t.setBindingContext(e,"data")})},closeEditEvent:function(){this.byId("editEvent").close()},deleteEvent:function(t){const e=t.getSource().getBindingContext("data");const a=this.getModel("data");d(a,e);this.closeEditEvent()},openAddPlayer:function(){a.call(this,"addPlayer","AddPlayer")},addPlayer:function(t){const e=this.getModel("data");var a=e.getData();a.players.push({name:this.byId("addPlayer_name").getValue(),id:this.byId("addPlayer_id").getValue(),characters:[]});e.setData(a);e.updateBindings(true);this.closeAddPlayer()},closeAddPlayer:function(){this.byId("addPlayer").close()},editPlayer:function(t){const e=t.getSource().getBindingContext("data");a.call(this,"editPlayer","EditPlayer").then(t=>{t.setBindingContext(e,"data")})},closeEditPlayer:function(){this.byId("editPlayer").close()},deletePlayer:function(t){const e=t.getSource().getBindingContext("data");const a=this.getModel("data");d(a,e);this.closeEditPlayer()},openAddCharacter:function(t){const e=t.getSource().getBindingContext("data").getPath();a.call(this,"addCharacter","AddCharacter",e).then(()=>{this.byId("addCharacter_level").setValue("");this.byId("addCharacter_name").setValue("");this.byId("addCharacter_id").setValue("")})},closeAddCharacter:function(){this.byId("addCharacter").close()},addCharacter:function(){const t=this.byId("addCharacter").getCustomData()[0].getKey();const e=Number.parseInt(this.byId("addCharacter_level").getValue());const a={name:this.byId("addCharacter_name").getValue(),id:this.byId("addCharacter_id").getValue(),level:Number.isInteger(e)?e:undefined};const d=this.getModel("data");d.getProperty(t).characters.push(a);d.updateBindings(true);this.closeAddCharacter()},editCharacter:function(t){const e=t.getSource().getBindingContext("data");a.call(this,"editCharacter","EditCharacter").then(t=>{t.setBindingContext(e,"data")})},closeEditCharacter:function(){this.byId("editCharacter").close()},deleteCharacter:function(t){const e=t.getSource().getBindingContext("data");const a=this.getModel("data");d(a,e);this.closeEditCharacter()}})});
},
	"com/lonwyr/PathfinderChronicler/controller/Welcome.controller.js":function(){sap.ui.define(["./BaseController"],function(n){"use strict";return n.extend("com.lonwyr.PathfinderChronicler.controller.Welcome",{onInit:async function(){}})});
},
	"com/lonwyr/PathfinderChronicler/data/data.json":'{"events":[],"players":[]}',
	"com/lonwyr/PathfinderChronicler/data/dataX.json":'{"events":[{"id":"123","name":"123 Event"},{"id":"456","name":"456 Event"},{"id":"2700781","name":"TTS remote"}],"players":[{"id":"115458","name":"Christian","characters":[{"id":"2001","name":"The Dude","level":2,"faction":"GA"}]},{"id":"134143","name":"Lisa","characters":[{"id":"2001","name":"The Lady","level":2,"faction":"HH"}]}]}',
	"com/lonwyr/PathfinderChronicler/data/printOptions.json":'{"additionalSheet":false,"date":"","treasureBundles":10,"fame":4,"reputation":2,"xp":4,"players":[]}',
	"com/lonwyr/PathfinderChronicler/data/printOptionsX.json":'{"additionalSheet":false,"date":"9/1/2020","treasureBundles":10,"fame":4,"reputation":2,"xp":4,"players":[{"playerId":"115458","characterId":"2001","type":"gm"},{"playerId":"134143","characterId":"2001","type":"player"}]}',
	"com/lonwyr/PathfinderChronicler/data/treasures.json":'{"bundleValues":[1.4,2.2,3.8,6.4,10,15,22,30,44,60,86,124,188,274,408,620,960,1560,2660,3680],"bundlesPerQuest":2.5}',
	"com/lonwyr/PathfinderChronicler/fragments/AddCharacter.fragment.xml":'<core:FragmentDefinition\r\n        xmlns="sap.m"\r\n        xmlns:f="sap.ui.layout.form"\r\n        xmlns:core="sap.ui.core" ><Dialog\r\n            id="addCharacter"\r\n            title="{i18n>addCharacter}" ><f:SimpleForm><f:content><Label text="{i18n>name}" /><Input id="addCharacter_name" /><Label text="{i18n>id}" /><Input id="addCharacter_id" /><Label text="{i18n>level}" /><Slider id="addCharacter_level"\r\n                        min="1"\r\n                        max="20"\r\n                        inputsAsTooltips="true"\r\n                        enableTickmarks="true"\r\n                        class="sapUiSmallMarginBottom" /></f:content></f:SimpleForm><beginButton><Button type="Emphasized" text="{i18n>ok}" press=".addCharacter" /></beginButton><endButton><Button text="{i18n>cancel}" press=".closeAddCharacter" /></endButton><customData><core:CustomData key="bindingContextPath" /></customData></Dialog></core:FragmentDefinition>',
	"com/lonwyr/PathfinderChronicler/fragments/AddEvent.fragment.xml":'<core:FragmentDefinition\r\n        xmlns="sap.m"\r\n        xmlns:f="sap.ui.layout.form"\r\n        xmlns:core="sap.ui.core" ><Dialog\r\n            id="addEvent"\r\n            title="{i18n>addEvent}" ><f:SimpleForm><f:content><Label text="{i18n>name}" /><Input id="addEvent_name" /><Label text="{i18n>id}" /><Input id="addEvent_id" /></f:content></f:SimpleForm><beginButton><Button type="Emphasized" text="{i18n>ok}" press=".addEvent" /></beginButton><endButton><Button text="{i18n>cancel}" press=".closeAddEvent" /></endButton></Dialog></core:FragmentDefinition>',
	"com/lonwyr/PathfinderChronicler/fragments/AddPlayer.fragment.xml":'<core:FragmentDefinition\r\n        xmlns="sap.m"\r\n        xmlns:f="sap.ui.layout.form"\r\n        xmlns:core="sap.ui.core" ><Dialog\r\n            id="addPlayer"\r\n            title="{i18n>addPlayer}" ><f:SimpleForm><f:content><Label text="{i18n>name}" /><Input id="addPlayer_name" /><Label text="{i18n>id}" /><Input id="addPlayer_id" /></f:content></f:SimpleForm><beginButton><Button type="Emphasized" text="{i18n>ok}" press=".addPlayer" /></beginButton><endButton><Button text="{i18n>cancel}" press=".closeAddPlayer" /></endButton></Dialog></core:FragmentDefinition>',
	"com/lonwyr/PathfinderChronicler/fragments/AddPlayerToSession.fragment.xml":'<core:FragmentDefinition\r\n        xmlns="sap.m"\r\n        xmlns:core="sap.ui.core" ><SelectDialog\r\n            id="addPlayer"\r\n            title="{i18n>addPlayer}"\r\n            search=".search"\r\n            confirm=".addPlayer"\r\n            items="{data>/players}"><StandardListItem\r\n                title="{data>name}"\r\n                description="{data>id}"\r\n                visible="{\r\n                parts: [{path: \'data>id\'}, {path: \'printOptions>/players\'}],\r\n                formatter: \'.formatAddPlayerVisibility\'}"\r\n                type="Active" /></SelectDialog></core:FragmentDefinition>',
	"com/lonwyr/PathfinderChronicler/fragments/EditCharacter.fragment.xml":'<core:FragmentDefinition\r\n        xmlns="sap.m"\r\n        xmlns:f="sap.ui.layout.form"\r\n        xmlns:core="sap.ui.core" ><Dialog\r\n            id="editCharacter"\r\n            title="{i18n>editCharacter}" ><f:SimpleForm><f:content><Label text="{i18n>name}" /><Input value="{data>name}" /><Label text="{i18n>id}" /><Input value="{data>id}" /><Label text="{i18n>level}" /><Slider\r\n                        value="{data>level}"\r\n                        min="1"\r\n                        max="20"\r\n                        inputsAsTooltips="true"\r\n                        enableTickmarks="true"\r\n                        class="sapUiSmallMarginBottom" /></f:content></f:SimpleForm><beginButton><Button type="Emphasized" text="{i18n>ok}" press=".closeEditCharacter" /></beginButton><endButton><Button type="Reject" icon="sap-icon://delete" press=".deleteCharacter" /></endButton></Dialog></core:FragmentDefinition>',
	"com/lonwyr/PathfinderChronicler/fragments/EditEvent.fragment.xml":'<core:FragmentDefinition\r\n        xmlns="sap.m"\r\n        xmlns:f="sap.ui.layout.form"\r\n        xmlns:core="sap.ui.core" ><Dialog\r\n            id="editEvent"\r\n            title="{i18n>editEvent}" ><f:SimpleForm><f:content><Label text="{i18n>name}" /><Input value="{data>name}" /><Label text="{i18n>id}" /><Input value="{data>id}" /></f:content></f:SimpleForm><beginButton><Button type="Emphasized" text="{i18n>ok}" press=".closeEditEvent" /></beginButton><endButton><Button type="Reject" icon="sap-icon://delete" press=".deleteEvent" /></endButton></Dialog></core:FragmentDefinition>',
	"com/lonwyr/PathfinderChronicler/fragments/EditPlayer.fragment.xml":'<core:FragmentDefinition\r\n        xmlns="sap.m"\r\n        xmlns:f="sap.ui.layout.form"\r\n        xmlns:core="sap.ui.core" ><Dialog\r\n            id="editPlayer"\r\n            title="{i18n>editPlayer}" ><f:SimpleForm><f:content><Label text="{i18n>name}" /><Input value="{data>name}" /><Label text="{i18n>id}" /><Input value="{data>id}" /></f:content></f:SimpleForm><beginButton><Button type="Emphasized" text="{i18n>ok}" press=".closeEditPlayer" /></beginButton><endButton><Button type="Reject" icon="sap-icon://delete" press=".deletePlayer" /></endButton></Dialog></core:FragmentDefinition>',
	"com/lonwyr/PathfinderChronicler/fragments/NavigationFooter.fragment.xml":'<core:FragmentDefinition\r\n        xmlns="sap.m"\r\n        xmlns:unified="sap.ui.unified"\r\n        xmlns:core="sap.ui.core" ><OverflowToolbar><Button\r\n                type="Reject"\r\n                icon="sap-icon://travel-request"\r\n                text="issues"\r\n                press="window.open(\'https://github.com/Lonwyr/PathfinderChronicler/issues\')" /><ToolbarSpacer/><SegmentedButton selectedKey="{navigation>/}" selectionChange=".navigate" ><items><SegmentedButtonItem text="{i18n>info}" key="welcome" /><SegmentedButtonItem text="{i18n>maintainEvents}" key="maintainEvents" /><SegmentedButtonItem text="{i18n>maintainPlayers}" key="maintainPlayers" /><SegmentedButtonItem text="{i18n>createSheets}" key="createSheets" /></items></SegmentedButton><ToolbarSpacer/><unified:FileUploader\r\n                uploadUrl = ""\r\n                buttonText = "{i18n>loadConfiguration}"\r\n                fileType = "pfcconfig"\r\n                buttonOnly = "true"\r\n                icon = "sap-icon://upload"\r\n                change = ".loadConfig" /><Button icon="sap-icon://save" text="{i18n>saveConfiguration}" press="downloadConfig" /></OverflowToolbar></core:FragmentDefinition>',
	"com/lonwyr/PathfinderChronicler/fragments/SelectCharacterForSession.fragment.xml":'<core:FragmentDefinition\r\n        xmlns="sap.m"\r\n        xmlns:core="sap.ui.core" ><SelectDialog\r\n            id="selectCharacter"\r\n            title="{i18n>selectCharacter}"\r\n            items="{data>characters}"\r\n            search=".search"\r\n            confirm=".selectCharacter"><StandardListItem\r\n                title="{data>name}"\r\n                description="{data>id}"\r\n                type="Active" /><customData><core:CustomData key="printOptionsBindingPath" /></customData></SelectDialog></core:FragmentDefinition>',
	"com/lonwyr/PathfinderChronicler/i18n/i18n.properties":'title=Pathfinder Chronicler\nappTitle=Pathfinder Chronicler\nappDescription=Pathfinder Chronicle Sheet Filling Tool\n\nwelcome=Welcome to the Pathfinder Chronicler.\\nHere you can prefill chronicle sheets by using your events, players and their characters (and have them remembered).\\n\\nNavigate, load and save with the action bar at the bottom.\nprovidePdf=Since Paizo Inc. has the chronicle sheet as part of the scenarios, it is well protected against us, just grabbing them.\\nTo still use them for auto-filling please open the scenario, print the chronicle sheet page in \'A4, Actual Size\' to an pdf (i.e. \'Microsoft Print to PDF\').\nnoDataStored=Absolutely no data will leave your device.\\nThe drawback: you must load & save the events and players on your device.\n\nloadConfiguration=Load Config\nsaveConfiguration=Save Config\nmaintainEvents=Maintain Events\nmaintainPlayers=Maintain Players\nname=Name\nid=ID\nlevel=Level\nok=Ok\ncancel=Cancel\naddEvent=Add Event\neditEvent=Edit Event\naddPlayer=Add Player\neditPlayer=Edit Player\naddCharacter=Add Character\neditCharacter=Edit Character\ncreateNew=Create New\n\ncreateSheets=Create Sheets\neventsTitle=Events\ndata=Data\nevent=Event\nxp=XP\ndate=Date\nfame=Fame\nreputation=Reputation\ntreasureBundles=Treasure Bundles\ncharacters=Characters\ncharacter=Character\ngm=GM\nplayers=Players\nplayer=Player\naddPlayer=Add Player\nnoCharacterSelected=<Select a character>\nselectCharacter=Select Character\nadditionalWithoutPlayerData=Additional sheet without player data\nuploadChronicleTemplateAndCreateSheets=Upload Chronicle Template and Create Sheets',
	"com/lonwyr/PathfinderChronicler/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"com.lonwyr.PathfinderChronicler","type":"application","i18n":{"bundleUrl":"i18n/i18n.properties","supportedLocales":[""],"fallbackLocale":""},"applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","ach":"ach","sourceTemplate":{"id":"html5moduletemplates.basicSAPUI5ApplicationProjectModule","version":"1.40.12"},"dataSources":{"data":{"uri":"data/data.json","type":"JSON"},"printOptions":{"uri":"data/printOptions.json","type":"JSON"},"treasures":{"uri":"data/treasures.json","type":"JSON"}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"com.lonwyr.PathfinderChronicler.view.App","type":"XML","async":true,"id":"App"},"dependencies":{"minUI5Version":"1.65.6","libs":{"sap.ui.core":{},"sap.m":{},"sap.ui.layout":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"com.lonwyr.PathfinderChronicler.i18n.i18n"}},"data":{"type":"sap.ui.model.json.JSONModel","dataSource":"data"},"printOptions":{"type":"sap.ui.model.json.JSONModel","dataSource":"printOptions"},"treasures":{"type":"sap.ui.model.json.JSONModel","dataSource":"treasures"},"navigation":{"type":"sap.ui.model.json.JSONModel"}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"com.lonwyr.PathfinderChronicler.view","controlAggregation":"pages","controlId":"app","bypassed":{"target":"notFound"}},"routes":[{"name":"welcome","pattern":"","target":["welcome"]},{"name":"maintainEvents","pattern":"events","target":["maintainEvents"]},{"name":"maintainPlayers","pattern":"players","target":["maintainPlayers"]},{"name":"createSheets","pattern":"createSheets","target":["createSheets"]}],"targets":{"welcome":{"viewType":"XML","viewId":"welcome","viewName":"Welcome","viewLevel":1},"maintainEvents":{"viewName":"MaintainEvents","viewId":"maintainEvents","viewLevel":2},"maintainPlayers":{"viewName":"MaintainPlayers","viewId":"maintainPlayers","viewLevel":2},"createSheets":{"viewName":"CreateSheets","viewId":"createSheets","viewLevel":4}}}}}',
	"com/lonwyr/PathfinderChronicler/view/App.view.xml":'<mvc:View controllerName="com.lonwyr.PathfinderChronicler.controller.App"\n\t\t  displayBlock="true"\n\t\t  xmlns:mvc="sap.ui.core.mvc"\n\t\t  xmlns="sap.m"><App id="app" /></mvc:View>',
	"com/lonwyr/PathfinderChronicler/view/CreateSheets.view.xml":'<mvc:View xmlns="sap.m"\r\n          xmlns:mvc="sap.ui.core.mvc"\r\n          xmlns:core="sap.ui.core"\r\n          xmlns:unified="sap.ui.unified"\r\n          xmlns:form="sap.ui.layout.form"\r\n          controllerName="com.lonwyr.PathfinderChronicler.controller.CreateSheets" ><Page   id="page"\r\n            floatingFooter="true"\r\n            titleAlignment="Center"\r\n            title="{i18n>createSheets}" ><VBox width="100%" ><form:SimpleForm\r\n                    labelSpanM="12"\r\n                    labelSpanL="12"\r\n                    labelSpanXL="12" ><Title text="{i18n>data}" /><Label text="{i18n>event}" /><Select items="{data>/events}" id="eventSelect" ><core:Item key="{data>id}" text="{data>name}" /></Select><Label text="{i18n>date}" /><DatePicker\r\n                        value="{printOptions>/date}" /><Label text="{i18n>xp}" /><Slider\r\n                        value="{printOptions>/xp}"\r\n                        max="12"\r\n                        inputsAsTooltips="true"\r\n                        enableTickmarks="true"\r\n                        class="sapUiSmallMarginBottom" /><Label text="{i18n>treasureBundles}" /><Slider\r\n                        value="{printOptions>/treasureBundles}"\r\n                        max="10"\r\n                        inputsAsTooltips="true"\r\n                        enableTickmarks="true"\r\n                        class="sapUiSmallMarginBottom" /><Label text="{i18n>fame}" /><Slider\r\n                        value="{printOptions>/fame}"\r\n                        max="10"\r\n                        inputsAsTooltips="true"\r\n                    enableTickmarks="true"\r\n                        class="sapUiSmallMarginBottom" /><Label text="{i18n>reputation}" /><Slider\r\n                        value="{printOptions>/reputation}"\r\n                        max="10"\r\n                        inputsAsTooltips="true"\r\n                        enableTickmarks="true"\r\n                        class="sapUiSmallMarginBottom" /><Label text="{i18n>additionalWithoutPlayerData}" /><Switch type="AcceptReject" state="{printOptions>/additionalSheet}" /></form:SimpleForm><Table\r\n                    mode="Delete"\r\n                    delete="deleteCharacterFromSession"\r\n                    items="{printOptions>/players}" ><headerToolbar><Toolbar><Title text="{i18n>players}" level="H2" /><ToolbarSpacer /><Button\r\n                                icon="sap-icon://add"\r\n                                press="addPlayerToSession" /></Toolbar></headerToolbar><columns><Column\r\n                            width="12em"><Text text="{i18n>player}" /></Column><Column\r\n                            demandPopin="true"><Text text="{i18n>character}" /></Column><Column><Text text="{i18n>gm}" /></Column></columns><items><ColumnListItem><cells><ObjectIdentifier\r\n                                title="{\'parts\': [{\'path\': \'printOptions>\'}, {\'path\': \'data>/players\'}], formatter: \'.formatPlayerTitle\'}"\r\n                                text="{\'parts\': [{\'path\': \'printOptions>\'}, {\'path\': \'data>/players\'}], formatter: \'.formatPlayerId\'}" /><Button\r\n                                icon="sap-icon://synchronize"\r\n                                text="{\'parts\': [{\'path\': \'printOptions>\'}, {\'path\': \'data>/players\'}], formatter: \'.formatCharacterButtonText\'}"\r\n                                press=".changeCharacter" /><SegmentedButton selectedKey="{printOptions>type}" ><items><SegmentedButtonItem text="{i18n>gm}" key="gm" /><SegmentedButtonItem text="{i18n>player}" key="player" /></items></SegmentedButton><ToolbarSpacer/></cells></ColumnListItem></items></Table><unified:FileUploader\r\n                    uploadUrl = ""\r\n                    buttonText = "{i18n>uploadChronicleTemplateAndCreateSheets}"\r\n                    fileType = "pdf"\r\n                    buttonOnly = "true"\r\n                    icon = "sap-icon://upload"\r\n                    class="sapUiMediumMargin"\r\n                    change = ".createSheets" /></VBox><footer><core:Fragment fragmentName="com.lonwyr.PathfinderChronicler.fragments.NavigationFooter" type="XML" /></footer></Page></mvc:View>',
	"com/lonwyr/PathfinderChronicler/view/MaintainEvents.view.xml":'<mvc:View xmlns="sap.m"\r\n          xmlns:mvc="sap.ui.core.mvc"\r\n          xmlns:f="sap.f"\r\n          xmlns:core="sap.ui.core"\r\n          xmlns:card="sap.f.cards"\r\n          controllerName="com.lonwyr.PathfinderChronicler.controller.MaintainEvents" ><Page\r\n            floatingFooter="true"\r\n            titleAlignment="Center"\r\n            title="{i18n>maintainEvents}"><f:GridContainer\r\n                class="sapUiSmallMargin"><f:layout><f:GridContainerSettings rowSize="84px" columnSize="84px" gap="8px" /></f:layout><f:layoutXS><f:GridContainerSettings rowSize="70px" columnSize="70px" gap="8px" /></f:layoutXS><f:Card><f:layoutData><f:GridContainerItemLayoutData columns="4" /></f:layoutData><f:header><card:Header\r\n                            title="{i18n>createNew}"\r\n                            iconSrc="sap-icon://add"\r\n                            press=".openAddEvent" /></f:header></f:Card></f:GridContainer><f:GridContainer\r\n                class="sapUiSmallMargin"\r\n                items="{data>/events}"><f:layout><f:GridContainerSettings rowSize="84px" columnSize="84px" gap="8px" /></f:layout><f:layoutXS><f:GridContainerSettings rowSize="70px" columnSize="70px" gap="8px" /></f:layoutXS><f:Card><f:layoutData><f:GridContainerItemLayoutData columns="4" /></f:layoutData><f:header><card:Header title="{data>name}"\r\n                                 subtitle="{data>id}"\r\n                                 iconSrc="sap-icon://map"\r\n                                 press=".editEvent" /></f:header></f:Card></f:GridContainer><footer><core:Fragment fragmentName="com.lonwyr.PathfinderChronicler.fragments.NavigationFooter" type="XML" /></footer></Page></mvc:View>',
	"com/lonwyr/PathfinderChronicler/view/MaintainPlayers.view.xml":'<mvc:View xmlns="sap.m"\r\n          xmlns:mvc="sap.ui.core.mvc"\r\n          xmlns:f="sap.f"\r\n          xmlns:core="sap.ui.core"\r\n          xmlns:card="sap.f.cards"\r\n          controllerName="com.lonwyr.PathfinderChronicler.controller.MaintainPlayers" ><Page\r\n            floatingFooter="true"\r\n            titleAlignment="Center"\r\n            title="{i18n>maintainPlayers}"><f:GridContainer\r\n                class="sapUiSmallMargin"><f:layout><f:GridContainerSettings rowSize="84px" columnSize="84px" gap="8px" /></f:layout><f:layoutXS><f:GridContainerSettings rowSize="70px" columnSize="70px" gap="8px" /></f:layoutXS><f:Card><f:layoutData><f:GridContainerItemLayoutData columns="4" /></f:layoutData><f:header><card:Header\r\n                            title="{i18n>createNew}"\r\n                            iconSrc="sap-icon://add"\r\n                            press=".openAddPlayer" /></f:header></f:Card></f:GridContainer><f:GridContainer\r\n                class="sapUiSmallMargin"\r\n                items="{data>/players}"><f:layout><f:GridContainerSettings rowSize="84px" columnSize="84px" gap="8px" /></f:layout><f:layoutXS><f:GridContainerSettings rowSize="70px" columnSize="70px" gap="8px" /></f:layoutXS><f:Card><f:layoutData><f:GridContainerItemLayoutData columns="4" /></f:layoutData><f:header><card:Header title="{data>name}"\r\n                                 subtitle="{data>id}"\r\n                                 iconSrc="sap-icon://customer"\r\n                                 press=".editPlayer" /></f:header><f:content><VBox\r\n                            width="100%"><List\r\n                                showSeparators="None"\r\n                                items="{data>characters}"><ObjectListItem\r\n                                    title="{data>name}"\r\n                                    type="Active"\r\n                                    press=".editCharacter"\r\n                                    number="{data>level}"\r\n                                    numberUnit="{i18n>level}"><ObjectAttribute text="{data>id}" /></ObjectListItem></List><Button\r\n                                icon="sap-icon://add"\r\n                                class="addCharacterButton"\r\n                                press=".openAddCharacter" /></VBox></f:content></f:Card></f:GridContainer><footer><core:Fragment fragmentName="com.lonwyr.PathfinderChronicler.fragments.NavigationFooter" type="XML" /></footer></Page></mvc:View>',
	"com/lonwyr/PathfinderChronicler/view/Welcome.view.xml":'<mvc:View xmlns="sap.m"\r\n          xmlns:mvc="sap.ui.core.mvc"\r\n          xmlns:core="sap.ui.core"\r\n          controllerName="com.lonwyr.PathfinderChronicler.controller.Welcome" ><Page\r\n            floatingFooter="true"\r\n            titleAlignment="Center"\r\n            title="{i18n>info}"><Text\r\n                text="{i18n>welcome}"\r\n                class="sapUiMediumMarginBegin sapUiMediumMarginEnd sapUiMediumMarginTop" /><MessageStrip\r\n                text="{i18n>providePdf}"\r\n                showIcon="true"\r\n                class="sapUiMediumMargin" /><MessageStrip\r\n                text="{i18n>noDataStored}"\r\n                type="Warning"\r\n                showIcon="true"\r\n                class="sapUiMediumMargin" /><footer><core:Fragment fragmentName="com.lonwyr.PathfinderChronicler.fragments.NavigationFooter" type="XML" /></footer></Page></mvc:View>'
});