"use client";

import { ReactNode } from "react";

interface AdminTableProps {
  headers: string[];
  children: ReactNode;
  emptyMessage?: string;
}

export function AdminTable({ headers, children, emptyMessage = "Aucune donnée trouvée." }: AdminTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden font-inter">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs uppercase tracking-widest">
          <thead className="bg-slate-50/50 text-slate-400 font-black border-b border-slate-50">
            <tr>
              {headers.map((header, i) => (
                <th key={header} className={`px-8 py-5 ${i === headers.length - 1 ? 'text-right' : ''}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {children}
          </tbody>
        </table>
        {!children && (
          <div className="p-20 text-center text-slate-400 font-bold italic bg-white lowercase">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}

