import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  API_SCOPES,
  AUTH_ENDPOINT,
  CLIENT_ID,
  REDIRECT_URI,
  RESPONSE_TYPE,
} from '../constants';

const AuthenticationContext = createContext({});

const AuthenticationProvider = props => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce(function(initial, item) {
        if (item) {
          var parts = item.split('=');
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});
    window.location.hash = '';

    setToken(hash.access_token);
  }, []);

  const getAuthUrl = () => {
    return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${API_SCOPES.join(
      '%20'
    )}&redirect_uri=${REDIRECT_URI}`;
  };

  return (
    <AuthenticationContext.Provider
      value={{
        token,
        setToken,
        getAuthUrl,
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
