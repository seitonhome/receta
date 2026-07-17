import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/recipes/types";
import { recipes, getRecipe, getRecipeContent } from "@/lib/recipes/data";
import { RecipePlate } from "@/components/recipe-plate";
import { LaunchOffer } from "@/components/launch-offer";
import type { AccessStatus } from "@/lib/access/purchase-status";

const CATEGORY_COUNTS = {
  entrada: recipes.filter((r) => r.category === "entrada").length,
  almuerzo: recipes.filter((r) => r.category === "almuerzo").length,
  cena: recipes.filter((r) => r.category === "cena").length,
  postre: recipes.filter((r) => r.category === "postre").length,
};

const SAMPLE_SLUG = "salmon-vapor-eneldo-pure-coliflor";

export async function RecipesLanding({
  locale,
  access,
}: {
  locale: string;
  access: AccessStatus;
}) {
  const t = await getTranslations({ locale, namespace: "landing" });
  const tRecipe = await getTranslations({ locale, namespace: "recipe" });

  const hotmartUrl = process.env.NEXT_PUBLIC_HOTMART_URL;
  const signedInNoAccess = access.authenticated;
  const sample = getRecipe(SAMPLE_SLUG)!;
  const { content: sampleContent } = getRecipeContent(sample, locale as Locale);

  const pains = [1, 2, 3, 4].map((n) => ({
    tag: t(`pain${n}Tag` as "pain1Tag"),
    title: t(`pain${n}Title` as "pain1Title"),
    body: t(`pain${n}Body` as "pain1Body"),
  }));

  const features = [1, 2, 3, 4].map((n) => ({
    title: t(`feature${n}Title` as "feature1Title"),
    body: t(`feature${n}Body` as "feature1Body"),
  }));

  const diffRows = [1, 2, 3, 4].map((n) => ({
    criteria: t(`diffRow${n}Criteria` as "diffRow1Criteria"),
    typical: t(`diffRow${n}Typical` as "diffRow1Typical"),
    ours: t(`diffRow${n}Ours` as "diffRow1Ours"),
  }));

  const faqs = [1, 2, 3, 4].map((n) => ({
    q: t(`faq${n}Q` as "faq1Q"),
    a: t(`faq${n}A` as "faq1A"),
  }));

  const offerLabels = {
    eyebrow: t("offerEyebrow"),
    returnsNote: t("offerReturnsNote"),
    days: t("offerDays"),
    hours: t("offerHours"),
    minutes: t("offerMinutes"),
    seconds: t("offerSeconds"),
  };

  return (
    <div>
      {/* HERO */}
      <section className="mx-auto max-w-4xl px-5 pt-16 pb-14 text-center sm:pt-24">
        <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
          {t("heroEyebrow")}
        </p>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-cacao-soft">{t("heroSubtitle")}</p>

        <div className="mt-8">
          <LaunchOffer labels={offerLabels} />
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {hotmartUrl ? (
            <a
              href={hotmartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-cacao px-6 py-3 text-sm font-medium text-cream transition-opacity hover:opacity-90"
            >
              {t("ctaBuy")}
            </a>
          ) : (
            <span className="inline-flex items-center rounded-full border border-line bg-cream-2 px-6 py-3 text-sm font-medium text-cacao-soft">
              {t("ctaBuySoon")}
            </span>
          )}
          {!signedInNoAccess && (
            <Link
              href="/ingresar"
              className="inline-flex items-center rounded-full border border-line px-6 py-3 text-sm font-medium text-cacao transition-colors hover:border-sage"
            >
              {t("ctaSignIn")}
            </Link>
          )}
        </div>

        {signedInNoAccess && (
          <div className="mx-auto mt-6 max-w-md rounded-xl border border-terracotta bg-terracotta-tint px-4 py-3 text-left">
            <p className="text-sm font-semibold text-terracotta">{t("signedInNoAccessTitle")}</p>
            <p className="mt-1 text-xs text-cacao-soft">
              {t.raw("signedInNoAccessBody").replace("{email}", access.email ?? "")}
            </p>
          </div>
        )}

        <div className="mx-auto mt-14 grid max-w-lg grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-semibold tabular-nums">{recipes.length}</p>
            <p className="mt-1 text-xs text-cacao-soft">{t("statRecipes")}</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold tabular-nums">3</p>
            <p className="mt-1 text-xs text-cacao-soft">{t("statLangs")}</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold tabular-nums">7</p>
            <p className="mt-1 text-xs text-cacao-soft">{t("statCountries")}</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold tabular-nums">4</p>
            <p className="mt-1 text-xs text-cacao-soft">{t("statMoments")}</p>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="border-t border-line bg-cream-2/60 px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
            {t("painEyebrow")}
          </p>
          <h2 className="mt-2 max-w-xl font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {t("painTitle")}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {pains.map((p) => (
              <div key={p.tag} className="rounded-2xl border border-line bg-cream p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">{p.tag}</p>
                <h3 className="mt-1.5 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-cacao-soft">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
            {t("includesEyebrow")}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("includesTitle")}
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-line p-5 text-center">
              <p className="font-display text-3xl font-semibold tabular-nums">
                {CATEGORY_COUNTS.entrada}
              </p>
              <p className="mt-1 text-sm font-medium">{t("catEntrada")}</p>
              <p className="mt-0.5 text-xs text-cacao-soft">{t("catEntradaNote")}</p>
            </div>
            <div className="rounded-2xl border border-line p-5 text-center">
              <p className="font-display text-3xl font-semibold tabular-nums">
                {CATEGORY_COUNTS.almuerzo}
              </p>
              <p className="mt-1 text-sm font-medium">{t("catAlmuerzo")}</p>
              <p className="mt-0.5 text-xs text-cacao-soft">{t("catAlmuerzoNote")}</p>
            </div>
            <div className="rounded-2xl border border-line p-5 text-center">
              <p className="font-display text-3xl font-semibold tabular-nums">
                {CATEGORY_COUNTS.cena}
              </p>
              <p className="mt-1 text-sm font-medium">{t("catCena")}</p>
              <p className="mt-0.5 text-xs text-cacao-soft">{t("catCenaNote")}</p>
            </div>
            <div className="rounded-2xl border border-line p-5 text-center">
              <p className="font-display text-3xl font-semibold tabular-nums">
                {CATEGORY_COUNTS.postre}
              </p>
              <p className="mt-1 text-sm font-medium">{t("catPostre")}</p>
              <p className="mt-0.5 text-xs text-cacao-soft">{t("catPostreNote")}</p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-sage" />
                <div>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="mt-0.5 text-sm text-cacao-soft">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="border-t border-line bg-cream-2/60 px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
            {t("diffEyebrow")}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("diffTitle")}
          </h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-cream">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-cacao-soft">
                  <th className="px-5 py-3 font-semibold">{t("diffCriteria")}</th>
                  <th className="px-5 py-3 font-semibold">{t("diffTypical")}</th>
                  <th className="px-5 py-3 font-semibold">{t("diffOurs")}</th>
                </tr>
              </thead>
              <tbody>
                {diffRows.map((row) => (
                  <tr key={row.criteria} className="border-b border-line last:border-none">
                    <td className="px-5 py-3 font-medium">{row.criteria}</td>
                    <td className="px-5 py-3 text-cacao-soft">{row.typical}</td>
                    <td className="px-5 py-3 font-medium text-sage-deep">{row.ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SAMPLE RECIPE */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
            {t("sampleEyebrow")}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("sampleTitle")}
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <RecipePlate slug={sample.slug} colors={sample.plateColors} alt={sample.imageAlt[locale as Locale]} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
                {sampleContent.eyebrow}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold leading-tight">
                {sampleContent.title}
              </h3>
              <p className="mt-2 text-sm text-cacao-soft">{sampleContent.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-cacao-soft">
                <span className="rounded-full border border-line px-2.5 py-1">
                  {tRecipe("total")} <b className="text-cacao">{sampleContent.total}</b>
                </span>
                <span className="rounded-full border border-line px-2.5 py-1">
                  {tRecipe("servings")} <b className="text-cacao">{sample.baseServings}</b>
                </span>
                <span className="rounded-full border border-line px-2.5 py-1">
                  {tRecipe("difficulty")} <b className="text-cacao">{sampleContent.difficulty}</b>
                </span>
              </div>
              <div className="mt-5 rounded-xl border border-line bg-cream-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-cacao-soft">
                  {tRecipe("cost")}
                </p>
                <p className="mt-1 font-display text-xl font-semibold tabular-nums">
                  ${sample.costPerServing.toLocaleString("es-CO")}{" "}
                  <span className="font-sans text-sm font-normal text-cacao-soft">
                    {sample.costCurrency} {tRecipe("costPerServing")}
                  </span>
                </p>
              </div>
              <p className="mt-5 border-l-2 border-terracotta pl-4 font-display text-base italic font-medium leading-relaxed">
                {sampleContent.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-cream-2/60 px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
            {t("faqEyebrow")}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("faqTitle")}
          </h2>
          <div className="mt-8 flex flex-col">
            {faqs.map((f) => (
              <div key={f.q} className="border-b border-line py-5 first:pt-0">
                <p className="text-sm font-semibold">{f.q}</p>
                <p className="mt-1.5 text-sm text-cacao-soft">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-cacao px-5 py-16 text-cream">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t("closingTitle")}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-cream/70">{t("closingBody")}</p>

          <div className="mt-6">
            <LaunchOffer labels={offerLabels} compact />
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {hotmartUrl ? (
              <a
                href={hotmartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-cream transition-opacity hover:opacity-90"
              >
                {t("ctaBuy")}
              </a>
            ) : (
              <span className="inline-flex items-center rounded-full border border-cream/25 px-6 py-3 text-sm font-medium text-cream/70">
                {t("ctaBuySoon")}
              </span>
            )}
            {!signedInNoAccess && (
              <Link
                href="/ingresar"
                className="inline-flex items-center rounded-full border border-cream/25 px-6 py-3 text-sm font-medium text-cream transition-colors hover:border-cream/50"
              >
                {t("ctaSignIn")}
              </Link>
            )}
          </div>
          {signedInNoAccess && (
            <div className="mx-auto mt-6 max-w-md rounded-xl border border-cream/25 bg-cream/5 px-4 py-3 text-left">
              <p className="text-sm font-semibold text-cream">{t("signedInNoAccessTitle")}</p>
              <p className="mt-1 text-xs text-cream/70">
                {t.raw("signedInNoAccessBody").replace("{email}", access.email ?? "")}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
