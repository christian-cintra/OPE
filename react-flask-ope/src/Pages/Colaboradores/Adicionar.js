import React, { useState, useEffect } from 'react';
  
const EditOrdem = () => {
    const [item, setItem] = useState({});
    const [id, setId] = useState(null);

    useEffect(() => {
        console.log('ordem')
        var url = window.location.href;

        const valueId = url.substring(url.lastIndexOf('/') + 1);
        if(valueId != 'adicionar')
            setId(valueId);
        console.log('ids', id)



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
        });

    }, []);

    return (
            <main>
                <div className="flex header-container">
                    <h1 className="title">Cadastro - colaborador</h1>
                </div>

                {/* action={{ '/add/Mat_P' if method == 'POST' else '/edit/Mat_P/' ~ row.id }} */}
                <form 
                action={id == null ? `/add/Usuario` : `/edit/Ordem_S/${item.id}`}
                    method="POST">

                    <div className="form-group">
                        <label>Login:</label>
                        <input id='Login' name='Login' type='text' value ={item.Login} placeholder="funcionario@email.com" size="80" className="form-control" onChange={(event) => setItem({...item, Login: event.target.value})} />
                    </div>

                    <div className="form-group">
                        <label>Nome:</label>
                        <input id='nome' name='nome' type='text' value={item.nome} placeholder="Digite o nome do funcionário" size="80"  className="form-control" onChange={(event) => setItem({...item, valorPecas: event.target.value})}/>
                    </div>

                    <div className="form-group">
                        <label>Senha:</label>
                        <input id='senha' name='senha' type='number' value={item.senha} placeholder="******" size="80" className="form-control" className="form-control" onChange={(event) => setItem({...item, senha: event.target.value})}/>            
                    </div>

                    <div className="form-group">
                        <div style={{width:'100%', textAlign: 'center'}}>
                            <button id="submit" type="submit" className="btn novo-item" style={{width: '200px'}}>Salvar</button>
                        </div>
                    </div> 

                </form>

                
            </main>
    )
}
export default EditOrdem;