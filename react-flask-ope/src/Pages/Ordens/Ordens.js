import React, { useState, useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import OrdemCard from './Card';
  
const Ordens = () => {
    const [estoque, setEstoque] = useState([]);
    const [novasOrdens, setNovasOrdens] = useState([]);
    const [ordensAgendadas, setOrdensAgendadas] = useState([]);
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
                </div>

                <section class="itens-ordens">
                    <div class="ordens-novas">
                        <h3>Novas</h3>
                        
                        {novasOrdens.map((row) => (
                            <OrdemCard row={row} editFunction={editFunction} deleteFunction={deleteFunction} />
                        ))}
                    </div>

                    <div class="ordens-agendadas">
                        <h3>Agendadas</h3>
                        {ordensAgendadas.map((row) => (
                            <OrdemCard row={row} editFunction={editFunction} deleteFunction={deleteFunction} />
                        ))}
                    </div>

                    <div class="ordens-executadas">
                        <h3>Executadas</h3>
                        {ordensExecutadas.map((row) => (
                            <OrdemCard row={row} editFunction={editFunction} deleteFunction={deleteFunction} />
                        ))}
                    </div>


                    </section>

            </main>
    )
}
export default Ordens;