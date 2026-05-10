/* ────────────────────────────────────────────
   TripNotes — Screen 13
   Add/edit/delete notes, timestamps
   ──────────────────────────────────────────── */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, Plus, Trash2, Edit3, Save, X, Clock } from 'lucide-react';
import { useTrip } from '../hooks/useTrips';

export default function TripNotes() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { data: trip } = useTrip(tripId);

  const [notes, setNotes] = useState([
    { id: '1', title: 'Travel Tips', content: 'Remember to check visa requirements', type: 'general', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', type: 'general' });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ title: '', content: '', type: 'general' });

  const NOTE_TYPES = [
    { value: 'general', label: 'General', color: 'bg-blue-100 text-blue-700' },
    { value: 'important', label: 'Important', color: 'bg-red-100 text-red-700' },
    { value: 'idea', label: 'Idea', color: 'bg-purple-100 text-purple-700' },
    { value: 'booking', label: 'Booking', color: 'bg-emerald-100 text-emerald-700' },
  ];

  const addNote = () => {
    if (!addForm.content.trim()) return;
    const note = {
      id: Date.now().toString(),
      ...addForm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((p) => [note, ...p]);
    setAddForm({ title: '', content: '', type: 'general' });
    setShowAdd(false);
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditForm({ title: note.title, content: note.content, type: note.type });
  };

  const saveEdit = () => {
    setNotes((p) =>
      p.map((n) =>
        n.id === editingId
          ? { ...n, ...editForm, updatedAt: new Date().toISOString() }
          : n
      )
    );
    setEditingId(null);
  };

  const deleteNote = (id) => {
    setNotes((p) => p.filter((n) => n.id !== id));
  };

  const getTypeStyle = (type) =>
    NOTE_TYPES.find((t) => t.value === type)?.color || 'bg-neutral-100 text-neutral-600';

  const formatTs = (iso) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(tripId ? `/trips/${tripId}` : '/trips')}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-neutral-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" /> Trip Notes
            </h1>
            {trip && <p className="text-sm text-neutral-500">{trip.tripName}</p>}
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white
                       text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Note
          </button>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-5 rounded-2xl bg-white/80 border border-primary/20 space-y-3">
                <input
                  value={addForm.title}
                  onChange={(e) => setAddForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Note title (optional)"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm
                             focus:border-primary outline-none bg-white/80"
                />
                <textarea
                  value={addForm.content}
                  onChange={(e) => setAddForm((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Write your note..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm resize-none
                             focus:border-primary outline-none bg-white/80"
                />
                <div className="flex items-center gap-3">
                  <select
                    value={addForm.type}
                    onChange={(e) => setAddForm((p) => ({ ...p, type: e.target.value }))}
                    className="px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:border-primary outline-none"
                  >
                    {NOTE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <div className="flex-1" />
                  <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-sm text-neutral-500 hover:bg-neutral-100">Cancel</button>
                  <button onClick={addNote} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark">Save</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes list */}
        <div className="space-y-3">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="p-5 rounded-2xl bg-white/80 border border-neutral-200/50 shadow-sm group"
              >
                {editingId === note.id ? (
                  <div className="space-y-3">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-primary outline-none"
                    />
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm((p) => ({ ...p, content: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm resize-none focus:border-primary outline-none"
                    />
                    <div className="flex gap-2">
                      <select
                        value={editForm.type}
                        onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))}
                        className="px-3 py-2 rounded-lg border border-neutral-200 text-sm"
                      >
                        {NOTE_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      <div className="flex-1" />
                      <button onClick={() => setEditingId(null)} className="p-2 rounded-lg hover:bg-neutral-100"><X className="w-4 h-4" /></button>
                      <button onClick={saveEdit} className="p-2 rounded-lg bg-primary text-white hover:bg-primary-dark"><Save className="w-4 h-4" /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {note.title && <h3 className="font-semibold text-neutral-800 text-sm">{note.title}</h3>}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getTypeStyle(note.type)}`}>
                            {note.type}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 whitespace-pre-wrap">{note.content}</p>
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-neutral-400">
                          <Clock className="w-3 h-3" /> {formatTs(note.updatedAt)}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(note)} className="p-1.5 rounded-lg hover:bg-neutral-100"><Edit3 className="w-3.5 h-3.5 text-neutral-400" /></button>
                        <button onClick={() => deleteNote(note.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-neutral-400 hover:text-red-500" /></button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {notes.length === 0 && (
          <div className="text-center py-16 rounded-2xl bg-white/60 border border-dashed border-neutral-200">
            <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-neutral-700 mb-1">No notes yet</h3>
            <p className="text-sm text-neutral-400">Start journaling your trip thoughts and ideas</p>
          </div>
        )}
      </div>
    </div>
  );
}
