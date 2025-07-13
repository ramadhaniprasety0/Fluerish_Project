import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const AdminRoute = ({ children }) => {
  return isAuthenticated() && getUserRole() === 'admin'
    ? children
    : <Navigate to="/" />;
};

export default AdminRoute;
