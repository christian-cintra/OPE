import React, { useState, useEffect } from 'react';
import cracha from '../../Assets/badge.svg';

const OrdemCard = ({row, editFunction, deleteFunction}) => {

    return (
            <div class="card" style={{width: '18em'}} key={row.id} id={row.id}>
                <div class="card-body">
                    <h5 class="card-title">{row.detalhes}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">{row.valorPecas}</h6>
                    <p class="card-text">Peças: {row.valorPecas}</p>
                    <p class="card-text">Serviço: {row.valorServico}</p>
                    <p class="card-text">Pagamento: {row.statusPagamento}</p>

                    <div className="d-flex ml-0">
                        <b class="card-text primary-color">Responsável:&nbsp;</b>
                        <p class="card-text">{row.responsavel ? row.responsavel : '-'}</p>
                    </div>

                    <a href="#" class="card-link" onClick={() => editFunction(row.id)}>Editar</a>
                    <a href="#" class="card-link" onClick={() => deleteFunction(row.id, 1)}>Remover</a>
                </div>
        </div>
    )
}
export default OrdemCard;