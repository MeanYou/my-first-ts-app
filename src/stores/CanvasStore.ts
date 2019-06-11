import { observable, action } from 'mobx';

export class CanvasStore {
    @observable public props: any;
    @observable public draggables: Array<any>;

    @action
    addDraggable = (draggable: any) => {
        this.draggables.push(draggable);
    }

    constructor(props?: any) {
        this.props = props;
    }
}