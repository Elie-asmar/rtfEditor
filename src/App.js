import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

import { RichEditComponent } from "./RichEditComponent";

function App() {
  const rtfRef = useRef(null);
  const [mystate, setMystate] = useState({ 'centerid': '1', 'resultid': '5', 'resyear': '2022', base64rtf: null });
  const DB_LINK = useRef('http://183.183.183.122/CtsWebService_LabRad/DataService.svc/web/');

  const handleSave = useCallback(
    (s, e) => {
      e.handled = true;
      // console.log(s)
      // console.log(e)
      // console.log(e.base64);
      // console.log(e.fileName);
      // //DocumentFormat.OpenXml
      // //DocumentFormat.PlainText
      // //DocumentFormat.Rtf
      // console.log(e.format); //in DocumentFormat
      let _data = {
        centerid: mystate.centerid,
        resultid: mystate.resultid,
        resyear: mystate.resyear,
        payload: e.base64
      };

      axios({
        method: "post",
        url: `${DB_LINK.current}SaveRadResultRtf`,
        data: JSON.stringify(_data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
      })
        .then(response => {
          console.log('Save Successfully')



        })
        .catch(error => {

        });


    }, [mystate]);


  useEffect(() => {
    axios({
      method: "get",
      url: `${DB_LINK.current}GetRadResultRtf?centerid=1&resultid=5&resyear=2022`,
      headers: {
        Accept: "application/json",
      },
    })
      .then(response => {

        rtfRef.current.rich.openDocument(response.data, 'DocumentName', rtfRef.current.DocFormat.Rtf);
      })
      .catch(error => {
        console.log('error', error)

      });
  }, []);




  return (
    <>
      <button onClick={() => {
        rtfRef.current.rich.saveDocument(rtfRef.current.DocFormat.Rtf)

      }}>Trigger Save From Outer Component</button>
      <RichEditComponent ref={rtfRef} handleSave={handleSave} />
    </>
  );
}

export default App;
