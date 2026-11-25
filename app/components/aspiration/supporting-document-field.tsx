import { useRef } from 'react';

import { Button } from '@/components/ui/button';

import { Trash2 } from 'lucide-react';

interface SupportingDocumentFieldProps {
  id: string;
  label: string;
  placeholder: string;
  fileName: string;
  accept?: string;
  maxSizeMb?: number;
  error?: string;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onError: (message: string) => void;
}

/**
 * Optional supporting document uploader (PDF/DOC/DOCX) that resets native input ref
 * on invalid files, selections, and removal so deleted files never re-upload.
 */
export function SupportingDocumentField({
  id,
  label,
  placeholder,
  fileName,
  accept = '.pdf,.doc,.docx',
  maxSizeMb = 10,
  error,
  onFileSelect,
  onClear,
  onError,
}: SupportingDocumentFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const errorId = `${id}-error`;

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMb * 1024 * 1024) {
      onError(`Ukuran dokumen maksimal ${maxSizeMb}MB.`);
      resetInput();
      return;
    }

    onFileSelect(file);
    resetInput();
  };

  const handleClearClick = () => {
    resetInput();
    onClear();
  };

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-darknavy-900 block text-xs font-bold">
        {label} <span className="font-normal text-slate-400">(opsional)</span>
      </label>

      <input
        id={id}
        type="file"
        ref={inputRef}
        accept={accept}
        className="hidden"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={handleChange}
      />

      <div
        className={`flex items-center justify-between rounded-xl border bg-white p-2 shadow-2xs ${
          error ? 'border-rose-500' : 'border-warm-300'
        }`}
      >
        <div className="flex min-w-0 items-center gap-2 pr-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            className="border-warm-300 bg-warm-100 hover:bg-warm-200 text-darknavy-900 shrink-0 rounded-lg text-xs"
          >
            Browse...
          </Button>
          <span className="truncate font-mono text-xs text-slate-700">
            {fileName || placeholder}
          </span>
        </div>

        {fileName ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={`Hapus ${label}`}
            onClick={handleClearClick}
            className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className="text-2xs font-semibold text-rose-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
