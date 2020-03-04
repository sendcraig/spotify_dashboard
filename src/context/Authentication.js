import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthenticationContext = createContext({});

const AuthenticationProvider = props => {
  const [token, setToken] = useState(
    window.localStorage.getItem('access_token')
  );

  return (
    <AuthenticationContext.Provider
      value={{
        token,
        setToken,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
};

AuthenticationProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export { AuthenticationContext, AuthenticationProvider };
