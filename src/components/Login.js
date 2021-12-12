import React from 'react';
import './../css/LoginPage.css';
import {
    Link, useNavigate 
} from "react-router-dom";
import UserDetailContext from './userDetailContext'

const LoginPage = () => {
    return (
        <div id="loginform">
        <FormHeader title="Login" />
        <LoginForm />
        <RegisterButton />
    </div>
    );
}

const FormHeader = props => (
    <h2 id="headerTitle">{props.title}</h2>
);


const LoginForm = () => {
    const userData = React.useContext(UserDetailContext)
    return (

        <div>
            <UserName description="Username" placeholder="Enter your username" type="text" username={userData.username} />
            <Password description="Password" placeholder="Enter your password" type="password" password={userData.password} />
            <FormButton title="Log in" userData={userData} />
        </div>
    );
}

const FormButton = (props) => {
    const navigate = useNavigate();
    const authToken = props.userData.auth[0]
    sessionStorage.removeItem('financePeerbackendAPIToken')
    React.useEffect(() => {
        if(props.userData.auth[0] !== ""){
            sessionStorage.setItem('financePeerbackendAPIToken', props.userData.auth[0])
            sessionStorage.setItem('financePeerbackenduser', props.userData.username[0])
            navigate("/users/home")
        }
    }, [authToken])
    const Login = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: props.userData.username[0], password:props.userData.password[0] })
        };
        fetch("http://127.0.0.1:8000/users/login", requestOptions)
        .then(resp => resp.json())
        .then(jsonResp => {
            if(jsonResp.error !== 1) {
                props.userData.auth[1]("Token "+jsonResp.token)
            } else {
                // console.log("error", jsonResp.msg)
                alert(jsonResp.msg)
            }
        }).catch((err) => {
            console.log(err)
        });
    }
    return (
        <div id="button" className="row">
            <button onClick={() => Login()}>{props.title}</button>
        </div>
    );
}


const UserName = props => {
    const updateInputValue = (evt) => {
        props.username[1](evt.target.value)
    }
    return (
    <div className="row">
        <label>{props.description}</label>
        <input type={props.type} placeholder={props.placeholder} value={props.username[0]} autoComplete={false} onChange={evt => updateInputValue(evt)}/>
    </div>
);
}

const Password = props => {
    const updateInputValue = (evt) => {
        props.password[1](evt.target.value)
    }
    return (
    <div className="row">
        <label>{props.description}</label>
        <input type={props.type} placeholder={props.placeholder} value={props.password[0]} autoComplete={false} onChange={evt => updateInputValue(evt)}/>
    </div>
);
}

const RegisterButton = () => (
    <div id="registrationlinkContainer">
        <button id="registrationText" ><Link to="/users/register">Or register?</Link></button>
    </div>
);

export default LoginPage;