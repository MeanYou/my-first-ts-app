import { AppStore } from './AppStore';
import { CanvasStore } from './CanvasStore';

const appStore = new AppStore(123);
const canvasStore = new CanvasStore({id: 1, title: '图表1'});

export const stores = {
    appStore,
    canvasStore
};