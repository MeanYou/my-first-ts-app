import * as React from 'react';
import { reducer } from './store';
import { DraggableComponentProps } from "./store";
import './style.less';

const { useReducer } = React;

const Draggable = ({ width=300, height=300, top=0, left=0, selected=true, onDragStart, onDragging, onDragEnd }: DraggableComponentProps) => {
    const [state, dispatch] = useReducer(reducer, { width, height, top, left, selected });
    console.log(state, dispatch);

    const handleDragStart = (e:React.DragEvent):void => {
        // e.preventDefault();
        onDragStart && onDragStart({x: e.screenX, y: e.screenY});
    }
    const handleDragging = (e:React.DragEvent):void => {
        // e.preventDefault();
        console.log(e);
        onDragging && onDragging({x: e.screenX, y: e.screenY});
    }
    const handleDragEnd = (e:React.DragEvent):void => {
        // e.preventDefault();
        onDragEnd && onDragEnd({x: e.screenX, y: e.screenY});
    }

    return (
        <div
            draggable
            className="draggable"
            style={{ width: width, height: height, top: top, left: left}}
            onDragStart={ handleDragStart }
            onDrag={ handleDragging }
            onDragEnd={ handleDragEnd }
        ></div>
    );
}

export default Draggable;