/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/payments/payments.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ActiveUser } from '../auth/decorator/active-user.decorator';
import { ActiveUserType } from '../auth/interfaces/active-user-type.interface';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { AuthorizeGuard } from '../auth/guards/authorize.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserType } from '../users/entities/user.entity';

@Controller('api/payments')
@UseGuards(AuthorizeGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // 1. Create a new payment for a reservation
  @Post()
  @Roles(UserType.Customer, UserType.Admin, UserType.Staff)
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @ActiveUser() activeUser: ActiveUserType,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentsService.create(
      createPaymentDto,
      activeUser,
    );

    return this.mapToResponseDto(payment);
  }

  // 2. Get all payments (Staff only)
  @Get()
  @Roles(UserType.Admin, UserType.Staff)
  async findAll(): Promise<PaymentResponseDto> {
    const payment = await this.paymentsService.findAll();

    return this.mapToResponseDto(payment);
  }

  // 3. Get a specific payment by ID
  @Get(':id')
  @Roles(UserType.Customer, UserType.Admin, UserType.Staff)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() activeUser: ActiveUserType,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentsService.findOne(id, activeUser);

    return this.mapToResponseDto(payment);
  }

  // 4. Get payment by reservation ID
  @Get('reservation/:reservationId')
  @Roles(UserType.Customer, UserType.Admin, UserType.Staff)
  async findByReservation(
    @Param('reservationId', ParseIntPipe) reservationId: number,
    @ActiveUser() activeUser: ActiveUserType,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentsService.findByReservation(
      reservationId,
      activeUser,
    );

    return this.mapToResponseDto(payment);
  }

  // 5. Update payment details (Staff only)
  @Patch(':id')
  @Roles(UserType.Admin, UserType.Staff)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @ActiveUser() activeUser: ActiveUserType,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentsService.update(
      id,
      updatePaymentDto,
      activeUser,
    );

    return this.mapToResponseDto(payment);
  }

  // 6. Confirm a payment (Manual confirmation if needed)
  @Post(':id/confirm')
  @Roles(UserType.Admin, UserType.Staff)
  async confirmPayment(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() activeUser: ActiveUserType,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentsService.confirmPayment(id, activeUser);

    return this.mapToResponseDto(payment);
  }

  // 7. Process a refund
  @Post(':id/refund')
  @Roles(UserType.Admin, UserType.Staff)
  async refundPayment(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() activeUser: ActiveUserType,
    @Body('amount') amount?: number,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentsService.refundPayment(
      id,
      amount,
      activeUser,
    );

    return this.mapToResponseDto(payment);
  }

  private mapToResponseDto(payment: any): PaymentResponseDto {
    return {
      id: payment.id,
      reservationId: payment.reservationId,
      amount: parseFloat(payment.amount),
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
      transactionId: payment.transactionId,
      paymentDate: payment.paymentDate,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
