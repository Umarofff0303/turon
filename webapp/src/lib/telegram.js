export const getTelegramWebApp = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.Telegram?.WebApp || null;
};

export const initTelegramWebApp = () => {
  const tg = getTelegramWebApp();
  if (!tg) {
    return null;
  }

  tg.ready();
  tg.expand();

  return tg;
};

export const getTelegramUser = () => {
  const tg = getTelegramWebApp();
  const user = tg?.initDataUnsafe?.user;

  if (user) {
    return {
      telegramId: String(user.id),
      fullName: [user.first_name, user.last_name].filter(Boolean).join(" "),
      username: user.username || "",
    };
  }

  if (typeof window === "undefined") return null;

  let guestId = localStorage.getItem("turon_guest_id");
  if (!guestId) {
    guestId = "guest_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("turon_guest_id", guestId);
  }

  return {
    telegramId: guestId,
    fullName: "Mehmon",
    username: "",
  };
};

export const applyTelegramTheme = () => {
  const tg = getTelegramWebApp();
  const params = tg?.themeParams || {};

  const root = document.documentElement;
  const bg = params.bg_color || "#f7f8f2";
  const text = params.text_color || "#111a14";
  const button = params.button_color || "#2f7f3b";
  const buttonText = params.button_text_color || "#ffffff";

  root.style.setProperty("--tg-bg", bg);
  root.style.setProperty("--tg-text", text);
  root.style.setProperty("--tg-button", button);
  root.style.setProperty("--tg-button-text", buttonText);
};

export const setupTelegramMainButton = ({ text, onClick, isVisible = true, isLoading = false }) => {
  const tg = getTelegramWebApp();
  if (!tg?.MainButton) {
    return () => {};
  }

  tg.MainButton.setText(text);
  tg.MainButton.onClick(onClick);
  if (isLoading) {
    tg.MainButton.showProgress();
  } else {
    tg.MainButton.hideProgress();
  }

  if (isVisible) {
    tg.MainButton.show();
  } else {
    tg.MainButton.hide();
  }

  return () => {
    tg.MainButton.offClick(onClick);
    tg.MainButton.hideProgress();
    tg.MainButton.hide();
  };
};
