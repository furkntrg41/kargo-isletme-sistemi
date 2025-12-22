import React, { useState } from 'react';
import useSupportStore from '../../stores/useSupportStore'; // Store import edildi
import { toast } from 'react-toastify';

// İkonlar
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Support = () => {
  const { createNewTicket, isLoading } = useSupportStore(); // Store'dan fonksiyon ve loading çekildi
  const [activeFaq, setActiveFaq] = useState(null);

  // Form State
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Kargo Durumu Hakkında',
    message: ''
  });

  const faqs = [
    { q: "Kargom ne zaman yola çıkar?", a: "Talebiniz 'Bekliyor' statüsünden 'Planlandı' statüsüne geçtiğinde, ilk uygun araç rotasına dahil edilir. Genelde 24 saat içinde toplama yapılır." },
    { q: "Ağırlık sınırınız var mı?", a: "Sistemimiz kiralık araç kapasitelerine göre çalışır. Tek parça kargolarda 500kg üzerindeki talepler için lütfen doğrudan merkezle iletişime geçin." },
    { q: "Hatalı talep oluşturdum, ne yapmalıyım?", a: "Henüz 'Planlandı' statüsüne geçmeyen talepleriniz için destek ekibimize mesaj atarak iptal edilmesini isteyebilirsiniz." }
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Basit validasyon
    if (!ticketForm.subject || !ticketForm.message) {
      toast.error("Lütfen tüm alanları doldurunuz.");
      return;
    }

    // Store üzerinden backend'e gönderim
    const success = await createNewTicket({
      subject: ticketForm.subject,
      category: ticketForm.category,
      message: ticketForm.message
    });

    if (success) {
      // Formu temizle
      setTicketForm({ subject: '', category: 'Kargo Durumu Hakkında', message: '' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Destek Merkezi</h1>
        <p className="text-slate-500 font-medium font-sans">Size nasıl yardımcı olabiliriz?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL: HIZLI İLETİŞİM KARTLARI */}
        <div className="space-y-4">
          <ContactCard 
            icon={<WhatsAppIcon className="text-emerald-500" />} 
            title="WhatsApp Destek" 
            sub="7/24 Hızlı Mesaj" 
            action="Mesaj Başlat"
            color="hover:bg-emerald-50"
          />
          <ContactCard 
            icon={<PhoneInTalkIcon className="text-blue-500" />} 
            title="Müşteri Hizmetleri" 
            sub="0850 000 00 00" 
            action="Hemen Ara"
            color="hover:bg-blue-50"
          />
          <ContactCard 
            icon={<EmailIcon className="text-orange-500" />} 
            title="E-Posta Adresi" 
            sub="destek@tepekargo.com" 
            action="Mail Gönder"
            color="hover:bg-orange-50"
          />
        </div>

        {/* ORTA: MESAJ FORMU (Gerçek Store Bağlantılı) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <SupportAgentIcon className="text-blue-600" /> Bize Yazın
            </h3>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Konu Başlığı" 
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                  className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
                  required 
                />
                <select 
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                  className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                >
                  <option value="Kargo Durumu Hakkında">Kargo Durumu Hakkında</option>
                  <option value="Sistem Hatası Bildirimi">Sistem Hatası Bildirimi</option>
                  <option value="Ücretlendirme ve Faturalandırma">Ücretlendirme ve Faturalandırma</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              <textarea 
                placeholder="Sorununuzu detaylıca açıklayın..." 
                rows="5" 
                value={ticketForm.message}
                onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
                required
              ></textarea>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50"
              >
                {isLoading ? "GÖNDERİLİYOR..." : <><SendIcon fontSize="small"/> MESAJI GÖNDER</>}
              </button>
            </form>
          </div>

          {/* SIKÇA SORULAN SORULAR (Aynı Kalıyor) */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <HelpOutlineIcon className="text-purple-600" /> Sıkça Sorulan Sorular
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-slate-50 rounded-2xl overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm font-black text-slate-700 text-left">{faq.q}</span>
                    <ExpandMoreIcon className={`text-slate-400 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {activeFaq === index && (
                    <div className="px-6 py-4 text-xs font-medium text-slate-500 leading-relaxed bg-white animate-in slide-in-from-top-2 duration-300">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactCard = ({ icon, title, sub, action, color }) => (
  <div className={`bg-white p-6 rounded-[2rem] border border-slate-100 transition-all cursor-pointer group ${color}`}>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors shadow-sm">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-black text-slate-800">{title}</h4>
        <p className="text-[10px] text-slate-400 font-bold uppercase">{sub}</p>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] font-black text-blue-600 uppercase tracking-widest text-right group-hover:translate-x-1 transition-transform">
      {action} →
    </div>
  </div>
);

export default Support;