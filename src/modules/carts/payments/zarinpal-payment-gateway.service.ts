import { BadGatewayException, Injectable } from '@nestjs/common';
import { PaymentGatewayName } from '@constants/app.constants';
import {
    PaymentGateway,
    PaymentInitiationRequest,
    PaymentInitiationResult,
    PaymentVerificationRequest,
    PaymentVerificationResult,
} from './payment-gateway.interface';

@Injectable()
export class ZarinpalPaymentGatewayService implements PaymentGateway {
    readonly gatewayName = PaymentGatewayName.ZARINPAL;

    private readonly merchantId = process.env.ZARINPAL_MERCHANT_ID || '';
    private readonly apiBaseUrl = process.env.ZARINPAL_API_BASE_URL || 'https://api.zarinpal.com/pg/v4/payment';
    private readonly startPayBaseUrl = process.env.ZARINPAL_START_PAY_BASE_URL || 'https://www.zarinpal.com/pg/StartPay';

    async initiatePayment(request: PaymentInitiationRequest): Promise<PaymentInitiationResult> {
        if (!this.merchantId) {
            throw new BadGatewayException('Zarinpal merchant id is not configured');
        }

        const payload = {
            merchant_id: this.merchantId,
            amount: Math.round(request.amount),
            description: request.description,
            callback_url: request.callbackUrl,
            metadata: {
                email: request.customerEmail,
                mobile: request.customerPhoneNumber,
                order_number: request.orderNumber,
                order_id: request.orderId,
            },
        };

        const response = await this.postJson('/request.json', payload);
        const data = response?.data as Record<string, unknown> | undefined;
        const authority = typeof data?.authority === 'string' ? data.authority : null;

        if (!authority) {
            throw new BadGatewayException(this.extractErrorMessage(response, 'Could not create Zarinpal payment request'));
        }

        return {
            gateway: this.gatewayName,
            authority,
            paymentUrl: `${this.startPayBaseUrl}/${authority}`,
            rawResponse: response,
        };
    }

    async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResult> {
        if (!this.merchantId) {
            throw new BadGatewayException('Zarinpal merchant id is not configured');
        }

        const payload = {
            merchant_id: this.merchantId,
            amount: Math.round(request.amount),
            authority: request.authority,
        };

        const response = await this.postJson('/verify.json', payload);
        const data = response?.data as Record<string, unknown> | undefined;
        const code = Number(data?.code ?? response?.meta?.code ?? 0);
        const success = code === 100 || code === 101;

        return {
            success,
            gateway: this.gatewayName,
            referenceId: data?.ref_id ? String(data.ref_id) : undefined,
            cardPan: data?.card_pan ? String(data.card_pan) : undefined,
            rawResponse: response,
            errorMessage: success ? undefined : this.extractErrorMessage(response, 'Zarinpal payment verification failed'),
        };
    }

    private async postJson(path: string, payload: Record<string, unknown>) {
        const response = await fetch(`${this.apiBaseUrl}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const json = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new BadGatewayException(this.extractErrorMessage(json, `Zarinpal gateway request failed with status ${response.status}`));
        }

        return json;
    }

    private extractErrorMessage(payload: any, fallback: string) {
        return payload?.errors?.message
            || payload?.errors?.error_message
            || payload?.meta?.error_message
            || payload?.data?.message
            || fallback;
    }
}