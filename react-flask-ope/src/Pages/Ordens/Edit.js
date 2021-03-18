import React, { useState, useEffect } from 'react';
  
const EditOrdem = () => {
    const [item, setItem] = useState({});
    const [estoqueItensUtilizado, setEstoqueItensUtilizado] = useState([]);

    const [estoque, setEstoque] = useState([]);
    const [id, setId] = useState([]);

    useEffect(() => {
        console.log('ordem')
        var url = window.location.href;
        setId(url.substring(url.lastIndexOf('/') + 1));

        // pegando informações da ordem de serviço
        fetch(`/api/edit/Ordem_S/${url.substring(url.lastIndexOf('/') + 1)}`).then(res => res.json()).then(data => {
            console.log('estoque', data)

            data = data.results;

            var body = {
                id: data[0],
                detalhes: data[1],
                valorPecas: data[2],
                valorServico: data[3],
                fase: data[4],
                statusPagamento: data[5]
            }
            setItem(body);

            console.log('body', body)
            console.log('item', item)
        });

        // pegando itens do estoque
        fetch('/api/estoque').then(res => res.json()).then(data => {
            console.log('estoque', data)
            setEstoque(data.result);
          });
    }, []);

    const addFunction = () => {
        window.location.href = 'http://127.0.0.1:5000/add/Mat_P';
    }

    const itemEstoque = (item) => {
        if(estoqueItensUtilizado.findIndex(i => i.id == item.id)){
            return <></>
        }
        return (<button key={item.id} type="button" class="list-group-item list-group-item-action" onClick={() => {
            return setEstoqueItensUtilizado([...estoqueItensUtilizado, item])
        }}>{item.nome}</button>)
    }

    return (
            <main>
                <div className="flex header-container">
                    <h1 className="title">Editar - Ordem de serviço</h1>
                    <button type="button" className="btn novo-item" onClick={addFunction}>Novo item</button>
                </div>

                {/* action={{ '/add/Mat_P' if method == 'POST' else '/edit/Mat_P/' ~ row.id }} */}
                <form 
                action={`/edit/Ordem_S/${item.id}`}
                    method="POST">

                    <div className="form-group">
                        <label>Detalhes:</label>
                        <input id='detalhes' name='detalhes' type='text' value ={item.detalhes} placeholder="Digite os detalhes da OS" size="80" className="form-control" onChange={(event) => setItem({...item, detalhes: event.target.value})} />
                    </div>

                    <div className="form-group">
                        <label>Preço das Peças:</label>
                        <input id='valorPecas' name='valorPecas' type='number' step="0.01" min="0" value={item.valorPecas} placeholder="Digite o valor das peças" size="80"  className="form-control" onChange={(event) => setItem({...item, valorPecas: event.target.value})}/>
                    </div>

                    <div className="form-group">
                        <label>Taxa de Serviço:</label>
                        <input id='valorServico' name='valorServico' type='number' step="0.01" min="0" value={item.valorServico} placeholder="Digite o Preço" size="80" className="form-control" className="form-control" onChange={(event) => setItem({...item, valorServico: event.target.value})}/>            
                    </div>

                    <div className="form-group">
                    <label>Status da OS:</label>
                        <select name="fase" id="fase"  onChange={(event) => setItem({...item, fase: event.target.value})}>
                        <option value={1}>1 - Solicitada</option>
                        <option value={2}>2 - Agendamento</option>
                        <option value={3}>3 - Agendada</option>
                        <option value={4}>4 - Executada</option>
                    </select>         
                    </div>

                    <div className="form-group">
                        <label>Status do Pagamento:</label>
                        <select name="statusPagamento" id="statusPagamento" onChange={(event) => setItem({...item, statusPagamento: event.target.value})}>
                            <option value="1">1 - Não paga</option>
                            <option value="2">2 - Paga 1ª Parcela</option>
                            <option value="3">3 - Paga 2ª Parcela</option>
                        </select>  
                    </div>

                    <div className="form-group">
                        <div style={{width:'100%', textAlign: 'center'}}>
                            <button id="submit" type="submit" className="btn novo-item" style={{width: '200px'}}>Salvar</button>
                        </div>
                    </div> 

                    <br/>
                    <br/>

                    <div className="flex">

                        <div>
                            <h3>Matérias Primas requeridas</h3>
                            <div>
                            {estoqueItensUtilizado.map((item) => (
                                    <div className="flex">
                                        <div key={item?.id} class="list-group-item">
                                            <span><b>{item?.Quantidade}</b></span>
                                            <span> - </span>
                                            <span>{item?.nome}</span>
                                        </div>
                                            <span className="add-option" onClick={() => {

                                                const newList = estoqueItensUtilizado.map((materia) => {
                                                    if (materia.id === item.id) {
                                                      materia.Quantidade = materia.Quantidade +1;
                                                    }
                                                    return materia;
                                                })
                                                return setEstoqueItensUtilizado(newList)
                                            }}>+</span>
                                            <span className="add-option"  onClick={() => {
                                                const newList = estoqueItensUtilizado.map((materia) => {
                                                    if (materia.id === item.id) {
                                                        if(materia.Quantidade > 1){

                                                            materia.Quantidade = materia.Quantidade -1;
                                                            return materia;
                                                        }
                                                    }else{
                                                        return materia;
                                                    }
                                                    
                                                })
                                                console.log('newlist', newList)
                                                return setEstoqueItensUtilizado(newList.filter(n => n != undefined))
                                            }}>-</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{width:'100%', textAlign: 'center'}}>
                                <button className="btn novo-item" style={{width: '150px'}} onClick={(event) => {
                                    event.preventDefault();

                                    var body = estoqueItensUtilizado.map(it => (
                                        {
                                            "id_os": parseInt(id),
                                            "id_materia_prima": it.id,
                                            "quantidade": it.Quantidade,
                                            "valor": it.valor_venda
                                        }
                                    ))

                                    console.log('boduy', estoqueItensUtilizado)
                                    console.log('boduy', body)

                                    fetch(`/add/materiasprimas/ordemservico/${id}`, {
                                        method: 'POST',
                                        headers: {
                                          'Accept': 'application/json',
                                          'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(body)
                                    },
                                        ).then(res => res.json()).then(data => {
                                        console.log('response', data)
                                      });
                                      
                                }}>Salvar itens</button>
                            </div>
                        </div>

                        <div style={{maxWidth: '300px'}}>
                            <h5><b>Selecione as Matérias Primas necessárias</b></h5>

                            <div class="list-group">
                                {estoque.map((item) => (
                                    (<button key={item.id} type="button" class="list-group-item list-group-item-action" onClick={() => {
                                        setEstoque(estoque.filter((e) => e.id != item.id))

                                        var novoItem = {...item};
                                        novoItem.Quantidade = 1;
                                        console.log('novo item', novoItem)
                                        return setEstoqueItensUtilizado([...estoqueItensUtilizado, novoItem])
                                    }}>{item.nome}
                                    </button>)
                                ))}
                            </div>
                        </div>

                    </div>
                </form>

                
            </main>
    )
}
export default EditOrdem;