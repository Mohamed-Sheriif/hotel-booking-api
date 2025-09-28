import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Reservation ID for the payment',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  reservationId: number;

  @ApiProperty({
    description: 'Payment amount',
    example: 150.0,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({
    description: 'External transaction ID (e.g., Stripe payment intent ID)',
    example: 'pi_1234567890abcdef',
  })
  @IsOptional()
  @IsString()
  transactionId?: string;
}
