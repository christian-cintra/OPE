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

print(engine.table_names())

@app.route('/hello')
def say_hello_world():
    return {'result': "Hello World"}

@app.route('/')
def inicio():
    return redirect(url_for('Estoque'))

@app.route('/api/estoque')
def EstoqueAPI():
    query_result = engine.execute('select * from MateriaPrima')
    print('query_result', query_result)
    return jsonify({'result': [dict(row) for row in query_result]})

@app.route('/api/ordensdeservico')
def OrdensDeServicoAPI():
    data = engine.execute('select * from OrdensdeServico')

    return jsonify({'result': [dict(row) for row in data]})


@app.route('/api/edit/<table>/<int:id>', methods=['POST', 'GET'])
def GetItems(table, id):
    print('talbe ', table)
    print('id ', id)
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

    results = [str(row) for row in result]
    return jsonify({'results': results})

@app.route('/api/materiasprimas/ordemservico/<int:id>', methods=['GET'])
def GetMateriasPrimasPordemServico(id):
    sql = 'select * from MateriasOrdemDeServico where id_os = {}'.format(id)
    query_result = engine.execute(sql)

    return jsonify({'results': [dict(row) for row in query_result]})


@app.route('/add/materiasprimas/ordemservico/<int:id>', methods=['POST'])
def AddMateriasPrimasNaOrdemServico(id):
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

    print('fim')
    return ""


@app.route('/Estoque')
def Estoque():
    query_result = engine.execute('select * from MateriaPrima')

    return render_template('estoque.html', query_result=query_result)

@app.route('/OrdensServico')
def OrdensServico():
    query_novas = engine.execute('select * from OrdensdeServico where fase = 1')

    query_agendadas = engine.execute('select * from OrdensdeServico where fase = 3')

    query_executadas = engine.execute('select * from OrdensdeServico where fase = 4')

    results = {
        'novas': query_novas,
        'agendadas': query_agendadas,
        'executadas': query_executadas,
    }

    return render_template('ordens.html', query_result=results)

@app.route('/add/<table>', methods=['POST', 'GET'])
def add(table):
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
            vs = request.form['valorServico']
            fs = request.form['fase']
            st = request.form['statusPagamento']
            sql = "insert into OrdensdeServico values ('{}', {}, {}, {}, {})".format(
                dt, vl, vs, fs, st)
            engine.execute(sql)
            flash('Ordem de Serviço cadastrada com sucesso.')
            return render_template(table+'_add.html')
        elif table == "":
            pass

    if table == "Mat_P":
        return render_template(table+'_edit.html', method="POST", row={})
    else:
        return render_template(table+'_add.html')

@app.route('/edit/<table>/<int:id>', methods=['POST', 'GET'])
def edit(table, id):
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
            sql = "update OrdensdeServico set detalhes = '{}', valorPecas = {}, valorServico = {}, fase = {}, statusPagamento = {} where id = {}".format(
                dt, vl, vs, fs, st, id)
            query_result = engine.execute(sql)
            return redirect(url_for('OrdensServico'))

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


@app.route('/delete/<table>/<int:id>', methods=['DELETE'])
def delete(table, id):
    if request.method == 'DELETE':
        if table == "Mat_P":
            sql = 'delete from materiaPrima where id = {}'.format(id)
            engine.execute(sql)

        elif table == "Ordem_S":
            sql = 'delete from OrdensdeServico where id = {}'.format(id)
            engine.execute(sql)

        elif table == "":
            pass
        return 'deleted'


if __name__ == '__main__':
    app.run(debug=True)
