import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import axios from 'axios';

function ForgotPassword({ open, handleClose }) {
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState({ type: '', message: '' });

  // Clear status when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setStatus({ type: '', message: '' });
      setLoading(false);
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const email = event.target.email.value;

    try {
      await axios.post('http://localhost:8000/forgot-password', {
        email: email
      });

      setStatus({
        type: 'success',
        message: 'Password reset instructions have been sent to your email.'
      });

      // Close dialog after 3 seconds on success
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.detail || 'Failed to process your request. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setStatus({ type: '', message: '' });
    setLoading(false);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        sx: { backgroundImage: 'none' },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', minWidth: '400px' }}
      >
        <DialogContentText>
          Enter your account's email address, and we'll send you a link to
          reset your password.
        </DialogContentText>
        {status.message && (
          <Alert severity={status.type} sx={{ width: '100%' }}>
            {status.message}
          </Alert>
        )}
        <OutlinedInput
          autoFocus
          required
          disabled={loading}
          margin="dense"
          id="email"
          name="email"
          placeholder="Email address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button 
          onClick={handleDialogClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          type="submit"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Sending...' : 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
