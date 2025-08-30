import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DeleteConfirmationProps {
    onDelete: () => void;
}

interface DeleteConfirmationProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
}

export default function DeleteConfirmation({ open, onClose, onDelete }: DeleteConfirmationProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{t('Delete Confirmation')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('Are you sure you want to delete this item? This action cannot be undone.')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {t('Cancel')}
                </Button>
                <Button
                    onClick={() => {
                        onDelete(); 
                        onClose();  
                    }}
                    color="error"
                    variant="contained"
                >
                    {t('Yes, Delete')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

