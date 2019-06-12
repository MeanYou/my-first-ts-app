/**
 * CanvasPanel属性
 */
export interface CanvasPanelProps {
    draggableList: Array<object>
}

/**
 * CanvasPanel自身状态
 */
export interface State {
    draggableList: Array<object>,
    selected: number
}

/**
 * 定义action
 */
export type Action = {
    type: 'handleSelect',
    selected: number
} | {
    type: 'handleMouseDown'
} | {
    type: 'handleMouseMove'
} | {
    type: 'handleMouseUp'
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
const handleMouseDown = (state:State, action:Action):State => {
    return state;
};
const handleMouseMove = (state:State, action:Action):State => {
    return state;
}
const handleMouseUp = (state:State, action:Action):State => {
    return state;
}

export const reducer = (state:State, action:Action) => {
    switch(action.type) {
        case 'handleSelect':
            return handleSelect(state, action);
        case 'handleMouseDown':
            return handleMouseDown(state, action);
        case 'handleMouseMove':
            return handleMouseMove(state, action);
        case 'handleMouseUp':
            return handleMouseUp(state, action);
        default:
            return state;
    }
};
