import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, locale: string = "fr-FR") {
  const formatter = new Intl.NumberFormat(locale === "ar" ? "ar-TN" : "fr-TN", {
    style: "currency",
    currency: "TND",
  });
  
  // Custom replacement to display "DT" instead of "TND"
  return formatter.format(amount).replace("TND", "DT");
}
