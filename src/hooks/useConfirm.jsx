import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Componente de diálogo
const ConfirmDialog = ({ open, message, onConfirm, onCancel }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>Confirmación</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions className='d-flex flex-row gap-2' style={{padding: '16px'}}>
      <button onClick={onCancel} className='button secondary-button'>Cancelar</button>
      <button onClick={onConfirm} className='button primary-button' autoFocus>Confirmar</button>
    </DialogActions>
  </Dialog>
);

// Hook para mostrar el diálogo de confirmación
export const useConfirmDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [resolveCallback, setResolveCallback] = useState(null);

    const openDialog = (message) => {
        setIsOpen(true);
        setMessage(message);
        return new Promise((resolve) => {
        setResolveCallback(() => resolve);
        });
    };

    const handleConfirm = () => {
        setIsOpen(false);
        if (resolveCallback) resolveCallback(true);
    };

    const handleCancel = () => {
        setIsOpen(false);
        if (resolveCallback) resolveCallback(false);
    };

    const ConfirmDialogComponent = (
        <ConfirmDialog
        open={isOpen}
        message={message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        />
    );

    return [ConfirmDialogComponent, openDialog];
};
