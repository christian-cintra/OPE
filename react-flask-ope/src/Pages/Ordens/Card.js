import React, { useState, useEffect } from 'react';
import cracha from '../../Assets/badge.svg';

const OrdemCard = ({row, editFunction, deleteFunction}) => {

    const getStatusPagamento = (status) => {
        switch(status) {
            case 1:
                return 'Pendente'
            case 2:
                return '1ª parcela paga'
            case 3:
                return '2ª parcela paga'
            default:
                return '-'
        }
    }

    return (
            <div class="os-card" style={{width: '18em'}} key={row.id} id={row.id}>
                <div class="">
                    <h5 class="">{row.detalhes}</h5>
                    <h6 class=" mb-2 text-muted">R$: {row.valorPecas + row.valorServico}</h6>
                    <p class="card-text"><b>Peças:</b>&nbsp; R${row.valorPecas}</p>
                    <p class="card-text"><b>Serviço:</b>&nbsp; R${row.valorServico}</p>
                    <p class="card-text"><b>Pagamento:</b>&nbsp; {getStatusPagamento(row.statusPagamento)}</p>


                    <div className="d-flex ml-0">
                        <b class="card-text primary-color">Responsável:&nbsp;</b>
                        <p class="card-text">{row.responsavel ? row.responsavel : '-'}</p>
                        <p class="card-text">{row.dataexe != null ? 'Executado em' + new Date(row.dataexe).toLocaleDateString() : ''}</p>
                    </div>

                    <div className="links">
                        <a href="#" class="card-link" style={{color: 'red'}} onClick={() => deleteFunction(row.id, 1)}><i class="fa fa-remove icon pointer"></i></a>
                        <a href="#" class="card-link" onClick={() => editFunction(row.id)}><i class="fa fa-edit icon pointer"></i></a>
                    </div>
                </div>
        </div>
    )
}
export default OrdemCard;