"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBuiltIns = exports.BuiltInModule = void 0;
// needed for older browsers
require("core-js/stable");
require("@webcomponents/webcomponentsjs/webcomponents-bundle.js");
const bootstrap_1 = require("../core/bootstrap");
const decorators_1 = require("../core/decorators");
const app_component_1 = require("./components/app/app.component");
const loading_component_1 = require("./components/loading/loading.component");
const test_component_1 = require("./components/test/test.component");
const log_service_1 = require("./services/log.service");
const test_service_1 = require("./services/test.service");
let BuiltInModule = class BuiltInModule {
};
BuiltInModule = __decorate([
    decorators_1.Module({
        components: [app_component_1.AppComponent, loading_component_1.LoadingComponent, test_component_1.TestComponent],
        providers: [test_service_1.TestService, log_service_1.LogService]
    })
], BuiltInModule);
exports.BuiltInModule = BuiltInModule;
function useBuiltIns() {
    bootstrap_1.bootstrap(BuiltInModule);
}
exports.useBuiltIns = useBuiltIns;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbHQtaW4ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9idWlsdC1pbnMvYnVpbHQtaW4ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDRCQUE0QjtBQUM1QiwwQkFBd0I7QUFDeEIsa0VBQWdFO0FBRWhFLGlEQUE0QztBQUM1QyxtREFBMEM7QUFFMUMsa0VBQTREO0FBQzVELDhFQUF3RTtBQUN4RSxxRUFBK0Q7QUFDL0Qsd0RBQWtEO0FBQ2xELDBEQUFvRDtBQU1wRCxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO0NBQUcsQ0FBQTtBQUFoQixhQUFhO0lBSnpCLG1CQUFNLENBQUM7UUFDSixVQUFVLEVBQUUsQ0FBQyw0QkFBWSxFQUFFLG9DQUFnQixFQUFFLDhCQUFhLENBQUM7UUFDM0QsU0FBUyxFQUFFLENBQUMsMEJBQVcsRUFBRSx3QkFBVSxDQUFDO0tBQ3ZDLENBQUM7R0FDVyxhQUFhLENBQUc7QUFBaEIsc0NBQWE7QUFFMUIsU0FBZ0IsV0FBVztJQUN2QixxQkFBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFGRCxrQ0FFQyJ9