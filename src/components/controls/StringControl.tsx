import React, { useState, useEffect, useRef } from 'react';

import { ControlRegistry } from '../../layout/registry';
import { LayoutPropsField } from '../../layout/layout-base';
import { TIMEOUT_BLUR } from '../../layout/controls';
import { FormManagerHelper } from '../../layout/form-manager';

function EditStringControl(props: LayoutPropsField) {
    // reference to form
    const [form] = FormManagerHelper.getFormAndLayout(props.$formId, props.$layoutId);
    // use state ???
    const [value, setValue] = useState(form?.getValue(props.$bind));
    // reference to root element
    const rootElement = useRef<HTMLDivElement>(null);
    // reference to input element 
    const inputElement = useRef<HTMLInputElement>(null);
    // focus timer is used to validate field onblur
    const focusTimer = useRef<number>(0);
    // Why not reference
    let focused = false;
    useEffect(() => {
        // when model changed refres control
        function bindChanged(propertyName: string, value: any, event: string) {
            if (propertyName === props.$bind) {
                if (inputElement.current && form) {
                    // setValue(form.getValue(props.$bind))
                    inputElement.current.value = form.getValue(props.$bind);
                }
            }
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
        focusTimer.current = window.setTimeout(validate, TIMEOUT_BLUR);
    };
    const _handleFocus = (event: any) => {
        if (focusTimer.current) {
            window.clearTimeout(focusTimer.current);
            focusTimer.current = 0;
        }
        focused = true;
    };
    return (
        <div key={props.$id} ref={rootElement} onBlur={_handleBlur} onFocus={_handleFocus}>
            <div onMouseDown={_handleFocus} tabIndex={-1}>xxxx</div>
            <input ref={inputElement} type="text" defaultValue={value} />
        </div>
    );

}


export const registerEditStringControl = () => {
    ControlRegistry.register('edit-string', EditStringControl);
}
