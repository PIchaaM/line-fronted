export const AuthenticationSection = ({ 
  isLoggedIn, 
  isInClient, 
  accessToken, 
  idToken, 
  onLogin, 
  onLogout 
}) => {
  const showButtons = isLoggedIn || isInClient;

  return (
    <fieldset>
      <legend>Authentication:</legend>
      <p><b>Access token :</b> {accessToken ? accessToken.substring(0, 50) + '...' : '-'}</p>
      <p><b>ID token:</b> {idToken ? idToken.substring(0, 50) + '...' : '-'}</p>
      {!showButtons && (
        <button id="btnLogIn" onClick={onLogin}>
          Log In
        </button>
      )}
      {showButtons && (
        <button id="btnLogOut" onClick={onLogout}>
          Log Out
        </button>
      )}
    </fieldset>
  );
};
