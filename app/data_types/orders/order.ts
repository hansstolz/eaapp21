import useGerman from "@/lib/hooks/useGerman";
import { EaForksParts } from "./ea_forks_parts";
import { EaOrder } from "./ea_order";
import { EaDetailOrder } from "./ea_order_detail";
import { addOrUpdateArray } from "@/lib/utils";
import { EaCustomer } from "../customer/ea_customer";
import { EaForkDialog } from "@/schemas/forks/fork_schema_dialog";
import { OrderStatus } from "./order_status";
import { CustomerCategory } from "./customer_category";
import { EaReminder } from "./ea_reminder";
import {
  EaOrdersCustomerUpdate,
  EaOrdersForkUpdate,
} from "./ea_orders_customer";

class Order {
  private _order: EaOrder;
  //private _fork_parts?: EaForksParts[];

  constructor(ea_order: EaOrder) {
    this._order = ea_order;
    //this._fork_parts = ea_order.fork_parts;
  }

  public getOrder(): EaOrder {
    return this._order;
  }
  public get uid_order() {
    return this._order.uid_order;
  }

  public get order_no() {
    return this._order.order_no;
  }
  public get customer_no() {
    return this._order.customer_no;
  }

  public get category() {
    return this._order.customer_category_no === 1 ? "Private" : "Dealer";
  }
  public get customer_category_no() {
    return this._order.customer_category_no;
  }

  public get address() {
    return this._order.customer_address;
  }

  public get user_group() {
    return this._order.user_group;
  }

  public get invoiceAddress() {
    return this._order.customer_address_alt &&
      this._order.customer_address_alt.length > 0
      ? this._order.customer_address_alt
      : "---";
  }

  public get customer_fon() {
    return this._order.customer_fon;
  }
  public get bank_payment() {
    return this.getValue(this._order.bank_payment);
  }

  public get vat_no_customer() {
    return this.getValue(this._order.vat_no_customer);
  }

  public get no_vat() {
    return this.getValue(this._order.no_vat);
  }

  public get mails() {
    const mails = this._order.customer_email?.split(";").join("\n");
    return this.getValue(mails);
  }

  public get fork_no() {
    return this.getValue(this._order.fork_no);
  }

  public get fork_color() {
    return this.getValue(this._order.fork_color);
  }

  public get fork_model() {
    return this.getValue(this._order.fork_model);
  }
  public get wheelsize() {
    return this.getValue(this._order.wheelsize);
  }

  public get invoice_date() {
    return this._order.invoice_date;
  }

  public get worker_invoice() {
    return this._order.worker_invoice;
  }

  public get fork_in_date_str() {
    const { to2DigitDateFromString } = useGerman();
    const dateStr = new Date().toISOString();
    return to2DigitDateFromString(this._order.fork_in_date ?? dateStr);
  }

  public get fork_in_date() {
    return this._order.fork_in_date ?? new Date();
  }

  public get fork_in_carrier() {
    return this.getValue(this._order.fork_in_carrier);
  }
  public get uid_ref_fork() {
    return this._order.uid_ref_fork;
  }
  public get uid_fork() {
    return this._order.uid_fork;
  }

  public get uid_customer() {
    return this._order.uid_customer;
  }

  public get customer_client_name() {
    return this.getValue(this._order.customer_client_name);
  }

  /*
  public get fork_parts(): EaForksParts[] {
    return this._fork_parts ?? [];
  }
  */

  public get reminderDate() {
    return this._order.reminder_date ?? new Date();
  }

  public get reminderLevel() {
    return this._order.reminder_level ?? 0;
  }

  public get reminderText() {
    return this._order.text_payments ?? "";
  }

  public get getValueTax() {
    return `Value Tax ${this._order.value_tax}%`;
  }

  public get getValueTax2(): string | null {
    return this._order.value_tax2 === 0
      ? null
      : `Value Tax ${this._order.value_tax2}%`;
  }

  public get value_tax() {
    return this._order.value_tax;
  }

  public get value_tax2() {
    return this._order.value_tax2;
  }

