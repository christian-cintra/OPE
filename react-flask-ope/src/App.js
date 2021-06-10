import React, { useState, useEffect, useLocation } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Header from './Components/Header';
import EditOrdem from './Pages/Ordens/Edit';
import Estoque from './Pages/Estoque/Estoque';
import Colaboradores from './Pages/Colaboradores/Colaboradores';
import AdicionarColaborador from './Pages/Colaboradores/Adicionar';
import EditEstoque from './Pages/Estoque/Edit';
import Ordens from './Pages/Ordens/Ordens';
import Servicos from './Pages/Servicos/Servicos';
import EditServicos from './Pages/Servicos/Edit.js';
import Login from './Pages/Login/Login.js';
import Logout from './Components/Logout.js';

function App(props) {
  const [placeholder, setPlaceholder] = useState('Hi');

  useEffect(() => {
  }, []);

  return (
    <BrowserRouter>
          <Route path="/autenticacao" component={Login}/>

          <Route path="/logout" component={Logout}/>
          {
            window.location.href.indexOf("autenticacao") == -1 ? <Header/>:null
          }

          <Route path="/" exact component={Ordens}/>
          {/* <Route path="https://cintrainstalacoes.herokuapp.com/" exact component={Ordens}/> */}
          <Route path="/estoque" exact component={Estoque}/>
          <Route path="/ordemservico/edit/:id" exact component={EditOrdem}/>
          <Route path="/ordemservico/adicionar" exact component={EditOrdem}/>
          <Route path="/estoque/edit/:id" exact component={EditEstoque}/>
          <Route path="/Servicos" exact component={Servicos}/>
          <Route path="/Servicos/edit/:id" exact component={EditServicos}/>
          <Route path="/usuarios" exact component={Colaboradores}/>
          <Route path="/usuarios/edit/:id" exact component={AdicionarColaborador}/>
          <Route path="/usuarios/adicionar" exact component={AdicionarColaborador}/>
     </BrowserRouter>
  );
}

export default App;