import React, { useState, useEffect, useRef } from 'react';

import { Helper } from '../../tools/helper';
import { LayoutTitleProps } from '../../layout/layout-base';
import { getForm } from './Layout';


export default function LayoutTitleBinded(props: LayoutTitleProps) {
    const fromNotify = useRef<boolean>(false);
    const initialValue = useRef<any>({});
    let nv = {};
    if (!fromNotify.current) {
        const form = getForm(props.formId);
        console.log('IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII');
        for (const bind of (props.binded || []))
            initialValue.current[bind] = form?.getValue(bind);
        nv = Helper.execExpression(props.title, initialValue.current);
    }
    fromNotify.current = false;
    const [value, setValue] = useState(nv);
    useEffect(() => {
        const form = getForm(props.formId);
        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
        const bindChanged = (propertyName: string, propValue: any, event: string) => {
            fromNotify.current = true;
            console.log('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
            initialValue.current[propertyName] = propValue;
            setValue(Helper.execExpression(props.title, initialValue.current));
        };
        for (const bind of props.binded || [])
            form?.subscribeToChanges(bind, bindChanged);
        return () => {
            form?.unsubscribeToChanges(bindChanged);
        };
    }, [props.formId, props.binded, props.title]);
    return (
        <p className={props.className}>{value}</p>
    );

}
