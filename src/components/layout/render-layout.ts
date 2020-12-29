import { LayoutDefinition } from "../../layout/layout-base";
import { Form } from "../../layout/form";
import { Helper } from "../../tools/helper";

export const updateLayoutRenderOptions = (form: Form, current : LayoutDefinition, parent: LayoutDefinition | null) => {
    const isRoot = form.id === current.$id;
    if (parent && parent.$type === 'row' ) {
        current.$type = 'col';
    }
    if (current && current.$title && current.$title.value) { 
        const size = current.$title.size || 4;
        const defaultClass: string[] = ['h' + size];
        if (current.$title.$style)
            defaultClass.push(current.$title.$style);
        const binded = current.$authoring ? [] : Helper.extractVariables(current.$title.value);
        current.$renderTitle = {
            formId: form.id,
            layoutId: current.$id,
            title: current.$title.value,
            className: defaultClass.join(' '),
        }
        if (binded.length) {
            current.$renderTitle.binded =  binded;
        }

    }   
    const cssClass: string[] = [];
    updateLayoutClass(current, isRoot, cssClass);
    current.$className = cssClass.join(' ');

}
const updateLayoutClass = (current : LayoutDefinition, isRoot: boolean, cssClass: string[]) => {
    if (current.$type === 'block') {
        updateLayoutBlockClass(current, isRoot, cssClass);
    } else if (current.$type === 'row') {
        updateLayoutRowClass(current, isRoot, cssClass);
    } else if (current.$type === 'col') {
        updateLayoutColClass(current, isRoot, cssClass);
    }
    
}

const updateLayoutBlockClass = (current : LayoutDefinition, isRoot: boolean, cssClass: string[]) => {
    if (!current.$authoring) {
        if (current.$style) {
            cssClass.push(current.$style);
        }
        cssClass.push('container-fluid');
    } else {
        if (!isRoot)
            cssClass.push('border border-primary');
        cssClass.push('p-1');
        cssClass.push('m-1');
        // cssClass.push('container');
    }
    if (!current.$fields && !current.$authoring) {
        cssClass.push('p-0');
    }
}
const updateLayoutRowClass = (current : LayoutDefinition, isRoot: boolean, cssClass: string[]) => {
    if (!current.$authoring) {
        if (current.$style) {
            cssClass.push(current.$style);
        }
        cssClass.push('container-fluid');
    } else {
        if (!isRoot)
            cssClass.push('border border-primary');
        cssClass.push('p-1');
        cssClass.push('m-1');
        // cssClass.push('container');
    }
    if (!current.$fields && !current.$authoring) {
        cssClass.push('p-0');
    }
}
const updateLayoutColClass = (current : LayoutDefinition, isRoot: boolean, cssClass: string[]) => {
    if (!current.$authoring) {
        if (current.$style) {
            cssClass.push(current.$style);
        }
        cssClass.push('container-fluid');
    } else {
        if (!isRoot)
            cssClass.push('border border-primary');
        cssClass.push('p-1');
        cssClass.push('m-1');
        // cssClass.push('container');
    }
    if (!current.$fields && !current.$authoring) {
        cssClass.push('p-0');
    }
}


