import { observable } from 'mobx';

export class AppStore {
    @observable public id: any;
    constructor({id}: any) {
        this.id = id;
    }
}