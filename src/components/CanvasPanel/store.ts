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
    capture: boolean
}

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

const handleSelect = (state:State, action:Action):State => {
    if(action.type === 'handleSelect') {
        return {
            ...state,
            selected: action.selected
        };
    }
    return state;
}
const handleMoveStart = (state:State, action:Action):State => {
    if(action.type === 'handleMoveStart') {
        return {
            ...state,
            moving: true
        };
    }
    return state;
};
const handleMoving = (state:State, action:Action):State => {
    if(action.type === 'handleMoving') {
        const list = [...state.draggableList];
        const left = (list[state.selected - 1].left as number) + action.movementX;
        const top = (list[state.selected - 1].top as number) + action.movementY;
        list[state.selected - 1].left = left > 0 ? ((left < state.containerWidth - (list[state.selected - 1].width as number)) ? left : (state.containerWidth - (list[state.selected - 1].width as number))) : 0;
        list[state.selected - 1].top = top > 0 ? ((top < state.containerHeight - (list[state.selected - 1].height as number)) ? top : (state.containerHeight - (list[state.selected - 1].height as number))) : 0;
        return {
            ...state,
            draggableList: list
        };
    }
    return state;
};
const handleMoveEnd = (state:State, action:Action):State => {
    if(action.type === 'handleMoveEnd') {
        return {
            ...state,
            moving: false
        };
    }
    return state;
};
const handleResizeStart = (state:State, action:Action):State => {
    if(action.type === 'handleResizeStart') {
        return {
            ...state,
            resizing: true,
            resizerLeft: action.resizerLeft,
            resizerTop: action.resizerTop
        }
    }
    return state;
}
const handleResizing = (state:State, action:Action):State => {
    if(action.type === 'handleResizing') {
        console.log(state.resizerLeft, state.resizerTop);
        const list = [...state.draggableList];
        const index = state.selected - 1;
        // list[index].width = list[index].width + action.movementX;
        // list[index].height = list[index].height + action.movementY;
        if(state.resizerLeft === '0%' && list[index].width - action.movementX > MIN_WIDTH) {
            list[index].width = list[index].width - action.movementX;
            list[index].left = list[index].left + action.movementX;
        }
        if(state.resizerLeft === '100%' && list[index].width + action.movementX > MIN_WIDTH) {
            list[index].width = list[index].width + action.movementX;
        }
        if(state.resizerTop === '0%' && list[index].height - action.movementY > MIN_HEIGHT) {
            list[index].height = list[index].height - action.movementY;
            list[index].top = list[index].top + action.movementY;
        }
        if(state.resizerTop === '100%' && list[index].height + action.movementY > MIN_HEIGHT) {
            list[index].height = list[index].height + action.movementY;
        }
        
        return {
            ...state,
            draggableList: list
        };
    }
    return state;
}
const handleResizeEnd = (state:State, action:Action):State => {
    if(action.type === 'handleResizeEnd') {
        return {
            ...state,
            resizing: false
        }
    }
    return state;
}

export const reducer = (state:State, action:Action) => {
    switch(action.type) {
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
