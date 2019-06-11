import * as React from 'react';
import MyDraggable from './MyDraggable';
import Draggable from './Draggable';

class CanvasPanel extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="canvas-panel">
                <MyDraggable
                    selected={true}
                    type="bar"
                    dataSource={{a:1, b:3}}>
                </MyDraggable>
                <Draggable></Draggable>
                <Draggable top={300} left={300}></Draggable>
            </div>
        );
    }
}

export default CanvasPanel;
