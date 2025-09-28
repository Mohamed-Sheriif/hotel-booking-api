/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/stripe/stripe.service.ts
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import stripeConfig from 'src/config/stripe.config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @Inject(stripeConfig.KEY)
    private readonly stripeConfiguration: ConfigType<typeof stripeConfig>,
  ) {
    const secretKey = this.stripeConfiguration.secretKey;

    if (!secretKey) {
      throw new Error('Stripe secret key is not configured');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: this.stripeConfiguration.apiVersion as any,
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'egp',
    metadata: any = {},
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      throw new InternalServerErrorException(`Stripe error: ${error.message}`);
    }
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.confirm(paymentIntentId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Stripe confirmation error: ${error.message}`,
      );
    }
  }

  async retrievePaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      throw new BadRequestException(`Invalid payment intent: ${error.message}`);
    }
  }

  async cancelPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Stripe cancellation error: ${error.message}`,
      );
    }
  }

  async createRefund(
    paymentIntentId: string,
    amount?: number,
  ): Promise<Stripe.Refund> {
    try {
      const refundParams: any = { payment_intent: paymentIntentId };
      if (amount) {
        refundParams.amount = Math.round(amount * 100);
      }

      return await this.stripe.refunds.create(refundParams);
    } catch (error) {
      throw new InternalServerErrorException(
        `Stripe refund error: ${error.message}`,
      );
    }
  }

  constructEvent(payload: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.stripeConfiguration.webhookSecret;

    if (!webhookSecret) {
      throw new Error('Stripe webhook secret is not configured');
    }

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      throw new BadRequestException(
        `Webhook signature verification failed: ${error.message}`,
      );
    }
  }
}
