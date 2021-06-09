import React, { useState, useEffect } from 'react';
  
const EditColaborador = () => {
    const [item, setItem] = useState({});
    const [id, setId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        var url = window.location.href;

        const valueId = url.substring(url.lastIndexOf('/') + 1);

        console.log('valueId', valueId)
        if(valueId != 'adicionar')
            setId(valueId);
        console.log('ids', id)



        // pegando informações da ordem de serviço
        fetch(`/api/usuarios/${valueId}`).then(res => res.json()).then(data => {
            console.log('estoque', data)

            data = data.results;

            var body = {
                Id: data[0].Id,
                Login: data[0].Login,
                nome: data[0].nome,
                senha: data[0].senha,
                statusColaborador: data[0].statusColaborador
            }
            setItem(body);
        });

    }, []);

    const updateUser = (item) => {

        var payload = {
            nome: item.nome,
            login: item.Login,
            senha: item.senha,
            statusColaborador: item.statusColaborador
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch(`${id == null ? `/add/Usuario` : '/edit/Usuario/' +item.Id}`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(payload)
        })
        .then(res => {

            if(res.status == 401)
                window.location = "/autenticacao";

            if(res.status == 403)
                setError('Permissões insuficientes');
            console.log('res', res)
            return res.json()
        })
        .then(data => {
            console.log('estoque', data)
         

            setLoading(false);
          })
    }

    return (
            <main>
                <div className="flex header-container">
                    <h1 className="title">Cadastro - colaborador</h1>
                </div>

                <p className="error-text">{error}</p>
                {/* action={{ '/add/Mat_P' if method == 'POST' else '/edit/Mat_P/' ~ row.id }} */}
                <div>

                    <div className="form-group">
                        <label>Login:</label>
                        <input id='Login' name='Login' type='email' value ={item.Login} required="required" placeholder="funcionario@email.com" size="80" className="form-control" onChange={(event) => setItem({...item, Login: event.target.value})} />
                    </div>

                    <div className="form-group">
                        <label>Nome:</label>
                        <input id='nome' name='nome' type='text' value={item.nome} required="required" placeholder="Digite o nome do funcionário" size="80"  className="form-control" onChange={(event) => setItem({...item, nome: event.target.value})}/>
                    </div>

                    <div className="form-group">
                        <label>Senha:</label>
                        <input id='senha' name='senha' type='password' value={item.senha} required="required" placeholder="******" size="80" className="form-control" className="form-control" onChange={(event) => setItem({...item, senha: event.target.value})}/>            
                    </div>

                    <div className="form-group">
                        <label>Staus:</label>
                        <select name="statusColaborador" id="statusColaborador" className="form-select" onChange={(event) => setItem({...item, statusColaborador: event.target.value})} value={item.statusColaborador} defaultValue={item.fase}>
                            <option value={1}>1 - Ativo</option>
                            <option value={0}>0 - Inativo</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <div style={{width:'100%', textAlign: 'center'}}>
                            <button id="submit" type="submit" className="btn novo-item" style={{width: '200px'}} onClick={() => updateUser(item)}>Salvar</button>
                        </div>
                    </div> 

                </div>

                
            </main>
    )
}
export default EditColaborador;