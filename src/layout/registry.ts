const registryByWidget = new Map<string, any>();

export class ControlRegistry {
    public static register(widgetName: string, componentClass: any) {
        registryByWidget.set(widgetName, componentClass);
    }
    public static getComponentClass(widgetName: string): any {
        return registryByWidget.get(widgetName) || null;
    }
}