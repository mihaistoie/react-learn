import { LayoutDefinition, walkLayouts, LayoutPropsField } from "./layout-base";
import { Helper } from "../tools/helper";
import { ISchemaDefinition } from "../tools/schema";
import { updateLayoutRenderOptions } from "../components/layout/render-layout";



export class Form {
    private _model: any;
    private _handlers: Map<string, any[]>;
    private layoutsById: Map<string, LayoutDefinition>;
    private fieldsById: Map<string, LayoutPropsField>;
    private layout: LayoutDefinition;
    constructor(layout: LayoutDefinition, schema: ISchemaDefinition, data: any, options: { authoring?: boolean } ) {
        this.layout = layout;
        this._model = data;
        this._model.notifyChange = this.changed.bind(this);
        this._handlers = new Map<string, any[]>();
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
    public getValue(field: string) {
        return this.model[field];
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