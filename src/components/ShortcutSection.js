export const ShortcutSection = ({ isMobile, onCreateShortcut }) => {
  if (!isMobile) {
    return null;
  }

  return (
    <fieldset>
      <legend>Shortcut:</legend>
      <button id="btnShortcut" onClick={onCreateShortcut}>
        Add Shortcut on Home Screen
      </button>
    </fieldset>
  );
};
