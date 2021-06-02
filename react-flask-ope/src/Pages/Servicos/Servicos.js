import React, { useState, useEffect } from 'react';
  
const Servicos = () => {
    const [estoque, setServicos] = useState([]);

    useEffect(() => {
        fetch('/api/servicos').then(res => res.json()).then(data => {
            console.log('servicos', data)
            setServicos(data.result);
          });
    }, []);

    const addFunction = () => {
        window.location.href = 'http://127.0.0.1:5000/add/Servico';
    }

    const deleteFunction = (id) => {
        if (window.confirm('Deseja realmente excluir esse registro?')) {
            fetch('/delete/Servico/' + id, {
            method: 'DELETE',
            })
            .then(res => res.text()) // or res.json()
            .then(res => {
                setServicos([...estoque.filter(item => item.id != id)])
            })
        }
    }

    return (
            <main>
                <div class="flex header-container">
                    <h1 class="title">Servicos</h1>
                    <button type="button" class="btn novo-item" onClick={addFunction}>Novo item</button>
                </div>

                <div>
                    <table class='table table-sm table-striped table-responsive-md'>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nome</th>
                        </tr>
                    </thead>
                        <tbody>
                            {estoque.map((item) => (
                                <tr id={item.id}>
                                <td>{item['id']}</td>
                                <td>{item['Nome']}</td>
                                <td>
                                    <i class="fa fa-edit icon pointer" onClick={() => (window.location = `http://127.0.0.1:5000/edit/Servicos/${item.id}`)}></i>
                                </td>
                                {/* <td>
                                    <i class="fa fa-remove icon pointer" onClick={() => deleteFunction(item.id)}></i>
                                </td> */}
                                </tr>
                            ))}
                            
                        </tbody>
                    </table>
                </div>
            </main>
    )
}
export default Servicos;