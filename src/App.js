import './App.css';
import {useState, useEffect} from "react";
import { WtList } from './Wtlist';
import {AttachmentDetail} from "./AttachmentDetail";
// import {WebSocket} from 'websocket';

 function yhInit() {
    const socket = new WebSocket("ws://localhost:14812");

    socket.onopen = () => {
        var message = '{"funcationName":"YHDLLINIT"}';
        socket.send(message);
    };
    socket.onmessage = (event) => {
        console.log(event.data);
        socket.close();
    }
    socket.onclose = ()=>{
        console.log("init socket closed");
    };
}

function yhCall(jybm, dataxml, handle)
{
    const message = {funcationName: "YHDLLCALL", strJybh: jybm, Dataxml: dataxml};
    const socket = new WebSocket("ws://localhost:14812");

    socket.onopen = () => {
        socket.send(JSON.stringify(message));
    };

    socket.onmessage = (event) => {
        let dataString = event.data;
        dataString = dataString.replace('<?xml version="1.0" encoding="GBK" standalone="yes" ?>', '');
        const data = JSON.parse(dataString);

        let appcode = 0;
        let appmsg = "";
        let jysc = "<output></output>"
        for (const key in data)
        {
            if (key === "code" || key === "aint_appcode")
                appcode = data[key];
            else if (key === "appmsg" || key === "astr_appmsg")
                appmsg = data[key];
            else if (key === "jyscxml" || key === "astr_jysc_xml")
                jysc = data[key];
        }

        if (appcode === 1) {
            handle(jysc);
        } else if (appcode === -1 && appmsg.indexOf("初始化")>=0) {
            yhInit();
        } else {
            console.log(appcode, appmsg);
        }
    }

    socket.onclose = ()=> {
        console.log("closed");
    }
    
}

function show_attachment(sno, setData) {
    const inputXml = `<input><entrustId>${sno}</entrustId></input>`;
    
    yhCall("WT05", inputXml, (data)=>{
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const countString = xmlDoc.querySelector("recordcount")?.textContent || "0";
        if (parseInt(countString.toString()) > 0) {
            const attachments = [...xmlDoc.querySelectorAll("row")];
            setData(attachments);
        }
    });
}

function App()
{
    const params = new URLSearchParams(window.location.search);
    const [id, setId] = useState(params.get("id") || "");
    const [name, setName] = useState(params.get("name") || "");
    const [wtList, setWtList] = useState([]);
    const [attachmentList, setAttachmentList] = useState([]);
    const [showAttachment, setShowAttachment] = useState(false);
    const [searchStatus, setSearchStatus] = useState("");
    
    useEffect(()=>{ yhInit(); }, []);
    
    function onSearch() {
        const inputXml = `<input><entrustCertno>${id}</entrustCertno><entrustCertType>01</entrustCertType><entrustName>${name}</entrustName></input>`;
        yhCall("WT04", inputXml, (data)=>{
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'text/xml');
            const countString = xmlDoc.querySelector("recordcount").textContent || "0";
            if (parseInt(countString.toString()) > 0) {
                setWtList([...xmlDoc.querySelectorAll("row")]);
            }
        });
    }

    function onShowAttachment(sno) {
        show_attachment(sno, setAttachmentList);
        setShowAttachment(true);
    }
    
    return (
        <div>
            <label htmlFor="">身份证号: </label>
            <input value={id} onChange={(e) => setId(e.target.value)} type="text" placeholder="身份证号" name="id"></input>
            <label htmlFor="">姓名: </label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="姓名" name="name"></input>
            <button onClick={onSearch}>查询</button>
            <br />
            <br />
            <WtList wtList={wtList} showAttachment={onShowAttachment} />
            <AttachmentDetail attachmentList={attachmentList} show={showAttachment} closeDetail={()=>{setShowAttachment(false)}} />
            <br />
            <br />
            <br />
            <br />
            <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <a href="http://192.168.10.54/pc-manager/#/pre-consultation-detail" rel="noreferrer" target="_blank" >预问诊</a>
            </div>
        </div>
    );
}

export default App;
