import * as React from 'react';
import Draggable from '../Draggable';
import { reducer, initialState, CanvasPanelProps } from './store';

const ruler = require('ruler');
let myRuler:any;
const { useEffect, useReducer } = React;

const CanvasPanel = ({draggableList}:CanvasPanelProps) => {
    
    const [state, dispatch] = useReducer(reducer, initialState);

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
            const selected = state.draggableList[state.selected - 1];
            const guideLines = [];
            let guideLineX;
            let guideLineY;
            if(state.capturedX) {
                guideLineX = {
                    dimension: 1,
                    posX: selected.left - 15,
                    posY: -15
                };
            }
            if(state.capturedY) {
                guideLineY = {
                    dimension: 2,
                    posX: -15,
                    posY: selected.top - 15
                };
            }
            guideLineX && guideLines.push(guideLineX);
            guideLineY && guideLines.push(guideLineY);
            if(guideLines.length > 0) {
                myRuler.api.clearGuides();
                myRuler.api.setGuides(guideLines);
            } else {
                myRuler.api.clearGuides();
            }
        }
    }, [state.draggableList, state.capturedX, state.capturedY]);

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
