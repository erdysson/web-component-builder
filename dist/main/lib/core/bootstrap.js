"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const runtime_1 = require("./runtime");
const bootstrap = (moduleClass) => {
    const runtime = new runtime_1.Runtime();
    runtime.initModule(moduleClass);
};
exports.bootstrap = bootstrap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb3JlL2Jvb3RzdHJhcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1Q0FBa0M7QUFFM0IsTUFBTSxTQUFTLEdBQUcsQ0FBQyxXQUFtQixFQUFRLEVBQUU7SUFDbkQsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7SUFDOUIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNwQyxDQUFDLENBQUM7QUFIVyxRQUFBLFNBQVMsYUFHcEIifQ==