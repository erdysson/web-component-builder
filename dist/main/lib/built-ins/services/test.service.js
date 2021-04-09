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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestService = void 0;
const decorators_1 = require("../../core/decorators");
const log_service_1 = require("./log.service");
let TestService = class TestService {
    constructor(logService) {
        this.logService = logService;
        this.isTest = true;
    }
    checkIfTest() {
        this.logService.log('is test :', this.isTest);
    }
};
TestService = __decorate([
    decorators_1.Injectable(),
    __param(0, decorators_1.Inject(log_service_1.LogService)),
    __metadata("design:paramtypes", [log_service_1.LogService])
], TestService);
exports.TestService = TestService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9idWlsdC1pbnMvc2VydmljZXMvdGVzdC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUF5RDtBQUV6RCwrQ0FBeUM7QUFHekMsSUFBYSxXQUFXLEdBQXhCLE1BQWEsV0FBVztJQUdwQixZQUFpRCxVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBRnRELFdBQU0sR0FBRyxJQUFJLENBQUM7SUFFMkMsQ0FBQztJQUUzRSxXQUFXO1FBQ1AsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsRCxDQUFDO0NBQ0osQ0FBQTtBQVJZLFdBQVc7SUFEdkIsdUJBQVUsRUFBRTtJQUlJLFdBQUEsbUJBQU0sQ0FBQyx3QkFBVSxDQUFDLENBQUE7cUNBQThCLHdCQUFVO0dBSDlELFdBQVcsQ0FRdkI7QUFSWSxrQ0FBVyJ9