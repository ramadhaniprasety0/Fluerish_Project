import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const UserRoute = ({ children }) => {
  return isAuthenticated() && getUserRole() === 'user'
    ? children
    : <Navigate to="/" />;
};

export default UserRoute;
