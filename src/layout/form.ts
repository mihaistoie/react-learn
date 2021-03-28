import { LayoutDefinition, walkLayouts, LayoutPropsField } from "./layout-base";
import { Helper } from "../tools/helper";
import { ISchemaDefinition } from "../tools/schema";
import { updateLayoutRenderOptions } from "../components/layout/render-layout";



export class Form {
    private _model: any;
    private _handlers: Map<string, any[]>;
    private _handlersLayout: Map<string, (propertyName: string) => void>;
    private layoutsById: Map<string, LayoutDefinition>;
    private fieldsById: Map<string, LayoutPropsField>;
    private layout: LayoutDefinition;
    constructor(layout: LayoutDefinition, schema: ISchemaDefinition, data: any, options: { authoring?: boolean }) {
        this.layout = layout;
        this._model = data;
        this._model.notifyChange = this.changed.bind(this);
        this._handlers = new Map<string, any[]>();
        this._handlersLayout = new Map<string, any>();
        this.layoutsById = new Map<string, LayoutDefinition>();
        this.fieldsById = new Map<string, LayoutPropsField>();
        walkLayouts(this.layout, null, (parent, current) => {
            current.$id = current.$id || Helper.id();
            current.$formId = layout.$id
            current.$authoring = !!options.authoring;
            if (current.$fields && current.$fields.length) {
                delete current.$items;
            } else {
                delete current.$fields;
            }
            updateLayoutRenderOptions(this, current, parent);
            this.layoutsById.set(current.$id, current);
            return true;
        }, (parentLayout, field) => {
            const fd: any = field;
            const fieldDef: LayoutPropsField = fd;
            fieldDef.$formId = layout.$id;
            fieldDef.$id = Helper.id();
            fieldDef.$layoutId = parentLayout.$id;
            this.fieldsById.set(fieldDef.$id, fieldDef);
            return true;
        }
        );
    }
    public get id(): string {
        return this.layout.$id;
    }
    public get model(): any {
        return this._model;
    }
    public layoutById(layoutId: string): LayoutDefinition | undefined {
        return this.layoutsById.get(layoutId);
    }
    public fieldById(layoutId: string): LayoutPropsField | undefined {
        return this.fieldsById.get(layoutId);
    }
    public subscribeToChanges(property: string, handler: any, event?: string) {
        event = event || 'changed';
        const propertyName = Helper.normalizeProperty(property);

        let handlers = this._handlers.get(propertyName);
        if (!handlers) {
            handlers = [];
            this._handlers.set(propertyName, handlers);
        }
        handlers.push({ event, handler });
    }
    public unsubscribeToChanges(handler: any) {
        this._handlers.forEach(item => {
            const ii = item.findIndex(ii => ii.handler === handler);
            if (ii >= 0)
                item.splice(ii, 1);
        });

    }
    public subscribeToLayoutChanges(layoutId: string, handler: (propertyName: string) => void) {
        this._handlersLayout.set(layoutId, handler);
    }
    public unsubscribeToLayoutChanges(layoutId: string) {
        this._handlersLayout.delete(layoutId);
    }
    public notifyLayoutPropChanged(layoutId: string, propName: string) {
        const handler = this._handlersLayout.get(layoutId);
        if (handler) handler(propName);
    }
    public getValue(field: string) {
        return this.model[field];
    }
    public isChildOfLayout(layout: LayoutDefinition, parent: LayoutDefinition): boolean {
        let li: LayoutDefinition | null | undefined = layout;
        while (li && li.$parentId) {
            if (li.$id === parent.$id || li.$parentId === parent.$id) return true;
            li = li.$parentId ? this.layoutById(li.$parentId) : null;
        }
        return false;
    }
    private changed(propName: string) {
        console.log(propName);
        console.log(this._model[propName]);
        const handlers = this._handlers.get(propName);
        if (handlers) {
            const value = this._model[propName]
            handlers.forEach((ii) => {
                ii.handler(propName, value, ii.event);
            });
        }
    }
}