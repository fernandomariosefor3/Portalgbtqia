import { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({ value, onChange, folder = 'articles' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Create a unique filename
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const storageRef = ref(storage, `${folder}/${filename}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        },
        (err) => {
          console.error('Upload error:', err);
          setError('Erro ao fazer upload da imagem.');
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadURL);
          setUploading(false);
          setProgress(0);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      );
    } catch (err) {
      console.error(err);
      setError('Erro ao preparar upload.');
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          placeholder="URL da imagem (ex: https://...)"
          disabled={uploading}
        />
        <span className="text-sm text-gray-500 font-medium">OU</span>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-dark-100 hover:bg-dark-200 text-dark-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <i className="ri-upload-cloud-2-line"></i>
          Enviar arquivo
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {value && !uploading && (
        <img 
          src={value} 
          alt="Preview" 
          className="h-32 w-full object-cover rounded-lg border border-gray-100" 
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
    </div>
  );
}
