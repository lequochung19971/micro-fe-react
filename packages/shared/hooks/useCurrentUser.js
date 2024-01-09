import { useLocalStorage } from '@uidotdev/usehooks';

export const useCurrentUser = () => {
  return useLocalStorage('currentUser');
};

export const getCurrentUser = () => {
  return localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser'))
    : undefined;
};
