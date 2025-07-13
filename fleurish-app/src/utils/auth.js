export const getToken = () => localStorage.getItem('token');

export const getUserRole = () => localStorage.getItem('role');

export const isAuthenticated = () => !!getToken();

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user'); // Hapus data user jika ada
};
