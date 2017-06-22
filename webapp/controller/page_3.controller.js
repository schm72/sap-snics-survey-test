sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, History) {
	"use strict";

	return BaseController.extend("generated.app.controller.page_3", {
		onInit: function() {
			this.mBindingOptions = {};
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("page_3").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			// method called when view is ready to set values to UI elements
			this.getView().addEventDelegate({
				onAfterShow: jQuery.proxy(function(evt) {
					this.onAfterShow(evt);
				}, this)
			});
		},
		onAfterShow: function() {
			console.log("UI loaded - Screen 3");
		
			var surveyResults = sap.ui.getCore().getModel("SurveyModel");
			
			var pageTitle = this.getView().byId("page3Title");
			if ( surveyResults.surveyID != null) {
				pageTitle.setTitle( "Result View - ID: " + surveyResults.surveyID );
				this.getView().byId("surveyID").setText(surveyResults.surveyID);
			}
			
			var vResultId = "#" + this.getView().byId("resultView").sId;
			document.querySelector(vResultId).innerHTML = surveyResults.surveyData;

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
		_onButtonPress1: function(oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext();

			return new ES6Promise.Promise(function(resolve, reject) {

				this.doNavigate("page_1", oBindingContext, resolve, "");
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