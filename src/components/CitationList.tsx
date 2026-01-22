import React, { useState } from 'react';
import { FileText } from 'lucide-react';

export interface UICitation {
  file_name?: string;
  page?: number;
  page_number?: number;
  chunk_id?: string;
  text_preview?: string;
  excerpt?: string;
}

interface CitationListProps {
  citations?: UICitation[];
  initiallyOpen?: boolean;
  className?: string;
}

export const CitationList: React.FC<CitationListProps> = ({
  citations,
  initiallyOpen = false,
  className = '',
}) => {
  const [open, setOpen] = useState(initiallyOpen);

  if (!citations || citations.length === 0) {
    return null;
  }

  const count = citations.length;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900 underline underline-offset-2"
      >
        Sources ({count})
      </button>
      {open && (
        <div className="mt-2 space-y-2 rounded-md bg-gray-50 border border-gray-200 p-2 max-h-32 sm:max-h-40 md:max-h-48 overflow-y-auto">
          {citations.map((citation, idx) => {
            const page = citation.page ?? citation.page_number;
            const snippet = citation.text_preview ?? citation.excerpt;

            return (
              <div key={citation.chunk_id || idx} className="flex items-start gap-2 text-xs text-gray-700">
                <FileText className="h-3 w-3 mt-0.5 flex-shrink-0 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-900">
                    {citation.file_name || 'Source'}
                    {typeof page === 'number' && (
                      <span className="text-gray-500"> (Page {page})</span>
                    )}
                  </div>
                  {snippet && (
                    <p className="mt-0.5 text-gray-600 line-clamp-3">{snippet}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CitationList;


