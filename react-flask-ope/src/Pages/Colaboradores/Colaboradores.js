import React, { useState, useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import avatar from '../../Assets/avatar.png';
  
const Colaboradores = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isADM, setIsADM] = useState(false);

    useEffect(() => {
        setIsADM(localStorage.getItem('adm') == "true" ? true : false)
            fetch('/api/usuarios')
            .then(function(response) {
                console.log(response.status); // Will show you the status
                if (!response.ok) {

                    if(response.status == 401){
                        window.location.replace('/autenticacao');
                    }
                }
                return response.json();
            }).then(data => {
                console.log('usuarios', data)

                if(data?.result)
                    setUsers(data?.result);
            })
            .catch(e => {
                console.log('e', e)
                setError('Ops, não foi possível conectar! Por favor, tente novamente mais tarde')
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
                    {isADM && <button type="button" className="btn novo-item" onClick={addFunction}>Novo item</button>}
                </div>

                {error != null ? <p className="error">{error}</p>
                :
                    users.map((item) => (

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
                                            {isADM && <a href={`/usuarios` + `/edit/` +item.Id}>Editar</a>}
                                        </div>
                                </div>

                                </div>
                            </div>
                        </div>

                    ))
                }               

            </main>
    )
}
export default Colaboradores;