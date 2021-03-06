import { Form } from "./form";
import { FormManagerHelper } from "./form-manager";

export interface AuthoringDragInfo {
    authoring: boolean;
    formId: string;
    id: string;
    isLayout: boolean;
    isRoot: boolean;
}

interface InfoDrag {
    element?: HTMLElement;
    formId: string;
    id: string;
    isLayout: boolean;
    dragStartHandler: ((ev: DragEvent) => any) | null;
    dragEndHandler: ((ev: DragEvent) => any) | null;
    dropHandler: ((ev: DragEvent) => any) | null;
    dragHandler: ((ev: DragEvent) => any) | null;
    dragOverHandler: ((ev: DragEvent) => any) | null;
}


class AuthoringDragManager {
    private form: Form | null;
    private dragImage: HTMLElement | null;
    private blocks: Map<HTMLElement, InfoDrag>;
    private inDragging: InfoDrag | null = null;
    public formId: string;

    private createDragImage() {
        const crt = document.createElement('div');
        crt.className = 'hc-drag-image';
        document.body.appendChild(crt);
        this.dragImage = crt;
    }
    private removeDragImage() {
        if (this.dragImage) {
            this.dragImage.parentElement?.removeChild(this.dragImage);
            this.dragImage = null;
        }
    }
    private cleanUpDrag() {
        const ii = this.inDragging;
        if (ii) {
            const layout = this.form?.layoutById(ii.id);
            if (layout && layout.$authoringInDrag) {
                layout.$authoringInDrag = false;
                this.form?.notifyLayoutPropChanged(layout.$id, '$authoringInDrag');
            }
        }
        this.removeDragImage();
        this.inDragging = null;
    }

    private dragEndHandler(event: DragEvent) {
        // Ok
        console.log('End');
        event.preventDefault();
        event.stopPropagation();
        this.cleanUpDrag();
    }

    private dropHandler(event: DragEvent) {
        console.log('Drop');
        console.log(event);
    }

    private dragHandler(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();
        // console.log(event.target);
        return false;
    }
    private dragOverHandler(event: DragEvent) {
        const ii = this.inDragging;
        if (!ii) {
            event.preventDefault();
            return false;
        }
        const element = event.target;
        const dst = this.blocks.get(element as HTMLElement);
        const layoutDst = dst ? this.form?.layoutById(dst.id) : null;
        const layoutSource = this.form?.layoutById(ii.id);
        if (layoutSource && layoutDst && !layoutSource.$authoringInDrag) {
            if (!this.form?.isChildOfLayout(layoutDst, layoutSource)) {
                layoutSource.$authoringInDrag = true;
                this.form?.notifyLayoutPropChanged(layoutSource.$id, '$authoringInDrag');
            }
        }
        if (layoutSource && layoutDst) {
            if (!this.form?.isChildOfLayout(layoutDst, layoutSource)) {
                console.log('ccccccccccccccccccccccc');
                console.log(layoutDst.$id + ' ' + layoutSource.$id);
                const x = layoutDst.$items?.find(ii => ii.$id === 'xxx');
                if (!x) {
                    const newItems = [...layoutDst.$items || []];
                    newItems.push({
                        $id: 'xxx',
                        $type: layoutDst.$type,
                        $formId: layoutDst.$formId,
                        $authoring: true,
                        $className: '',
                        $parentId: layoutDst.$id,
                        $authoringTarget: true,

                    });
                    layoutDst.$items = newItems;
                    console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ");
                    this.form?.notifyLayoutPropChanged(layoutSource.$id, '$items');
                }
            }
        }
        return false;
    }

    private dragStartHandler(event: DragEvent) {
        event.stopPropagation();
        const element = event.target;
        const ii = this.blocks.get(element as HTMLElement);
        if (!ii) {
            event.preventDefault();
            return false;
        }
        // if (l.selected) layout.select(null);
        const dt = event.dataTransfer;
        if (!dt) {
            event.preventDefault();
            return false;
        }
        dt.effectAllowed = 'move';
        dt.setData('text/plain', '');
        this.createDragImage();
        if (this.dragImage) {
            dt.setDragImage(this.dragImage, 0, 0);
        }
        this.inDragging = ii;
    }
    public dispose() {
        this.cleanUpDrag();
        this.form = null;
        this.blocks.clear();
    }
    constructor(formId: string) {
        this.formId = formId;
        this.form = FormManagerHelper.formById(formId);
        this.blocks = new Map<HTMLElement, InfoDrag>();
        this.dragImage = null;
    }
    public addBlock(element: HTMLElement, options: AuthoringDragInfo) {
        const dragStartHandler = options.isRoot ? null : this.dragStartHandler.bind(this);
        const dragEndHandler = this.dragEndHandler.bind(this);
        const dropHandler = this.dropHandler.bind(this);
        const dragHandler = this.dragHandler.bind(this);
        const dragOverHandler = this.dragOverHandler.bind(this);

        const info: InfoDrag = {
            formId: options.formId,
            id: options.id,
            isLayout: options.isLayout,
            dragStartHandler,
            dragEndHandler,
            dropHandler,
            dragHandler,
            dragOverHandler,
        }
        this.blocks.set(element, info);
        const item = document;
        if (dragStartHandler)
            element.addEventListener('dragstart', dragStartHandler, false);
        if (dragEndHandler)
            item.addEventListener('dragend', dragEndHandler, false);
        if (dropHandler)
            item.addEventListener('drop', dropHandler, false);
        if (dragHandler)
            item.addEventListener('drag', dragHandler, false);
        if (dragOverHandler)
            item.addEventListener('dragenter', dragOverHandler, false);
    }
    public remove(element: HTMLElement) {
        const ii = this.blocks.get(element);
        /*
        if (ii === this.inDragging) {
            this.inDragging = null;
        }
        */
        const item = document;
        if (ii) {
            this.blocks.delete(element);
            if (ii.dragStartHandler)
                element.removeEventListener('dragstart', ii.dragStartHandler);
            if (ii.dragEndHandler)
                item.removeEventListener('dragend', ii.dragEndHandler);
            if (ii.dropHandler)
                item.removeEventListener('drop', ii.dropHandler);
            if (ii.dropHandler)
                item.removeEventListener('drag', ii.dropHandler);
            if (ii.dragOverHandler)
                item.removeEventListener('dragenter', ii.dragOverHandler);
        }

    }
    public isEmpty(): boolean {
        return false;
    }

}
let authoringDragManager: AuthoringDragManager | null = null;


export class Authoring {
    public static add(element: HTMLElement, options: AuthoringDragInfo) {
        if (authoringDragManager && authoringDragManager.formId !== options.formId) {
            authoringDragManager.dispose();
            authoringDragManager = null;
        }
        if (!authoringDragManager) {
            authoringDragManager = new AuthoringDragManager(options.formId);
        }
        authoringDragManager.addBlock(element, options);
    }
    public static remove(element: HTMLElement) {
        if (authoringDragManager) {
            authoringDragManager.remove(element);
            if (authoringDragManager.isEmpty()) {
                authoringDragManager.dispose();
                authoringDragManager = null;
            }
        }

    }
}