  public get outstandingMoney() {
    return this._order.cal_outstanding_money;
  }

  public get orderCustomerUpdate(): EaOrdersCustomerUpdate {
    return {
      customer_no: this.customer_no,
      uid_customer: this.uid_customer!,
      cal_address: this.address,
      fon: this.customer_fon,
      email: this._order.customer_email ?? "",
      bank_account: this._order.bank_account ?? "",
      bank_payment: this._order.bank_payment ?? "",
      vat_no: this._order.vat_no_customer ?? "",
      no_vat: this._order.no_vat ?? "",
      customer_category_no: this._order.customer_category_no!,
      delivery_address: this.invoiceAddress,
      uid_order: this.uid_order!,
    };
  }

  public get orderForkUpdate(): EaOrdersForkUpdate {
    return {
      fork_color: this.fork_color,
      fork_model: this.fork_model,
      wheelsize: this.wheelsize,
      customer_client_name: this.customer_client_name,
      fork_in_carrier: this.fork_in_carrier,
      fork_in_date: this.fork_in_date ?? new Date().toISOString(),
      uid_order: this.uid_order!,
    };
  }

  public set orderStatus(status: OrderStatus) {
    this._order.order_status = status;
  }

  public updateOutstandingMoney(money: number) {
    this._order.cal_outstanding_money -= money;
  }

  public get isArticleSales() {
    return this._order.fork_no === 0;
  }

  public get customerCategory(): CustomerCategory {
    return this._order.customer_category_no === 1
      ? CustomerCategory.private
      : CustomerCategory.dealer;
  }

  public getReminder(): EaReminder {
    return {
      reminderDate: this.reminderDate,
      reminderLevel: this.reminderLevel,
      reminderText: this.reminderText,
      reminderLevelName: "Mahnstufe",
      reminderReference: "Zahlungserinnerung",
    };
  }

  /*
  public deleteForkPart(index: number) {
    this._fork_parts?.splice(index, 1);
  }

  public addForkPart(part: EaForksParts) {
    this._fork_parts?.push(part);
  }

  public updateForkPart(part: EaForksParts) {
    this._fork_parts = addOrUpdateArray(
      part,
      this._fork_parts!,
      (p: EaForksParts) => {
        return p.uid_forks_part === part.uid_forks_part;
      },
    );
  }

  public getUidForksPart(index: number): number | undefined {
    return this._fork_parts?.at(index)?.uid_forks_part;
  }
*/

  public newOrder(): Order {
    return new Order(this._order);
  }

  public updateCustomer(customer: EaCustomer) {
    //this._order.customer_client_name = customer.cal_name_list;
    this._order.customer_no = customer.customer_no;
    this._order.uid_customer = customer.uid_customer;
    this._order.customer_address = customer.cal_address;
    this._order.customer_fon = customer.fon;
    this._order.customer_email = customer.email;
    this._order.bank_account = customer.bank_account;
    this._order.bank_payment = customer.bank_payment;
    this._order.vat_no_customer = customer.vat_no;
    this._order.no_vat = customer.no_vat;
    this._order.customer_category_no = customer.customer_category_no;
    this._order.customer_address_alt = customer.delivery_address;
  }

  public updateFork(fork: EaForkDialog) {
    this._order.fork_color = fork.colour!;
    this._order.fork_model = fork.fork_model!;
    this._order.wheelsize = fork.wheelsize!;
    this._order.customer_client_name = fork.client_name!;
    this._order.fork_in_carrier = fork.fork_in_carrier ?? "";
    this._order.fork_in_date = fork.fork_in_date ?? new Date().toISOString();
  }

  public getNameCustNo(): string {
    return `${this._order.customer_name} #${this.customer_no}`;
  }
  public getForkModelColor(): string {
    return `${this.fork_model} #${this._order.fork_no}\n${this.fork_color}`;
  }

  private getValue(val: string | undefined | null | number) {
    if (typeof val === "number") {
      return String(val);
    }
    return val && val.length ? val : "---";
  }
}

export default Order;
