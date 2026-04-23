export const EnvironmentSection = ({ liffState }) => {
  return (
    <fieldset>
      <legend>Environment:</legend>
      <p><b>OS:</b> {liffState.os}</p>
      <p><b>App language:</b> {liffState.appLanguage}</p>
      <p><b>SDK version:</b> {liffState.sdkVersion}</p>
      <p><b>LINE version:</b> {liffState.lineVersion}</p>
      <p><b>Is in client?:</b> {String(liffState.isInClient)}</p>
      <p><b>Is logged in?:</b> {String(liffState.isLoggedIn)}</p>
      <p><b>Screen type:</b> {liffState.contextType}</p>
    </fieldset>
  );
};
