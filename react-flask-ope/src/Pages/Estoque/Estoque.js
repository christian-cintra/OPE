import React, { useState, useEffect } from 'react';
  
const Estoque = () => {
    const [estoque, setEstoque] = useState([]);

    useEffect(() => {
        fetch('/api/estoque').then(res => res.json()).then(data => {
            console.log('estoque', data)
            setEstoque(data.result);
          });
    }, []);

    const ordenarEstoque = () => {
        fetch('/api/estoque/ordenar').then(res => res.json()).then(data => {
            console.log('estoque', data)
            setEstoque(data.result);
            });
    }

    const addFunction = () => {
        window.location.href = 'http://127.0.0.1:5000/add/Mat_P';
    }

    const deleteFunction = (id) => {
        if (window.confirm('Deseja realmente excluir esse registro?')) {
            fetch('/delete/Mat_P/' + id, {
            method: 'DELETE',
            })
            .then(res => res.text()) // or res.json()
            .then(res => {
                setEstoque([...estoque.filter(item => item.id != id)])
            })
        }
    }

    return (
        <main>
            <div class="flex header-container">
                <h1 class="title">Estoque</h1>
                <button type="button" class="btn novo-item" onClick={addFunction}>Novo item</button>
                <button type="button" class="btn novo-item" onClick={ordenarEstoque}>Ordenar itens</button>
            </div>

                <div>
                    <table class='table table-sm table-striped table-responsive-md'>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Quantidade</th>    
                                <th scope="col">Nome</th>
                                <th scope="col">Preço</th>
                                <th scope="col">Cadastrado em</th>
                                <th scope="col">Alterado em</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {estoque.map((item) => (
                                <tr id={item.id}>
                                <td>{item.id}</td>
                                <td>{item['QtdeDisponivel']}</td>
                                <td>{item['nome']}</td>
                                <td>{item['valor_venda']}</td>
                                <td>{item['data_abastecimento']}</td>
                                <td>{item['data_atualização']}</td>
                                <td>
                                    <i class="fa fa-edit icon pointer" onClick={() => (window.location = `http://127.0.0.1:5000/edit/Mat_P/${item.id}`)}></i>
                                </td>
                                <td>
                                    <i class="fa fa-remove icon pointer" onClick={() => deleteFunction(item.id)}></i>
                                </td>
                                </tr>
                            ))}
                            
                        </tbody>
                    </table>
                </div>
            </main>
    )
}
export default Estoque;