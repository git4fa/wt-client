import "./AttachmentDetail.css"

export function AttachmentDetail({attachmentList, show, closeDetail}) {
    const attachTypeMap = {"1": "委托人身份证复印件", "2": "被委托人身份证复印件", "3": "贵州省委托购药申请表", "4": "其他"}
    return (
        show && (<>
            <div id="attachment_detail_popup">
                <div id="attachment_detail_popup_maincontainer">
                    <div id="attachment_detail_popup_header">
                        <button onClick={closeDetail}>X</button>
                    </div>
                    <div id="attachment_detail_popup_body">
                        { !attachmentList.length && "无数据" }
                        { attachmentList.length > 0 && 
                            attachmentList.map((e)=>{
                                const base64String = e.querySelector("base64Str")?.textContent?.toString();
                                const typeId = e.querySelector("type")?.textContent;
                                return (
                                    <div key={e.querySelector("id")?.textContent}>
                                        <img style={{width: "80%"}} alt={attachTypeMap[typeId]} src={"data:image/jpeg;base64," + base64String } />
                                        <p>{attachTypeMap[typeId]}</p>
                                    </div>
                                );
                            })
                        }


                    </div>
                </div>
            </div>
        </>)
    );
}