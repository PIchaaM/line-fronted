export const MessageSection = ({ isInClient, onSend, onShare }) => {
  return (
    <fieldset>
      <legend>Message:</legend>
      {isInClient && (
        <button id="btnSend" onClick={onSend}>
          Send Messages
        </button>
      )}
      <button id="btnShare" onClick={onShare}>
        Share Target Picker
      </button>
    </fieldset>
  );
};
