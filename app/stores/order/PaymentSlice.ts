import { create } from "zustand";
import { removeFromArray } from "@/lib/utils";
import {
  _addPayment,
  _deletePayment,
  _getPayments,
} from "@/app/api/payments/_crud_paymtents";
import type { EaPayments } from "@/app/data_types/payments/ea_payments";

export interface PaymentSlice {
  payments: EaPayments[];
  amount_paid: number;
  paymentCount: number;
  getPayments: (uid_order: number) => void;
  addPayment: (payment: EaPayments) => void;
  deletePayment: (uid_payment: number) => void;
  updateAmountPaid: (amount_paid: number) => void;
}

export const usePaymentStore = create<PaymentSlice>((set, get) => ({
  payments: [],
  amount_paid: 0,
  paymentCount: -1,
  getPayments: async (uid_order: number) => {
    const payments = await _getPayments(uid_order);

    set({
      payments,
      paymentCount: payments.length,
    });
  },

  addPayment: async (payment: EaPayments) => {
    const saved = await _addPayment(payment);
    const payments = get().payments;
    payments.push(saved);

    set({
      payments: [...payments],
      paymentCount: payments.length,
    });

    get().updateAmountPaid(payment.payment_amount);
  },

  deletePayment: async (uid_payment: number) => {
    const payment = await _deletePayment(uid_payment);
    if (payment) {
      const payments = get().payments;
      const updated = removeFromArray(
        payments,
        (t) => t.uid_payment === uid_payment,
      );
      set({
        payments: [...updated],
        paymentCount: updated.length,
      });
      get().updateAmountPaid(-payment.payment_amount);
    }
  },
  updateAmountPaid: async (amount_paid: number) => {
    void amount_paid;
    /*
    const { order } = useOrderStore();

    if (order) {
      order.updateOutstandingMoney(amount_paid);
      if (order.outstandingMoney <= 0) {
        order.orderStatus = OrderStatus.InvoicePaid;
      } else {
        order.orderStatus = OrderStatus.Invoice;
      }

      const result = await _updateOrder(order.getOrder());

      set({
        order: new Order(result),
      });
      
    }
    */
  },
}));
