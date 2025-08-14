import './App.css';
import {useState, useEffect} from "react";


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
    socket.onclose(()=>{
        console.log("init socket closed");
    });
}


function show_attachment(sno) {

    const messages = [
        `{
                "funcationName":"YHDLLCALL",
                "strJybh":"WT05",
                "Dataxml":"<input><entrustId>${sno}</entrustId></input>"
              }`,
    ];

    const socket = new WebSocket("ws://localhost:14812");
    socket.onopen = () => {
        var message = messages.pop();
        // var message : any = messages[0];
        socket.send(message);
    };

    socket.onmessage = (event) => {
        var dataString = event.data;
        dataString = dataString.replace('<?xml version="1.0" encoding="GBK" standalone="yes" ?>', '');
        var data = JSON.parse(dataString);

        if (data["code"] === 1 || data["aint_appcode"] === 1) {
            const attachTypeMap = {"1": "委托人身份证复印件", "2": "被委托人身份证复印件", "3": "贵州省委托购药申请表", "4": "其他"}
            const parser = new DOMParser();
            const jyscxml = data["jyscxml"] || data["astr_jysc_xml"];
            const xmlDoc = parser.parseFromString(jyscxml, 'text/xml');
            const countString = xmlDoc.querySelector("recordcount")?.textContent || "0";
            if (parseInt(countString.toString()) > 0) {
                const attachments = [...xmlDoc.querySelectorAll("row")];
                const c = attachments.map((e)=>{
                    const base64String = e.querySelector("base64Str")?.textContent?.toString();
                    const typeId = e.querySelector("type")?.textContent;
                    return `
                        <div>
                            <img style="width: 80%" src="data:image/jpeg;base64,${base64String}" />
                            <p>${attachTypeMap[typeId]}</p>
                        </div>
                    `;
                });

                var divContainer = document.createElement("div");
                // divContainer.style["z-index"] = "99999";
                // divContainer.style["width"] = 600;
                // divContainer.style["height"] = 400;
                // divContainer.style["background-color"] = "#27282c";
                divContainer.style["color"] = "black";
                divContainer.style["backgroundColor"] = "#EEEEEE";
                divContainer.style["position"] = "fixed";
                divContainer.style["left"] = "25%";
                divContainer.style["width"] = "50%";
                divContainer.style["height"] = "80%";
                divContainer.style["border"] = "5px solid blue";
                divContainer.style["top"] = "10%";

                const divHeader = document.createElement("div");
                divHeader.style.backgroundColor = "blue";
                const popupId = "attachment";
                var closeButton = document.createElement("button");
                closeButton.innerHTML = "[X]";
                // closeButton.style["background-color"] = "#27282c";
                closeButton.style["color"] = "black";
                closeButton.id = `${popupId}_btnclose`;
                divHeader.appendChild(closeButton);
                divContainer.appendChild(divHeader);

                divContainer.appendChild(document.createElement("br"));

                const bodyContainer = document.createElement("div");
                bodyContainer.style.paddingLeft = "5px";
                bodyContainer.style.overflow = "auto";
                bodyContainer.style.width = "100%";
                bodyContainer.style.height = "90%";
                bodyContainer.innerHTML = c.join("<br />");

                divContainer.appendChild(bodyContainer);

                divContainer.id = popupId;
                document.querySelectorAll("#"+popupId).forEach(p=>{
                    p.parentElement?.removeChild(p);
                });
                document.body.appendChild(divContainer);
                document.querySelectorAll(`#${popupId}_btnclose`).forEach(btn=>{
                    btn.addEventListener("click", ()=>{
                        console.log("clicked");
                        document.querySelectorAll("#"+popupId).forEach(p=>{
                            p.parentElement?.removeChild(p);
                        });
                    });

                });
            }
        };
        
        if (messages.length > 0) {
            var message = messages.pop();
            socket.send(message);
        }
        else
        {
            socket.close();
        }
    }
    socket.onclose = () => {
        console.log("连接关闭");
    };
}


