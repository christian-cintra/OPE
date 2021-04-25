from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import timedelta, datetime
import urllib
import pyodbc

app = Flask(__name__)
CORS(app)
params = urllib.parse.quote_plus(
    "DRIVER={SQL Server};SERVER=ght.database.windows.net;DATABASE=ghteam_db;UID=ghtadmin;PWD=GHT_SI4B2020")
db = SQLAlchemy(app)
engine = db.create_engine("mssql+pyodbc:///?odbc_connect=%s" % params, {})
app.config['SQLALCHEMY_DATABASE_URI'] = "mssql+pyodbc:///?odbc_connect=%s" % params
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.secret_key = "oi"
app.debug = True

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    login = db.Column(db.String(255))
    senha = db.Column(db.String(255))
    nome = db.Column(db.String(80))

    def __init__(self, login, senha, nome):
        self.login = login
        self.senha = senha
        self.nome = nome

print(engine.table_names())

@app.route('/hello')
def say_hello_world():
    return {'result': "Hello World"}

@app.route('/')
def rota_Raiz():
    return redirect(url_for('login'))

@app.route('/login', methods=['POST', 'GET'])
def login():
    global loggedUser
    classeFlash = 'alert alert-success'
    if request.method == 'POST':
        login = request.form['email']
        senha = request.form['password']
        user = Usuario.query.filter_by(login=login, senha=senha).first()
        if user is None:
            flash('Incorrect email or password.')
            classeFlash = 'alert alert-danger'
        else:
            loggedUser = user.nome
            session[loggedUser] = loggedUser    
            return redirect(url_for('Estoque'))
    return render_template('index.html', classeFlash=classeFlash)            

@app.route('/logout')
def logout():
    session.pop('user', none)

def checaSession(user):
    if user in session:
        return True

@app.route('/api/estoque')
def EstoqueAPI():
    if checaSession(loggedUser):
        query_result = engine.execute('select * from MateriaPrima')
        print('query_result', query_result)
        return jsonify({'result': [dict(row) for row in query_result]})
    else:
        return render_template('index.html', classeFlash=classeFlash)   

@app.route('/api/estoque/ordenar')
def EstoqueFiltroAPI():
    if checaSession(loggedUser):
        query_result = engine.execute('select * from MateriaPrima order by qtdedisponivel')
        print('query_result', query_result)
        return jsonify({'result': [dict(row) for row in query_result]})
    else:
        return render_template('index.html', classeFlash=classeFlash)  

@app.route('/api/servicos')
def ServicosAPI():
    if checaSession(loggedUser):
        query_result = engine.execute('select * from Servico')
        print('query_result', query_result)
        return jsonify({'result': [dict(row) for row in query_result]})
    else:
        return render_template('index.html', classeFlash=classeFlash)  

@app.route('/api/usuarios')
def UsuariosAPI():
    if checaSession(loggedUser):
        query_result = engine.execute('select * from Usuario')
        print('query_result', query_result)
        return jsonify({'result': [dict(row) for row in query_result]})

@app.route('/api/ordensdeservico', methods=['POST', 'GET'])
def OrdensDeServicoAPI():
    # if checaSession(loggedUser):
    data = engine.execute('select os.id, os.detalhes, os.valorPecas, os.valorServico, os.fase, os.statusPagamento, Usuario.nome as responsavel from OrdensdeServico as os LEFT JOIN Usuario ON os.responsavel_id = Usuario.Id')

    return jsonify({'result': [dict(row) for row in data]})
    # else:
    #     return render_template('index.html', classeFlash=classeFlash)  


@app.route('/api/ordensdeservico/<filtro>', methods=['POST', 'GET'])
def FiltroOrdensDeServicoAPI(filtro):
    # if checaSession(loggedUser):
    dictFiltros = {'fase': {'1': 'solicitada', 'Agendamento': '2', 'Agendada': '3', 'Executada': '4'}, 'statusPagamento': {'Não paga': '1', 'Paga 1ª Parcela': '2' ,  'Paga 2ª Parcela': '3'}}
    for i in dictFiltros:
        for j in dictFiltros[i]:
            if filtro == dictFiltros[i][j]:
                campo = dictFiltros[i]
                sql = ('select os.id, os.detalhes, os.valorPecas, os.valorServico, os.fase, os.statusPagamento, Usuario.nome as responsavel from OrdensdeServico as os LEFT JOIN Usuario ON os.responsavel_id = Usuario.Id WHERE {} = {}').format(campo, filtro)
                print(sql)
                data = engine.execute(sql)
                return jsonify({'result': [dict(row) for row in data]})

    return 'filtro inválido'
    # else:
    #     return render_template('index.html', classeFlash=classeFlash)  

