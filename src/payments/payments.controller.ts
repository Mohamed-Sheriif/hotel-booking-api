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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { ActiveUser } from '../auth/decorator/active-user.decorator';
import { ActiveUserType } from '../auth/interfaces/active-user-type.interface';
import { AuthorizeGuard } from '../auth/guards/authorize.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserType } from '../users/entities/user.entity';

@ApiTags('Payments')
@Controller('api/payments')
@UseGuards(AuthorizeGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // 1. Create a new payment for a reservation
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new payment',
    description:
      'Creates a new payment for a reservation. Customers can create payments for their own reservations.',
  })
  @ApiBody({
    type: CreatePaymentDto,
    description: 'Payment creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only create payments for own reservations',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all payments',
    description:
      'Retrieves all payments. Requires staff or admin authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of payments retrieved successfully',
    type: [PaymentResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Staff or admin access required',
  })
  @Roles(UserType.Admin, UserType.Staff)
  async findAll(): Promise<PaymentResponseDto[]> {
    const payments = await this.paymentsService.findAll();
    return payments.map((payment) => this.mapToResponseDto(payment));
  }

  // 3. Get a specific payment by ID
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get payment by ID',
    description: 'Retrieves detailed information about a specific payment.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment information retrieved successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only access own payments',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get payment by reservation ID',
    description: 'Retrieves payment information for a specific reservation.',
  })
  @ApiParam({
    name: 'reservationId',
    description: 'Reservation ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment information retrieved successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only access own reservation payments',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found for this reservation',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update payment details',
    description:
      'Updates payment information. Requires staff or admin authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    type: UpdatePaymentDto,
    description: 'Payment update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment updated successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Staff or admin access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Confirm payment',
    description:
      'Manually confirms a payment. Requires staff or admin authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment confirmed successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Staff or admin access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Process payment refund',
    description:
      'Processes a refund for a payment. Requires staff or admin authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          description: 'Refund amount (optional, defaults to full amount)',
          example: 75.0,
        },
      },
    },
    description: 'Refund data',
  })
  @ApiResponse({
    status: 200,
    description: 'Refund processed successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid refund amount',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Staff or admin access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
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
