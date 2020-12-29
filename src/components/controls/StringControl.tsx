import React, { useState, useEffect, useRef } from 'react';

import { ControlRegistry } from '../../layout/registry';
import { LayoutPropsField } from '../../layout/layout-base';
import { getFormAndLayout } from '../layout/Layout';

function EditStringControl(props: LayoutPropsField) {
    const [form] = getFormAndLayout(props.$formId, props.$layoutId);
    const [value, setValue] = useState(form?.getValue(props.$bind));
    const rootElement = useRef<HTMLDivElement>(null);
    const inputElement = useRef<HTMLInputElement>(null);
    const focusTimer = useRef<number>(0);
    let focused = false;
    useEffect(() => {
        function bindChanged(propertyName: string, value: any, event: string) {
            if (propertyName === props.$bind)
                setValue(value);
        }
        form?.subscribeToChanges(props.$bind, bindChanged);
        return () => {
            if (focusTimer.current) {
                window.clearTimeout(focusTimer.current);
                focusTimer.current = 0;
            }
            form?.unsubscribeToChanges(bindChanged);
        };
    });
    const validate = () => {
        if (!focused) {
            if (form && inputElement.current)
                form.model[props.$bind] = inputElement.current.value;
        }
    };
    const _handleBlur = (event: React.ChangeEvent<HTMLElement>) => {
        focused = false;
        focusTimer.current = window.setTimeout(validate, 20);
    };
    const _handleFocus = (event: any) => {
        if (focusTimer.current) {
            window.clearTimeout(focusTimer.current);
            focusTimer.current = 0;
        }
        focused = true;
        console.log('focus');
    };
    return (
        <div ref={rootElement} onBlur={_handleBlur} onFocus={_handleFocus}>
            <input ref={inputElement} type="text" defaultValue={value} />
            <div onMouseDown={_handleFocus} tabIndex={-1}>xxxx</div>
        </div>
    );

}


export const registerEditStringControl = () => {
    ControlRegistry.register('edit-string', EditStringControl);
}
