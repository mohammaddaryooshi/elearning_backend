import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentGatewayName } from '@constants/app.constants';
import { PaymentGateway } from './payment-gateway.interface';
import { ZarinpalPaymentGatewayService } from './zarinpal-payment-gateway.service';

@Injectable()
export class PaymentGatewayRegistryService {
    private readonly gateways = new Map<PaymentGatewayName, PaymentGateway>();

    constructor(zarinpalPaymentGatewayService: ZarinpalPaymentGatewayService) {
        this.gateways.set(zarinpalPaymentGatewayService.gatewayName, zarinpalPaymentGatewayService);
    }

    getGateway(gatewayName: PaymentGatewayName): PaymentGateway {
        const gateway = this.gateways.get(gatewayName);
        if (!gateway) {
            throw new NotFoundException(`Payment gateway ${gatewayName} is not supported`);
        }

        return gateway;
    }
}