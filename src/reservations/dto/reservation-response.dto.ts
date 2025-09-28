import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReservationStatus } from '../entities/reservation.entity';

export class ReservationResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the reservation',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Customer ID who made the reservation',
    example: 1,
  })
  customer_id: number;

  @ApiProperty({
    description: 'Room ID for the reservation',
    example: 1,
  })
  room_id: number;

  @ApiProperty({
    description: 'Check-in date',
    example: '2024-02-15',
  })
  check_in_date: string;

  @ApiProperty({
    description: 'Check-out date',
    example: '2024-02-18',
  })
  check_out_date: string;

  @ApiProperty({
    description: 'Number of guests',
    example: 2,
  })
  number_of_guests: number;

  @ApiProperty({
    description: 'Total price for the reservation',
    example: '450.00',
  })
  total_price: string;

  @ApiProperty({
    description: 'Reservation status',
    enum: ReservationStatus,
    example: ReservationStatus.Confirmed,
  })
  status: ReservationStatus;

  @ApiProperty({
    description: 'Date when the reservation was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the reservation was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Customer information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      email: { type: 'string', example: 'customer@example.com' },
      first_name: { type: 'string', example: 'John' },
      last_name: { type: 'string', example: 'Doe' },
    },
  })
  customer?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };

  @ApiPropertyOptional({
    description: 'Room information',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      room_number: { type: 'string', example: '101' },
      floor: { type: 'number', example: 1 },
      is_available: { type: 'boolean', example: false },
    },
  })
  room?: {
    id: number;
    room_number: string;
    floor?: number | null;
    is_available: boolean;
  };

  @ApiPropertyOptional({
    description: 'Associated payments',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        amount: { type: 'number', example: 450.0 },
        paymentStatus: { type: 'string', example: 'succeeded' },
        paymentMethod: { type: 'string', example: 'credit_card' },
      },
    },
  })
  payments?: Array<{
    id: number;
    amount: number;
    paymentStatus: string;
    paymentMethod: string;
  }>;
}
