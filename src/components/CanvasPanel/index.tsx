import * as React from 'react';
import Draggable from '../Draggable';
import { reducer, CanvasPanelProps } from './store';
import { DraggableProps } from '../Draggable/store';

const ruler = require('ruler');
let myRuler:any;
const { useEffect, useReducer } = React;

const CanvasPanel = ({draggableList}:CanvasPanelProps) => {
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
    const [state, dispatch] = useReducer(reducer, { draggableList: list, selected:0, moving: false, resizing: false, resizerLeft: '0%', resizerTop: '0%', containerWidth: 1833.33, containerHeight: 600, capture: false });

    // 初始化尺子
    useEffect(() => {
        myRuler = new ruler({
            container: document.querySelector('.canvas-panel'),
            rulerHeight: 15, // thickness of ruler
            fontFamily: 'arial',// font for points
            fontSize: '12px', 
            strokeStyle: 'black',
            lineWidth: 1,
            enableMouseTracking: true,
            enableToolTip: false
        });
        return () => {
            myRuler = null;
        }
    }, []);
    // guideline显示
    useEffect(() => {
        if(state.selected !== 0) {
            let match = false;
            const selected = state.draggableList[state.selected - 1];
            const guideLines = [];
            let guideLineX1;
            let guideLineX2;
            let guideLineY1;
            let guideLineY2;
            // 当前左侧和右侧
            const currentLeft = selected.left;
            const currentRight = currentLeft + selected.width;
            // 当前顶部和底部
            const currentTop = selected.top;
            const currentBottom = currentTop + selected.height;
            for (let i = 0; i < state.draggableList.length; i++) {
                if(i === state.selected - 1) continue;
                const item = state.draggableList[i];
                const itemLeft = item.left;
                const itemRight = itemLeft + item.width;
                const itemTop = item.top;
                const itemBottom = itemTop + item.height;
                if(state.capture) {

                } else {
                    if(currentLeft === itemLeft || currentLeft === itemRight) {
                        match = true;
                        guideLineX1 = {
                            dimension: 1,
                            posX: currentLeft - 15,
                            posY: -15
                        };
                    }
                    if(currentRight === itemLeft || currentRight === itemRight) {
                        match = true;
                        guideLineX2 = {
                            dimension: 1,
                            posX: currentRight - 15,
                            posY: -15
                        };
                    }
                    if(currentTop === itemTop || currentTop === itemBottom) {
                        match = true;
                        guideLineY1 = {
                            dimension: 2,
                            posX: -15,
                            posY: currentTop - 15
                        };
                    }
                    if(currentBottom === itemTop || currentBottom === itemBottom) {
                        match = true;
                        guideLineY2 = {
                            dimension: 2,
                            posX: -15,
                            posY: currentBottom - 15
                        };
                    }
                }
            }
            guideLineX1 && guideLines.push(guideLineX1);
            guideLineX2 && guideLines.push(guideLineX2);
            guideLineY1 && guideLines.push(guideLineY1);
            guideLineY2 && guideLines.push(guideLineY2);
            if(match) {
                myRuler.api.clearGuides();
                myRuler.api.setGuides(guideLines);
            } else {
                myRuler.api.clearGuides();
            }
        }
    }, [state.draggableList]);

    const handleSelect = (selected:number) => {
        dispatch({type: 'handleSelect', selected});
    }
    const handleMouseDown = (e:React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const id = (e.target as HTMLDivElement).id;
        const cursor = (e.target as HTMLDivElement).style.cursor;
        if(id) {
            handleSelect(+id);
            dispatch({ type: 'handleMoveStart' });
        } else if(cursor) {
            const left = (e.target as HTMLDivElement).style.left || '';
            const top = (e.target as HTMLDivElement).style.top || '';
            dispatch({ type: 'handleResizeStart', resizerLeft: left, resizerTop: top });
        } else {
            handleSelect(0);
        }
    };
    const handleMouseMove = (e:React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if(state.moving) {
            dispatch({ type: 'handleMoving', movementX: e.movementX, movementY: e.movementY });
        }
        if(state.resizing) {
            dispatch({ type: 'handleResizing', movementX: e.movementX, movementY: e.movementY });
        }
    }
    const handleMouseUp = (e:React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: 'handleMoveEnd' });
        dispatch({ type: 'handleResizeEnd' });
    }

    return (
        <div
            className="canvas-panel"
            onMouseDown={ handleMouseDown }
            onMouseMove={ handleMouseMove }
            onMouseUp={ handleMouseUp }
            onMouseLeave={ handleMouseUp }>
            {
                state.draggableList.map((item) => (
                    <Draggable
                        key={ item.id }
                        { ...item }
                        selected={ state.selected }
                    ></Draggable>
                ))
            }
        </div>
    );
}

export default CanvasPanel;
