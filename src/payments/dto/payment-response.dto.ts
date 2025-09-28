import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

export class PaymentResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the payment',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Reservation ID associated with the payment',
    example: 1,
  })
  reservationId: number;

  @ApiProperty({
    description: 'Payment amount',
    example: 150.0,
  })
  amount: number;

  @ApiProperty({
    description: 'Payment method used',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Current payment status',
    enum: PaymentStatus,
    example: PaymentStatus.SUCCEEDED,
  })
  paymentStatus: PaymentStatus;

  @ApiPropertyOptional({
    description: 'External transaction ID',
    example: 'pi_1234567890abcdef',
    nullable: true,
  })
  transactionId?: string | null;

  @ApiPropertyOptional({
    description: 'Date when payment was processed',
    example: '2024-01-15T10:30:00.000Z',
    nullable: true,
  })
  paymentDate?: Date | null;

  @ApiProperty({
    description: 'Date when the payment record was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the payment record was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
