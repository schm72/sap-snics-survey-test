/* global Survey:true */
sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"generated/app/util/SurveyLib"
], function(BaseController, MessageBox, History, SurveyLib) {
	"use strict";

	return BaseController.extend("generated.app.controller.page_2", {

		onInit: function() {
			this.mBindingOptions = {};
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("page_2").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			// method called when view is ready to set values to UI elements
			this.getView().addEventDelegate({
				onAfterShow: jQuery.proxy(function(evt) {
					this.onAfterShow(evt);
				}, this)
			});

		},
		onAfterShow: function() {
			console.log("UI loaded - Screen 2");

			var surveyResults = sap.ui.getCore().getModel("SurveyModel");
			
			var pageTitle = this.getView().byId("page2Title");
			if ( surveyResults.surveyID != null) {
				pageTitle.setTitle( "Survey PoC - ID: " + surveyResults.surveyID );
			}
			
			var survey = new Survey.Model({
				pages: [{
					title: "Some random question to check random things",
					questions: [{
						type: "radiogroup",
						name: "badPerson",
						title: "Are you a bad person?",
						isRequired: true,
						choices: ["1|Yes", "2|No"],
						colCount: 0
					}, {
						"type": "rating",
						"name": "evilRating",
						"title": "How bad of a person are you ?",
						"visibleIf": "{badPerson}='1'",
						"mininumRateDescription": "Not that bad",
						"maximumRateDescription": "evil bad"
					}, {
						"type": "text",
						"inputType": "range",
						"name": "goodRating",
						"title": "How good of a person are you then ?",
						"visibleIf": "{badPerson}='2'"
					}, {
						type: "text",
						name: "textField",
						title: "Please enter some text:",
						placeHolder: "random text placeholder",
						isRequired: true
					}]
				}, {
					title: "Further Question progress",
					questions: [{
						type: "radiogroup",
						name: "selectSomething",
						title: "How old is the youngest employee in your organisation?",
						isRequired: true,
						choices: ["1|18 or above", "2|16 or above", "3|Younger than 16"],
						colCount: 1
					}, {
						type: "dropdown",
						name: "country",
						title: "Select the country...",
						choicesByUrl: {
							url: "http://restcountries.eu/rest/v2/all",
							path: "",
							valueName: "name"
						}
					}]
				}, {
					title: "Further Question progress",
					questions: [{
						type: "text",
						inputType: "date",
						name: "dateField",
						title: "Please select a random date:",
						isRequired: false
					}, {
						type: "text",
						inputType: "color",
						name: "color",
						title: "Please select a random color:",
						isRequired: false
					}, {
						type: "text",
						inputType: "email",
						name: "email",
						title: "Please enter a random e-mail address:",
						placeHolder: "random@house.org",
						isRequired: true,
						validators: [{
							type: "email"
						}]
					}]
				}, {
					title: "And another Question page header",
					questions: [{
						type: "checkbox",
						name: "opSystem",
						title: "What operating system do you use?",
						hasOther: true,
						isRequired: true,
						choices: ["1|Windows", "2|Linux", "3|Macintosh OSX"]
					}, {
						type: "dropdown",
						name: "whichDistribution",
						title: "Which Distribution are you using ?",
						visibleIf: "{opSystem}='2' or {opSystem}='1,2' or {opSystem}='2,1' or {opSystem}='2,3' or {opSystem}='3,2' or {opSystem}='1,2,3' or {opSystem}='1,3,2' or {opSystem}='2,3,1' or {opSystem}='2,1,3' or {opSystem}='3,1,2' or {opSystem}='3,2,1'",
						isRequired: false,
						choices: ["1|Ubuntu", "2|Mint", "3|SUSE", "4|Gentoo", "5|Another"]
					}, {
						type: "comment",
						name: "NameIt",
						title: "Please name the one you use and maybe Add some comments ?",
						visibleIf: "{whichDistribution}='5'",
						isRequired: false
					}, {
						type: "comment",
						name: "someComments",
						title: "Some final words ?",
						isRequired: false
					}]
				}]
			});
			survey.showProgressBar = "bottom";

			var that = this;
			this.getView().byId("finishSurvey").setVisible(false);
			survey.onComplete.add(function(result) {
				surveyResults.surveyData = JSON.stringify(result.data);
				sap.ui.getCore().setModel(surveyResults, "SurveyModel");
				that.getView().byId("finishSurvey").setVisible(true);
			});

			var vIdSurveyElement = "#" + this.getView().byId("surveyElement").sId;
			$(vIdSurveyElement).Survey({
				model: survey
			});
		},
		handleRouteMatched: function(oEvent) {
			var oParams = {};

			if (oEvent.mParameters.data.context || oEvent.mParameters.data.masterContext) {
				var oModel = this.getView ? this.getView().getModel() : null;
				if (oModel) {
					oModel.setRefreshAfterChange(true);

					if (oModel.hasPendingChanges()) {
						oModel.resetChanges();
					}
				}

				this.sContext = oEvent.mParameters.data.context;
				this.sMasterContext = oEvent.mParameters.data.masterContext;

				if (!this.sContext) {
					this.getView().bindElement("/" + this.sMasterContext, oParams);
				} else {
					this.getView().bindElement("/" + this.sContext, oParams);
				}

			}

		},
		_onButtonPress: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new ES6Promise.Promise(function(resolve, reject) {

				this.doNavigate("page_3", oBindingContext, resolve, "");
			}.bind(this));
		},
		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var that = this;
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var entityNameSet;
			if (sPath !== null && sPath !== "") {

				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				entityNameSet = sPath.split("(")[0];
			}
			var navigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (entityNameSet !== null) {
				navigationPropertyName = sViaRelation || that.getOwnerComponent().getNavigationPropertyForNavigationWithContext(entityNameSet,
					sRouteName);
			}
			if (navigationPropertyName !== null && navigationPropertyName !== undefined) {
				if (navigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(navigationPropertyName, oBindingContext, null, function(bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							that.oRouter.navTo(sRouteName);
						} else {
							that.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					});
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		}
	});
}, /* bExport= */ true);