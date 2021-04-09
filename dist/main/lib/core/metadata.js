"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = void 0;
require("reflect-metadata");
const metadata_keys_1 = require("./metadata-keys");
class Metadata {
    static setModuleConfig(moduleClass, moduleConfig) {
        Reflect.defineMetadata(metadata_keys_1.METADATA_KEYS.MODULE, moduleConfig, moduleClass);
    }
    static getModuleConfig(moduleClass) {
        return Reflect.getMetadata(metadata_keys_1.METADATA_KEYS.MODULE, moduleClass);
    }
    static setComponentConfig(componentClass, componentConfig) {
        Reflect.defineMetadata(metadata_keys_1.METADATA_KEYS.COMPONENT, componentConfig, componentClass);
    }
    static getComponentConfig(componentClass) {
        return Reflect.getMetadata(metadata_keys_1.METADATA_KEYS.COMPONENT, componentClass);
    }
    static setProviderConfig(providerClass, config = {}) {
        Reflect.defineMetadata(metadata_keys_1.METADATA_KEYS.PROVIDER, config, providerClass);
    }
    static getProviderConfig(providerClass) {
        return Reflect.getMetadata(metadata_keys_1.METADATA_KEYS.PROVIDER, providerClass);
    }
    static setInjectedProviderConfig(hostClass, providerClass, targetParameterIndex) {
        const hasMetadata = Reflect.hasMetadata(metadata_keys_1.METADATA_KEYS.INJECT, hostClass);
        if (!hasMetadata) {
            Reflect.defineMetadata(metadata_keys_1.METADATA_KEYS.INJECT, [{ providerClass, targetParameterIndex }], hostClass);
        }
        else {
            const injectMetadata = Metadata.getInjectedProviderConfig(hostClass);
            injectMetadata.push({
                providerClass,
                targetParameterIndex
            });
        }
    }
    static getInjectedProviderConfig(hostClass) {
        return (Reflect.getMetadata(metadata_keys_1.METADATA_KEYS.INJECT, hostClass) || []);
    }
    static setComponentInputConfig(componentInstance, componentPropertyKey, inputAttributeName) {
        const componentClass = componentInstance.constructor;
        const hasMetadata = Reflect.hasMetadata(metadata_keys_1.METADATA_KEYS.INPUT, componentClass);
        if (!hasMetadata) {
            Reflect.defineMetadata(metadata_keys_1.METADATA_KEYS.INPUT, [{ componentPropertyKey, inputAttributeName }], componentClass);
        }
        else {
            const inputMetadata = Metadata.getComponentInputConfig(componentClass);
            inputMetadata.push({ componentPropertyKey, inputAttributeName });
        }
    }
    static getComponentInputConfig(componentClass) {
        return Reflect.getMetadata(metadata_keys_1.METADATA_KEYS.INPUT, componentClass) || [];
    }
}
exports.Metadata = Metadata;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NvcmUvbWV0YWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQTBCO0FBRzFCLG1EQUE4QztBQUU5QyxNQUFhLFFBQVE7SUFDakIsTUFBTSxDQUFDLGVBQWUsQ0FBQyxXQUFtQixFQUFFLFlBQTJCO1FBQ25FLE9BQU8sQ0FBQyxjQUFjLENBQUMsNkJBQWEsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxNQUFNLENBQUMsZUFBZSxDQUFDLFdBQW1CO1FBQ3RDLE9BQU8sT0FBTyxDQUFDLFdBQVcsQ0FBQyw2QkFBYSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQWtCLENBQUM7SUFDbkYsQ0FBQztJQUVELE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFzQixFQUFFLGVBQWlDO1FBQy9FLE9BQU8sQ0FBQyxjQUFjLENBQUMsNkJBQWEsQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRCxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBc0I7UUFDNUMsT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDLDZCQUFhLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBcUIsQ0FBQztJQUM1RixDQUFDO0lBRUQsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGFBQXFCLEVBQUUsU0FBa0IsRUFBRTtRQUNoRSxPQUFPLENBQUMsY0FBYyxDQUFDLDZCQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGFBQXFCO1FBQzFDLE9BQU8sT0FBTyxDQUFDLFdBQVcsQ0FBQyw2QkFBYSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsTUFBTSxDQUFDLHlCQUF5QixDQUFDLFNBQWlCLEVBQUUsYUFBcUIsRUFBRSxvQkFBNEI7UUFDbkcsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyw2QkFBYSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUV6RSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2QsT0FBTyxDQUFDLGNBQWMsQ0FDbEIsNkJBQWEsQ0FBQyxNQUFNLEVBQ3BCLENBQUMsRUFBQyxhQUFhLEVBQUUsb0JBQW9CLEVBQUMsQ0FBNEIsRUFDbEUsU0FBUyxDQUNaLENBQUM7U0FDTDthQUFNO1lBQ0gsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLHlCQUF5QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JFLGNBQWMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLGFBQWE7Z0JBQ2Isb0JBQW9CO2FBQ3ZCLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxTQUFpQjtRQUM5QyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyw2QkFBYSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQXNCLENBQUM7SUFDN0YsQ0FBQztJQUVELE1BQU0sQ0FBQyx1QkFBdUIsQ0FDMUIsaUJBQTBCLEVBQzFCLG9CQUE0QixFQUM1QixrQkFBMEI7UUFFMUIsTUFBTSxjQUFjLEdBQVcsaUJBQWlCLENBQUMsV0FBVyxDQUFDO1FBQzdELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsNkJBQWEsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFN0UsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNkLE9BQU8sQ0FBQyxjQUFjLENBQ2xCLDZCQUFhLENBQUMsS0FBSyxFQUNuQixDQUFDLEVBQUMsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUMsQ0FBbUIsRUFDOUQsY0FBYyxDQUNqQixDQUFDO1NBQ0w7YUFBTTtZQUNILE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN2RSxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO1NBQ2xFO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxjQUFzQjtRQUNqRCxPQUFPLE9BQU8sQ0FBQyxXQUFXLENBQUMsNkJBQWEsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFFLENBQUM7Q0FDSjtBQXRFRCw0QkFzRUMifQ==