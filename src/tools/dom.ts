
let _window: Window | undefined = undefined;
try {
    _window = window;
} catch (e) {
}

export function getWindow(rootElement?: Element | null): Window | undefined {
    const el = rootElement as Element;
    return el && el.ownerDocument && el.ownerDocument.defaultView ? el.ownerDocument.defaultView : _window;
}

export function addClass(css: string, className: string): string {
    const cssArray = (css || '').split(' ');
    if (cssArray.indexOf(className) < 0) {
        cssArray.push(className);
    }
    return cssArray.join(' ');
}

export function removeClass(css: string, className: string): string {
    const cssArray = (css || '').split(' ');
    const index = cssArray.indexOf(className);
    if (index >= 0)
        cssArray.splice(index, 1);
    return cssArray.join(' ');
}