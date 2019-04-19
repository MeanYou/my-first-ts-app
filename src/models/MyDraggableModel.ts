import { observable } from 'mobx';

export class MyDraggableModel {
    readonly id: number;
    @observable public selected: boolean;
    @observable public type: string;
    @observable public dataSource: object;

    constructor(selected: boolean, type: string, dataSource: object) {
        this.id = Math.random();
        this.selected = selected;
        this.type = type;
        this.dataSource = dataSource;
    }
}