import React, { useEffect, useState } from 'react';
import useSupportStore from '../../stores/useSupportStore';
import { toast } from 'react-toastify';

// İkonlar
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ReplyIcon from '@mui/icons-material/Reply';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';

const SupportManagement = () => {
    const { allTickets, fetchAllTickets, replyTicket, closeTicket, isLoading } = useSupportStore();
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => { 
        fetchAllTickets(); 
    }, [fetchAllTickets]);

    const handleReplySubmit = async () => {
        if (!replyText.trim()) return;
        const success = await replyTicket(selectedTicket.id, replyText);
        if (success) {
            setReplyText("");
            setSelectedTicket(null);
        }
    };

    const handleCloseSubmit = async (id) => {
        await closeTicket(id);
        setSelectedTicket(null);
    };

    // Filtreleme mantığı
    const filteredTickets = allTickets.filter(t => 
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerFullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-600';
            case 'Replied': return 'bg-amber-500';
            case 'Resolved': return 'bg-emerald-500';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Operasyonel Destek</h1>
                    <p className="text-slate-500 font-medium italic">Müşteri taleplerini yönetin ve çözüm süreçlerini takip edin.</p>
                </div>
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" />
                    <input 
                        type="text"
                        placeholder="Talep veya müşteri ara..."
                        className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 w-64 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* SOL: SMART LİSTE */}
                <div className="lg:col-span-4 space-y-4 max-h-[75vh] overflow-y-auto pr-3 custom-scrollbar">
                    {filteredTickets.map(t => (
                        <div 
                            key={t.id} 
                            onClick={() => setSelectedTicket(t)} 
                            className={`group relative p-5 rounded-[2rem] bg-white border border-slate-100 cursor-pointer transition-all duration-300 
                                ${selectedTicket?.id === t.id 
                                    ? 'shadow-2xl shadow-blue-900/10 -translate-y-1' 
                                    : 'hover:shadow-md hover:border-blue-200'}`}
                        >
                            {/* Status Şeridi */}
                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-r-full transition-all ${getStatusStyle(t.status)}`}></div>
                            
                            <div className="flex justify-between items-start mb-2 pl-2">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${t.status === 'Open' ? 'text-blue-600 bg-blue-50' : t.status === 'Replied' ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'}`}>
                                    {t.status}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                    {new Date(t.createdAt).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm truncate pl-2">{t.subject}</h4>
                            <div className="flex items-center gap-1.5 mt-2 pl-2 text-slate-400">
                                <PersonPinIcon sx={{ fontSize: 14 }} />
                                <span className="text-[11px] font-bold">{t.customerFullName}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SAĞ: WORKSPACE PANELDETAY */}
                <div className="lg:col-span-8 h-full">
                    {selectedTicket ? (
                        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col h-full animate-in slide-in-from-right-8 duration-500">
                            
                            {/* Panel Header */}
                            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                        <ChatBubbleTwoToneIcon className="text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black">{selectedTicket.subject}</h2>
                                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{selectedTicket.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Müşteri Kimliği</p>
                                    <p className="font-black text-sm">{selectedTicket.customerFullName}</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh]">
                                {/* Mesaj Gövdesi */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <HistoryIcon fontSize="small" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Konuşma Geçmişi</span>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-slate-700 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                                        {selectedTicket.message}
                                    </div>
                                </div>

                                {/* Aksiyon Alanı */}
                                {selectedTicket.status !== 'Resolved' ? (
                                    <div className="pt-8 border-t border-slate-100 space-y-4">
                                        <div className="relative">
                                            <textarea 
                                                className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl text-sm font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-300"
                                                placeholder="Buradan yanıt yazarak müşteriyi bilgilendirin..."
                                                rows="4"
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={handleReplySubmit} 
                                                disabled={isLoading || !replyText.trim()}
                                                className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50 active:scale-95"
                                            >
                                                <ReplyIcon fontSize="small"/> CEVABI GÖNDER
                                            </button>
                                            <button 
                                                onClick={() => handleCloseSubmit(selectedTicket.id)} 
                                                disabled={isLoading}
                                                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-95"
                                            >
                                                <DoneAllIcon fontSize="small"/> ÇÖZÜLDÜ
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 text-center space-y-2">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                                            <DoneAllIcon />
                                        </div>
                                        <h3 className="text-emerald-900 font-black uppercase text-sm">Talep Arşivlendi</h3>
                                        <p className="text-emerald-600 text-xs font-medium italic px-12">
                                            Bu bilet başarıyla çözümlendiği için arşive taşınmıştır. Müşteri artık yeni mesaj gönderemez.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[3rem] p-12 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                <ChatBubbleTwoToneIcon sx={{ fontSize: 40 }} />
                            </div>
                            <div>
                                <h3 className="text-slate-400 font-black uppercase tracking-widest italic">Operasyon Masası Hazır</h3>
                                <p className="text-slate-300 text-xs font-bold max-w-[250px] mx-auto mt-2">
                                    Detayları incelemek ve müşteriye dönüş yapmak için bir talep seçin.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportManagement;