// src/payments/stripe-webhook.controller.ts
import {
  Controller,
  Post,
  Req,
  Headers,
  HttpCode,
  HttpStatus,
  RawBodyRequest,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { StripeService } from '../stripe/stripe.service';

@Controller('webhook')
export class StripeWebhookController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }

    const rawBody = request.rawBody;

    if (!rawBody) {
      throw new Error('Raw body is required for webhook verification');
    }

    const event = this.stripeService.constructEvent(rawBody, signature);

    // Handle specific event types
    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled':
        await this.paymentsService.handleWebhookEvent(event);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
}
