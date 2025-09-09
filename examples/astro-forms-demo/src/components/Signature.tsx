import { type SignatureProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';
import { useRef, useEffect, useState } from 'react';

const Signature = ({
  id,
  value,
  label,
  showLabel,
  description,
  required,
  readOnly,
  imageUploadEnabled,
  onChange,
  onBlur,
  onFocus,
}: SignatureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!value);
  const descriptionId = description ? `${id}-description` : undefined;

  // Load existing signature if value is provided
  useEffect(() => {
    if (value && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = value.url;
      }
    }
  }, [value]);

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (readOnly) return;

    setIsDrawing(true);
    onFocus();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e as React.MouseEvent<HTMLCanvasElement>).clientX - rect.left;
    const y = (e as React.MouseEvent<HTMLCanvasElement>).clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || readOnly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e as React.MouseEvent<HTMLCanvasElement>).clientX - rect.left;
    const y = (e as React.MouseEvent<HTMLCanvasElement>).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    onBlur();

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas to base64 and create FileData object
    const dataURL = canvas.toDataURL('image/png');
    const fileData = {
      fileId: `signature_${Date.now()}`,
      displayName: 'signature.png',
      url: dataURL,
      fileType: 'image/png',
    };
    onChange(fileData);
    setHasSignature(true);
  };

  const clearSignature = () => {
    if (readOnly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange(null);
    setHasSignature(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly || !imageUploadEnabled) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas and draw uploaded image
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate scaling to fit image in canvas
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        // Create FileData object
        const fileData = {
          fileId: `signature_${Date.now()}`,
          displayName: file.name,
          url: e.target?.result as string,
          fileType: file.type,
        };
        onChange(fileData);
        setHasSignature(true);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const triggerImageUpload = () => {
    if (readOnly || !imageUploadEnabled) return;
    fileInputRef.current?.click();
  };

  // Set up canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set drawing styles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  return (
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <canvas
          ref={canvasRef}
          id={id}
          width={400}
          height={200}
          style={{
            border: '2px solid #ccc',
            borderRadius: '4px',
            cursor: readOnly ? 'default' : 'crosshair',
            backgroundColor: '#f9f9f9',
            display: 'block',
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={e => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
              clientX: touch.clientX,
              clientY: touch.clientY,
            });
            startDrawing(mouseEvent as any);
          }}
          onTouchMove={e => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
              clientX: touch.clientX,
              clientY: touch.clientY,
            });
            draw(mouseEvent as any);
          }}
          onTouchEnd={e => {
            e.preventDefault();
            stopDrawing();
          }}
          aria-describedby={descriptionId}
          aria-required={required}
          aria-readonly={readOnly}
        />

        {!hasSignature && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#999',
              pointerEvents: 'none',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            Sign here
          </div>
        )}

        {!readOnly && hasSignature && (
          <button
            type="button"
            onClick={clearSignature}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        )}
      </div>

      {imageUploadEnabled && !readOnly && (
        <div style={{ marginTop: '8px' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={triggerImageUpload}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Upload Image
          </button>
        </div>
      )}

      {description && (
        <div id={descriptionId} style={{ marginTop: '8px' }}>
          <RicosViewer
            content={description as RichContent}
            plugins={quickStartViewerPlugins()}
          />
        </div>
      )}
    </div>
  );
};

export default Signature;
