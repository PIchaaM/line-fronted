import { useState } from 'react';

export const CameraSection = ({ onScanCode }) => {
  const [qrCode, setQrCode] = useState(null);

  const handleScan = async () => {
    const result = await onScanCode();
    if (result) {
      setQrCode(result);
    }
  };

  return (
    <fieldset>
      <legend>Camera:</legend>
      <p><b>QR code:</b> {qrCode || '-'}</p>
      <button id="btnScanCode" onClick={handleScan}>
        Scan QR Code
      </button>
    </fieldset>
  );
};
