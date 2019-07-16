import * as React from 'react';
import BarChart from '../ChartItem/BarChart';
import { DraggableProps } from '../Draggable/store';
/**
 * 配置常量
 */
export const MIN_WIDTH = 100;
export const MIN_HEIGHT = 100;
export const CAPTURE_TOLERANCE = 3;// 捕捉容差

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
    capturedTop: boolean,
    showMenu: boolean,
    menuPosition: {left: number, top: number},
    scale: number
}

/**
 * 初始状态
 */

const list:Array<DraggableProps> = [{
    id: 1,
    selected: 0,
    top: 50,
    left: 450,
    right: 0,
    bottom: 0,
    width: 100,
    height: 100,
    render: data => {
        return (
            <BarChart { ...data } name="销量" category={ ['T恤', '衬衫', '短裤', '牛仔裤'] } data={ [] }/>
        );
    }
},{
    id: 2,
    selected: 0,
    top: 50,
    left: 550,
    right: 0,
    bottom: 0,
    width: 100,
    height: 100,
    render: data => {
        return (
            <div>123</div>
        );
    }
},{
    id: 3,
    selected: 0,
    top: 50,
    left: 650,
    right: 0,
    bottom: 0,
    width: 100,
    height: 100,
    render: data => {
        return (
            <div>123</div>
        );
    }
},{
    id: 4,
    selected: 0,
    top: 50,
    left: 750,
    right: 0,
    bottom: 0,
    width: 100,
    height: 100,
    render: data => {
        return (
            <BarChart { ...data } name="销量" category={ ['T恤', '衬衫', '短裤', '牛仔裤'] } data={ [] }/>
        );
    }
}];
export const initialState = {
    draggableList: list,
    selected: 0,
    moving: false,
    resizing: false,
    resizerLeft: '0%',
    resizerTop: '0%',
    containerWidth: 13440,
    containerHeight: 5400,
    capturable: true,
    capturedX: false,
    capturedLeft: true,
    capturedY: false,
    capturedTop: true,
    showMenu: false,
    menuPosition: {
        left: 0,
        top: 0
    },
    scale: 1
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
} | {
    type: 'handleToggleCapture'
} | {
    type: 'handleToggleMenu',
    showMenu: boolean,
    left?: number,
    top?: number
} | {
    type: 'handleScaleChange',
    scale: number 
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
        const list = [...state.draggableList];
        const index = state.selected - 1;
        if(action.resizerLeft === '0%') {
            list[index].right = state.containerWidth - list[index].left - list[index].width;
            list[index].left = -1;
        }
        if(action.resizerTop === '0%') {
            list[index].bottom = state.containerHeight - list[index].top - list[index].height;
            list[index].top = -1;
        }
        return {
            ...state,
            resizing: true,
            draggableList: list,
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
        let width = list[index].width;
        let height = list[index].height;
        if(state.resizerLeft === '0%') {
            width = width - action.movementX;
        }
        if(state.resizerLeft === '100%') {
            width = width + action.movementX;
        }
        if(state.resizerTop === '0%') {
            height = height - action.movementY;
        }
        if(state.resizerTop === '100%') {
            height = height + action.movementY;
        }
        if(width < MIN_WIDTH) {
            width = MIN_WIDTH;
        }
        if(height < MIN_HEIGHT) {
            height = MIN_HEIGHT;
        }
        let capturedX = false;
        let capturedLeft = true;
        let capturedY = false;
        let capturedTop = true;
        if(state.capturable) {
            const res = shouldCaptureResizing(width, height, list, index, state.containerWidth, state.containerHeight);
            width = res.width;
            height = res.height;
            capturedX = res.capturedX;
            capturedLeft = res.capturedLeft;
            capturedY = res.capturedY;
            capturedTop = res.capturedTop;
        }
        list[index].width = width;
        list[index].height = height;
        // list[index].width = list[index].width + action.movementX;
        // list[index].height = list[index].height + action.movementY;
        // if (state.resizerLeft === '0%') {
        //     let width = list[index].width - action.movementX;
        //     if(width < MIN_WIDTH) {
        //         width = MIN_WIDTH;
        //     }
        //     if(width > state.containerWidth - )
        //     list[index].width = width;
        // }
        // if (state.resizerLeft === '100%') {
        //     let width = list[index].width + action.movementX;
        //     if(width < MIN_WIDTH) {
        //         width = MIN_WIDTH;
        //     }
        //     if(width + list[index].left > state.containerWidth) {
        //         width = state.containerWidth - list[index].left;
        //     }
        //     list[index].width = width;
        // }
        // if (state.resizerTop === '0%') {
        //     let height = list[index].height - action.movementY;
        //     let top = list[index].top + action.movementY;
        //     if(height < MIN_HEIGHT) {
        //         height = MIN_HEIGHT;
        //         top = top - action.movementY;
        //     }
        //     if(top < 0) {
        //         height = height + top;
        //         top = 0;
        //     }
        //     list[index].height = height;
        //     list[index].top = top;
        // }
        // if (state.resizerTop === '100%') {
        //     let height = list[index].height + action.movementY;
        //     if(height < MIN_HEIGHT) {
        //         height = MIN_HEIGHT;
        //     }
        //     if(height + list[index].top > state.containerHeight) {
        //         height = state.containerHeight - list[index].top;
        //     }
        //     list[index].height = height;
        // }

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
}
const handleResizeEnd = (state: State, action: Action): State => {
    if (action.type === 'handleResizeEnd') {
        const index = state.selected - 1;
        if(index > - 1) {
            const list = [...state.draggableList];
            if(list[index].left === -1) {
                list[index].left = state.containerWidth - list[index].right - list[index].width;
            }
            if(list[index].top === -1) {
                list[index].top = state.containerHeight - list[index].bottom - list[index].height;
            }
            return {
                ...state,
                draggableList: list,
                resizing: false
            }
        } else {
            return {
                ...state,
                resizing: false
            }
        }
        
    }
    return state;
}
const handleToggleCapture = (state: State, action: Action): State => {
    if(action.type === 'handleToggleCapture') {
        return {
            ...state,
            capturable: !state.capturable
        }
    }
    return state;
}
const handleToggleMenu = (state:State, action:Action): State => {
    if(action.type === 'handleToggleMenu') {
        return {
            ...state,
            showMenu: action.showMenu,
            menuPosition: {
                left: action.left || 0,
                top: action.top || 0
            }
        }
    }
    return state;
}
const handleScaleChange = (state:State, action:Action): State => {
    if(action.type === 'handleScaleChange') {
        return {
            ...state,
            scale: action.scale
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
        case 'handleToggleCapture':
            return handleToggleCapture(state, action);
        case 'handleToggleMenu':
            return handleToggleMenu(state, action);
        case 'handleScaleChange':
            return handleScaleChange(state, action);
        default:
            return state;
    }
};

interface MovingResProps {
    left: number,
    top: number,
    capturedX: boolean,
    capturedLeft: boolean,
    capturedY: boolean,
    capturedTop: boolean
}
/**
 * 判断是否move到捕获位置
 */
function shouldCaptureMoving(left:number, top:number, index:number, list:Array<DraggableProps>):MovingResProps {
    const res:MovingResProps = {
        left: left,
        top: top,
        capturedX: false,
        capturedLeft: true,
        capturedY: false,
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
        // 捕捉X轴
        if(Math.abs(left - itemLeft) <= CAPTURE_TOLERANCE) {
            res.left = itemLeft;
            res.capturedX = true;
            break;
        }
        if(Math.abs(left - itemRight) <= CAPTURE_TOLERANCE) {
            res.left = itemRight;
            res.capturedX = true;
            break;
        }
        if(Math.abs(right - itemLeft) <= CAPTURE_TOLERANCE) {
            res.left = itemLeft - selected.width;
            res.capturedX = true;
            res.capturedLeft = false;
            break;
        }
        if(Math.abs(right - itemRight) <= CAPTURE_TOLERANCE) {
            res.left = itemRight - selected.width;
            res.capturedX = true;
            res.capturedLeft = false;
            break;
        }
    }
    for (let i = 0; i < list.length; i++) {
        if(i === index) continue;
        const item = list[i];
        const itemTop = item.top;
        const itemBottom = itemTop + item.height;
        // 捕捉Y轴
        if(Math.abs(top - itemTop) <= CAPTURE_TOLERANCE) {
            res.top = itemTop;
            res.capturedY = true;
            break;
        }
        if(Math.abs(top - itemBottom) <= CAPTURE_TOLERANCE) {
            res.top = itemBottom;
            res.capturedY = true;
            break;
        }
        if(Math.abs(bottom - itemTop) <= CAPTURE_TOLERANCE) {
            res.top = itemTop - selected.height;
            res.capturedY = true;
            res.capturedTop = false;
            break;
        }
        if(Math.abs(bottom - itemBottom) <= CAPTURE_TOLERANCE) {
            res.top = itemBottom - selected.height;
            res.capturedY = true;
            res.capturedTop = false;
            break;
        }
    }
    return res;
}
interface ResizingResProps {
    width: number,
    height: number,
    capturedX: boolean,
    capturedLeft: boolean,
    capturedY: boolean,
    capturedTop: boolean
}
/**
 * 判断是否resize到捕获位置
 */
function shouldCaptureResizing(width:number, height:number, list:Array<DraggableProps>, index:number, containerWidth:number, containerHeight:number):ResizingResProps {
    
    const selected = list[index];
    const res = {
        width,
        height,
        capturedX: false,
        capturedLeft: true,
        capturedY: false,
        capturedTop: true
    };
    const left = selected.left === -1 ? containerWidth - selected.right - width : selected.left;
    const right = left + width;
    const top = selected.top === -1 ? containerHeight - selected.bottom - height : selected.top;
    const bottom = top + height;
    console.log(left, right, top, bottom)
    // 捕捉X轴
    if(selected.left === -1) {// resize左侧
        for (let i = 0; i < list.length; i++) {
            if(i === index) continue;
            const item = list[i];
            const itemLeft = item.left;
            const itemRight = itemLeft + item.width;
            if(Math.abs(left - itemLeft) <= CAPTURE_TOLERANCE) {
                res.width = right - itemLeft;
                res.capturedX = true;
                break;
            }
            if(Math.abs(left - itemRight) <= CAPTURE_TOLERANCE) {
                res.width = right - itemRight;
                res.capturedX = true;
                break;
            }
        }
    } else {// resize右侧
        for (let i = 0; i < list.length; i++) {
            if(i === index) continue;
            const item = list[i];
            const itemLeft = item.left;
            const itemRight = itemLeft + item.width;
            if(Math.abs(right - itemLeft) <= CAPTURE_TOLERANCE) {
                res.width = itemLeft - left;
                res.capturedX = true;
                res.capturedLeft = false;
                break;
            }
            if(Math.abs(right - itemRight) <= CAPTURE_TOLERANCE) {
                res.width = itemRight - left;
                res.capturedX = true;
                res.capturedLeft = false;
                break;
            }
        }
    }
    // 捕捉Y轴
    if(selected.top === -1) {// resize上方
        for (let i = 0; i < list.length; i++) {
            if(i === index) continue;
            const item = list[i];
            const itemTop = item.top;
            const itemBottom = itemTop + item.height;
            if(Math.abs(top - itemTop) <= CAPTURE_TOLERANCE) {
                res.height = bottom - itemTop;
                res.capturedY = true;
                break;
            }
            if(Math.abs(top - itemBottom) <= CAPTURE_TOLERANCE) {
                res.height = bottom - itemBottom;
                res.capturedY = true;
                break;
            }
        }
    } else {// resize下方
        for (let i = 0; i < list.length; i++) {
            if(i === index) continue;
            const item = list[i];
            const itemTop = item.top;
            const itemBottom = itemTop + item.height;
            if(Math.abs(bottom - itemTop) <= CAPTURE_TOLERANCE) {
                res.height = itemTop - top;
                res.capturedY = true;
                res.capturedTop = false;
                break;
            }
            if(Math.abs(bottom - itemBottom) <= CAPTURE_TOLERANCE) {
                res.height = itemBottom - top;
                res.capturedY = true;
                res.capturedTop = false;
                break;
            }
        }
    }
    return res;
}