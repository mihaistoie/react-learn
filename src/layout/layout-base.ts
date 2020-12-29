export type TypeLayout = 'block' | 'row' | 'col';

export type LayoutColumnSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type HeaderSize = 1 | 2 | 3 | 4 | 5 | 6;


export interface LayoutOptions {
    bindVisibility?: string;
    bindVisibilityValue?: any;
};



export interface LayoutTitle {
    value?: string;
    size?: HeaderSize;
    $style?: string;
};

export interface LayoutFieldsOptions {
    columns?: boolean;
    labelCol?: LayoutColumnSize;
};

export interface LayoutField {
    $bind: string;
    $widget?: string;
    options?: any;
};

export interface LayoutPropsField extends LayoutField {
    $formId: string;
    $layoutId: string;
    $id: string;
};


export interface LayoutDefinition {
    $name?: string;
    $type: TypeLayout;
    $style?: string;
    $items?: Array<LayoutDefinition>;
    $fields?: Array<LayoutField>;
    options?: LayoutOptions;
    $title?: LayoutTitle;
    $inline?: boolean,
    $sticky?: 'bottom' | 'top';
    $colSize?: LayoutColumnSize;
    $fieldsOptions?: LayoutFieldsOptions;
    $id: string;
    $formId?: string;
    $authoring?: boolean;
    $className: string;
    $renderTitle?: LayoutTitleProps;
}

export interface LayoutTitleProps {
    formId: string;
    title: string;
    className: string;
    layoutId: string;
    binded?: string[];
}


export function walkLayouts(layout: LayoutDefinition, parentLayout: LayoutDefinition | null,
    onLayout?: (parent: LayoutDefinition | null, current: LayoutDefinition) => boolean,
    onField?: (parent: LayoutDefinition, current: LayoutField) => boolean
): boolean {
    if (onLayout) {
        if (!onLayout(parentLayout ? parentLayout : null, layout))
            return false;
    }
    if (layout.$items) {
        for (const item of layout.$items) {
            if (!walkLayouts(item, layout, onLayout, onField)) {
                return false;
            }
        }
    } else if (layout.$fields) {
        for (const item of layout.$fields) {
            if (onField) {
                if (!onField(layout, item))
                    return false;
            }

        }
    }
    return true;
}
