import React, { useState, useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
  
const Ordens = () => {
    const [estoque, setEstoque] = useState([]);
    const [novasOrdens, setNovasOrdens] = useState([]);
    const [ordensAgendadas, setOrdensAgendadas] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [ordensExecutadas, setOrdensExecutadas] = useState([]);

    useEffect(() => {
        fetch('/api/ordensdeservico').then(res => res.json()).then(data => {
            console.log('estoque', data)
            setNovasOrdens(data.result.filter((ordem) => ordem.fase == 1))
            setOrdensAgendadas(data.result.filter((ordem) => ordem.fase == 3))
            setOrdensExecutadas(data.result.filter((ordem) => ordem.fase == 4))
          });
    }, []);

    const editFunction = (id) => {
        window.open(`/ordemservico/edit/${id}`);
    }

    const addFunction = () => {
        window.location.href = 'http://127.0.0.1:5000/add/Ordem_S';
    }

    const FiltrarOrdensStatus = (filtro) => {
        fetch('/api/ordensdeservico/' + filterText, {
            method: 'GET',
        })
    }

    const deleteFunction = (id, type) => {
        if (window.confirm('Deseja realmente excluir esse registro?')) {
            fetch('/delete/Ordem_S/' + id, {
            method: 'DELETE',
            })
            .then(res => res.text()) // or res.json()
            .then(res => {
                switch(type){
                    case 1:
                        console.log('remove', [...estoque.filter(item => item.id != id)])
                        setNovasOrdens([...novasOrdens.filter(item => item.id != id)])
                        break;
                    case 2:
                        setOrdensAgendadas([...ordensAgendadas.filter(item => item.id != id)])
                        break;
                    case 3:
                        setOrdensExecutadas([...ordensExecutadas.filter(item => item.id != id)])
                        break;
                    default:
                        break;
                }
                
            })
        }
    }

    return (
            <main>
                <div class="flex header-container">
                    <h1 class="title">Ordens de Serviço</h1>
                    <button type="button" class="btn novo-item" onClick={addFunction}>Novo item</button>
                    <input type='text' name='filtro_OS' value={filterText} onChange={(ev) => setFilterText(ev.target.value)} id='filtro_OS' placeholder='Pesquisar'/>
                    <button type="button" class="btn novo-item" onClick={() => FiltrarOrdensStatus()}>Filtrar</button>
                </div>

                <section class="itens-ordens">
                    <div class="ordens-novas">
                        <h3>Novas</h3>
                        
                        {novasOrdens.map((row) => (
                            <div class="card" style={{width: '18em'}} key={row.id} id={row.id}>
                            <div class="card-body">
                            <h5 class="card-title">{row.detalhes}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">{row.valorPecas}</h6>
                            <p class="card-text">Peças: {row.valorPecas}</p>
                            <p class="card-text">Serviço: {row.valorServico}</p>
                            <p class="card-text">Pagamento: {row.statusPagamento}</p>
                            <a href="#" class="card-link" onClick={() => editFunction(row.id)}>Editar</a>
                            <a href="#" class="card-link" onClick={() => deleteFunction(row.id, 1)}>Remover</a>
                            </div>
                        </div>
                        ))}
                    </div>

                    <div class="ordens-agendadas">
                        <h3>Agendadas</h3>
                        {ordensAgendadas.map((row) => (
                            <div class="card" style={{width: '18em'}} key={row.id} id={row.id}>
                            <div class="card-body">
                            <h5 class="card-title">{row.detalhes}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">{row.valorPecas}</h6>
                            <p class="card-text">Peças: {row.valorPecas}</p>
                            <p class="card-text">Serviço: {row.valorServico}</p>
                            <p class="card-text">Pagamento: {row.statusPagamento}</p>
                            <a href="#" class="card-link" onClick={() => editFunction(row.id)}>Editar</a>
                            <a href="#" class="card-link" onClick={() => deleteFunction(row.id, 2)}>Remover</a>
                            </div>
                        </div>
                        ))}
                    </div>

                    <div class="ordens-executadas">
                        <h3>Executadas</h3>
                        {ordensExecutadas.map((row) => (
                            <div class="card" style={{width: '18em'}} key={row.id} id={row.id}>
                            <div class="card-body">
                            <h5 class="card-title">{row.detalhes}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">{row.valorPecas}</h6>
                            <p class="card-text">Peças: {row.valorPecas}</p>
                            <p class="card-text">Serviço: {row.valorServico}</p>
                            <p class="card-text">Pagamento: {row.statusPagamento}</p>
                            <a href="#" class="card-link" onClick={() => editFunction(row.id)}>Editar</a>
                            <a href="#" class="card-link" onClick={() => deleteFunction(row.id, 3)}>Remover</a>
                            </div>
                        </div>
                        ))}
                    </div>


                    </section>

            </main>
    )
}
export default Ordens;