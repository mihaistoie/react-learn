import { Form } from "./form";
import { LayoutDefinition } from "./layout-base";
import { ISchemaDefinition } from "../tools/schema";

class FormManager {
    private readonly forms: Map<string, Form>;
    constructor() {
        this.forms = new Map<string, Form>();
    }
    public registerForm(form: Form) {
        this.forms.set(form.id, form);
    }
    public formById(id: string) {
        return this.forms.get(id);
    }
}
const formManager = new FormManager();

export class FormManagerHelper {
    public static createForm(layout: LayoutDefinition, schema: ISchemaDefinition, data: any, options: { authoring: boolean }): string {
        const form = new Form(layout, schema, data, options);
        formManager.registerForm(form);
        return form.id;
    }
    public static formById(id: string): Form {
        const form = formManager.formById(id);
        if (!form)
            throw new Error('Innvalid Form id');
        return form;
    }
    public static getFormAndLayout(formId?: string, layoutId?: string): [Form, LayoutDefinition] {
        if (!formId)
            throw new Error('Invalid Form Id');
        const form = this.formById(formId);
        if (!layoutId)
            throw new Error('Invalid Layout Id');
        const layout = form.layoutById(layoutId);
        if (!layout)
            throw new Error('Invalid Layout Id');
        return [form, layout];
    }

    public static getForm(formId?: string): Form {
        if (!formId)
            throw new Error('Invalid Form Id');
        const form = FormManagerHelper.formById(formId);
        if (!form)
            throw new Error('Invalid Form Id');
        return form;
    }

}