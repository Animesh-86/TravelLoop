import { useState, useRef } from 'react';
import { Camera, UploadCloud, X, PlusCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/formatters';

export default function AiReceiptScanner({ onItemsExtracted }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setIsScanning(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/ai/receipt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      toast.success('Receipt scanned successfully!');
    } catch (err) {
      toast.error('Failed to scan receipt.');
      console.error(err);
      setPreviewUrl(null);
    } finally {
      setIsScanning(false);
    }
  };

  const handleApply = () => {
    if (result && onItemsExtracted) {
      onItemsExtracted(result);
    }
    setIsOpen(false);
    setResult(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent/80 text-white text-sm font-semibold hover:shadow-lg transition-all"
      >
        <Camera className="w-4 h-4" /> Scan Receipt
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-neutral-50/50">
                <h3 className="font-display font-bold text-neutral-800 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-accent" /> AI Receipt Scanner
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {!previewUrl && !isScanning && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
                  >
                    <UploadCloud className="w-10 h-10 text-neutral-400 mb-3" />
                    <p className="font-medium text-neutral-700">Click to upload receipt image</p>
                    <p className="text-xs text-neutral-500 mt-1">Supports JPG, PNG (Max 5MB)</p>
                  </div>
                )}

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept="image/*" 
                  className="hidden" 
                />

                {isScanning && (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                    <p className="font-medium text-neutral-800">Analyzing Receipt with Gemini Vision...</p>
                    <p className="text-sm text-neutral-500 mt-1">Extracting items, prices, and tax.</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 text-emerald-700">
                      <CheckCircle2 className="w-5 h-5" />
                      <div>
                        <p className="font-medium text-sm">Successfully extracted {result.items?.length || 0} items</p>
                        {result.merchant && <p className="text-xs opacity-80">Merchant: {result.merchant}</p>}
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 overflow-hidden text-sm">
                      <table className="w-full">
                        <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium">Item</th>
                            <th className="px-4 py-2 text-right font-medium">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {(result.items || []).map((item, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2.5 text-neutral-800">{item.name}</td>
                              <td className="px-4 py-2.5 text-right font-medium text-neutral-700">{formatCurrency(item.price)}</td>
                            </tr>
                          ))}
                          {result.tax > 0 && (
                            <tr className="bg-neutral-50/50">
                              <td className="px-4 py-2.5 text-neutral-600 italic">Tax</td>
                              <td className="px-4 py-2.5 text-right font-medium text-neutral-600">{formatCurrency(result.tax)}</td>
                            </tr>
                          )}
                          <tr className="bg-neutral-100">
                            <td className="px-4 py-3 font-bold text-neutral-800">Total</td>
                            <td className="px-4 py-3 text-right font-bold text-neutral-800">{formatCurrency(result.total)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {result && (
                <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex gap-3 justify-end">
                  <button
                    onClick={() => { setResult(null); setPreviewUrl(null); }}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-200 transition-colors"
                  >
                    Scan Another
                  </button>
                  <button
                    onClick={handleApply}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" /> Add to Budget
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
