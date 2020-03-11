import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

const AuthenticationContext = createContext({});

const AuthenticationProvider = props => {
  const [cookies] = useCookies(['logged_in']);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (cookies.logged_in) {
      console.log('user is logged in', cookies);
      setIsLoggedIn(true);
    } else {
      console.log('user is NOT logged in', cookies);
      setIsLoggedIn(false);
      window.location.href = 'http://localhost:7000/login';
    }
  }, [cookies]);

  return (
    <AuthenticationContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
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
