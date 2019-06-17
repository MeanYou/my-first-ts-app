import { DraggableProps } from '../Draggable/store';
/**
 * 配置常量
 */
export const MIN_WIDTH = 100;
export const MIN_HEIGHT = 100;

/**
 * CanvasPanel属性
 */
export interface CanvasPanelProps {
    draggableList: Array<DraggableProps>
}

/**
 * CanvasPanel自身状态
 */
export interface State {
    draggableList: Array<DraggableProps>,
    selected: number,
    moving: boolean,
    resizing: boolean,
    resizerLeft: string,
    resizerTop: string,
    containerWidth: number,
    containerHeight: number,
    capturable: boolean,
    capturedX: boolean,
    capturedY: boolean
}

/**
 * 初始状态
 */
const list:Array<DraggableProps> = [{
    id: 1,
    selected: 0,
    top: 10,
    left: 20,
    width: 300,
    height: 300
},{
    id: 2,
    selected: 0,
    top: 300,
    left: 300,
    width: 100,
    height: 200
}];
export const initialState = {
    draggableList: list,
    selected: 0,
    moving: false,
    resizing: false,
    resizerLeft: '0%',
    resizerTop: '0%',
    containerWidth: 1833.33,
    containerHeight: 600,
    capturable: true,
    capturedX: false,
    capturedY: false
};

/**
 * 定义action
 */
export type Action = {
    type: 'handleSelect',
    selected: number
} | {
    type: 'handleMoveStart'
} | {
    type: 'handleMoving',
    movementX: number,
    movementY: number
} | {
    type: 'handleMoveEnd'
} | {
    type: 'handleResizeStart',
    resizerLeft: string,
    resizerTop: string
} | {
    type: 'handleResizing',
    movementX: number,
    movementY: number
} | {
    type: 'handleResizeEnd'
}

const handleSelect = (state: State, action: Action): State => {
    if (action.type === 'handleSelect') {
        return {
            ...state,
            selected: action.selected
        };
    }
    return state;
}
const handleMoveStart = (state: State, action: Action): State => {
    if (action.type === 'handleMoveStart') {
        return {
            ...state,
            moving: true
        };
    }
    return state;
};
const handleMoving = (state: State, action: Action): State => {
    if (action.type === 'handleMoving') {
        const list = [...state.draggableList];
        let left = (list[state.selected - 1].left as number) + action.movementX;
        let top = (list[state.selected - 1].top as number) + action.movementY;
        left = left > 0 ? ((left < state.containerWidth - (list[state.selected - 1].width as number)) ? left : (state.containerWidth - (list[state.selected - 1].width as number))) : 0;
        top = top > 0 ? ((top < state.containerHeight - (list[state.selected - 1].height as number)) ? top : (state.containerHeight - (list[state.selected - 1].height as number))) : 0;
        let capturedX = false;
        let capturedY = false;
        if(state.capturable) {
            let res = shouldCapture(left, top, state.selected - 1, list);
            left = res.left;
            top = res.top;
            capturedX = res.capturedX;
            capturedY = res.capturedY;
        }
        list[state.selected - 1].left = left;
        list[state.selected - 1].top = top;
        return {
            ...state,
            draggableList: list,
            capturedX,
            capturedY
        };
    }
    return state;
};
const handleMoveEnd = (state: State, action: Action): State => {
    if (action.type === 'handleMoveEnd') {
        return {
            ...state,
            moving: false,
            capturedX: false,
            capturedY: false
        };
    }
    return state;
};
const handleResizeStart = (state: State, action: Action): State => {
    if (action.type === 'handleResizeStart') {
        return {
            ...state,
            resizing: true,
            resizerLeft: action.resizerLeft,
            resizerTop: action.resizerTop
        }
    }
    return state;
}
const handleResizing = (state: State, action: Action): State => {
    if (action.type === 'handleResizing') {
        const list = [...state.draggableList];
        const index = state.selected - 1;
        // list[index].width = list[index].width + action.movementX;
        // list[index].height = list[index].height + action.movementY;
        if (state.resizerLeft === '0%' && list[index].width - action.movementX > MIN_WIDTH) {
            list[index].width = list[index].width - action.movementX;
            list[index].left = list[index].left + action.movementX;
        }
        if (state.resizerLeft === '100%' && list[index].width + action.movementX > MIN_WIDTH) {
            list[index].width = list[index].width + action.movementX;
        }
        if (state.resizerTop === '0%' && list[index].height - action.movementY > MIN_HEIGHT) {
            list[index].height = list[index].height - action.movementY;
            list[index].top = list[index].top + action.movementY;
        }
        if (state.resizerTop === '100%' && list[index].height + action.movementY > MIN_HEIGHT) {
            list[index].height = list[index].height + action.movementY;
        }

        return {
            ...state,
            draggableList: list
        };
    }
    return state;
}
const handleResizeEnd = (state: State, action: Action): State => {
    if (action.type === 'handleResizeEnd') {
        return {
            ...state,
            resizing: false
        }
    }
    return state;
}

export const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'handleSelect':
            return handleSelect(state, action);
        case 'handleMoveStart':
            return handleMoveStart(state, action);
        case 'handleMoving':
            return handleMoving(state, action);
        case 'handleMoveEnd':
            return handleMoveEnd(state, action);
        case 'handleResizeStart':
            return handleResizeStart(state, action);
        case 'handleResizing':
            return handleResizing(state, action);
        case 'handleResizeEnd':
            return handleResizeEnd(state, action);
        default:
            return state;
    }
};

interface ResProps {
    left: number,
    top: number,
    capturedX: boolean,
    capturedY: boolean
}
/**
 * 判断是否到达捕获位置
 */
function shouldCapture(left:number, top:number, index:number, list:Array<DraggableProps>):ResProps {
    const captureTolerance = 10;// 捕捉容差
    const res:ResProps = {
        left: left,
        top: top,
        capturedX: false,
        capturedY: false
    };
    const selected = list[index];
    const right = left + selected.width;
    const bottom = top + selected.height;
    for (let i = 0; i < list.length; i++) {
        if(i === index) continue;
        const item = list[i];
        const itemLeft = item.left;
        const itemRight = itemLeft + item.width;
        const itemTop = item.top;
        const itemBottom = itemTop + item.height;

        // 捕捉X轴
        if(Math.abs(left - itemLeft) <= captureTolerance) {
            res.left = itemLeft;
            res.capturedX = true;
        }
        if(!res.capturedX && Math.abs(left - itemRight) <= captureTolerance) {
            res.left = itemRight;
            res.capturedX = true;
        }
        if(!res.capturedX && Math.abs(right - itemLeft) <= captureTolerance) {
            res.left = itemLeft - selected.width;
            res.capturedX = true;
        }
        if(!res.capturedX && Math.abs(right - itemRight) <= captureTolerance) {
            res.left = itemRight - selected.width;
            res.capturedX = true;
        }
        // 捕捉Y轴
        if(Math.abs(top - itemTop) <= captureTolerance) {
            res.top = itemTop;
            res.capturedY = true;
        }
        if(!res.capturedY && Math.abs(top - itemBottom) <= captureTolerance) {
            res.top = itemBottom;
            res.capturedY = true;
        }
        if(!res.capturedY && Math.abs(bottom - itemTop) <= captureTolerance) {
            res.top = itemTop - selected.height;
            res.capturedY = true;
        }
        if(!res.capturedY && Math.abs(bottom - itemBottom) <= captureTolerance) {
            res.top = itemBottom - selected.height;
            res.capturedY = true;
        }
    }
    return res;
}