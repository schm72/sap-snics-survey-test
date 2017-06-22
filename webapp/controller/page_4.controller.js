sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, History) {
	"use strict";

	return BaseController.extend("generated.app.controller.page_4", {
		onInit: function() {
			this.mBindingOptions = {};
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("page_4").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			// method called when view is ready to set values to UI elements
			this.getView().addEventDelegate({
				onAfterShow: jQuery.proxy(function(evt) {
					this.onAfterShow(evt);
				}, this)
			});
		},
		onAfterShow: function() {
			console.log("UI loaded - Screen 4");
		
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

		}
	});
}, /* bExport= */ true);