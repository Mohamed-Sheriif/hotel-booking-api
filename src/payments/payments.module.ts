// src/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeWebhookController } from './stripe-webhook.controller';
import { Payment } from './entities/payment.entity';
import { ReservationsModule } from '../reservations/reservations.module';
import { StripeModule } from '../stripe/stripe.module';
import { AuthorizeGuard } from '../auth/guards/authorize.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import authConfig from 'src/auth/config/auth.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
    ReservationsModule,
    StripeModule,
  ],
  controllers: [PaymentsController, StripeWebhookController],
  providers: [PaymentsService, AuthorizeGuard, RolesGuard],
  exports: [PaymentsService],
})
export class PaymentsModule {}
