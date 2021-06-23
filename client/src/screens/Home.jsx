import React, { useEffect, useState } from "react";
import axios from 'axios';
import * as FormData  from 'form-data';
import LineChartScreen from '../charts/LineChartScreen';
import DoughChartScreen from '../charts/DoughChartScreen';

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return response.json();
}

function submitForm(contentType, data, setResponse) {
    axios({
    url: `http://localhost:8080/api/singleFile`,
    method: 'POST',
    data: data,
    headers: {
    'Content-Type': contentType
    }
    }).then((response) => {
    setResponse(response.data);
    alert('File uploaded successfully!');
    setTimeout(()=>{
        window.location.reload(false);
    }, 500);
    }).catch((error) => {
    setResponse("error");
    alert('Error');
    })
   }

const HomeScreen = () => {
    const [file, setFile] = useState(null);

    function uploadWithFormData(){
        const formData = new FormData();
        formData.append("file", file);
        submitForm("multipart/form-data", formData, (msg) => console.log(msg));
    }

    const [data, setData] = useState({});
    let x = 0;
    let index = 0;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
    let annual = 0;

    fetch('http://localhost:8080/api/getSingleFiles')
        .then(response => response.json())
        .then(data  => {
            setData(data);
        })
        .catch(err => console.error(err))
    for(let i = 0 ; i < data.length; i++)
    {   if(data.lenght != 0){
        x = x + Math.floor(data[i].fileSize);
        index = Math.floor(Math.log(x) / Math.log(1000));
        } else {
            x=0;
            index = 1;
        }
    }

    for(let i = 0 ; i < data.length; i++)
    {   
        let y = data[i].createdAt;
        if(y.slice(0, 4) == new Date().getFullYear()){
            annual++;
        }
    }

    return (
        <div class="d-flex flex-column" id="content-wrapper" class="main-cont">
            <div id="content">
                <div class="container-fluid">
                    <div class="d-sm-flex justify-content-between align-items-center mb-4">
                        <h3 class="text-dark mb-0">Dashboard</h3><a class="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#"><i class="fas fa-download fa-sm text-white-50"></i>&nbsp;Generate Report</a></div>
                    <div class="row">
                        <div class="col-md-6 col-xl-3 mb-4">
                            <div class="card shadow border-left-primary py-2">
                                <div class="card-body">
                                    <div class="row align-items-center no-gutters">
                                        <div class="col mr-2">
                                            <div class="text-uppercase text-primary font-weight-bold text-xs mb-1"><span>Files (total)</span></div>
                                            <div class="text-dark font-weight-bold h5 mb-0"><span>{data.length}</span></div>
                                        </div>
                                        <div class="col-auto"><i class="far fa-folder-open fa-2x text-gray-300"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-xl-3 mb-4 marginl15">
                            <div class="card shadow border-left-success py-2">
                                <div class="card-body">
                                    <div class="row align-items-center no-gutters">
                                        <div class="col mr-2">
                                            <div class="text-uppercase text-success font-weight-bold text-xs mb-1"><span>Files (annual)</span></div>
                                            <div class="text-dark font-weight-bold h5 mb-0"><span>{annual}</span></div>
                                        </div>
                                        <div class="col-auto"><i class="far fa-folder-open fa-2x text-gray-300"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-xl-3 mb-4 marginl15">
                            <div class="card shadow border-left-warning py-2">
                                <div class="card-body">
                                    <div class="row align-items-center no-gutters">
                                        <div class="col mr-2">
                                            <div class="text-uppercase text-warning font-weight-bold text-xs mb-1"><span>Used space</span></div>
                                            <div class="text-dark font-weight-bold h5 mb-0"><span>{(x / Math.pow(1000, index)).toFixed(2)+ " " + sizes[index]}</span></div>
                                        </div>
                                        <div class="col-auto"><i class="fas fa-server fa-2x text-gray-300"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-7 col-xl-8">
                            <div class="card shadow mb-4">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h6 class="text-primary font-weight-bold m-0">Files Uploaded Monthly</h6>
                                </div>
                                <div class="card-body">
                                <LineChartScreen/>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-5 col-xl-4">
                            <div class="card shadow mb-4">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h6 class="text-primary font-weight-bold m-0">Files Overview</h6>
                                </div>
                                <div class="card-body">
                                    <div><DoughChartScreen/></div>
                                </div>
                            </div>
                            <div class="container">
                <div class="row" style={{marginTop: 20 + 'px',marginBottm: 20 + 'px'}}>
                    <div class="col offset-0 bounce animated" class="casetedejos">
                        <div class="row">
                            <div class="col text-center" style={{marginTop: 10 + 'px'}}>
                                <h3>Print a new file</h3>
                            </div>
                        </div>
                        <div class="row">
                            <form>
                                <input id="file"  type="file" class="upload-box" name="file" accept=".stl" onChange={(e) => setFile(e.target.files[0])} />
                                <input class="btn btn-primary upload-btn" type="button" value="Upload" onClick={uploadWithFormData}  />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeScreen;