import React, { useState, useRef } from 'react';
import { Camera, Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function SitePhotoUploader({ leadId, onUploadSuccess }) {
  const [queue, setQueue] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const processFile = async (file) => {
    const id = Math.random().toString(36).substring(7);
    const newQueueItem = {
      id,
      name: file.name,
      progress: 0,
      status: 'compressing',
      preview: URL.createObjectURL(file),
      type: 'site_visit',
      caption: '',
    };

    setQueue((prev) => [...prev, newQueueItem]);

    try {
      let activeFile = file;

      if (file.name.toLowerCase().match(/\.(heic|heif)$/)) {
        const heic2any = (await import('heic2any')).default;
        const convertedBlob = await heic2any({ blob: file, toType: 'image/jpeg' });
        activeFile = new File([convertedBlob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: 'image/jpeg' });
      }

      const compressionOptions = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedBlob = await imageCompression(activeFile, compressionOptions);
      const compressedFile = new File([compressedBlob], activeFile.name, { type: activeFile.type });

      setQueue((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'ready', file: compressedFile } : item))
      );
    } catch (error) {
      setQueue((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'failed', error: 'Processing failed' } : item))
      );
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || e.target.files);
    files.forEach(processFile);
  };

  const updateQueueMeta = (id, key, value) => {
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

  const removeQueueItem = (id) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-[#00C9A7] rounded-xl bg-slate-50 transition-colors group"
        >
          <Camera className="h-8 w-8 text-slate-400 group-hover:text-[#00C9A7] mb-2" />
          <span className="font-semibold text-sm text-slate-700">Capture from Camera</span>
          <span className="text-xs text-slate-400 mt-1">Mobile device native rear lens</span>
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileDrop}
          />
        </button>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-[#00C9A7] rounded-xl bg-slate-50 transition-colors cursor-pointer group"
        >
          <Upload className="h-8 w-8 text-slate-400 group-hover:text-[#00C9A7] mb-2" />
          <span className="font-semibold text-sm text-slate-700">Drop Photos Here</span>
          <span className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP, HEIC up to 10MB</span>
          <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={handleFileDrop} />
        </div>
      </div>

      {queue.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-sm font-semibold text-[#1A2744]">Staged Upload Sequence ({queue.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queue.map((item) => (
              <div key={item.id} className="flex gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 relative">
                <button
                  type="button"
                  onClick={() => removeQueueItem(item.id)}
                  className="absolute top-2 right-2 p-1 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full border border-slate-200 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div className="w-20 h-20 bg-slate-200 rounded object-cover flex-shrink-0 relative overflow-hidden">
                  <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
                  {item.status === 'compressing' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5 text-xs">
                  <p className="font-medium text-slate-700 truncate pr-6">{item.name}</p>
                  <div className="flex gap-2">
                    <select
                      value={item.type}
                      onChange={(e) => updateQueueMeta(item.id, 'type', e.target.value)}
                      className="bg-white border border-slate-300 rounded px-1.5 py-0.5 font-medium text-slate-600 focus:outline-none focus:border-[#00C9A7]"
                    >
                      <option value="site_visit">Site Visit</option>
                      <option value="measurement">Measurement</option>
                      <option value="installation">Installation</option>
                      <option value="completion">Completion</option>
                      <option value="reference">Reference</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Provide a photo caption..."
                    value={item.caption}
                    onChange={(e) => updateQueueMeta(item.id, 'caption', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-600 focus:outline-none focus:border-[#00C9A7]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
