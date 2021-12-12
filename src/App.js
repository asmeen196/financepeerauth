import React from 'react';
import { BrowserRouter, Routes , Route } from 'react-router-dom';
import Home from './components/Home';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import UserDetailContext from './components/userDetailContext';



const App = props => {
  const [APIToken, setAPIToken] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [email, setEmail] = React.useState('')
return (
  <UserDetailContext.Provider value = {{email: [email, setEmail], username: [username, setUsername], password:[password, setPassword], auth: [APIToken, setAPIToken]}}>
    <BrowserRouter>
      <Routes >
        <Route exact path="/" element={<LoginPage />} />
        <Route  exact path="/users">
          <Route exact path="/users/register" element={<RegisterPage />} />
          <Route exact path="/users/home" element={<Home APIToken={APIToken}/>} />
        </Route>
      </Routes >
    </BrowserRouter>
    </UserDetailContext.Provider>
);
}


export default App;
