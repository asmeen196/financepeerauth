import React from 'react';
import UserDetailContext from './userDetailContext';
import { useNavigate } from "react-router-dom";
import '../css/Dashboard.css';

const DataList = ({userData, reloadData}) => {
    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        console.log(data, 'data here')
    },[data])
    React.useEffect(() => {
        const token = sessionStorage.getItem('financePeerbackendAPIToken')
        console.log("session ", token, "asked", userData.auth[0])
        const requestOptions = {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token
            },
        };
        fetch("http://127.0.0.1:8000/users/getJson", requestOptions)
            .then(response => response.json())
            .then((result) => {
                if(result.error === '1') {
                    setData([{id: "1", title: result.msg, body: "upload a valid json file"}])
                }else {
                    console.log(result)
                    setData(result)
                }
            })
            .catch((error) => {
                    console.log(error)
                }
            )
    }, [reloadData])
        return (
            <div>
                <ol>
                    {
                        data.map(data => (
                            <li key={data.id} align="start">
                                <div>
                                    <p>Title: {data.title}</p>
                                    <p>Body: {data.body}</p>
                                </div>
                            </li>
                        ))
                    }
                </ol>
            </div>
        );
    // }
}

const Header = ({userData}) => {
    const navigate = useNavigate();
    const logout = () => {
        sessionStorage.removeItem("financePeerbackendAPIToken")
        sessionStorage.removeItem("financePeerbackenduserDetails")
        userData.auth[1]("")
        navigate("/")
    }
    return (
        <div id="header">
            <div>
            <label>Welcome {sessionStorage.getItem("financePeerbackenduser")}</label>
            </div>
            <div>
            <button onClick={() => logout()}>Log out</button>
            </div>
        </div>
    );
}

const Popup = ({file, setFile, setReloadData, reloadData}) => {
    const uploadJson = () => {
        let form = new FormData()
        form.append("jsonData", file)
        form.append("username", sessionStorage.getItem('financePeerbackenduser'))
        const token = sessionStorage.getItem('financePeerbackendAPIToken')
        const requestOptions = {
            method: 'PATCH',
            headers: { 
                // 'Content-Type': 'application/json',
                'Authorization': token
            },
            body: form
        };
        fetch("http://127.0.0.1:8000/users/updateJson", requestOptions)
        .then(resp => resp.json())
        .then(res => {
            setFile(null)
            setReloadData(!reloadData)
        })
    }

    const cancelUpload = () => {
        setFile(null)
    }
    return (
        <div id="fileUploadPopup">
            <label>Do you wish to upload the file {file.name}?</label>
            <div>
            <button id="cancelFileSendBtn" onClick={() => cancelUpload()}></button>
            <label id="cancelFileSendTxt" for="cancelFileSendBtn">No</label>
            <button id="sendFileBtn" onClick={() => uploadJson()}></button>
            <label id="sendFileBtnTxt" for="sendFileBtn">Yes</label>
            </div>
        </div>
    );
}

const InvalidPopup = ({setInvalidFile}) => {
    const closePopup = () => {
        setInvalidFile(false);
    }
    return (
        <div id="fileUploadPopup">
            <label>Chosen file is an invalid file</label>
            <button id="closePopup" onClick={() => closePopup()}></button>
            <label id="closePopupTxt" for="closePopup">Ok</label>
        </div>
    );
}

const AddJson = ({setReloadData, reloadData}) => {
    const [invalidFile, setInvalidFile] = React.useState(false)
    const [file, setFile] = React.useState(null)
    const onFileChange = (event) => {
        if(event.target.files[0].type === 'application/json') {
            setFile(event.target.files[0]);
            console.log(event.target.files[0])
        } else {
            setInvalidFile(true)
        }
    }
    React.useEffect(() => {
        console.log("file changed", file!==null)
    }, [file])
    
    if(file != null) {
        return (<Popup file={file} setFile={setFile} setReloadData={setReloadData} reloadData={reloadData}/>);
    } else if(invalidFile) {
        return (<InvalidPopup setInvalidFile={setInvalidFile}/>);
    }else {
    return (
        <>
            <input type='file' onChange={(event) => onFileChange(event)} id="addFileInput"></input><label id="addBtn" for="addFileInput">+</label>
        </>
    );}
}

const Home = () => {
    const userData = React.useContext(UserDetailContext)
    const [reloadData, setReloadData] = React.useState(false)
    React.useEffect(() => {
        console.log("realoading data")
    }, [reloadData])
    return (
    <>
        <Header userData={userData} />
        <DataList userData={userData} reloadData={reloadData}/>
        <AddJson setReloadData={setReloadData} reloadData={reloadData}/>
    </>
);
}
export default Home;