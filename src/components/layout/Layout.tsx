import * as React from 'react';
import { ControlRegistry } from '../../layout/registry';
import { LayoutPropsField, LayoutDefinition } from '../../layout/layout-base';
import { FormManagerHelper } from '../../layout/form-manager';
import { Form } from '../../layout/form';
import LayoutTitleBinded from './LayoutTitleBinded';
import LayoutTitle from './LayoutTitle';
import { useState, useEffect } from 'react';
import { useAuthoring } from '../../layout/authoring-hooks';


export function getFormAndLayout(formId?: string, layoutId?: string): [Form, LayoutDefinition] {
    if (!formId)
        throw new Error('Invalid Form Id');
    const form = FormManagerHelper.formById(formId);
    if (!layoutId)
        throw new Error('Invalid Layout Id');
    const layout = form.layoutById(layoutId);
    if (!layout)
        throw new Error('Invalid Layout Id');
    return [form, layout];
}

export function getForm(formId?: string): Form {
    if (!formId)
        throw new Error('Invalid Form Id');
    const form = FormManagerHelper.formById(formId);
    if (!form)
        throw new Error('Invalid Form Id');
    return form;
}

const getIsHidden = (props: LayoutDefinition, form: Form): boolean => {
    if (props.$authoring) return false;
    if (props.options && props.options.bindVisibility) {
        const value = form.getValue(props.options.bindVisibility);
        return value !== props.options.bindVisibilityValue;

    }
    return false;
}
export function Layout(props: LayoutDefinition) {
    const [form, layout] = getFormAndLayout(props.$formId, props.$id);
    const isRoot = form.id === layout.$id;
    const draggable = !!props.$authoring && !isRoot;
    const listItems = (layout.$items || []).map((item) =>
        <Layout key={item.$id} {...item} />
    );
    const dragDiv = React.useRef<HTMLDivElement>(null);
    useAuthoring(dragDiv, { formId: props.$formId || '', id: props.$id || '', authoring: !!props.$authoring, isRoot, isLayout: true });
    const [hidden, setIsHidden] = useState(getIsHidden(props, form));
    console.log('Layout render');
    useEffect(() => {
        console.log('Layout use effect');
        // const form = getForm(props.$formId);
        const bindChanged = (propertyName: string, value: any, event: string) => {
            if (propertyName === props?.options?.bindVisibility) {
                const v = props?.options?.bindVisibilityValue;
                setIsHidden(v !== value);
            }
        };
        if (!props.$authoring && props.options && props.options.bindVisibility)
            form?.subscribeToChanges(props.options && props.options.bindVisibility, bindChanged);
        return () => {
            form?.unsubscribeToChanges(bindChanged);
        };
    });
    if (hidden) {
        return null;
    }
    const listFields: React.ReactElement[] = [];
    (layout.$fields as LayoutPropsField[] || []).forEach((item: LayoutPropsField) => {
        if (item.$widget && item.$id) {
            const TagName = ControlRegistry.getComponentClass(item.$widget);
            if (TagName) {
                listFields.push(<TagName key={item.$id} {...item} />);
            }
        }
    });
    let titleItem: React.ReactElement[] = [];
    if (layout && layout.$renderTitle) {
        const key = layout.$id + '-title';
        if (layout.$renderTitle.binded) {
            titleItem.push(<LayoutTitleBinded key={key} {...layout.$renderTitle} />);
        } else {
            titleItem.push(<LayoutTitle key={key} {...layout.$renderTitle} />);
        }
    }

    const items = [...listItems, ...listFields];
    let parent: React.ReactElement | null = null;
    if (props.$type === 'row') {
        const classNames = ['row'];
        const parentProp: any = { className: classNames.join(' ') };
        if (props.$authoring) {
            parentProp['data-drop-zone'] = true;
        }
        parent = React.createElement('div', parentProp, items);
    } else if (props.$authoring) {
        parent = React.createElement('div', { 'data-drop-zone': true }, items);
    }
    const children = parent ? [parent] : items;
    return (
        <div ref={dragDiv} data-form={props.$formId} data-layout={props.$id} className={props.$className} draggable={draggable}>
            {titleItem}
            {children}
        </div>
    );
}


