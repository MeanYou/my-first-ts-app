import { DraggableProps } from '../Draggable/store';
/**
 * 配置常量
 */
export const MIN_WIDTH = 100;
export const MIN_HEIGHT = 100;
export const CAPTURE_TOLERANCE = 1;// 捕捉容差

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
    capturedLeft: boolean,
    capturedY: boolean,
    capturedTop: boolean
}

/**
 * 初始状态
 */
const list:Array<DraggableProps> = [{
    id: 1,
    selected: 0,
    top: 50,
    left: 50,
    right: 0,
    bottom: 0,
    width: 100,
    height: 100
},{
    id: 2,
    selected: 0,
    top: 50,
    left: 150,
    right: 0,
    bottom: 0,
    width: 100,
    height: 100
},{
    id: 3,
    selected: 0,
    top: 50,
    left: 250,
    right: 0,
    bottom: 0,
    width: 100,
    height: 100
},{
    id: 4,
    selected: 0,
    top: 50,
    left: 350,
    right: 0,
    bottom: 0,
    width: 100,
    height: 100
}];
export const initialState = {
    draggableList: list,
    selected: 0,
    moving: false,
    resizing: false,
    resizerLeft: '0%',
    resizerTop: '0%',
    containerWidth: 1620,
    containerHeight: 600,
    capturable: true,
    capturedX: false,
    capturedLeft: true,
    capturedY: false,
    capturedTop: true
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
        let capturedLeft = true;
        let capturedY = false;
        let capturedTop = true;
        if(state.capturable) {
            let res = shouldCaptureMoving(left, top, state.selected - 1, list);
            left = res.left;
            top = res.top;
            capturedX = res.capturedX;
            capturedLeft = res.capturedLeft;
            capturedY = res.capturedY;
            capturedTop = res.capturedTop;
        }
        list[state.selected - 1].left = left;
        list[state.selected - 1].top = top;
        return {
            ...state,
            draggableList: list,
            capturedX,
            capturedLeft,
            capturedY,
            capturedTop
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
        if (state.resizerLeft === '0%') {
            // 该计算方式为了避免在左上边缘处鼠标移动left为0时，导致宽度增加的问题，top影响高度同理
            let width = list[index].width - action.movementX;
            let left = list[index].left + action.movementX;
            if(width < MIN_WIDTH) {
                width = MIN_WIDTH;
                left = left - action.movementX;
            }
            if(left < 0) {
                width = width + left;
                left = 0;
            }
            list[index].width = width;
            list[index].left = left;
        }
        if (state.resizerLeft === '100%') {
            let width = list[index].width + action.movementX;
            if(width < MIN_WIDTH) {
                width = MIN_WIDTH;
            }
            if(width + list[index].left > state.containerWidth) {
                width = state.containerWidth - list[index].left;
            }
            list[index].width = width;
        }
        if (state.resizerTop === '0%') {
            let height = list[index].height - action.movementY;
            let top = list[index].top + action.movementY;
            if(height < MIN_HEIGHT) {
                height = MIN_HEIGHT;
                top = top - action.movementY;
            }
            if(top < 0) {
                height = height + top;
                top = 0;
            }
            list[index].height = height;
            list[index].top = top;
        }
        if (state.resizerTop === '100%') {
            let height = list[index].height + action.movementY;
            if(height < MIN_HEIGHT) {
                height = MIN_HEIGHT;
            }
            if(height + list[index].top > state.containerHeight) {
                height = state.containerHeight - list[index].top;
            }
            list[index].height = height;
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
    capturedMovementX: number,
    capturedLeft: boolean,
    capturedY: boolean,
    capturedMovementY: number,
    capturedTop: boolean
}
/**
 * 判断是否到达捕获位置
 */
function shouldCaptureMoving(left:number, top:number, index:number, list:Array<DraggableProps>):ResProps {
    const res:ResProps = {
        left: left,
        top: top,
        capturedX: false,
        capturedMovementX: 0,
        capturedLeft: true,
        capturedY: false,
        capturedMovementY: 0,
        capturedTop: true
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
        if(Math.abs(left - itemLeft) <= CAPTURE_TOLERANCE) {
            res.left = itemLeft;
            res.capturedX = true;
            res.capturedMovementX = left - itemLeft;
        }
        if(!res.capturedX && Math.abs(left - itemRight) <= CAPTURE_TOLERANCE) {
            res.left = itemRight;
            res.capturedX = true;
            res.capturedMovementX = left - itemRight;
        }
        if(!res.capturedX && Math.abs(right - itemLeft) <= CAPTURE_TOLERANCE) {
            res.left = itemLeft - selected.width;
            res.capturedX = true;
            res.capturedMovementX = right - itemRight;
            res.capturedLeft = false;
        }
        if(!res.capturedX && Math.abs(right - itemRight) <= CAPTURE_TOLERANCE) {
            res.left = itemRight - selected.width;
            res.capturedX = true;
            res.capturedMovementX = right - itemRight;
            res.capturedLeft = false;
        }
        // 捕捉Y轴
        if(Math.abs(top - itemTop) <= CAPTURE_TOLERANCE) {
            res.top = itemTop;
            res.capturedY = true;
            res.capturedMovementY = top - itemTop;
        }
        if(!res.capturedY && Math.abs(top - itemBottom) <= CAPTURE_TOLERANCE) {
            res.top = itemBottom;
            res.capturedY = true;
            res.capturedMovementY = top - itemBottom;
        }
        if(!res.capturedY && Math.abs(bottom - itemTop) <= CAPTURE_TOLERANCE) {
            res.top = itemTop - selected.height;
            res.capturedY = true;
            res.capturedMovementY = bottom - itemTop;
            res.capturedTop = false;
        }
        if(!res.capturedY && Math.abs(bottom - itemBottom) <= CAPTURE_TOLERANCE) {
            res.top = itemBottom - selected.height;
            res.capturedY = true;
            res.capturedMovementY = bottom - itemBottom;
            res.capturedTop = false;
        }
    }
    return res;
}

// function shouldCaptureResizing() {
    
// }