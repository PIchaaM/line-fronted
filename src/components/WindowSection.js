export const WindowSection = ({ onOpenWindow, onCloseWindow }) => {
  return (
    <fieldset>
      <legend>Window:</legend>
      <button id="btnOpenWindow" onClick={() => onOpenWindow("https://linedevth.line.me")}>
        Open Window
      </button>
      <button id="btnCloseWindow" onClick={onCloseWindow}>
        Close Window
      </button>
    </fieldset>
  );
};
