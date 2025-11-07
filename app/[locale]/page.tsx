import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div>
      <h1>{t("welcomeMessage")}</h1>
    </div>
  );
}