@app.route('/api/estoque/qntd/<int:id>/<int:qntd>', methods=['POST'])
def UpdteEstoqueItemCount(id, qntd):
    if checaSession(loggedUser):
        print('table ', table)
        print('id ', id)
        sql = "update MateriaPrima set qtdedisponivel = {} where id = {}".format(qntd, id)
        resp = jsonify(success=True)
        return resp
    else:
        return render_template('index.html', classeFlash=classeFlash)  

@app.route('/api/edit/<table>/<int:id>', methods=['POST', 'GET'])
def GetItems(table, id):
    if checaSession(loggedUser):
        print('table ', table)
        print('id ', id)
        if table == "Mat_P":
            sql = 'select * from MateriaPrima where id = {}'.format(id)
            query_result = engine.execute(sql)
            for row in query_result:
                result = row
                
        elif table == "Ordem_S":
            sql = 'select os.id, os.detalhes, os.valorPecas, os.valorServico, os.fase, os.statusPagamento, os.responsavel_id, os.responsavel_id, Usuario.nome AS responsavelNome from OrdensdeServico AS os	LEFT JOIN Usuario ON os.responsavel_id = Usuario.Id  where os.id =  {}'.format(id)
            query_result = engine.execute(sql)

            for row in query_result:
                result = row

        results = [str(row) for row in result]
        return jsonify({'results': results})
    else:
        return render_template('index.html', classeFlash=classeFlash)  

@app.route('/api/materiasprimas/<int:id>', methods=['GET'])
def GetMateriasPrimasPordemServico(id):
    if checaSession(loggedUser):
        sql = 'select * from MateriasOrdemDeServico where id_os = {}'.format(id)
        query_result = engine.execute(sql)

        return jsonify({'results': [dict(row) for row in query_result]})
    else:
        return render_template('index.html', classeFlash=classeFlash)  

@app.route('/api/usuarios/<int:id>', methods=['GET'])
def GetColaborador(id):
    if checaSession(loggedUser):
        sql = 'select * from Usuario where id = {}'.format(id)
        query_result = engine.execute(sql)

        return jsonify({'results': [dict(row) for row in query_result]})
    else:
        return render_template('index.html', classeFlash=classeFlash)  


@app.route('/add/materiasprimas/ordemservico/<int:id>', methods=['POST'])
def AddMateriasPrimasNaOrdemServico(id):
    if checaSession(loggedUser):
        # body = request.args("lista")
        # print('body', request)
        data = request.get_json()
        sql = 'select * from MateriasOrdemDeServico where id_os = {}'.format(id)
        query_result = engine.execute(sql)

        rows = []

        for row in query_result:
            rows.append(row)

        # percorrer lista do banco comparando com lista recebida para atualizar quantidade ou remover itens se necessário

        for row in rows:
            ja_cadastrado = False
            item_permanece = False

            id_materia_prima = row[1]
            for item in data:
                print('row', row)
                print('item', item)
                if id_materia_prima == item["id_materia_prima"]:
                    item_permanece = True

                    print('item permanece', id_materia_prima, row[2], item["quantidade"])
                    if row[2] != item["quantidade"]:
                        print('update', id, id_materia_prima)
                        # atualiza a quantidade de itens de matérias primas já cadastradas
                        sql = "update MateriasOrdemDeServico set Quantidade = '{}' where id_os = {} and id_materia_prima = {}".format(item["quantidade"], id, id_materia_prima)
                        query_result = engine.execute(sql)
                        
            if not item_permanece :
                # remove o item
                print('remove ',id, id_materia_prima)
                sql = 'delete from MateriasOrdemDeServico where id_os = {} and id_materia_prima = {}'.format(id, id_materia_prima)
                engine.execute(sql)

        # percorre lista recebida comparando com lista do banco para cadastrar se necessário
        for item in data:
            novo_item = True
            for row in rows:
                if(row[1] == item["id_materia_prima"]):
                    novo_item = False

            if novo_item:
                print('novo', item['id_os'], item['id_materia_prima'])
                id_os = int(item['id_os'])
                id_materia_prima = item['id_materia_prima']
                Quantidade = item['quantidade']
                valor = item['valor']
                sql = "insert into MateriasOrdemDeServico values ('{}', {}, {}, {})".format(id_os, id_materia_prima, Quantidade, valor)
                engine.execute(sql)

        return ""
    else:
        return render_template('index.html', classeFlash=classeFlash)  

