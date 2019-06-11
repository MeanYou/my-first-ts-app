import { AppStore } from './AppStore';
import { CanvasStore } from './CanvasStore';

const appStore = new AppStore(123);
const canvasStore = new CanvasStore();

export const stores = {
    appStore,
    canvasStore
};