import * as React from 'react';
import { ControlRegistry } from '../../layout/registry';
import { LayoutPropsField, LayoutDefinition, LayoutType, LayoutField } from '../../layout/layout-base';
import { Form } from '../../layout/form';
import LayoutTitleBinded from './LayoutTitleBinded';
import LayoutTitle from './LayoutTitle';
import { useState, useEffect } from 'react';
import { useAuthoring } from '../../layout/authoring-hooks';
import { addClass, removeClass } from '../../tools/dom';
import { FormManagerHelper } from '../../layout/form-manager';
import { LayoutTarget } from './LayoutTarget';


const getAuthoringInDrag = (layout: LayoutDefinition, form: Form): boolean => {
    return !!layout.$authoringInDrag;
}
const getChildrenLayouts = (layout: LayoutDefinition, form: Form): LayoutDefinition[] => {
    return layout.$items || [];
}
const getChildrenFields = (layout: LayoutDefinition, form: Form): LayoutPropsField[] => {
    return (layout.$fields || []) as LayoutPropsField[];
}


export function LayoutAuthoring(props: { layoutId: string, formId: string }) {
    console.log('id = ' + props.layoutId);
    const [form, layout] = FormManagerHelper.getFormAndLayout(props.formId, props.layoutId);
    const isRoot = form.id === layout.$id;
    const draggable = !isRoot;
    const dragDiv = React.useRef<HTMLDivElement>(null);
    useAuthoring(dragDiv, { formId: props.formId, id: props.layoutId, authoring: !!layout.$authoring, isRoot, isLayout: true });
    const [authoringInDrag, setAuthoringInDrag] = useState(getAuthoringInDrag(layout, form));
    const [subLayouts, setSubLayouts] = useState(getChildrenLayouts(layout, form));
    console.log(subLayouts.length);
    useEffect(() => {
        const layoutChanged = (propertyName: string) => {
            if (propertyName === '$authoringInDrag') {
                setAuthoringInDrag(!!layout.$authoringInDrag)
            } else if (propertyName === '$items') {
                console.log(layout.$id + '- items changed')
                console.log(layout.$items?.map(ii => ii.$id).join(', '))

                setSubLayouts(layout.$items || [])
            } else if (propertyName === '$fields') {
                setFields((layout.$fields || []) as LayoutPropsField[]);
            }
        };
        form?.subscribeToLayoutChanges(layout.$id, layoutChanged);
        return () => {
            form?.unsubscribeToLayoutChanges(layout.$id);
        };
    });
    const listItems:any[] = []; 
    subLayouts.map((item) => {
        if (item.$authoringTarget) {
            listItems.push(<LayoutTarget key={item.$id}  layoutId={item.$id} />);
        } else  {
            listItems.push(<LayoutAuthoring key={item.$id} formId={props.formId} layoutId={item.$id} />);
        }
    });
    const [fields, setFields] = useState(getChildrenFields(layout, form));
    const listFields: React.ReactElement[] = [];
    fields.forEach((item: LayoutPropsField) => {
        if (item.$widget && item.$id) {
            const TagName = ControlRegistry.getComponentClass(item.$widget);
            if (TagName) {
                listFields.push(<TagName key={item.$id} {...item} />);
            }
        }
    });
    let titleItem: React.ReactElement[] = [];
    if (layout && layout.$renderTitle && !authoringInDrag) {
        const key = layout.$id + '-title';
        if (layout.$renderTitle.binded) {
            titleItem.push(<LayoutTitleBinded key={key} {...layout.$renderTitle} />);
        } else {
            titleItem.push(<LayoutTitle key={key} {...layout.$renderTitle} />);
        }
    }
   

    const items = authoringInDrag ? [] : [...listItems, ...listFields];
    let parent: React.ReactElement | null = null;
    if (layout.$type === LayoutType.Row) {
        const classNames = ['row m-0'];
        const parentProp: any = { className: classNames.join(' ') };
        parentProp['data-drop-zone'] = true;
        parent = React.createElement('div', parentProp, items);
    } else {
        parent = React.createElement('div', { 'data-drop-zone': true }, items);
    }
    const children = parent ? [parent] : items;
    if (authoringInDrag) {
        layout.$className = addClass(layout.$className, 'hc-design-in-drag')
    } else {
        layout.$className = removeClass(layout.$className, 'hc-design-in-drag')
    }
    return (
        <div ref={dragDiv} data-form={layout.$formId} data-layout={layout.$id} className={layout.$className} draggable={draggable}>
            {titleItem}
            {children}
        </div>
    );
}