@app.route('/Servicos')
def Servicos():
    if checaSession(loggedUser):
        query_result = engine.execute('select * from Servico')

        return render_template('listagemServicos.html', query_result=query_result)
    else:
        return render_template('index.html', classeFlash=classeFlash)  

@app.route('/Estoque')
def Estoque():
    if checaSession(loggedUser):
        query_result = engine.execute('select * from MateriaPrima')

        return render_template('estoque.html', query_result=query_result)
    else:
        return render_template('index.html', classeFlash=classeFlash)  

@app.route('/Usuarios')
def Usuarios():
    if checaSession(loggedUser):
        query_result = engine.execute('select * from Usuario')

        return render_template('usuarios.html', query_result=query_result)
    else:
        return render_template('index.html', classeFlash=classeFlash)  

@app.route('/OrdensServico')
def OrdensServico():
    if checaSession(loggedUser):
        query_novas = engine.execute('select * from OrdensdeServico where fase = 1')

        query_agendadas = engine.execute('select * from OrdensdeServico where fase = 3')

        query_executadas = engine.execute('select * from OrdensdeServico where fase = 4')

        results = {
            'novas': query_novas,
            'agendadas': query_agendadas,
            'executadas': query_executadas,
        }

        return render_template('ordens.html', query_result=results)
    else:
        return render_template('index.html', classeFlash=classeFlash)  

@app.route('/add/<table>', methods=['POST', 'GET'])
def add(table):
    if checaSession(loggedUser):
        print('register', request.form)
        if request.method == 'POST':
            if table == "Mat_P":
                nm = request.form['nome']
                pb = request.form['priceBuy']
                ps = request.form['priceSell']
                dt = datetime.now()
                da = datetime.now()
                qt = request.form['quantidade']
                sql = "insert into MateriaPrima values ('{}', {}, {}, '{}','{}', {})".format(
                    nm, pb, ps, dt, da, qt)
                engine.execute(sql)
                flash('Matéria Prima cadastrada com sucesso.')
                print(request.form)
                return render_template(table+'_edit.html', method="POST", row={})
            
            elif table == "Ordem_S":
                table = "Ordem_S"
                dt = request.form['detalhes']
                vl = request.form['valorPecas']
                servicoExecutado = request.form['servicoExecutado']
                vs = request.form['valorServico']
                fs = request.form['fase']
                st = request.form['statusPagamento']
                responsavel = request.form['responsavel_id']
                sql = "insert into OrdensdeServico values ('{}', {}, {}, {}, {}, {}, {})".format(
                    dt, vl, vs, fs, st, responsavel, servicoExecutado)
                engine.execute(sql)
                flash('Ordem de Serviço cadastrada com sucesso.')
                return redirect('http://localhost:3000/')
            
            elif table == "Servico":
                nomeServico = request.form['nomeServico']
                sql = "insert into Servico values ('{}')".format(nomeServico)
                engine.execute(sql)
                flash('Serviço cadastrado com sucesso.')
                print(request.form)

            elif table == "Usuario":
                login = request.form['Login']
                senha = request.form['senha']
                nome = request.form['nome']
                sql = "insert into Usuario values ('{}', '{}', '{}')".format(
                    login, senha, nome)
                engine.execute(sql)
                return redirect('http://localhost:3000/usuarios')
            
            elif table == "":
                pass

        if table == "Mat_P":
            return render_template(table+'_edit.html', method="POST", row={})
        else:
            return render_template(table+'_add.html')
    else:
        return render_template('index.html', classeFlash=classeFlash)  

