import * as React from 'react';
import { reducer, DraggableProps, ResizePointProps } from "./store";
import './style.less';

const { useReducer, useState } = React;

const Draggable = ({ id, containerWidth, containerHeight, width=300, height=300, top=0, left=0, selected=0, onSelect, onDragging, onDragEnd }:DraggableProps) => {
    const [state, dispatch] = useReducer(reducer, { width, height, top, left, dragging: false });

    // 鼠标按下
    const handleMouseDown = (e:React.MouseEvent):void => {
        e.preventDefault();
        onSelect && onSelect(id);
        dispatch({type: 'mouseDown'});
    }
    // 鼠标移动
    const handleDragging = (e:React.MouseEvent):void => {
        e.preventDefault();
        if(state.dragging) {
            onDragging && onDragging({x: 0, y: 0});
            let top = state.top + e.movementY;
            let left = state.left + e.movementX;
            top = (top > 0) ? ((top < containerHeight - state.height) ? top : (containerHeight - state.height)) : 0;
            left = (left > 0) ? ((left < containerWidth - state.width) ? left : (containerWidth - state.width)) : 0;
            dispatch({type: 'drag', top, left});
        }
    }
    // 鼠标松手
    const handleMouseUp = (e:React.MouseEvent):void => {
        e.preventDefault();
        onDragEnd && onDragEnd({x: 0, y: 0});
        dispatch({type: 'mouseUp'});
    }
    // 调整尺寸
    const handleResize = (x:number, y:number) => {
        dispatch({type: 'resize', width: state.width + x, height: state.height + y});
    }

    return (
        <div
            className="draggable"
            style={{ width: state.width, height: state.height, top: state.top, left: state.left, zIndex: id }}
            onMouseDown={ handleMouseDown }
            onMouseMove={ handleDragging }
            onMouseUp={ handleMouseUp }
            onMouseLeave={ handleMouseUp }>
            {
                id === selected ? (
                    <div>
                        <ResizePoint top={0} left={0} cursor="nw-resize" onDragging={ handleResize }></ResizePoint>
                        <ResizePoint top={0} left={'50%'} cursor="ns-resize" onDragging={ handleResize }></ResizePoint>
                        <ResizePoint top={0} left={'100%'} cursor="ne-resize" onDragging={ handleResize }></ResizePoint>
                        <ResizePoint top={'50%'} left={0} cursor="w-resize" onDragging={ handleResize }></ResizePoint>
                        <ResizePoint top={'50%'} left={'100%'} cursor="w-resize" onDragging={ handleResize }></ResizePoint>
                        <ResizePoint top={'100%'} left={0} cursor="sw-resize" onDragging={ handleResize }></ResizePoint>
                        <ResizePoint top={'100%'} left={'50%'} cursor="ns-resize" onDragging={ handleResize }></ResizePoint>
                        <ResizePoint top={'100%'} left={'100%'} cursor="se-resize" onDragging={ handleResize }></ResizePoint>
                    </div>
                ) : null
            }
            
        </div>
    );
}

const ResizePoint = (props:ResizePointProps) => {
    const [dragging, setDragging] = useState(false);
    
    return (
        <div
            className="draggable__resize"
            style={{ top: props.top, left: props.left, cursor: props.cursor }}
            onMouseDown={() => {
                setDragging(true);
            }}
            onMouseMove={(e) => {
                if(dragging) {
                    props.onDragging(e.movementX, e.movementY);
                    e.stopPropagation();
                }
            }}
            onMouseOut={(e) => {
                if(dragging) {
                    console.log(e.movementX);
                    props.onDragging(e.movementX, e.movementY);
                    e.stopPropagation();
                }
            }}
            onMouseUp={() => {
                setDragging(false);
            }}></div>
    );
}

export default Draggable;