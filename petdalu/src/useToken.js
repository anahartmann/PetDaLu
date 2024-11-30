import { useState } from 'react';

export default function useToken() {
  function getToken(){
    const tokenString = localStorage.getItem('token-info');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };

  const [token, setToken] = useState(getToken());

  function saveToken(userToken) {
    localStorage.setItem('token-info', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token
  }
}