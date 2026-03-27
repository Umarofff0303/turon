import { useEffect, useState } from "react";
import { registerOrLogin } from "../api/users.api";
import { getPublicConfig } from "../api/config.api";
import {
  applyTelegramTheme,
  getTelegramUser,
  initTelegramWebApp,
} from "../lib/telegram";
import { useAppStore } from "../store/app.store";

export const useBootstrap = () => {
  const setTelegramUser = useAppStore((state) => state.setTelegramUser);
  const setConfig = useAppStore((state) => state.setConfig);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        initTelegramWebApp();
        applyTelegramTheme();

        const telegramUser = getTelegramUser();
        setTelegramUser(telegramUser);

        await registerOrLogin({
          telegramId: telegramUser.telegramId,
          fullName: telegramUser.fullName,
          phone: "",
        });

        const config = await getPublicConfig();
        setConfig(config);
      } catch (e) {
        if (mounted) {
          setError(e.message || "Initialization failed");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [setConfig, setTelegramUser]);

  return { loading, error };
};
