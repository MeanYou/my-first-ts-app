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
}

export const reducer = (state:State, action:Action) => {
    switch(action.type) {
        case 'handleSelect':
            return {
                ...state,
                selected: action.selected
            };
        default:
            return state;
    }
};
