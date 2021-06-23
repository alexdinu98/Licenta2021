import React, {useState, useEffect} from 'react';

import {Line} from 'react-chartjs-2';
import {getdata} from '../data/apiData';


const LineChartScreen = () => {
    const [lablesData, setLabelsData] = useState([]);
    const [confirmedData, setConfirmedData] = useState([]);


    const data = (canvas) => {
        const ctx = canvas.getContext("2d");
        const gradient1 = ctx.createLinearGradient(0, 90, 100, 0);

        gradient1.addColorStop(0, '#B7F8DB');
        gradient1.addColorStop(0.5, '#50A7C2');
        gradient1.addColorStop(1, '#B7F8DB');

        return {
            labels: lablesData,
            datasets: [
                {
                    fill: false,
                    label: 'Number of files',
                    data: confirmedData,
                    backgroundColor: gradient1,
                    borderColor: gradient1,
                    borderWidth: 5
                },
            ]
        }
    }
    const options = {
        responsive: true,
        tooltips: {
            mode: 'index',
            intersect: false,
			animationDuration: 400,

        },
        hover: {
            mode: null,
            intersect: true
            
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                fontColor: 'rgba(242, 38, 19, 1)'
            }
        },
    }
    const getChartData = async () => {
        try{
            let labelsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            let confirmedArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            const response = await getdata();
            response.forEach(element => {
                let y = element.createdAt;
                if(y.slice(5, 7) == "01") confirmedArray[0]++
                    else if(y.slice(5, 7) == "02") confirmedArray[1]++
                        else if(y.slice(5, 7) == "03") confirmedArray[2]++
                            else if(y.slice(5, 7) == "04") confirmedArray[3]++
                                else if(y.slice(5, 7) == "05") confirmedArray[4]++
                                    else if(y.slice(5, 7) == "06") confirmedArray[5]++
                                        else if(y.slice(5, 7) == "07") confirmedArray[6]++
                                            else if(y.slice(5, 7) == "08") confirmedArray[7]++
                                                else if(y.slice(5, 7) == "09") confirmedArray[8]++
                                                    else if(y.slice(5, 7) == "10") confirmedArray[9]++
                                                        else if(y.slice(5, 7) == "11") confirmedArray[10]++
                                                            else confirmedArray[11]++;
            });
            console.log(confirmedArray);
            setLabelsData(labelsArray);
            setConfirmedData(confirmedArray);
        }catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getChartData();
    }, []);
    return (
        <Line data={data} options={options}/>
    );
}

export default LineChartScreen;