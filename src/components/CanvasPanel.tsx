import * as React from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';

class CanvasPanel extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="canvas-panel">
                <Draggable
                    cancel=".react-resizable-handle"
                    bounds="parent"
                    disabled={true}
                    offsetParent={document.querySelector('.canvas-panel')}
                    defaultPosition={{x: 0, y: 0}}
                    scale={1}>
                    <div style={{display: 'inline-block'}}>
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
                                grid: [25, 25],
                                disabled: false
                            }}>
                            <span>Contents</span>
                        </ResizableBox>
                    </div>
                </Draggable>
                <Draggable
                    cancel=".react-resizable-handle"
                    defaultPosition={{x: 0, y: 0}}
                    scale={1}>
                    <div style={{display: 'inline-block'}}>
                        <ResizableBox
                            width={200}
                            height={200}
                            minConstraints={[100, 100]}
                            maxConstraints={[300, 300]}
                            draggableOpts={{grid: [25, 25], enableUserSelectHack: true}}>
                            <span>Contents</span>
                        </ResizableBox>
                    </div>
                </Draggable>
            </div>
        );
    }
}

export default CanvasPanel;