function App()
{
    const params = new URLSearchParams(window.location.search);
    const [id, setId] = useState(params.get("id") || "");
    const [name, setName] = useState(params.get("name") || "");
    const [result, setResult] = useState([]);
    const relaTypeMap  = { "1": "父母", "2": "夫妻", "3": "子女", "4": "其他"};
    
    useEffect(()=>{ yhInit(); }, []);
    
    
    return (
        <div>
            <label htmlFor="">身份证号: </label>
            <input value={id} onChange={(e) => setId(e.target.value)} type="text" placeholder="身份证号" name="id"></input>
            <label htmlFor="">姓名: </label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="姓名" name="name"></input>
            <button onClick={
                () => {


                    const messages = [
                        `{
                            "funcationName":"YHDLLCALL",
                            "strJybh":"WT04",
                            "Dataxml":"<input><entrustCertno>${id}</entrustCertno><entrustCertType>01</entrustCertType><entrustName>${name}</entrustName></input>"
                        }`,
                        // '{"funcationName":"YHDLLINIT"}',
                    ]
                    
                    const socket = new WebSocket("ws://localhost:14812");

                    

                    
                    socket.onopen = () => {
                        var message = messages.pop();
                        // var message : any = messages[0];
                        socket.send(message);
                    };
                    socket.onmessage = (event) => {
                        var dataString = event.data;
                        dataString = dataString.replace('<?xml version="1.0" encoding="GBK" standalone="yes" ?>', '');
                        var data = JSON.parse(dataString);

                        console.log(data);
                        if (data["code"] === 1 || data["aint_appcode"] === 1) {
                            const parser = new DOMParser();
                            const jyscxml = data["jyscxml"] || data["astr_jysc_xml"];
                            const xmlDoc = parser.parseFromString(jyscxml, 'text/xml');
                            const countString = xmlDoc.querySelector("recordcount").textContent || "0";
                            console.log(countString)
                            if (parseInt(countString.toString()) > 0) {
                                setResult([...xmlDoc.querySelectorAll("row")]);
                            }
                            // console.log(data.jyscxml);
                        }

                        if (messages.length > 0) {
                            var message = messages.pop();
                            socket.send(message);
                        }
                        else {
                            socket.close();
                        }
                    };
                    socket.onclose = () => {
                        console.log("连接关闭");
                    };
                }
            }>查询</button>
            <br />
            <br />
            <table>
                <thead>
                    <tr>
                        <th>委托流水号</th>
                        <th>委托人身份证</th>
                        <th>委托人证件类型</th>
                        <th>委托人人员编号</th>
                        <th>委托人姓名</th>
                        <th>委托人电话号</th>
                        <th>被委托人身份证</th>
                        <th>被委托人证件类型</th>
                        <th>被委托人人员编号</th>
                        <th>被委托人姓名</th>
                        <th>与委托人关系</th>
                        <th>开始日期</th>
                        <th>结束日期</th>
                        <th>有效标志</th>
                        <th>备注</th>
                        <th>经办人id</th>
                        <th>经办人姓名</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        !result || !result.length ?
                            <tr><td>无数据</td></tr>
                            :

                            result.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.querySelector("id")?.textContent?.toString()}</td>
                                    <td>{item.querySelector("entrustCertno")?.textContent}</td>
                                    <td>{item.querySelector("entrustCertType")?.textContent}</td>
                                    <td>{item.querySelector("entrustPsnno")?.textContent}</td>
                                    <td>{item.querySelector("entrustName")?.textContent}</td>
                                    <td>{item.querySelector("tel")?.textContent}</td>
                                    <td>{item.querySelector("entrustedCertno")?.textContent}</td>
                                    <td>{item.querySelector("entrustedCertType")?.textContent}</td>
                                    <td>{item.querySelector("entrustedPsnno")?.textContent}</td>
                                    <td>{item.querySelector("entrustedName")?.textContent}</td>
                                    <td>{relaTypeMap[item.querySelector("bindRlts")?.textContent]}</td>
                                    <td>{item.querySelector("begnDate")?.textContent}</td>
                                    <td>{item.querySelector("endDate")?.textContent}</td>
                                    <td>{item.querySelector("valiFlag")?.textContent}</td>
                                    <td>{item.querySelector("memo")?.textContent}</td>
                                    <td>{item.querySelector("opterId")?.textContent}</td>
                                    <td>{item.querySelector("opterName")?.textContent}</td>
                                    <td><button onClick={() => { show_attachment(item.querySelector("id")?.textContent); }}>查看附件</button></td>
                                </tr>
                            ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default App;
