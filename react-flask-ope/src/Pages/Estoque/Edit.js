import React, { useState, useEffect } from 'react';
  
const EditEstoque = () => {
    const [item, setItem] = useState({});
    const [id, setId] = useState([]);

    useEffect(() => {
        console.log('use effect')
        var url = window.location.href;
        setId(url.substring(url.lastIndexOf('/') + 1));

        console.log('a', url.substring(url.lastIndexOf('/') + 1))

        fetch(`/api/edit/Mat_P/${url.substring(url.lastIndexOf('/') + 1)}`).then(res => res.json()).then(data => {
            console.log('estoque', data)

            data = data.results;

            var body = {
                id: data[0],
                nome: data[1],
                valor_compra: data[2],
                valor_venda: data[3],
                QtdeDisponivel: data[6],
                data_abastecimento: data[5]
            }
            setItem(body);

            console.log('body', body)
            console.log('item', item)
          });
    }, []);

    const addFunction = () => {
        window.location.href = 'http://127.0.0.1:5000/add/Mat_P';
    }

    return (
            <main>
                <div className="flex header-container">
                    <h1 className="title">Estoque</h1>
                    <button type="button" className="btn novo-item" onClick={addFunction}>Novo item</button>
                </div>

                {/* action={{ '/add/Mat_P' if method == 'POST' else '/edit/Mat_P/' ~ row.id }} */}
                <form 
                action={`/edit/Ordem_S/${item.id}`}
                    method="POST">

                    <div className="form-group">
                        <label>Nome:</label>
                        <input id='nome' name='nome' type='text' value ={item.nome} placeholder="Digite o Nome" size="80" className="form-control" onChange={(event) => setItem({...item, nome: event.target.value})} />
                    </div>

                    <div className="form-group">
                        <label>Valor de Compra:</label>
                        <input id='priceBuy' name='priceBuy' type='number' step="0.01" min="0" value={item.valor_compra} placeholder="Digite o Preço" size="80"  className="form-control" onChange={(event) => setItem({...item, valor_compra: event.target.value})}/>
                    </div>

                    <div className="form-group">
                        <label> Valor de Venda:</label>
                        <input id='priceSell' name='priceSell' type='number' step="0.01" min="0" value={item.valor_venda} placeholder="Digite o Preço" size="80" className="form-control" className="form-control" onChange={(event) => setItem({...item, valor_venda: event.target.value})}/>            
                    </div>

                    <div className="form-group">
                        <label> Quantidade:</label>
                        <input id='quantidade' name='quantidade' type='number' min ="1" value ={item.QtdeDisponivel} placeholder="Informe a quantidade" size="80" className="form-control" onChange={(event) => setItem({...item, QtdeDisponivel: event.target.value})}/>           
                    </div>

                    <div className="form-group">
                        <label> Data:</label>
                        <input id='date_att' name='date_att' type='datetime' value={item.data_abastecimento} placeholder="Informe a data" size="80" className="form-control" onChange={(event) => setItem({...item, data_abastecimento: event.target.value})}/>   
                    </div>

                    <div className="form-group">
                        <div style={{width:'100%', textAlign: 'center'}}>
                            <button id="submit" type="submit" className="btn novo-item" style={{width: '200px'}}>Salvar</button>
                        </div>
                    </div> 

                    <input id='date_ins' name='date_ins' type='hidden' value={item.data_abastecimento} size="80"/>  
                </form>

                
            </main>
    )
}
export default EditEstoque;