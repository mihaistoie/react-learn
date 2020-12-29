import React from 'react';

import { LayoutTitleProps } from '../../layout/layout-base';

export default function LayoutTitle(props: LayoutTitleProps) {
    if (!props.title) return null;
    return (
        <p className={props.className}>{props.title}</p>
    );
}



