import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ContactMessage } from '../../types';
import { Mail, MailOpen, Trash2, Eye, Search, CheckCircle, Clock, X, Reply } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const { messages, markMessageRead, deleteMessage } = useData();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
  const [notification, setNotification] = useState('');

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const filtered = messages
    .filter((m) => {
      if (filterRead === 'unread') return !m.read;
      if (filterRead === 'read') return m.read;
      return true;
    })
    .filter(
      (m) =>
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      markMessageRead(msg.id, true);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Client Inquiry Messages</h3>
          <p className="text-xs text-slate-400 font-mono">
            {messages.length} total messages received • {messages.filter((m) => !m.read).length} unread
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterRead('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              filterRead === 'all'
                ? 'bg-cyan-500 text-black font-semibold'
                : 'bg-[#060b18] border border-cyan-500/20 text-slate-400 hover:text-white'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilterRead('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              filterRead === 'unread'
                ? 'bg-rose-500 text-white font-semibold'
                : 'bg-[#060b18] border border-cyan-500/20 text-slate-400 hover:text-white'
            }`}
          >
            Unread ({messages.filter((m) => !m.read).length})
          </button>
          <button
            onClick={() => setFilterRead('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              filterRead === 'read'
                ? 'bg-emerald-500 text-black font-semibold'
                : 'bg-[#060b18] border border-cyan-500/20 text-slate-400 hover:text-white'
            }`}
          >
            Read ({messages.filter((m) => m.read).length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by sender, email or message content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-cyan-500/30 bg-[#060b18] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Messages List */}
      <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 italic font-mono">
            No messages found matching your filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-cyan-500/10">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                  msg.read
                    ? 'hover:bg-slate-800/30 text-slate-300'
                    : 'bg-cyan-500/5 hover:bg-cyan-500/10 text-white font-medium border-l-4 border-l-cyan-400'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-[#060b18] border border-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                    {msg.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4 text-cyan-300" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white truncate">{msg.fullName}</span>
                      <span className="text-xs font-mono text-cyan-400/90 truncate">({msg.email})</span>
                      {!msg.read && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-slate-200 mt-0.5 truncate">
                      {msg.subject}
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {msg.message}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(msg.timestamp).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => markMessageRead(msg.id, !msg.read)}
                    className="p-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-xs"
                    title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {msg.read ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete message from ${msg.fullName}?`)) {
                        deleteMessage(msg.id);
                        showNotice('Message removed.');
                      }
                    }}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message View Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-5 shadow-[0_0_40px_rgba(0,242,254,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase">Inquiry Details</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedMessage.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#060b18] border border-cyan-500/15 space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">From:</span>
                <span className="text-white font-bold">{selectedMessage.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-cyan-300 hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="text-slate-400">{new Date(selectedMessage.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono text-slate-400 uppercase">Message Content</h4>
              <div className="p-4 rounded-xl border border-cyan-500/20 bg-[#060b18] text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>Reply by Email</span>
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    deleteMessage(selectedMessage.id);
                    setSelectedMessage(null);
                    showNotice('Message deleted.');
                  }}
                  className="px-3 py-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
