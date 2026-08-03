const ADMIN_EMAILS = ["xiomilena@yahoo.com", "cesar.rivasl@outlook.com"];

export function isAdmin(email: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
