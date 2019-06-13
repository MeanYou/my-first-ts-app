import * as React from 'react';
import Draggable from '../Draggable';
import { reducer, CanvasPanelProps } from './store';
import { DraggableProps } from '../Draggable/store';

const ruler = require('ruler');
const { useEffect, useReducer } = React;

const CanvasPanel = ({draggableList}:CanvasPanelProps) => {
    useEffect(() => {
        new ruler({
            container: document.querySelector('.canvas-panel'),
            rulerHeight: 15, // thickness of ruler
            fontFamily: 'arial',// font for points
            fontSize: '7px', 
            strokeStyle: 'black',
            lineWidth: 1,
            enableMouseTracking: true,
            enableToolTip: true
        });
    },[]);

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
    const [state, dispatch] = useReducer(reducer, { draggableList: list, selected:0, moving: false, resizing: false, resizerLeft: '0%', resizerTop: '0%', containerWidth: 1833.33, containerHeight: 600 });

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
