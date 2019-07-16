import * as React from 'react';
import { BarChartProps } from './store';

const echarts = require('echarts');

const { useEffect, useRef } = React;

const BarChart = ({ width, height, name, category, data }:BarChartProps) => {
    let myChart:any;
    const chartRef = useRef(null);
    useEffect(() => {
        myChart = echarts.init(chartRef.current);
        const option = {
            title: {
                text: 'title'
            },
            xAxis: {
                data: category
            },
            yAxis: {},
            series: [{
                name: name,
                type: 'bar',
                data: data
            }]
        };
        myChart.setOption(option);
        return () => {
            myChart = null;
        }
    }, []);
    useEffect(() => {
        if(myChart) {
            myChart.resize();
        }
    }, [width, height]);

    return (
        <div ref={ chartRef } style={{ width: width, height: height }}></div>
    );
}

export default BarChart;