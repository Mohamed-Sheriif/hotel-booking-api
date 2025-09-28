/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/payments/payments.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ReservationsService } from '../reservations/reservations.service';
import { StripeService } from '../stripe/stripe.service';
import { ActiveUserType } from 'src/auth/interfaces/active-user-type.interface';
import { UserType } from 'src/users/entities/user.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly reservationsService: ReservationsService,
    private readonly stripeService: StripeService,
  ) {}

  async create(
    createPaymentDto: CreatePaymentDto,
    activeUser: ActiveUserType,
  ): Promise<Payment> {
    // Verify reservation exists
    const reservation = await this.reservationsService.findOne(
      createPaymentDto.reservationId,
      activeUser,
    );
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // Check if payment already exists for this reservation
    const existingPayment = await this.paymentRepository.findOne({
      where: { reservationId: createPaymentDto.reservationId },
    });

    if (existingPayment) {
      throw new BadRequestException(
        'Payment already exists for this reservation',
      );
    }

    // Create Stripe Payment Intent
    const paymentIntent = await this.stripeService.createPaymentIntent(
      createPaymentDto.amount,
      'egp',
      {
        reservationId: createPaymentDto.reservationId.toString(),
        hotelId: reservation.room.hotel.id.toString(),
        roomId: reservation.room.id.toString(),
      },
    );

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      stripePaymentIntentId: paymentIntent.id ?? undefined,
      stripeClientSecret: paymentIntent.client_secret ?? undefined,
      paymentStatus: this.mapStripeStatusToPaymentStatus(paymentIntent.status),
    });

    return await this.paymentRepository.save(payment);
  }

  async confirmPayment(
    paymentId: number,
    activeUser: ActiveUserType,
  ): Promise<Payment> {
    const payment = await this.findOne(paymentId, activeUser);

    if (payment.paymentStatus !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment is not in a confirmable state');
    }

    try {
      const paymentIntent = await this.stripeService.confirmPaymentIntent(
        payment.stripePaymentIntentId,
      );

      payment.paymentStatus = this.mapStripeStatusToPaymentStatus(
        paymentIntent.status,
      );
      payment.stripeResponse = paymentIntent;

      if (paymentIntent.status === 'succeeded') {
        payment.paymentDate = new Date();
        payment.transactionId = paymentIntent.id;
      }

      return await this.paymentRepository.save(payment);
    } catch (error) {
      throw new InternalServerErrorException(
        `Payment confirmation failed: ${error.message}`,
      );
    }
  }

  async handleWebhookEvent(event: any): Promise<void> {
    const paymentIntent = event.data.object;
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment with Stripe ID ${paymentIntent.id} not found`,
      );
    }

    payment.paymentStatus = this.mapStripeStatusToPaymentStatus(
      paymentIntent.status,
    );
    payment.stripeResponse = paymentIntent;

    if (paymentIntent.status === 'succeeded') {
      payment.paymentDate = new Date();
      payment.transactionId = paymentIntent.id;
    }

    await this.paymentRepository.save(payment);
  }

  async refundPayment(
    paymentId: number,
    amount: number | undefined,
    activeUser: ActiveUserType,
  ): Promise<Payment> {
    const payment = await this.findOne(paymentId, activeUser);

    if (payment.paymentStatus !== PaymentStatus.SUCCEEDED) {
      throw new BadRequestException('Only succeeded payments can be refunded');
    }

    if (!payment.stripePaymentIntentId) {
      throw new BadRequestException(
        'Payment does not have a Stripe payment intent',
      );
    }

    try {
      const refund = await this.stripeService.createRefund(
        payment.stripePaymentIntentId,
        amount,
      );

      if (refund.status === 'succeeded') {
        payment.paymentStatus = PaymentStatus.REFUNDED;
      }

      return await this.paymentRepository.save(payment);
    } catch (error) {
      throw new InternalServerErrorException(`Refund failed: ${error.message}`);
    }
  }

  // Keep existing methods (findAll, findOne, findByReservation, update)
  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find({
      relations: ['reservation'],
    });
  }

  async findOne(id: number, activeUser: ActiveUserType): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['reservation', 'reservation.customer'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // Check authorization: Customers can only access their own payments
    if (activeUser.user_type === UserType.Customer) {
      if (payment.reservation.customer.id !== activeUser.sub) {
        throw new ForbiddenException('You can only access your own payments');
      }
    }

    return payment;
  }

  async findByReservation(
    reservationId: number,
    activeUser: ActiveUserType,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { reservationId },
      relations: ['reservation', 'reservation.customer'],
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment for reservation ID ${reservationId} not found`,
      );
    }

    // Check authorization: Customers can only access their own payments
    if (activeUser.user_type === UserType.Customer) {
      if (payment.reservation.customer.id !== activeUser.sub) {
        throw new ForbiddenException('You can only access your own payments');
      }
    }

    return payment;
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
    activeUser: ActiveUserType,
  ): Promise<Payment> {
    const payment = await this.findOne(id, activeUser);
    Object.assign(payment, updatePaymentDto);
    return await this.paymentRepository.save(payment);
  }

  private mapStripeStatusToPaymentStatus(stripeStatus: string): PaymentStatus {
    const statusMap: { [key: string]: PaymentStatus } = {
      requires_payment_method: PaymentStatus.REQUIRES_PAYMENT_METHOD,
      requires_confirmation: PaymentStatus.REQUIRES_CONFIRMATION,
      requires_action: PaymentStatus.REQUIRES_ACTION,
      processing: PaymentStatus.PROCESSING,
      requires_capture: PaymentStatus.REQUIRES_CAPTURE,
      canceled: PaymentStatus.CANCELLED,
      succeeded: PaymentStatus.SUCCEEDED,
    };

    return statusMap[stripeStatus] || PaymentStatus.FAILED;
  }
}
