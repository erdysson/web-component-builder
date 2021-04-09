"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = exports.Inject = exports.Injectable = exports.Component = exports.Module = void 0;
const metadata_1 = require("./metadata");
const Module = (config) => (target) => metadata_1.Metadata.setModuleConfig(target, config);
exports.Module = Module;
const Component = (config) => (target) => metadata_1.Metadata.setComponentConfig(target, config);
exports.Component = Component;
const Injectable = () => (target) => metadata_1.Metadata.setProviderConfig(target, true);
exports.Injectable = Injectable;
const Inject = (providerClass) => 
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
(target, propertyKey, parameterIndex) => metadata_1.Metadata.setInjectedProviderConfig(target, providerClass, parameterIndex);
exports.Inject = Inject;
const Input = (name) => (target, propertyKey) => metadata_1.Metadata.setComponentInputConfig(target, propertyKey, name || propertyKey);
exports.Input = Input;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvY29yZS9kZWNvcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHlDQUFvQztBQUU3QixNQUFNLE1BQU0sR0FBRyxDQUFDLE1BQXFCLEVBQWtCLEVBQUUsQ0FBQyxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQ2hGLG1CQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQURoQyxRQUFBLE1BQU0sVUFDMEI7QUFFdEMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxNQUF3QixFQUFrQixFQUFFLENBQUMsQ0FBQyxNQUFjLEVBQUUsRUFBRSxDQUN0RixtQkFBUSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQURuQyxRQUFBLFNBQVMsYUFDMEI7QUFFekMsTUFBTSxVQUFVLEdBQUcsR0FBbUIsRUFBRSxDQUFDLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FBQyxtQkFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUFoRyxRQUFBLFVBQVUsY0FBc0Y7QUFFdEcsTUFBTSxNQUFNLEdBQUcsQ0FBQyxhQUFxQixFQUFzQixFQUFFO0FBQ2hFLDZEQUE2RDtBQUM3RCxhQUFhO0FBQ2IsQ0FBQyxNQUFjLEVBQUUsV0FBNEIsRUFBRSxjQUFzQixFQUFFLEVBQUUsQ0FDckUsbUJBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBSnJFLFFBQUEsTUFBTSxVQUkrRDtBQUUzRSxNQUFNLEtBQUssR0FBRyxDQUFDLElBQWEsRUFBcUIsRUFBRSxDQUFDLENBQUMsTUFBZSxFQUFFLFdBQTRCLEVBQUUsRUFBRSxDQUN6RyxtQkFBUSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxXQUFxQixFQUFFLElBQUksSUFBSyxXQUFzQixDQUFDLENBQUM7QUFEeEYsUUFBQSxLQUFLLFNBQ21GIn0=