import * as React from 'react';
import { ControlRegistry } from '../../layout/registry';
import { LayoutPropsField, LayoutDefinition, LayoutType } from '../../layout/layout-base';
import { FormManagerHelper } from '../../layout/form-manager';
import { Form } from '../../layout/form';
import LayoutTitleBinded from './LayoutTitleBinded';
import LayoutTitle from './LayoutTitle';
import { useState, useEffect } from 'react';

const getIsHidden = (props: LayoutDefinition, form: Form): boolean => {
    if (props.options && props.options.bindVisibility) {
        const value = form.getValue(props.options.bindVisibility);
        return value !== props.options.bindVisibilityValue;

    }
    return false;
   
}
export function Layout(props: { layoutId: string, formId: string }) {
    console.log('id = ' + props.layoutId);
    const [form, layout] = FormManagerHelper.getFormAndLayout(props.formId, props.layoutId);
    const isRoot = form.id === layout.$id;
    const listItems = (layout.$items || []).map((item) =>
        <Layout key={item.$id} formId={props.formId} layoutId={item.$id} />
    );
    const dragDiv = React.useRef<HTMLDivElement>(null);
    const [hidden, setIsHidden] = useState(getIsHidden(layout, form));
    console.log('Layout render');
    useEffect(() => {
        console.log('Layout use effect');
        // const form = getForm(props.$formId);
        const bindChanged = (propertyName: string, value: any, event: string) => {
            if (propertyName === layout?.options?.bindVisibility) {
                const v = layout?.options?.bindVisibilityValue;
                setIsHidden(v !== value);
            }
        };
        if (!layout.$authoring && layout.options && layout.options.bindVisibility) {
            form?.subscribeToChanges(layout.options && layout.options.bindVisibility, bindChanged);
        }
        return () => {
            form?.unsubscribeToChanges(bindChanged);
            form?.unsubscribeToLayoutChanges(layout.$id);
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
    if (layout.$type === LayoutType.Row) {
        const classNames = ['row'];
        const parentProp: any = { className: classNames.join(' ') };
        parent = React.createElement('div', parentProp, items);
    }
    const children = parent ? [parent] : items;
    return (
        <div ref={dragDiv} data-form={layout.$formId} data-layout={layout.$id} className={layout.$className} >
            {titleItem}
            {children}
        </div>
    );
}


