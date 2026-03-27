import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, ImageIcon, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

export default function ImageUpload({ onImageSelect, imagePreview, error }) {
  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) onImageSelect(accepted[0])
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={clsx(
          'relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden',
          isDragActive
            ? 'border-blue-400 bg-blue-500/10'
            : imagePreview
            ? 'border-slate-700 bg-slate-900/60'
            : 'border-slate-700 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-900/60'
        )}
      >
        <input {...getInputProps()} />
        {imagePreview ? (
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="w-full max-h-72 object-contain rounded-xl" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <ImageIcon size={14} className="text-blue-400" />
                <span className="text-xs text-slate-300">Click to change image</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className={clsx(
              'w-16 h-16 rounded-2xl border flex items-center justify-center mb-5 transition-all',
              isDragActive ? 'bg-blue-500/20 border-blue-400/40' : 'bg-slate-800/60 border-slate-700'
            )}>
              <Upload size={24} className={isDragActive ? 'text-blue-400' : 'text-slate-400'} />
            </div>
            <p className="text-base font-medium text-slate-200 mb-1">
              {isDragActive ? 'Drop the image here' : 'Upload a skin image'}
            </p>
            <p className="text-sm text-slate-500 mb-4">Drag & drop or click to browse</p>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">JPEG</span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">PNG</span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">WebP</span>
              <span>· max 10 MB</span>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
    </div>
  )
}
