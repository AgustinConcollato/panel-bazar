import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import { Loading } from "../Loading/Loading";
import { usePlatform } from "../../hooks/usePlatform";
import './ProductsByProviderChart.css';

export function ProductsByProviderChart({ data }) {
    const chartRef = useRef(null);

    const mobile = usePlatform();

    const [legend, setLegend] = useState({
        orient: 'horiz',
        left: 'left'
    });

    useEffect(() => {

        if (mobile) setLegend(null)

        if (chartRef.current) {
            const chartInstance = echarts.init(chartRef.current);

            const options = {
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        return `
                            <strong>${params.marker} ${params.name}</strong><br/>
                            Cantidad de productos: ${params.value}<br/>
                            Porcentaje: ${params.percent}%
                        `;
                    }
                },
                legend,
                series: [
                    {
                        type: 'pie',
                        radius: ['30%', '60%'],
                        // color: [],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 5,
                            borderColor: '#fff',
                            borderWidth: 2,
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '16',
                                fontWeight: 'normal',
                            },
                        },
                        data: data
                    }
                ]
            };

            chartInstance.setOption(options);

            return () => chartInstance.dispose(); // Cleanup al desmontar
        }
    }, [data]);

    return (
        data ?
            <div className="chart">
                <h3 className="title">Cantidad de productos por proveedor</h3>
                <div ref={chartRef} style={{ width: "100%", height: "350px" }} />
            </div> :
            <Loading />
    )
}