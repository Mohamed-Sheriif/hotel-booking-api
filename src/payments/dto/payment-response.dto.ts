import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

export class PaymentResponseDto {
  id: number;
  reservationId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