@app.route('/edit/<table>/<int:id>', methods=['POST', 'GET'])
def edit(table, id):
    if checaSession(loggedUser):
        print('edit')
        print(request.method)
        if table == "Mat_P":
            sql = 'select * from MateriaPrima where id = {}'.format(id)
            query_result = engine.execute(sql)
            for row in query_result:
                result = row
        elif table == "Ordem_S":
            sql = 'select * from OrdensdeServico where id = {}'.format(id)
            query_result = engine.execute(sql)
            for row in query_result:
                result = row
        elif table == "Servicos":
            sql = 'select * from Servico where id = {}'.format(id)
            query_result = engine.execute(sql)
            for row in query_result:
                result = row    

        if request.method == 'POST':
            if table == "Mat_P":
                nm = request.form['nome']
                pb = request.form['priceBuy']
                ps = request.form['priceSell']
                dt = request.form['date_ins']
                da = datetime.now()
                qt = request.form['quantidade']
                sql = "update MateriaPrima set nome = '{}', valor_compra = {}, valor_venda = {}, data_abastecimento = '{}', data_atualização = '{}', qtdedisponivel = {} where id = {}".format(
                    nm, pb, ps, dt, da, qt, id)
                query_result = engine.execute(sql)
                print('query', query_result)
                flash('Item alterado com sucesso')
                return redirect(url_for('Estoque'))
            
            elif table == "Ordem_S":
                table = "Ordem_S"
                dt = request.form['detalhes']
                vl = request.form['valorPecas']
                vs = request.form['valorServico']
                fs = request.form['fase']
                st = request.form['statusPagamento']
                re = request.form['responsavel_id']
                sql = "update OrdensdeServico set detalhes = '{}', valorPecas = {}, valorServico = {}, fase = {}, statusPagamento = {}, responsavel_id={} where id = {}".format(
                    dt, vl, vs, fs, st, re, id)
                query_result = engine.execute(sql)
                return redirect('http://localhost:3000')

            elif table == "Servicos":
                nomeServico = request.form['nomeServico']
                sql = "update Servico set Nome = '{}' where id = {}".format(nomeServico, id)
                query_result = engine.execute(sql)
                return redirect(url_for('Servicos'))

            elif table == "Usuario":
                table = "Usuario"
                nome = request.form['nome']
                login = request.form['Login']
                senha = request.form['senha']
                sql = "update Usuario set Login = '{}', nome = '{}', senha = '{}' where id = {}".format(
                    login, nome, senha, id)
                query_result = engine.execute(sql)
                return redirect('http://localhost:3000/usuarios')

            elif table == "":
                pass
            flash('Registro alterado com sucesso')
            return redirect(url_for('Estoque'))

        if(table == "Ordem_S"):
            materias_primas = engine.execute('select * from MateriasOrdemDeServico where id_os = ' + str(result.id))

            estoque = engine.execute('select * from MateriaPrima')

            print('materias', materias_primas)
            print('estoque', estoque)
            return render_template(table+'_edit.html', row=result, materiasPrimas=materias_primas, estoque=estoque)
            
        else:
            return render_template(table+'_edit.html', row=result)
    else:
        return render_template('index.html', classeFlash=classeFlash)  


@app.route('/delete/<table>/<int:id>', methods=['DELETE'])
def delete(table, id):
    if checaSession(loggedUser):
        if request.method == 'DELETE':
            if table == "Mat_P":
                sql = 'delete from materiaPrima where id = {}'.format(id)
                engine.execute(sql)

            elif table == "Ordem_S":
                sql = 'delete from OrdensdeServico where id = {}'.format(id)
                engine.execute(sql)

            elif table == "Servicos":
                sql = 'delete from Servico where id = {}'.format(id)
                engine.execute(sql)

            elif table == "":
                pass
            return 'deleted'
    else:
        return render_template('index.html', classeFlash=classeFlash)  


if __name__ == '__main__':
    app.run(debug=True)
