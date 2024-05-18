import React from 'react';
import { UserContext } from '../../UserContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { login } = React.useContext(UserContext);
<<<<<<< HEAD
  return login ? children : <Navigate to="/login" />;
=======
  if (login === true) {
    return children;
  } else if (login === false) {
    return <Navigate to="/login" />;
  } else {
    return <></>;
  }
>>>>>>> ed243be146a2a31697c959b0a770ff6b52fc83ac
};

export default ProtectedRoute;
