


export function WtList({wtList, showAttachment}) {
    const relaTypeMap  = { "1": "父母", "2": "夫妻", "3": "子女", "4": "其他"};
    console.log("length: ");
    console.log(wtList.length);
    return (
        <>
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
                        wtList && wtList.length &&
                            wtList.map((item) => (
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
                                    <td><button onClick={() => { showAttachment(item.querySelector("id")?.textContent); }}>查看附件</button></td>
                                </tr>
                            ))
                    }
                </tbody>
            </table>
            <div>{!(wtList && wtList.length) && <div>无数据</div>}</div>
        </>
    )
}