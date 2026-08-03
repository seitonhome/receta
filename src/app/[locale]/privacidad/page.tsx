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
    title: "Política de Privacidad",
    updated: `Última actualización: ${LAST_UPDATED}`,
    sections: [
      {
        heading: "1. Qué datos recogemos",
        body: "Tu correo electrónico (para darte acceso e iniciar sesión), el estado de tu compra (que nos llega de Hotmart), las recetas que marcas como favoritas, y los ingredientes que agregas a tu lista de compras. El país que eliges para ver precios de referencia se guarda solo en tu navegador (localStorage), no en nuestros servidores.",
      },
      {
        heading: "2. Para qué usamos tus datos",
        body: "Únicamente para verificar tu acceso, guardar tus favoritos y tu lista de compras entre sesiones, y responder si nos escribes a soporte. No usamos tu información para publicidad ni la vendemos a terceros.",
      },
      {
        heading: "3. Con quién se comparte",
        body: "Con Hotmart, que procesa tu compra y nos confirma que fue exitosa, y con Supabase, el proveedor que aloja la base de datos de la aplicación. Ninguno de los dos usa tus datos para fines distintos a operar el producto.",
      },
      {
        heading: "4. Cookies y analítica",
        body: "Usamos una cookie esencial para recordar tu sesión y tu idioma preferido. Cualquier analítica de uso que agreguemos en el futuro (por ejemplo, para saber cuántas visitas recibe el sitio) funciona sin cookies de rastreo publicitario ni perfiles individuales identificables.",
      },
      {
        heading: "5. Seguridad",
        body: "Tus favoritos y tu lista de compras solo son visibles y editables por tu propia cuenta — está protegido a nivel de base de datos, no solo de interfaz.",
      },
      {
        heading: "6. Tus derechos",
        body: `Puedes pedir que eliminemos tu cuenta y todos los datos asociados (favoritos, lista de compras) escribiendo a ${SUPPORT_EMAIL}. Atendemos la solicitud en un plazo razonable.`,
      },
      {
        heading: "7. Cambios a esta política",
        body: "Si actualizamos esta política de forma importante, cambiaremos la fecha de \"última actualización\" al inicio de esta página.",
      },
      {
        heading: "8. Contacto",
        body: `Para cualquier pregunta sobre tus datos, escribe a ${SUPPORT_EMAIL}.`,
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: `Last updated: ${LAST_UPDATED}`,
    sections: [
      {
        heading: "1. What data we collect",
        body: "Your email address (to grant access and sign you in), your purchase status (received from Hotmart), the recipes you mark as favorites, and the ingredients you add to your shopping list. The country you pick for reference pricing is stored only in your browser (localStorage), not on our servers.",
      },
      {
        heading: "2. What we use your data for",
        body: "Only to verify your access, save your favorites and shopping list between sessions, and respond if you contact support. We don't use your information for advertising or sell it to third parties.",
      },
      {
        heading: "3. Who it's shared with",
        body: "Hotmart, which processes your purchase and confirms it to us, and Supabase, the provider that hosts the application's database. Neither uses your data for anything beyond operating the product.",
      },
      {
        heading: "4. Cookies and analytics",
        body: "We use one essential cookie to remember your session and preferred language. Any usage analytics we add in the future (e.g. to know how many visits the site gets) works without advertising-tracking cookies or identifiable individual profiles.",
      },
      {
        heading: "5. Security",
        body: "Your favorites and shopping list are only visible and editable from your own account -- this is enforced at the database level, not just in the interface.",
      },
      {
        heading: "6. Your rights",
        body: `You can request that we delete your account and all associated data (favorites, shopping list) by writing to ${SUPPORT_EMAIL}. We handle requests within a reasonable timeframe.`,
      },
      {
        heading: "7. Changes to this policy",
        body: "If we update this policy in a meaningful way, we'll change the \"last updated\" date at the top of this page.",
      },
      {
        heading: "8. Contact",
        body: `For any question about your data, write to ${SUPPORT_EMAIL}.`,
      },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    updated: `Dernière mise à jour : ${LAST_UPDATED}`,
    sections: [
      {
        heading: "1. Quelles données nous collectons",
        body: "Votre adresse e-mail (pour vous donner accès et vous connecter), le statut de votre achat (reçu de Hotmart), les recettes que vous marquez comme favorites, et les ingrédients que vous ajoutez à votre liste de courses. Le pays choisi pour les prix de référence est stocké uniquement dans votre navigateur (localStorage), pas sur nos serveurs.",
      },
      {
        heading: "2. À quoi servent vos données",
        body: "Uniquement pour vérifier votre accès, sauvegarder vos favoris et votre liste de courses d'une session à l'autre, et répondre si vous contactez le support. Nous n'utilisons pas vos informations à des fins publicitaires et ne les vendons à aucun tiers.",
      },
      {
        heading: "3. Avec qui elles sont partagées",
        body: "Avec Hotmart, qui traite votre achat et nous le confirme, et avec Supabase, le fournisseur qui héberge la base de données de l'application. Aucun des deux n'utilise vos données à d'autres fins que le fonctionnement du produit.",
      },
      {
        heading: "4. Cookies et analytique",
        body: "Nous utilisons un cookie essentiel pour mémoriser votre session et votre langue préférée. Toute analytique d'usage ajoutée à l'avenir (par exemple pour savoir combien de visites reçoit le site) fonctionne sans cookies de suivi publicitaire ni profils individuels identifiables.",
      },
      {
        heading: "5. Sécurité",
        body: "Vos favoris et votre liste de courses ne sont visibles et modifiables que depuis votre propre compte -- ceci est appliqué au niveau de la base de données, pas seulement de l'interface.",
      },
      {
        heading: "6. Vos droits",
        body: `Vous pouvez demander la suppression de votre compte et de toutes les données associées (favoris, liste de courses) en écrivant à ${SUPPORT_EMAIL}. Nous traitons les demandes dans un délai raisonnable.`,
      },
      {
        heading: "7. Modifications de cette politique",
        body: "Si nous mettons à jour cette politique de manière significative, nous changerons la date de « dernière mise à jour » en haut de cette page.",
      },
      {
        heading: "8. Contact",
        body: `Pour toute question sur vos données, écrivez à ${SUPPORT_EMAIL}.`,
      },
    ],
  },
};

export default async function PrivacyPage({
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
