import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { parseScannedContent } from '../utils/qrPayload';
import {
  Camera,
  Upload,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  SwitchCamera,
  AlertCircle,
  FileSearch,
  History,
} from 'lucide-react';

export const ScannerView: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'camera' | 'upload'>('camera');
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [copied, setCopied] = useState(false);
  const [recentScans, setRecentScans] = useState<
    { id: string; payload: string; type: string; timestamp: string }[]
  >([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Stop camera stream safely
  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  // Start camera stream
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access is not supported by your browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanning(true);
        requestAnimationFrame(tick);
      }
    } catch (err: any) {
      setCameraError(
        err?.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in your browser settings.'
          : 'Unable to access camera device. Please try uploading an image instead.'
      );
    }
  };

  // Continuous frame analysis
  const tick = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameId.current = requestAnimationFrame(tick);
      return;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });

    if (code && code.data) {
      handleCodeDetected(code.data);
      stopCamera();
      return;
    }

    animationFrameId.current = requestAnimationFrame(tick);
  };

  const handleCodeDetected = (data: string) => {
    setScannedResult(data);
    const parsed = parseScannedContent(data);
    setRecentScans((prev) => [
      {
        id: 'scan-' + Date.now(),
        payload: data,
        type: parsed.type,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 9),
    ]);
  };

  // Scan uploaded image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (code && code.data) {
          handleCodeDetected(code.data);
        } else {
          alert('No readable QR code found in this image. Try another picture with clear contrast.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (activeMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeMode, facingMode]);

  const parsedInfo = scannedResult ? parseScannedContent(scannedResult) : null;

  const handleCopy = () => {
    if (!scannedResult) return;
    navigator.clipboard.writeText(scannedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            QR Code Scanner
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Scan QR codes instantly using your device camera or upload picture files.
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveMode('camera')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeMode === 'camera'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Device Camera</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeMode === 'upload'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Picture</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Viewfinder or Upload Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeMode === 'camera' && (
            <div className="relative rounded-2xl bg-black overflow-hidden aspect-4/3 flex items-center justify-center border border-slate-800 shadow-lg">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
              />

              {/* Viewfinder Overlay with Animated Scanline */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-indigo-400/80 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                    {/* Corner Reticles */}
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-indigo-500 rounded-tl-sm" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-indigo-500 rounded-tr-sm" />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-indigo-500 rounded-bl-sm" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-indigo-500 rounded-br-sm" />

                    {/* Animated laser line */}
                    <div className="absolute inset-x-2 top-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_8px_#818cf8] animate-bounce" />
                  </div>
                </div>
              )}

              {/* Camera Switch & Controls Bar */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-10">
                <button
                  type="button"
                  onClick={() =>
                    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
                  }
                  className="p-2.5 rounded-xl bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors"
                  title="Switch camera"
                >
                  <SwitchCamera className="h-4 w-4" />
                </button>

                {!isScanning && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Scan Again</span>
                  </button>
                )}
              </div>

              {cameraError && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <AlertCircle className="h-8 w-8 text-rose-500" />
                  <p className="text-xs text-rose-300 max-w-sm">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-medium text-white hover:bg-slate-700"
                  >
                    Retry Permission
                  </button>
                </div>
              )}
            </div>
          )}

          {activeMode === 'upload' && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700 bg-white dark:bg-slate-900">
              <FileSearch className="h-10 w-10 text-indigo-500 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Upload QR Code Image
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Supports PNG, JPEG, WEBP, or SVG screenshot files.
              </p>
              <label className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 inline-flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Select Image From Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Right Column: Decoded Result & Scan History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Result Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Decoded Content
            </h3>

            {parsedInfo ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/40">
                  <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
                    <span>{parsedInfo.type}</span>
                    <span className="font-mono text-[10px] text-emerald-600">Verified QR</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white break-all">
                    {parsedInfo.summary}
                  </p>
                </div>

                {/* Structured details */}
                <div className="space-y-1.5 text-xs">
                  {Object.entries(parsedInfo.details).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-slate-400 font-medium">{k}:</span>
                      <span className="font-mono text-[11px] break-all max-w-[200px] text-right">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {parsedInfo.actionUrl && (
                    <a
                      href={parsedInfo.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>{parsedInfo.actionLabel || 'Open Link'}</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copied ? 'Copied' : 'Copy Payload'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
                Point your camera at any QR code to instantly display and execute its contents.
              </div>
            )}
          </div>

          {/* Recent Scanned Log */}
          {recentScans.length > 0 && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <History className="h-3.5 w-3.5" />
                <span>Recent Scans in this Session</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="py-2 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {scan.type}
                      </span>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        {scan.payload}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {scan.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
