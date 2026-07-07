"use client";

// In-app camera QR scanner (jsQR + getUserMedia). Requires HTTPS or localhost.

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { X, CameraOff } from "lucide-react";

export default function QrScanner({ onResult, onClose }: {
  onResult: (text: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState("");
  const doneRef = useRef(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    let cancelled = false;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
      } catch {
        setError("Camera access was blocked. Allow camera permission in your browser, or use the QR code with your phone's camera app instead.");
        return;
      }
      if (cancelled || !videoRef.current) return;
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play().catch(() => {});

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

      const tick = () => {
        if (cancelled || doneRef.current) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
          if (code?.data) {
            doneRef.current = true;
            onResult(code.data);
            return;
          }
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [onResult]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Scan station QR code"
      style={{
        position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.92)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <button
        onClick={onClose} aria-label="Close scanner"
        style={{
          position: "absolute", top: 14, right: 14,
          background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
          width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <X size={20} color="white" aria-hidden="true" />
      </button>

      {error ? (
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <CameraOff size={36} color="var(--fhsu-gold)" strokeWidth={1.5} aria-hidden="true" style={{ margin: "0 auto 14px" }} />
          <p role="alert" style={{ color: "white", fontSize: 14, lineHeight: 1.6 }}>{error}</p>
        </div>
      ) : (
        <>
          <p style={{ color: "white", fontSize: 15, fontWeight: 600, marginBottom: 16, textAlign: "center" }}>
            Point your camera at the station&apos;s QR code
          </p>
          <div style={{ position: "relative", width: "100%", maxWidth: 340, aspectRatio: "1", borderRadius: 20, overflow: "hidden", border: "3px solid var(--fhsu-gold)" }}>
            <video ref={videoRef} playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {/* corner guides */}
            {[
              { top: 10, left: 10, borderWidth: "3px 0 0 3px" },
              { top: 10, right: 10, borderWidth: "3px 3px 0 0" },
              { bottom: 10, left: 10, borderWidth: "0 0 3px 3px" },
              { bottom: 10, right: 10, borderWidth: "0 3px 3px 0" },
            ].map((s, i) => (
              <span key={i} aria-hidden="true" style={{ position: "absolute", width: 28, height: 28, borderColor: "white", borderStyle: "solid", opacity: 0.9, ...s }} />
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5, marginTop: 14, textAlign: "center" }}>
            The stamp records automatically once the code is detected.
          </p>
        </>
      )}
      <canvas ref={canvasRef} hidden />
    </div>
  );
}
