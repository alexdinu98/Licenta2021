import React, {useState, useEffect} from 'react';

import {Doughnut} from 'react-chartjs-2';

import {getDoughData} from '../data/apiData';


const DoughnutChartScreen = () => {
    const [_10mb, set_10mb] = useState(0);
    const [_10_30mb, set_10_30mb] = useState(0);
    const [_30mb, set_30mb] = useState(0);

    const data = (canvas) => {
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 5);
        const gradient1 = ctx.createLinearGradient(0, 0, 0, 7);
        const gradient2 = ctx.createLinearGradient(0, 0, 0, 7);
        gradient.addColorStop(0, '#4e73df');
        gradient.addColorStop(0.5, '#4e73df');
        gradient.addColorStop(1, '#4e73df');

        gradient1.addColorStop(0, '#1cc88a');
        gradient1.addColorStop(0.5, '#1cc88a');
        gradient1.addColorStop(1, '#1cc88a');

        gradient2.addColorStop(0, '#36b9cc');
        gradient2.addColorStop(0.5, '#36b9cc');
        gradient2.addColorStop(1, '#36b9cc');

        return {
            labels: ['0-10 MB', '10-30 MB', '30+ MB'],
            datasets:[
                {
                label: 'Data',
                data: [_10mb, _10_30mb, _30mb],
                backgroundColor: [gradient1, gradient, gradient2],
                borderColor: [gradient1, gradient, gradient2],
                borderWidth: 1,
                }
            ]
        }
    }
    const options = {
        aspectRatio:20,
        responsive: true,
        tooltips: {
            mode: 'index',
            intersect: false,
			animationDuration: 400,
            //enabled: false,

        },
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    }
    const getChartData = async () => {
        try{
            let _10mb = 0;
            let _10_30mb = 0;
            let _30mb = 0;
            const response = await getDoughData();
            if (response !== null) {
                for(let i = 0 ; i < response.length; i++){
                    if(response[i].fileSize < 10000000) _10mb =_10mb+1;
                        else if(response[i].fileSize > 10000000 && response[i].fileSize < 30000000) _10_30mb = _10_30mb+1;
                            else _30mb = _30mb + 1;
                }
                const total = _10mb + _10_30mb + _30mb;
                let _10mb_ = parseFloat(((_10mb / total) * 100).toFixed(2));
                let _10_30mb_ = parseFloat(((_10_30mb / total) * 100).toFixed(2));
                let _30mb_ = parseFloat(((_30mb / total) * 100).toFixed(2));
                

                set_10mb(_10mb_);
                set_10_30mb(_10_30mb_);
                set_30mb(_30mb_);
            }
        }catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getChartData();
    }, []);
    return (
        <Doughnut data={data} options={options}/>
    );
}

export default DoughnutChartScreen;