import React from 'react'
import { IconIbero } from './icons'

export const HeaderIbero = ({
    handleClickOpen,
    Titulo,
    TextoBoton

}) => {
  return (
    <div className="header-container d-flex align-items-center justify-content-between">
        <span className='header-text'>{Titulo}</span>
        <div style={{width: '30%', display: 'flex', flexDirection:'row-reverse'}} >
            <button className="button secondary-button button-m" onClick={()=>{handleClickOpen(undefined)}}>
            <span> {TextoBoton} </span>
            <IconIbero icon="Add" size="18px" color="rgb(207, 6, 34)" />
            </button>
        </div>
    </div>
  )
}
