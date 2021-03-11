from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta
import urllib
import pyodbc

app = Flask(__name__)
params = urllib.parse.quote_plus(
    "DRIVER={SQL Server};SERVER=ght.database.windows.net;DATABASE=ghteam_db;UID=ghtadmin;PWD=GHT_SI4B2020")
db = SQLAlchemy(app)
engine = db.create_engine("mssql+pyodbc:///?odbc_connect=%s" % params, {})
app.config['SQLALCHEMY_DATABASE_URI'] = "mssql+pyodbc:///?odbc_connect=%s" % params
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.secret_key = "oi"

print(engine.table_names())


@app.route('/home')
def home():
    query_result = engine.execute('select * from MateriaPrima')

    return render_template('estoque.html', query_result=query_result)

@app.route('/OrdensServico')
def OrdensServico():
    query_result = engine.execute('select * from OrdensdeServico')

    return render_template('ordens.html', query_result=query_result)

@app.route('/add/<table>', methods=['POST', 'GET'])
def add(table):
    if request.method == 'POST':
        if table == "Mat_P":
            nm = request.form['nome']
            pb = request.form['priceBuy']
            ps = request.form['priceSell']
            dt = request.form['date_ins']
            qt = request.form['quantidade']
            sql = "insert into MateriaPrima values ('{}', {}, {}, '{}',null, {})".format(
                nm, pb, ps, dt, qt)
            engine.execute(sql)
            flash('Matéria Prima cadastrada com sucesso.')
            return render_template(table+'_add.html')

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

    return render_template(table+'_add.html')


@app.route('/edit/<table>/<int:id>', methods=['POST', 'GET'])
def edit(table, id):
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
            da = request.form['date_att']
            qt = request.form['quantidade']
            sql = "update MateriaPrima set nome = '{}', valor_compra = {}, valor_venda = {}, data_abastecimento = '{}', data_atualização = '{}', qtdedisponivel = {} where id = {}".format(
                nm, pb, ps, dt, da, qt, id)
            query_result = engine.execute(sql)
            return redirect(url_for('home'))
        
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
        return redirect(url_for('home'))
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
