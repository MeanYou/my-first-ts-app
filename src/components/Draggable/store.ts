/**
 * 定义Draggable组件的prop参数
 */
export interface DraggableComponentProps {
    onDragStart?: (arg: Position) => void,
    onDragging?: (arg: Position) => void,
    onDragEnd?: (arg: Position) => void,
    width?: number,
    height?: number,
    top?: number,
    left?: number,
    selected?: boolean
};

/**
 * 定义reducer
 * @param state 
 * @param action 
 */
export const reducer = (state:DraggableComponentProps, action:Action):DraggableComponentProps => {
    switch(action.type) {
        case 'drag':
            return drag(state, action);
        case 'resize':
            return resize(state, action);
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
    type: 'drag',
    top: number,
    left: number
} | {
    type: 'resize',
    width: number,
    height: number
};

/**
 * drag reducer
 */
const drag = (state:DraggableComponentProps, action:Action):DraggableComponentProps => {
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
const resize = (state:DraggableComponentProps, action:Action):DraggableComponentProps => {
    if(action.type === 'resize') {
        return {
            ...state,
            width: action.width,
            height: action.height
        }
    }
    return state;
}