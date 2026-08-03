import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/recipes/types";
import { SUPPORT_EMAIL } from "@/lib/support";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const LAST_UPDATED = "2026-07-18";

const CONTENT: Record<
  Locale,
  { title: string; updated: string; sections: { heading: string; body: string }[] }
> = {
  es: {
    title: "Términos y Condiciones",
    updated: `Última actualización: ${LAST_UPDATED}`,
    sections: [
      {
        heading: "1. Qué es este producto",
        body: "Comidas que te Cuidan es un ebook web interactivo: una aplicación en línea con 100 recetas en español, inglés y francés, recalculador de porciones, lista de compras y favoritos. No es un archivo PDF descargable — el acceso se hace a través de una cuenta propia mientras el producto siga disponible.",
      },
      {
        heading: "2. Cómo se obtiene el acceso",
        body: "El acceso se compra a través de Hotmart. Después de la compra, inicias sesión en el sitio con el mismo correo usado en Hotmart, mediante un código de un solo uso enviado por email (no se usan contraseñas). El acceso es personal e intransferible.",
      },
      {
        heading: "3. Precio y pago",
        body: "El precio y el procesamiento del pago los gestiona Hotmart directamente; nosotros no almacenamos datos de tarjetas ni de pago. Los precios mostrados en el sitio en otras monedas son referencias de conversión, no el monto exacto que cobra Hotmart.",
      },
      {
        heading: "4. Garantía y reembolsos",
        body: "Ofrecemos una garantía de 7 días desde la fecha de compra. Si no estás satisfecho, escribe a soporte y gestionamos el reembolso a través de Hotmart según su política de garantía para productos digitales.",
      },
      {
        heading: "5. Uso permitido",
        body: "El acceso es para uso personal. No está permitido revender, redistribuir, compartir la cuenta con terceros que no hayan comprado el producto, ni republicar el contenido (recetas, textos, imágenes) en otro sitio o producto.",
      },
      {
        heading: "6. Propiedad intelectual",
        body: "Todo el contenido del producto (recetas, textos, fotografías, ilustraciones y diseño) pertenece a Comidas que te Cuidan. La compra otorga una licencia de uso personal, no una cesión de derechos.",
      },
      {
        heading: "7. Cambios al contenido",
        body: "El contenido puede actualizarse (correcciones, nuevas recetas, mejoras de la aplicación) sin previo aviso. Los cambios de precio, sin embargo, respetan siempre lo que ya pagaron los compradores existentes.",
      },
      {
        heading: "8. Alcance de la información nutricional y de costos",
        body: "La información nutricional y los costos estimados son referencias basadas en fuentes públicas y precios de mercado en un momento dado; no son datos médicos ni una cotización garantizada. No sustituyen la orientación de un profesional de la salud o nutrición.",
      },
      {
        heading: "9. Contacto",
        body: `Para preguntas sobre estos términos, escribe a ${SUPPORT_EMAIL}.`,
      },
    ],
  },
  en: {
    title: "Terms and Conditions",
    updated: `Last updated: ${LAST_UPDATED}`,
    sections: [
      {
        heading: "1. What this product is",
        body: "Comidas que te Cuidan is an interactive web ebook: an online application with 100 recipes in Spanish, English and French, a portion recalculator, a shopping list and favorites. It's not a downloadable PDF — access happens through your own account for as long as the product remains available.",
      },
      {
        heading: "2. How access works",
        body: "Access is purchased through Hotmart. After purchase, you sign in on the site with the same email used on Hotmart, via a one-time code sent by email (no passwords). Access is personal and non-transferable.",
      },
      {
        heading: "3. Price and payment",
        body: "Pricing and payment processing are handled directly by Hotmart; we don't store card or payment data. Prices shown on the site in other currencies are conversion references, not the exact amount charged by Hotmart.",
      },
      {
        heading: "4. Guarantee and refunds",
        body: "We offer a 7-day guarantee from the purchase date. If you're not satisfied, contact support and we'll handle the refund through Hotmart under its guarantee policy for digital products.",
      },
      {
        heading: "5. Permitted use",
        body: "Access is for personal use. Reselling, redistributing, sharing the account with people who haven't purchased the product, or republishing the content (recipes, text, images) on another site or product is not allowed.",
      },
      {
        heading: "6. Intellectual property",
        body: "All product content (recipes, text, photography, illustrations, and design) belongs to Comidas que te Cuidan. Purchase grants a personal-use license, not a transfer of rights.",
      },
      {
        heading: "7. Content changes",
        body: "Content may be updated (corrections, new recipes, app improvements) without prior notice. Price changes, however, always honor what existing buyers already paid.",
      },
      {
        heading: "8. Scope of nutrition and cost information",
        body: "Nutrition information and estimated costs are references based on public sources and market prices at a given point in time; they are not medical data or a guaranteed quote. They don't replace guidance from a health or nutrition professional.",
      },
      {
        heading: "9. Contact",
        body: `For questions about these terms, write to ${SUPPORT_EMAIL}.`,
      },
    ],
  },
  fr: {
    title: "Conditions générales",
    updated: `Dernière mise à jour : ${LAST_UPDATED}`,
    sections: [
      {
        heading: "1. Ce qu'est ce produit",
        body: "Comidas que te Cuidan est un ebook web interactif : une application en ligne avec 100 recettes en espagnol, anglais et français, un recalculateur de portions, une liste de courses et des favoris. Ce n'est pas un PDF téléchargeable — l'accès se fait via votre propre compte tant que le produit reste disponible.",
      },
      {
        heading: "2. Comment fonctionne l'accès",
        body: "L'accès s'achète via Hotmart. Après l'achat, vous vous connectez sur le site avec le même e-mail utilisé sur Hotmart, via un code à usage unique envoyé par e-mail (pas de mot de passe). L'accès est personnel et non transférable.",
      },
      {
        heading: "3. Prix et paiement",
        body: "Le prix et le traitement du paiement sont gérés directement par Hotmart ; nous ne stockons aucune donnée de carte ou de paiement. Les prix affichés sur le site dans d'autres devises sont des références de conversion, pas le montant exact facturé par Hotmart.",
      },
      {
        heading: "4. Garantie et remboursements",
        body: "Nous offrons une garantie de 7 jours à partir de la date d'achat. Si vous n'êtes pas satisfait, contactez le support et nous gérerons le remboursement via Hotmart selon sa politique de garantie pour les produits numériques.",
      },
      {
        heading: "5. Usage autorisé",
        body: "L'accès est pour un usage personnel. La revente, la redistribution, le partage du compte avec des personnes n'ayant pas acheté le produit, ou la republication du contenu (recettes, textes, images) sur un autre site ou produit ne sont pas autorisés.",
      },
      {
        heading: "6. Propriété intellectuelle",
        body: "Tout le contenu du produit (recettes, textes, photographies, illustrations et design) appartient à Comidas que te Cuidan. L'achat accorde une licence d'usage personnel, pas un transfert de droits.",
      },
      {
        heading: "7. Modifications du contenu",
        body: "Le contenu peut être mis à jour (corrections, nouvelles recettes, améliorations de l'application) sans préavis. Les changements de prix, en revanche, respectent toujours ce que les acheteurs existants ont déjà payé.",
      },
      {
        heading: "8. Portée des informations nutritionnelles et de coûts",
        body: "Les informations nutritionnelles et les coûts estimés sont des références basées sur des sources publiques et des prix du marché à un moment donné ; ce ne sont pas des données médicales ni un devis garanti. Elles ne remplacent pas les conseils d'un professionnel de la santé ou de la nutrition.",
      },
      {
        heading: "9. Contact",
        body: `Pour toute question sur ces conditions, écrivez à ${SUPPORT_EMAIL}.`,
      },
    ],
  },
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const content = CONTENT[locale as Locale];

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-display text-2xl font-semibold tracking-tight">{content.title}</h1>
      <p className="mt-2 text-xs text-cacao-soft">{content.updated}</p>

      <div className="mt-10 flex flex-col gap-8">
        {content.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-display text-base font-semibold text-sage-deep">
              {section.heading}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-cacao-soft">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
