import React from 'react';
import './App.css';
import Adviser from './views/Adviser'
import Login_admon from './views/Login_admon'
import { ToastProvider } from 'react-toast-notifications';
function App() {
  return (
    <div className="App">
    {/**  <Adviser/> */}
    <ToastProvider>
    <Login_admon/>
  </ToastProvider>

  </div>
  );
}

export default App;
