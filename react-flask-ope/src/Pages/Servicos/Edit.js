import React, { useState, useEffect } from 'react';
  
const EditServicos = () => {
    const [item, setItem] = useState({});
    const [id, setId] = useState([]);

    useEffect(() => {
        console.log('use effect')
        var url = window.location.href;
        setId(url.substring(url.lastIndexOf('/') + 1));

        console.log('a', url.substring(url.lastIndexOf('/') + 1))

        fetch(`/api/edit/Servicos/${url.substring(url.lastIndexOf('/') + 1)}`).then(res => res.json()).then(data => {
            console.log('', data)

            data = data.results;

            var body = {
                id: data[0],
                nome: data[1]
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
                    <h1 className="title">Serviços</h1>
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
                        <div style={{width:'100%', textAlign: 'center'}}>
                            <button id="submit" type="submit" className="btn novo-item" style={{width: '200px'}}>Salvar</button>
                        </div>
                    </div> 

                    <input id='date_ins' name='date_ins' type='hidden' value={item.data_abastecimento} size="80"/>  
                </form>

                
            </main>
    )
}
export default EditServicos;