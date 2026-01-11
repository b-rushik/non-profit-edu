import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Encode an object as application/x-www-form-urlencoded
 */
export function encodeForm(data) {
  return new URLSearchParams(data).toString();
}

/**
 * Submit a form to Netlify Forms.
 * - formName: must match the static hidden form `name` in public/index.html
 * - data: object of form fields
 */
export async function submitToNetlify(formName, data) {
  const payload = { 'form-name': formName, ...data };
  const cleaned = Object.fromEntries(
    Object.entries(payload).map(([k, v]) => [k, v === undefined ? '' : (typeof v === 'boolean' ? String(v) : v)])
  );
  const body = new URLSearchParams(cleaned).toString();
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  // Read response body for better debugging and surface details on failure
  const resText = await res.text().catch(() => '');
  if (!res.ok) {
    console.error('Netlify form submission failed', { status: res.status, body: resText });
    throw new Error(`Netlify form submission failed (${res.status}): ${resText}`);
  }

  return res;
}
