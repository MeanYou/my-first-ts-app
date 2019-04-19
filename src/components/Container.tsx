import * as React from 'react';
import ChartPanel from './ChartPanel';
import CanvasPanel from './CanvasPanel';
import './style.less';
import 'react-resizable/css/styles.css';
import 'antd/dist/antd.css';

export default class Container extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="container">
                <ChartPanel></ChartPanel>
                <CanvasPanel></CanvasPanel>
            </div>
        )
    }
}