import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export function BarcodeScanner() {
  const [barcode, setBarcode] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(true);
  const videoRef = useRef();

  // Función para reproducir un beep
  function playBeep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gain.gain.value = 0.1;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      ctx.close();
    }, 120);
  }

  useEffect(() => {
    if (!scanning) return;
    setError("");
    const codeReader = new BrowserMultiFormatReader();
    let stream = null;
    codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err, controls) => {
      if (result) {
        setBarcode(result.getText());
        setSuccess(true);
        setScanning(false);
        playBeep();
        // Detener la cámara inmediatamente
        if (controls && controls.stop) {
          controls.stop();
        } else if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
      }
      if (err && err.name === "NotAllowedError") {
        setError("No se pudo acceder a la cámara.");
        setScanning(false);
      }
    }).then(ctrl => { stream = ctrl; });
    return () => {
      if (stream && stream.stop) {
        stream.stop();
      }
      if (codeReader && codeReader.reset) {
        try {
          codeReader.reset();
        } catch (e) {}
      } else if (codeReader && codeReader.close) {
        try {
          codeReader.close();
        } catch (e) {}
      }
    };
  }, [scanning]);

  function handleClear() {
    setBarcode(null);
    setSuccess(false);
    setScanning(true);
  }

  return (
    <div style={{position: "relative", width: "100%", maxWidth: 500}}>
{!barcode && <>
      <video ref={videoRef} style={{ width: "100%", border: success ? "3px solid #66b819" : "3px solid #ccc" }} />
        <div style={{
    position: "absolute",
    top: "40%",
    left: "15%",
    width: "70%",
    height: "20%",
    border: "2px dashed #ff8800",
    borderRadius: 8,
    pointerEvents: "none"
  }} />
</>  }

      {barcode && (
        <div style={{ marginTop: 16, color: "#66b819", fontWeight: "bold" }}>
          Código escaneado: <b>{barcode}</b>
          <button className="btn" style={{ marginLeft: 12 }} onClick={handleClear}>
            Escanear otro
          </button>
        </div>
      )}
      {error && <div style={{ color: "#e74c3c", marginTop: 12 }}>{error}</div>}
      {!scanning && !barcode && (
        <button className="btn" onClick={() => setScanning(true)}>
          Reintentar escaneo
        </button>
      )}
    </div>
  );
}
