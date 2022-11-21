import React from 'react'
import { useEffect, useState } from 'react'
import { Chart } from 'react-google-charts'
import CircleLoader from "react-spinners/CircleLoader"
import { Button, Form } from "semantic-ui-react";
import Select from "react-select";
import axios from "axios";
import { resolvePath } from "react-router-dom";

const timeFrames = [
  { value: "1h", label: "1h" },
  { value: "3h", label: "3h" },
  { value: "12h", label: "12h" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "3m", label: "3m" },
  { value: "1y", label: "1y" },
  { value: "3y", label: "3y" },
  { value: "5y", label: "5y" },
];

export const options = {
  hAxis: { title: "Time", titleTextStyle: { color: "#e0f2fe" }, textStyle: { color: "#e0f2fe" } },
  vAxis: { title: "Price (USD$)", titleTextStyle: { color: "#e0f2fe" }, textStyle: { color: "#e0f2fe" }},
  chartArea: { width: "70%", height: "70%" },
  legend: "none",
  animation: {
    startup: true,
    easing: "out",
    duration: 500,
  },
  backgroundColor: { fill:'#111827' },
  legend: { textStyle: { color: "#e0f2fe" }}
};

function Graphs() {
    const [data, setData] = useState([{}]);
    const [time, setTime] = useState();
    const [SelectedData, setSelectedData] = useState();
    
    const graphData = [
      ["Timestamp", "Price"],
    ];

    useEffect(() =>  { // possibly useless now that we use /time request?
      fetch("/graphs")
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          //console.log(data)
        });
    }, []);

    const handleSubmit = (event) => {
      event.preventDefault();
      axios
        .post("/time", {
          body: time,
        })
        .then((response) => {
          //console.log(response.data.apiData.data);
          setSelectedData(response.data.apiData.data);
        })
        .catch((error) => console.log(error));
    };

    function convertEpoch(epoch) {
      return new Date(epoch * 1000)
    }

    const makeGraph = () => {
      for (let x = 0; x < SelectedData.history.length; x++) {
        graphData.push([
          convertEpoch(SelectedData.history[x].timestamp),
          parseFloat(SelectedData.history[x].price)]);
      }
    }


    const handleDefault = () => {
      const defaultVal = timeFrames[3].value
      setTime(defaultVal);

      console.log(defaultVal)
      return defaultVal
    }
  
    return (
        <div className='graphs'>
          <Form onSubmit={handleSubmit} className='graph-form'>
            <label>Choose a time period:</label>
            <Select
              placeholder="Change Time Period"
              value={handleDefault}
              options={timeFrames}
              onChange={(e) => setTime(e.value)}
            />
            <Button>Update Time Period</Button>
          </Form>
            {(typeof SelectedData === 'undefined') ? (
                <p>                            
                  <CircleLoader
                    color="#426cb4"
                    size={100}
                  />
                </p>
            ): (
                <div>
                  {
                    makeGraph()
                  }         
                <Chart
                  chartType="AreaChart"
                  width="80%"
                  height="450px"
                  data={graphData}
                  options={options}
                />
                </div>
                )}
        </div>
    );
  }
  
  export default Graphs