/* ────────────────────────────────────────────
   ExpenseInvoice — Screen 14
   Trip cost summary, category table, export button
   ──────────────────────────────────────────── */

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Receipt, Download, Printer, DollarSign } from 'lucide-react';
import { useTrip } from '../hooks/useTrips';
import { useBudgetSummary, useBudgetItems } from '../hooks/useBudget';
import { formatCurrency, formatDateFull } from '../utils/formatters';
import { LineSkeleton } from '../components/ui/LoadingSkeleton';

import AiReceiptScanner from '../components/budget/AiReceiptScanner';

export default function ExpenseInvoice() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { data: trip } = useTrip(tripId);
  const { data: summary, isLoading: summaryLoading } = useBudgetSummary(tripId);
  const { data: items, isLoading: itemsLoading } = useBudgetItems(tripId);

  const handleExport = () => {
    const rows = [
      ['Category', 'Estimated', 'Actual'],
      ...(summary?.categories || []).map((c) => [c.category, c.estimated, c.actual]),
      ['', '', ''],
      ['TOTAL', summary?.totalEstimated || 0, summary?.totalActual || 0],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip?.tripName || 'trip'}-expenses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  const handleItemsExtracted = (result) => {
    // In a real app, we would send these items to the backend
    // to add them to the budget. For the hackathon, we show a success toast.
    // toast.success(`Added ${result.items.length} items to budget!`);
  };

  const isLoading = summaryLoading || itemsLoading;

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(tripId ? `/trips/${tripId}` : '/trips')}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary transition-colors mb-6 print:hidden"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Invoice Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 lg:p-8 rounded-2xl bg-white/90 border border-neutral-200/50 shadow-sm"
        >
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-neutral-800 flex items-center gap-2">
                <Receipt className="w-6 h-6 text-primary" /> Expense Report
              </h1>
              <h2 className="text-lg text-primary font-semibold mt-1">{trip?.tripName}</h2>
              <p className="text-sm text-neutral-500 mt-1">
                {formatDateFull(trip?.startDate)} — {formatDateFull(trip?.endDate)}
              </p>
            </div>
            <div className="flex gap-2 print:hidden">
              <AiReceiptScanner onItemsExtracted={handleItemsExtracted} />
              
              <button
                onClick={handlePrint}
                className="p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors"
                title="Print"
              >
                <Printer className="w-4 h-4 text-neutral-600" />
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-sm
                           font-semibold hover:bg-primary-dark transition-colors"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          {isLoading ? (
            <LineSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-primary/5 text-center">
                  <p className="text-xs text-primary font-medium mb-1">Budget</p>
                  <p className="text-xl font-bold text-neutral-800">{formatCurrency(trip?.totalBudget)}</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 text-center">
                  <p className="text-xs text-emerald-600 font-medium mb-1">Estimated</p>
                  <p className="text-xl font-bold text-emerald-700">{formatCurrency(summary?.totalEstimated)}</p>
                </div>
                <div className="p-4 rounded-xl bg-orange-50 text-center">
                  <p className="text-xs text-orange-600 font-medium mb-1">Actual</p>
                  <p className="text-xl font-bold text-orange-700">{formatCurrency(summary?.totalActual)}</p>
                </div>
              </div>

              {/* Category Table */}
              <div className="rounded-xl border border-neutral-200 overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="px-5 py-3 text-left font-medium text-neutral-600 text-xs">Category</th>
                      <th className="px-5 py-3 text-right font-medium text-neutral-600 text-xs">Estimated</th>
                      <th className="px-5 py-3 text-right font-medium text-neutral-600 text-xs">Actual</th>
                      <th className="px-5 py-3 text-right font-medium text-neutral-600 text-xs">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(summary?.categories || []).map((cat, i) => {
                      const est = parseFloat(cat.estimated) || 0;
                      const act = parseFloat(cat.actual) || 0;
                      const variance = act - est;
                      return (
                        <tr key={i} className="border-b border-neutral-100 last:border-0">
                          <td className="px-5 py-3 font-medium text-neutral-800 capitalize">{cat.category}</td>
                          <td className="px-5 py-3 text-right text-neutral-600">{formatCurrency(est)}</td>
                          <td className="px-5 py-3 text-right text-neutral-600">{formatCurrency(act)}</td>
                          <td className={`px-5 py-3 text-right font-medium ${variance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                            {variance > 0 ? '+' : ''}{formatCurrency(variance)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-neutral-50 font-bold">
                      <td className="px-5 py-3 text-neutral-800">Total</td>
                      <td className="px-5 py-3 text-right text-neutral-800">{formatCurrency(summary?.totalEstimated)}</td>
                      <td className="px-5 py-3 text-right text-neutral-800">{formatCurrency(summary?.totalActual)}</td>
                      <td className={`px-5 py-3 text-right ${(parseFloat(summary?.totalActual) - parseFloat(summary?.totalEstimated)) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {(() => {
                          const v = (parseFloat(summary?.totalActual) || 0) - (parseFloat(summary?.totalEstimated) || 0);
                          return `${v > 0 ? '+' : ''}${formatCurrency(v)}`;
                        })()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Line Items */}
              {items?.length > 0 && (
                <div>
                  <h3 className="font-display font-bold text-neutral-800 text-sm mb-3">Line Items</h3>
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-50 text-sm">
                        <div>
                          <span className="font-medium text-neutral-700">{item.description || item.category}</span>
                          <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-1 text-neutral-600">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(item.actualAmount || item.estimatedAmount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
