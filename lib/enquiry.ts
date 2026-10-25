export type Enquiry = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  location: string;
  message: string;
  reference: string;
};
export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;
export function validateEnquiry(data: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!data.name.trim()) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!data.projectType) errors.projectType = "Please choose a project type.";
  if (data.message.trim().length < 10)
    errors.message = "Please tell us a little more (at least 10 characters).";
  return errors;
}
// Delivery boundary. Deliberately no network request, storage or logging.
// Replace with a server-side provider adapter, rate limiting and a privacy review before launch.
export async function deliverEnquiry(
  _data: Enquiry,
): Promise<{ mode: "demo" }> {
  void _data;
  await new Promise((resolve) => setTimeout(resolve, 450));
  return { mode: "demo" };
}
