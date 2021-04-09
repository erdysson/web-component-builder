"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogService = void 0;
const decorators_1 = require("../../core/decorators");
let LogService = class LogService {
    log(...input) {
        console.log(...input);
    }
};
LogService = __decorate([
    decorators_1.Injectable()
], LogService);
exports.LogService = LogService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL2J1aWx0LWlucy9zZXJ2aWNlcy9sb2cuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxzREFBaUQ7QUFHakQsSUFBYSxVQUFVLEdBQXZCLE1BQWEsVUFBVTtJQUNuQixHQUFHLENBQUMsR0FBRyxLQUFnQjtRQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztDQUNKLENBQUE7QUFKWSxVQUFVO0lBRHRCLHVCQUFVLEVBQUU7R0FDQSxVQUFVLENBSXRCO0FBSlksZ0NBQVUifQ==