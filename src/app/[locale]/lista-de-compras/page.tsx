import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Link, redirect } from "@/i18n/navigation";
import { getAccessStatus } from "@/lib/access/purchase-status";
import { getShoppingListItems } from "@/lib/shopping-list/queries";
import { clearCheckedItems } from "@/lib/shopping-list/actions";
import { SHOPPING_CATEGORIES, type ShoppingCategory } from "@/lib/shopping-list/categorize";
import { ShoppingListItemRow } from "@/components/shopping-list-item";
import { ShoppingListAddForm } from "@/components/shopping-list-add-form";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const CATEGORY_KEY: Record<ShoppingCategory, string> = {
  "frutas-y-verduras": "catFrutasYVerduras",
  proteinas: "catProteinas",
  lacteos: "catLacteos",
  "granos-y-cereales": "catGranosYCereales",
  legumbres: "catLegumbres",
  especias: "catEspecias",
  despensa: "catDespensa",
  congelados: "catCongelados",
  otros: "catOtros",
};

export default async function ShoppingListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const access = await getAccessStatus();
  if (!access.authenticated) {
    redirect({ href: { pathname: "/ingresar" }, locale });
  }

  const t = await getTranslations({ locale, namespace: "shoppingList" });
  const tAuth = await getTranslations({ locale, namespace: "auth" });

  const items = access.hasAccess ? await getShoppingListItems() : [];
  const hasCheckedItems = items.some((i) => i.checked);

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm text-cacao-soft">{t("subtitle")}</p>

      {!access.hasAccess ? (
        <div className="mt-5 rounded-xl border border-terracotta bg-terracotta-tint p-5">
          <p className="font-display text-lg font-semibold text-terracotta">
            {tAuth("noAccessTitle")}
          </p>
          <p className="mt-1.5 text-sm text-cacao-soft">{tAuth("noAccessBody")}</p>
        </div>
      ) : (
        <>
          {items.length === 0 ? (
            <div className="mt-8 rounded-xl border border-line bg-cream-2 p-5">
              <p className="font-display text-lg font-semibold text-sage-deep">
                {t("emptyTitle")}
              </p>
              <p className="mt-1.5 text-sm text-cacao-soft">{t("emptyBody")}</p>
              <Link
                href="/recetas"
                className="mt-4 inline-flex items-center rounded-full bg-cacao px-5 py-2.5 text-sm font-medium text-cream transition-opacity hover:opacity-90"
              >
                {t("browseRecipes")}
              </Link>
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-7">
              {SHOPPING_CATEGORIES.map((category) => {
                const categoryItems = items.filter((i) => i.category === category);
                if (categoryItems.length === 0) return null;
                return (
                  <section key={category}>
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-sage-deep">
                      {t(CATEGORY_KEY[category] as "catOtros")}
                    </h2>
                    <ul className="mt-2">
                      {categoryItems.map((item) => (
                        <ShoppingListItemRow
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          quantity={item.quantity}
                          unit={item.unit}
                          checked={item.checked}
                          removeLabel={t("removeItem")}
                        />
                      ))}
                    </ul>
                  </section>
                );
              })}

              {hasCheckedItems && (
                <form action={clearCheckedItems}>
                  <button
                    type="submit"
                    className="text-xs text-cacao-soft underline-offset-2 hover:underline"
                  >
                    {t("clearChecked")}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-8 border-t border-line pt-6">
            <ShoppingListAddForm
              labels={{
                namePlaceholder: t("namePlaceholder"),
                quantityPlaceholder: t("quantityPlaceholder"),
                unitPlaceholder: t("unitPlaceholder"),
                add: t("addManual"),
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
