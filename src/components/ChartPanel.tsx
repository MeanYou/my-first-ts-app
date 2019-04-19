import * as React from 'react';
import { ResizableBox } from 'react-resizable';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

class ChartPanel extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.handleStart = this.handleStart.bind(this);
    }

    handleStart(e: any) {
        console.log(e);
        return 1;
    }

    drag(e: any) {
        e.dataTransfer.setData('Text', e.target.id);
    }

    render() {
        return (
            <div className="chart-panel">
                <Tabs defaultActiveKey="1" size="small" tabBarGutter={5}>
                    <TabPane tab="条形图" key="1">
                        <ResizableBox
                            width={200}
                            height={200}
                            draggableOpts={{
                                allowAnyClick: true,
                                cancel: 'canceled',
                                disabled: true,
                                enableUserSelectHack: false,
                                grid: [1, 1],
                                handle: 'moving',
                                onStart: (e: any) => {
                                    console.log(e);
                                },
                                onDrag: (e: any) => {
                                    console.log(e);
                                },
                                onStop: (e: any) => {
                                    console.log(e);
                                },
                                onMouseDown: (e: any) => {
                                    console.log(e);
                                }
                            }}
                            minConstraints={[100, 100]}
                            maxConstraints={[300, 300]}>
                            <span>Contents</span>
                        </ResizableBox>
                    </TabPane>
                    <TabPane tab="折线图" key="2">
                        我是折线图
                    </TabPane>
                    <TabPane tab="饼状图" key="3">
                        我是饼状图
                    </TabPane>
                    <TabPane tab="玫瑰图" key="4">
                        我是玫瑰图
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default ChartPanel;