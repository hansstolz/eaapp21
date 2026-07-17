export type TCustSup = {
  lastName: string | null;
  firstName: string | null;
  company: string | null;
  city: string | null;
  streetAddress: string | null;
  zipPostalCode: string | null;
  customerNo: number | null;
  email: string | null;
};

export type TPrintMail = "print" | "email";
