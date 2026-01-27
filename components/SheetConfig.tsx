import React, { useState, useEffect } from 'react';
import { Save, FileSpreadsheet, Check, RefreshCw, Table, Info, AlertTriangle } from 'lucide-react';
import { fetchSheetData } from '../services/sheetService';

export const SheetConfig: React.FC = () => {
  const [sheetId, setSheetId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [recordCount, setRecordCount] = useState(0);

  useEffect(() => {
    const savedId = localStorage.getItem('omniDesk_sheetId');
    if (savedId) setSheetId(savedId);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus('idle');
    setErrorMessage('');
    
    try {
      // Test the connection before saving
      const data = await fetchSheetData(sheetId);
      
      if (data.length > 0) {
        localStorage.setItem('omniDesk_sheetId', sheetId);
        setRecordCount(data.length);
        setStatus('success');
        
        // Dispatch event to notify App to reload data
        window.dispatchEvent(new Event('sheetConfigUpdated'));
      } else {
        setStatus('error');
        setErrorMessage('Sheet connected but no valid agent data rows found.');
      }
    } catch (error: any) {
        console.error(error);
        setStatus('error');
        setErrorMessage(error.message || 'Unknown error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const requiredColumns = [
    'Date', 'Agent Name', 'Email', 
    'Calls Taken', 'AHT (sec)', 'CSAT Score', 
    'Total Tickets', 'Solved Tickets', 'Interactions', 'Resolution Time',
    'Evaluation: Info Capture', 'Evaluation: Etiquette', 'Evaluation: Product Knowledge', 
    'Evaluation: Problem Solving', 'Evaluation: Upselling'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                <FileSpreadsheet size={32} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Google Sheets Integration</h1>
                <p className="text-slate-500">Manage the connection to the Master Performance Sheet.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Sheet Link or ID
                        </label>
                        <input 
                            type="text" 
                            value={sheetId}
                            onChange={(e) => setSheetId(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono text-xs"
                            placeholder="https://docs.google.com/spreadsheets/d/..."
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            You can paste the browser URL (if shared with 'Anyone with link') OR the 'Publish to Web' CSV link.
                        </p>
                    </div>

                    {status === 'error' && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-lg flex items-start gap-3">
                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                            <div className="text-sm text-red-700 dark:text-red-300">
                                <p className="font-semibold">Connection Failed</p>
                                <p className="mt-1">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                         <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-lg flex items-start gap-3">
                            <Check className="text-green-500 shrink-0 mt-0.5" size={18} />
                            <div className="text-sm text-green-700 dark:text-green-300">
                                <p className="font-semibold">Successfully Connected</p>
                                <p className="mt-1">Loaded {recordCount} agent records from sheet.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving || !sheetId}
                            className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-70 font-medium shadow-lg shadow-brand-500/20"
                        >
                            {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>{isSaving ? 'Connecting...' : 'Connect Sheet'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Schema Guide */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Table className="text-slate-500" size={20} />
                    <h3 className="font-bold text-slate-900 dark:text-white">Master Sheet Structure</h3>
                </div>
                <div className="flex items-start gap-3 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                   <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                   <p className="text-xs text-blue-800 dark:text-blue-200">
                     <strong>Option 1 (Easiest):</strong> Share sheet with "Anyone with the link" as Viewer. Paste the browser URL.<br/><br/>
                     <strong>Option 2 (Best):</strong> Go to File &gt; Share &gt; Publish to web. Select "Entire Document" and "CSV". Paste that link.
                   </p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Ensure your Google Sheet columns match the order below, starting from <strong>Column A</strong>:
                </p>
                <div className="flex flex-wrap gap-2">
                    {requiredColumns.map((col, i) => (
                        <span key={i} className={`px-2.5 py-1 border rounded text-xs font-mono ${
                          i < 3 
                            ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-brand-600 dark:text-brand-400 font-medium'
                        }`}>
                            {String.fromCharCode(65 + i)}: {col}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};