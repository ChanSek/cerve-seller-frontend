import cogoToast from 'cogo-toast';

export const handleError = (resp) => {
  cogoToast.error(resp?.message, {
    position: 'top-right',
    hideAfter: 10,
    heading: 'Error',
  });
};