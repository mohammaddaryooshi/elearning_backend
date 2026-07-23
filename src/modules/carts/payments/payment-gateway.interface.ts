import { PaymentGatewayName } from '@constants/app.constants';

export type PaymentInitiationRequest = {
    orderId: number;
    orderNumber: string;
    amount: number;
    description: string;
    customerEmail?: string;
    customerPhoneNumber?: string;
    callbackUrl: string;
};

export type PaymentInitiationResult = {
    gateway: PaymentGatewayName;
    authority: string;
    paymentUrl: string;
    rawResponse: Record<string, unknown>;
};

export type PaymentVerificationRequest = {
    amount: number;
    authority: string;
};

export type PaymentVerificationResult = {
    success: boolean;
    gateway: PaymentGatewayName;
    referenceId?: string;
    cardPan?: string;
    rawResponse: Record<string, unknown>;
    errorMessage?: string;
};

export interface PaymentGateway {
    readonly gatewayName: PaymentGatewayName;
    initiatePayment(request: PaymentInitiationRequest): Promise<PaymentInitiationResult>;
    verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResult>;
}