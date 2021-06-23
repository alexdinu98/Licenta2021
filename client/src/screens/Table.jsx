import React, { useEffect, useState } from "react";

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'DELETE',
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


function print()
{
    const fileName = document.getElementById('id').value;

    fetch(`http://localhost:8080/api/print/${fileName.id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(err => console.error(err))
}

function deletefile()
{
    const fileName = document.getElementById('id').value;
    
    const datas = {
        fileName : fileName
    };

     postData(`http://localhost:8080/api/deletefile/${fileName.id}`, datas)
        .then(data => {
            if(data.delete == 'true')
            {
                console.log("succes");
                document.getElementById("messageaction").className = "text-dark mb-4 textsucces";
                document.getElementById("messageaction").innerHTML = "Deleted succesful";
            }
            else
            {
                console.log("failed");
                document.getElementById("messageaction").className = "text-dark mb-4 textwrong";
                document.getElementById("messageaction").innerHTML = "Error on delete a patient";
            }
        });
}

function Table(){

    const [data, setData] = useState({});

    let table = "";
    let cols = [];

    fetch('http://localhost:8080/api/getSingleFiles')
    .then(response => response.json())
    .then(data  => {
        setData(data);
    })
    .catch(err => console.error(err))

    for(let i = 0 ; i < data.length; i++)
    {   const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
        const index = Math.floor(Math.log(data[i].fileSize) / Math.log(1000));
        table = <tr><input type="hidden" value={data[i].id} id="id"></input>
                <td>{data[i].fileName}</td>
                <td>{(data[i].fileSize / Math.pow(1000, index)).toFixed(2)+ " " + sizes[index]}</td>
                <td>{data[i].createdAt.slice(0, 10)}</td>
                <td><button class="btn btn-primary" type="button" onClick={print}>Print</button></td>
                <td><button class="btn btn-danger" type="button" id="delete" onClick={deletefile}>Delete</button></td></tr>
        cols.push(table);
    }

    return(
        <div class="d-flex flex-column" id="content-wrapper" class="main-cont">
            <div id="content">
                <div class="container-fluid">
                    <h3 class="text-dark mb-4">STL Files</h3>
                    <h3 class="text-dark mb-4" id="messageaction"></h3>
                    <div class="card shadow">
                        <div class="card-header py-3">
                            <p class="text-primary m-0 font-weight-bold">Files Info</p>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive table mt-2" id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table dataTable my-0" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>File Name</th>
                                            <th>File Size</th>
                                            <th>Date</th>
                                            <th>Print</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        {(() => {
                                            return cols;
                                        })()}

                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th>File Name</th>
                                            <th>File Size</th>
                                            <th>Date</th>
                                            <th>Print</th>
                                            <th>Delete</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

}

export default Table;