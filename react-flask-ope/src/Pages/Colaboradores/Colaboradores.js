import React, { useState, useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import avatar from '../../Assets/avatar.png';
  
const Colaboradores = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.log('use effect')
        fetch('/api/usuarios').then(res => res.json()).then(data => {
            console.log('usuarios', data)
            setUsers(data.result);
          });
    }, []);

    const addFunction = () => {
        window.open(`/usuarios/adicionar`);
    }

    // const deleteFunction = (id) => {
    //     if (window.confirm('Deseja realmente excluir esse registro?')) {
    //         fetch('/delete/Mat_P/' + id, {
    //         method: 'DELETE',
    //         })
    //         .then(res => res.text()) // or res.json()
    //         .then(res => {
    //             setUsers([...users.filter(item => item.id != id)])
    //         })
    //     }
    // }

    return (
            <main>
                <div className="flex header-container">
                    <h1 className="title">Colaboradores</h1>
                    <button type="button" class="btn novo-item" onClick={addFunction}>Novo item</button>
                </div>

                {users.map((item) => (

                    <div className="card users-card" key={item.Id}>
                        <div className="card-body">
                            <div className="users-card-body m-0-auto">

                                <div className="img-container">
                                    <img className="img-avatar" src={avatar} />
                                    <b>{item.Id}</b>
                                </div>

                               <div className="flex w-100">
                                    <div>
                                        <div className="d-flex">
                                            <b>Nome:</b>&nbsp;<span>{item['nome']}</span>
                                        </div>

                                        <div className="d-flex">
                                            <b>E-mail:</b>&nbsp;<span>{item['Login']}</span>
                                        </div>

                                        <div className="d-flex">
                                            <b>Status:</b>&nbsp;<span>{item['statusColaborador']}</span>
                                        </div>   

                                    </div>
                                    <div>
                                        <a href={`/usuarios` + `/edit/` +item.Id}>Editar</a>
                                    </div>
                               </div>

                            </div>
                        </div>
                    </div>

                ))}

            </main>
    )
}
export default Colaboradores;