/**
 * 定义Draggable组件的prop参数
 */
export interface DraggableProps {
    id: number,
    containerWidth: number,
    containerHeight: number,
    width?: number,
    height?: number,
    top?: number,
    left?: number,
    selected?: number,
    onSelect?: (selected: number) => void,
    onDragging?: (arg: Position) => void,
    onDragEnd?: (arg: Position) => void,
};

/**
 * 定义自身state属性
 */
export interface State {
    width: number,
    height: number,
    top: number,
    left: number,
    dragging: boolean
};

/**
 * 定义reducer
 * @param state 
 * @param action 
 */
export const reducer = (state:State, action:Action):State => {
    switch(action.type) {
        case 'mouseDown':
            return handleMouseDown(state, action);
        case 'drag':
            return handleDrag(state, action);
        case 'resize':
            return handleResize(state, action);
        case 'mouseUp':
            return handleMouseUp(state, action);
        default:
            return state;
    }
}

/**
 * 定义Position接口
 */
export interface Position {
    x: number,
    y: number
}

/**
 * 定义action类型
 */
export type Action = {
    type: 'mouseDown'
} | {
    type: 'drag',
    top: number,
    left: number
} | {
    type: 'resize',
    width: number,
    height: number
} | {
    type: 'mouseUp'
};

/**
 * mouseDown reducer
 */
const handleMouseDown = (state:State, action:Action):State => {
    if(action.type === 'mouseDown') {
        return {
            ...state,
            dragging: true
        };
    }
    return state;
}

/**
 * drag reducer
 */
const handleDrag = (state:State, action:Action):State => {
    if(action.type === 'drag') {
        return {
            ...state,
            top: action.top,
            left: action.left
        };
    }
    return state;
}

/**
 * resize reducer
 */
const handleResize = (state:State, action:Action):State => {
    if(action.type === 'resize') {
        return {
            ...state,
            width: action.width,
            height: action.height
        };
    }
    return state;
}

/**
 * mouseUp reducer
 */
const handleMouseUp = (state:State, action:Action):State => {
    if(action.type === 'mouseUp') {
        return {
            ...state,
            dragging: false
        };
    }
    return state;
}

/**
 * ResizePointProps 更改宽高属性的事件
 */
export interface ResizePointProps {
    top: number | string,
    left: number | string,
    cursor: string,
    onDragging: (offsetX: number, offsetY: number) => void
}