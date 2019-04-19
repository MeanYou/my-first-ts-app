import { observable } from 'mobx';
import { CanvasModel } from 'app/models/CanvasModel';

export class CanvasStore {
    @observable public props: CanvasModel;

    constructor(props: CanvasModel) {
        this.props = props;
    }
}