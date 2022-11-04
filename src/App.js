import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

import { RichEditComponent } from "./RichEditComponent";

function App() {
  const rtfRef = useRef(null);
  const [mystate, setMystate] = useState({ 'centerid': '1', 'resultid': '5', 'resyear': '2022', base64rtf: null });
  const DB_LINK = useRef('http://183.183.183.122/CtsWebService_LabRad/DataService.svc/web/');

  const handleSave = useCallback(
    async () => {



      let _data = {
        centerid: mystate.centerid,
        resultid: mystate.resultid,
        resyear: mystate.resyear,
        payload: await rtfRef.current.awaitableExportToRTF()
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
        //rtfRef.current.rich.hasUnsavedChanges = true
        //rtfRef.current.rich.saveDocument(rtfRef.current.DocFormat.Rtf)
        handleSave()

      }}>Trigger Save From Outer Component</button>
      <RichEditComponent ref={rtfRef} />
    </>
  );
}

export default App;
