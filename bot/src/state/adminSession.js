const sessions = new Map();

export const setSession = (chatId, value) => {
  sessions.set(String(chatId), value);
};

export const getSession = (chatId) => sessions.get(String(chatId));

export const clearSession = (chatId) => {
  sessions.delete(String(chatId));
};
