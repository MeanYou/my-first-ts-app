import { observable } from 'mobx';

export class CanvasModel {
    readonly id: number;
    @observable public title: string;

    constructor(title: string) {
        this.id = Math.random();
        this.title = title;
    }
}