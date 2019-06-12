import * as React from 'react';
import Draggable from '../Draggable';
import { reducer, CanvasPanelProps } from './store';

const { useReducer } = React;

const CanvasPanel = ({draggableList}:CanvasPanelProps) => {
    const [state, dispatch] = useReducer(reducer, { draggableList, selected:0 });
    const handleSelect = (selected:number) => {
        dispatch({type: 'handleSelect', selected});
    }

    return (
        <div className="canvas-panel">
            <Draggable
                id={1}
                containerWidth={1620}
                containerHeight={600}
                top={300}
                left={300}
                selected={ state.selected }
                onSelect={ handleSelect }></Draggable>
        </div>
    );
}

export default CanvasPanel;
