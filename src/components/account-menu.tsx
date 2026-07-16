import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AccessStatus } from "@/lib/access/purchase-status";
import { signOut } from "@/app/[locale]/ingresar/actions";

export async function AccountMenu({ locale, access }: { locale: string; access: AccessStatus }) {
  const t = await getTranslations({ locale, namespace: "auth" });

  if (!access.authenticated) {
    return (
      <Link href="/ingresar" className="text-cacao-soft hover:text-cacao">
        {t("navSignIn")}
      </Link>
    );
  }

  return (
    <form action={signOut} className="flex items-center gap-2">
      <span className="hidden text-cacao-soft sm:inline" title={access.email}>
        {access.email}
      </span>
      <button type="submit" className="text-cacao-soft hover:text-cacao">
        {t("signOut")}
      </button>
    </form>
  );
}
