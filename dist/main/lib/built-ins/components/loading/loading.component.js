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
exports.LoadingComponent = void 0;
const decorators_1 = require("../../../core/decorators");
const log_service_1 = require("../../services/log.service");
const loading_component_html_1 = __importDefault(require("./loading.component.html"));
require("./loading.component.scss");
let LoadingComponent = class LoadingComponent {
    constructor(logService) {
        this.logService = logService;
    }
    onInit() {
        this.logService.log('loading on init');
    }
    onDestroy() {
        this.logService.log('loading on destroy');
    }
};
LoadingComponent = __decorate([
    decorators_1.Component({
        selector: 'loading-component',
        template: loading_component_html_1.default
    }),
    __param(0, decorators_1.Inject(log_service_1.LogService)),
    __metadata("design:paramtypes", [log_service_1.LogService])
], LoadingComponent);
exports.LoadingComponent = LoadingComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2J1aWx0LWlucy9jb21wb25lbnRzL2xvYWRpbmcvbG9hZGluZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseURBQTJEO0FBRTNELDREQUFzRDtBQUV0RCxzRkFBdUQ7QUFDdkQsb0NBQWtDO0FBTWxDLElBQWEsZ0JBQWdCLEdBQTdCLE1BQWEsZ0JBQWdCO0lBQ3pCLFlBQWlELFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7SUFBRyxDQUFDO0lBRTNFLE1BQU07UUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxTQUFTO1FBQ0wsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUM5QyxDQUFDO0NBQ0osQ0FBQTtBQVZZLGdCQUFnQjtJQUo1QixzQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLG1CQUFtQjtRQUM3QixRQUFRLEVBQUUsZ0NBQWU7S0FDNUIsQ0FBQztJQUVlLFdBQUEsbUJBQU0sQ0FBQyx3QkFBVSxDQUFDLENBQUE7cUNBQThCLHdCQUFVO0dBRDlELGdCQUFnQixDQVU1QjtBQVZZLDRDQUFnQiJ9