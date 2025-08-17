import { toast, Toaster } from 'react-hot-toast';

const useToast = () => {
  return {
    toast,
    Toaster,
  };
};

export { useToast, Toaster };