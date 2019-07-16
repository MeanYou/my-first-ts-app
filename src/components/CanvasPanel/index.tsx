import * as React from 'react';
import { Slider } from 'antd';
import ContextMenu from '../ContextMenu';
import Draggable from '../Draggable';
import { reducer, initialState, CanvasPanelProps } from './store';
import './style.less';

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
                let x = selected.left === -1 ? state.containerWidth - selected.width - selected.right - 15 : selected.left - 15;
                guideLineX = {
                    dimension: 1,
                    posX: state.capturedLeft ? x : x + selected.width,
                    posY: -15
                };
            }
            if(state.capturedY) {
                let y = selected.top === -1 ? state.containerHeight - selected.height - selected.bottom - 15 : selected.top - 15;
                guideLineY = {
                    dimension: 2,
                    posX: -15,
                    posY: state.capturedTop ? y : y + selected.height
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
    
    // 事件处理函数
    const handleSelect = (selected:number) => {
        dispatch({type: 'handleSelect', selected});
    }
    const handleMouseDown = (e:React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const id = (e.target as HTMLDivElement).id;
        const cursor = (e.target as HTMLDivElement).style.cursor;
        if(e.button === 2) {
            if(id) {
                dispatch({ type: 'handleToggleMenu', showMenu: true, left: e.pageX - (e.currentTarget as HTMLDivElement).offsetLeft, top: e.pageY - ((e.currentTarget as HTMLDivElement).offsetParent as HTMLDivElement).offsetTop });
            }
        } else {
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
        if(e.button !== 2 && e.type !== 'mouseleave') {
            dispatch({ type: 'handleToggleMenu', showMenu: false });
        }
    }
    const handleToggleCapture = (e:React.MouseEvent) => {
        e.preventDefault();
        dispatch({ type: 'handleToggleCapture' });
    }
    // 处理scale改变事件
    const handleSlide = (value:number) => {
        dispatch({ type: 'handleScaleChange', scale: value });
    }

    // 右键菜单
    const menuList = [
        {
            title: '置于顶层',
            onClick: () => {
                console.log(1);
                dispatch({ type: 'handleToggleMenu', showMenu: false });
            }
        },
        {
            title: '上移一层',
            onClick: () => {
                console.log(2);
                dispatch({ type: 'handleToggleMenu', showMenu: false });
            }
        },
        {
            title: '下移一层',
            onClick: () => {
                console.log(3);
                dispatch({ type: 'handleToggleMenu', showMenu: false });
            }
        },
        {
            title: '置于底层',
            onClick: () => {
                console.log(4);
                dispatch({ type: 'handleToggleMenu', showMenu: false });
            }
        }
    ];

    return (
        <div>
            <div
                className="canvas-panel"
                style={{ width: state.containerWidth, height: state.containerHeight, transform: `scale(${state.scale})` }}
                onMouseDown={ handleMouseDown }
                onMouseMove={ handleMouseMove }
                onMouseUp={ handleMouseUp }
                onMouseLeave={ handleMouseUp }
                onContextMenu={ (e) => {e.preventDefault()} }>
                {
                    state.draggableList.map((item) => (
                        <Draggable
                            key={ item.id }
                            { ...item }
                            selected={ state.selected }
                        ></Draggable>
                    ))
                }
                <ContextMenu menuList={ menuList } show={ state.showMenu } left={ state.menuPosition.left } top={ state.menuPosition.top }></ContextMenu>
            </div>
            <button style={{ position: 'absolute', top: 20, left: 30 }} onClick={ handleToggleCapture }>{ state.capturable ? '关闭捕捉' : '开启捕捉' }</button>
            <Slider
                style={{ position: 'absolute', top: 60, left: 30, width: 100 }}
                min={0.1}
                max={1}
                onChange={ handleSlide }
                value={ state.scale }
                step={0.01}
            />
        </div>
        
    );
}

export default CanvasPanel;
