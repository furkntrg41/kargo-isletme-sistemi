import axiosClient from "../api/axiosClient";

export const supportService = {
  // --- KULLANICI METODLARI ---

  // Yeni bir destek talebi (ticket) oluşturur
  createTicket: async (ticketData) => {
    const response = await axiosClient.post("/Support", ticketData);
    return response.data;
  },

  // Giriş yapmış kullanıcının kendi taleplerini getirir
  getMyTickets: async () => {
    const response = await axiosClient.get("/Support/my-tickets");
    return response;
  },

  // Yanıtlanmış bir talebe kullanıcı tarafından ek mesaj gönderilmesini sağlar
  // JSON.stringify kullanıyoruz çünkü backend [FromBody] string bekliyor
  reOpenTicket: async (ticketId, newMessage) => {
    const response = await axiosClient.patch(
      `/Support/${ticketId}/reopen`,
      JSON.stringify(newMessage),
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  },


  // --- ADMİN METODLARI ---

  // Sistemdeki tüm destek taleplerini admin için listeler
  getAllTickets: async () => {
    const response = await axiosClient.get("/Support/all");
    return response;
  },

  // Adminin bir talebe yanıt vermesini sağlar
  replyTicket: async (ticketId, replyMessage) => {
    const response = await axiosClient.patch(`/Support/${ticketId}/reply`, {
        replyMessage: replyMessage
    });
    return response.data;
  },

  // Adminin bir talebi tamamen çözüldü olarak kapatmasını sağlar
  closeTicket: async (ticketId) => {
    const response = await axiosClient.patch(`/Support/${ticketId}/close`);
    return response.data;
  },
};