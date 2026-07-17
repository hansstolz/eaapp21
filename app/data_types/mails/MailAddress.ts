import { TCustSup } from "./cust_sup";

class MailAddress {
  private custSup: TCustSup;

  public getName(): string {
    if (this.custSup.company && this.custSup.company.length > 0) {
      return this.custSup.company;
    } else {
      return `${this.custSup.firstName} ${this.custSup.lastName}`;
    }
  }

  public getAddress(): string {
    const street = this.custSup.streetAddress ?? "";
    const city = this.custSup.city ?? "";
    const zip = this.custSup.zipPostalCode ?? "";

    return `${street}\n${zip} ${city}`;
  }

  public getEMail(): string {
    return this.custSup.email === null ? "" : this.custSup.email;
  }

  constructor(cust: TCustSup) {
    this.custSup = cust;
  }
}

export default MailAddress;
