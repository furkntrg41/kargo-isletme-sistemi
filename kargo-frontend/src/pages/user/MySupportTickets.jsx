import React, { useEffect, useState } from 'react';
import useSupportStore from '../../stores/useSupportStore';

// İkonlar
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TopicIcon from '@mui/icons-material/Topic';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import LockIcon from '@mui/icons-material/Lock';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';

const MySupportTickets = () => {
    const { myTickets, fetchMyTickets, isLoading, reopenTicket } = useSupportStore();
    const [chatInputs, setChatInputs] = useState({});

    useEffect(() => {
        fetchMyTickets();
    }, [fetchMyTickets]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Intl.DateTimeFormat('tr-TR', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(new Date(dateStr));
    };

    const handleChatSubmit = async (ticketId) => {
        const message = chatInputs[ticketId];
        if (!message || !message.trim()) return;
        const success = await reopenTicket(ticketId, message);
        if (success) setChatInputs({ ...chatInputs, [ticketId]: "" });
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Open': return { label: 'Aktif Talep', color: 'bg-blue-600', lightColor: 'bg-blue-50 text-blue-600', sub: 'Temsilci ataması bekleniyor.', icon: <PendingActionsIcon className="animate-pulse" sx={{ fontSize: 16 }} /> };
            case 'Replied': return { label: 'Yanıt Geldi', color: 'bg-amber-500', lightColor: 'bg-amber-50 text-amber-600', sub: 'Temsilcimiz size dönüş yaptı.', icon: <ReplyIcon sx={{ fontSize: 16 }} /> };
            case 'Resolved': return { label: 'Sonuçlandı', color: 'bg-slate-900', lightColor: 'bg-slate-100 text-slate-500', sub: 'Sorun çözüldü ve arşivlendi.', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> };
            default: return { label: status, color: 'bg-slate-400', lightColor: 'bg-slate-50 text-slate-400', sub: '', icon: null };
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <ChatBubbleTwoToneIcon />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Destek Merkezi</h1>
                    </div>
                    <p className="text-slate-500 font-medium text-lg italic">Geçmiş talepleriniz ve uzman çözümlerimiz.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-50">
                    <div className="px-6 py-2 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bekleyen</p>
                        <p className="text-2xl font-black text-blue-600">{myTickets.filter(t => t.status !== 'Resolved').length}</p>
                    </div>
                    <div className="w-px h-10 bg-slate-100"></div>
                    <div className="px-6 py-2 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tamamlanan</p>
                        <p className="text-2xl font-black text-slate-300">{myTickets.filter(t => t.status === 'Resolved').length}</p>
                    </div>
                </div>
            </div>

            {/* --- TICKETS LIST --- */}
            {isLoading && myTickets.length === 0 ? (
                <div className="flex flex-col items-center py-32 gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <SupportAgentIcon className="text-blue-600/30" />
                        </div>
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm animate-pulse">Veriler Çekiliyor...</p>
                </div>
            ) : (
                <div className="space-y-10">
                    {myTickets.map((ticket) => {
                        const config = getStatusConfig(ticket.status);
                        const isClosed = ticket.status === 'Resolved';

                        return (
                            <div key={ticket.id} className={`relative group bg-white rounded-[3rem] border border-slate-100 transition-all duration-500 ${isClosed ? 'grayscale-[0.5] opacity-90' : 'hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1'}`}>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
                                    
                                    {/* LEFT: INFO STRIP */}
                                    <div className="lg:col-span-4 p-10 bg-slate-50/40 border-r border-slate-50 flex flex-col justify-between relative overflow-hidden">
                                        <div className={`absolute top-0 left-0 w-1.5 h-full ${config.color}`}></div>
                                        
                                        <div className="space-y-8">
                                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider ${config.lightColor} border border-current/10`}>
                                                {config.icon} {config.label}
                                            </div>

                                            <div className="space-y-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-400">
                                                        <TopicIcon fontSize="small" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Departman</p>
                                                        <p className="text-xs font-black text-slate-700">{ticket.category}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-400">
                                                        <CalendarMonthIcon fontSize="small" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Talep Tarihi</p>
                                                        <p className="text-xs font-black text-slate-700">{formatDate(ticket.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-[11px] font-bold text-slate-400 italic leading-relaxed pt-8 border-t border-slate-100">
                                            {config.sub}
                                        </p>
                                    </div>

                                    {/* RIGHT: CONVERSATION */}
                                    <div className="lg:col-span-8 p-10 flex flex-col justify-between">
                                        <div className="space-y-8">
                                            {/* USER MESSAGE */}
                                            <div className="flex items-start gap-5">
                                                <div className="w-12 h-12 rounded-[1.25rem] bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/50">
                                                    <span className="font-black text-slate-400 text-xs">Siz</span>
                                                </div>
                                                <div className="space-y-2 flex-1">
                                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{ticket.subject}</h3>
                                                    <div className="bg-slate-50/80 p-6 rounded-3xl rounded-tl-none text-slate-600 text-[13px] font-medium leading-relaxed whitespace-pre-wrap border border-slate-100 shadow-inner">
                                                        {ticket.message}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ADMIN RESPONSE */}
                                            {ticket.adminReply && (
                                                <div className="flex items-start gap-5 animate-in slide-in-from-right-4 duration-700">
                                                    <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg ${isClosed ? 'bg-slate-800' : 'bg-blue-600 text-white'}`}>
                                                        <SupportAgentIcon fontSize="small" />
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className={`p-6 rounded-3xl rounded-tl-none text-white shadow-xl ${isClosed ? 'bg-slate-800 shadow-slate-200' : 'bg-blue-600 shadow-blue-100'}`}>
                                                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Uzman: {ticket.adminFullName}</span>
                                                                <span className="text-[9px] font-bold opacity-60 italic">{formatDate(ticket.repliedAt)}</span>
                                                            </div>
                                                            <p className="text-[13px] font-medium leading-relaxed italic">
                                                                "{ticket.adminReply}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* ACTION AREA */}
                                        <div className="mt-10 pt-8 border-t border-slate-50">
                                            {isClosed ? (
                                                <div className="bg-slate-50 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 text-slate-400 border border-dashed border-slate-200">
                                                    <LockIcon sx={{ fontSize: 16 }} />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">BU OTURUM SONLANDIRILDI</span>
                                                </div>
                                            ) : ticket.status === 'Replied' ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 mb-2 ml-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></div>
                                                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Temsilciye cevap verin</span>
                                                    </div>
                                                    <div className="relative flex items-center">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Eklemek istediğiniz mesaj..." 
                                                            className="w-full pl-6 pr-20 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-blue-600/20 focus:bg-white transition-all shadow-inner"
                                                            value={chatInputs[ticket.id] || ""}
                                                            onChange={(e) => setChatInputs({...chatInputs, [ticket.id]: e.target.value})}
                                                            onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit(ticket.id)}
                                                        />
                                                        <button 
                                                            onClick={() => handleChatSubmit(ticket.id)}
                                                            disabled={isLoading || !chatInputs[ticket.id]?.trim()}
                                                            className="absolute right-3 p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-90 disabled:opacity-30 shadow-lg"
                                                        >
                                                            <SendIcon sx={{ fontSize: 18 }} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2 text-blue-500/50 py-2">
                                                    <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                    <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                    <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                                                    <span className="text-[9px] font-black uppercase tracking-widest ml-2">Temsilci Talebinizi İnceliyor</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MySupportTickets;    