import * as React from 'react';
import {MyDraggableModel} from 'app/models/MyDraggableModel';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import './style.less';

export default class MyDraggable extends React.Component<MyDraggableModel, any> {

    constructor(props: MyDraggableModel) {
        super(props);

        this.state = {
            showMask: 'none',
            draggable: true,
            resizable: true
        }

        this.showMask = this.showMask.bind(this);
        this.hideMask = this.hideMask.bind(this);
    }

    showMask() {
        this.setState({
            showMask: 'block'
        })
    }
    hideMask() {
        this.setState({
            showMask: 'none'
        })
    }

    componentDidMount() {
    }

    render() {
        return (
            <Draggable
                cancel=".react-resizable-handle"
                bounds="parent"
                disabled={this.state.draggable}
                offsetParent={document.querySelector('.canvas-panel')}
                defaultPosition={{x: 0, y: 0}}
                scale={1}>
                <div className="draggable-resize">
                    <ResizableBox
                        width={200}
                        height={200}
                        onResizeStart={(e: any, data: any) => {
                            console.log(e);
                            console.log(data);
                            e.preventDefault();
                            return false;
                        }}
                        minConstraints={[100, 100]}
                        maxConstraints={[300, 300]}
                        draggableOpts={{
                            grid: [1, 1],
                            disabled: this.state.resizable
                        }}>
                        <div className="draggable__content" onMouseEnter={this.showMask}>
                            content
                        </div>
                    </ResizableBox>
                    <div className="draggable-mask" onMouseOut={this.hideMask} style={{display: this.state.showMask}}></div>
                </div>
            </Draggable>
        )
    }
}