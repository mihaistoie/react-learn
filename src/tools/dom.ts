
let _window: Window | undefined = undefined;
try {
    _window = window;
} catch (e) {
}

export function getWindow(rootElement?: Element | null): Window | undefined {
    const el = rootElement as Element;
    return el && el.ownerDocument && el.ownerDocument.defaultView ? el.ownerDocument.defaultView : _window;
}