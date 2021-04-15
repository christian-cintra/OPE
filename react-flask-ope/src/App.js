import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Header from './Components/Header';
import EditOrdem from './Pages/Ordens/Edit';
import Estoque from './Pages/Estoque/Estoque';
import Colaboradores from './Pages/Colaboradores/Colaboradores';
import AdicionarColaborador from './Pages/Colaboradores/Adicionar';
import EditEstoque from './Pages/Estoque/Edit';
import Ordens from './Pages/Ordens/Ordens';

function App() {
  const [placeholder, setPlaceholder] = useState('Hi');

  useEffect(() => {
  }, []);

  return (
    <BrowserRouter>
        <Header />
          <Route path="/" exact component={Ordens}/>
          {/* <Route path="/http://127.0.0.1:5000/" exact component={Ordens}/> */}
          <Route path="/estoque" exact component={Estoque}/>
          <Route path="/ordemservico/edit/:id" exact component={EditOrdem}/>
          <Route path="/estoque/edit/:id" exact component={EditEstoque}/>
          <Route path="/usuarios" exact component={Colaboradores}/>
          <Route path="/usuarios/adicionar" exact component={AdicionarColaborador}/>
     </BrowserRouter>
  );
}

export default App;