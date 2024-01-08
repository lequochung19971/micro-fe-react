export const getCurrentUser = () => {
  return localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser'))
    : undefined;
};
