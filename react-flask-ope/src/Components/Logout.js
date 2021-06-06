import React, { useState, useEffect } from 'react';

    const logout = () => {
        fetch("/logout",{
            method: 'GET',
        }).then(res => {
            window.location.href = "/autenticacao"
        })
    } 
export default logout;
