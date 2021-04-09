"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = void 0;
const decorators_1 = require("../../../core/decorators");
const log_service_1 = require("../../services/log.service");
const test_service_1 = require("../../services/test.service");
const app_component_html_1 = __importDefault(require("./app.component.html"));
require("./app.component.scss");
let AppComponent = class AppComponent {
    constructor(logService, testService) {
        this.logService = logService;
        this.testService = testService;
        //
    }
    onInit() {
        this.testService.checkIfTest();
        this.logService.log('app component on init', 'index :', this.index);
    }
    onChanges(changes) {
        this.logService.log('changes :', changes);
    }
    onDestroy() {
        this.testService.checkIfTest();
        this.logService.log('app component on destroy');
    }
};
__decorate([
    decorators_1.Input(),
    __metadata("design:type", String)
], AppComponent.prototype, "index", void 0);
AppComponent = __decorate([
    decorators_1.Component({
        selector: 'app-component',
        template: app_component_html_1.default
    }),
    __param(0, decorators_1.Inject(log_service_1.LogService)),
    __param(1, decorators_1.Inject(test_service_1.TestService)),
    __metadata("design:paramtypes", [log_service_1.LogService,
        test_service_1.TestService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYnVpbHQtaW5zL2NvbXBvbmVudHMvYXBwL2FwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseURBQWtFO0FBRWxFLDREQUFzRDtBQUN0RCw4REFBd0Q7QUFFeEQsOEVBQStDO0FBQy9DLGdDQUE4QjtBQU05QixJQUFhLFlBQVksR0FBekIsTUFBYSxZQUFZO0lBSXJCLFlBQ3lDLFVBQXNCLEVBQ3JCLFdBQXdCO1FBRHpCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDckIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFFOUQsRUFBRTtJQUNOLENBQUM7SUFDRCxNQUFNO1FBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxTQUFTLENBQUMsT0FBa0I7UUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxTQUFTO1FBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBQ3BELENBQUM7Q0FDSixDQUFBO0FBckJHO0lBREMsa0JBQUssRUFBRTs7MkNBQ2U7QUFGZCxZQUFZO0lBSnhCLHNCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsZUFBZTtRQUN6QixRQUFRLEVBQUUsNEJBQVc7S0FDeEIsQ0FBQztJQU1PLFdBQUEsbUJBQU0sQ0FBQyx3QkFBVSxDQUFDLENBQUE7SUFDbEIsV0FBQSxtQkFBTSxDQUFDLDBCQUFXLENBQUMsQ0FBQTtxQ0FENkIsd0JBQVU7UUFDUiwwQkFBVztHQU56RCxZQUFZLENBdUJ4QjtBQXZCWSxvQ0FBWSJ9