import { Controller, Get, Query, Res } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { Public } from '@decorators/public.decorator';
import { PaymentGatewayName } from '@constants/app.constants';
import { PaymentsService } from '../services/payments.service';
import { Response } from 'express';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Public()
    @Get('callback/zarinpal')
    @ApiOperation({ summary: 'Zarinpal callback endpoint for payment verification' })
    @ApiQuery({ name: 'orderId', type: Number })
    @ApiQuery({ name: 'Authority', required: false, type: String })
    @ApiQuery({ name: 'Status', required: false, type: String })
    @ApiOkResponse({ description: 'Callback processed successfully' })
    async zarinpalCallback(
        @Query() query: Record<string, string>,
        @Res() response: Response,
    ) {
        const successBaseUrl = process.env.PAYMENT_FRONTEND_SUCCESS_URL || 'http://localhost:3000/payment/success';
        const failBaseUrl = process.env.PAYMENT_FRONTEND_FAIL_URL || 'http://localhost:3000/payment/fail';

        try {
            const result = await this.paymentsService.verifyGatewayCallback(
                PaymentGatewayName.ZARINPAL,
                Number(query.orderId),
                query,
            );

            const targetBaseUrl = result.success ? successBaseUrl : failBaseUrl;
            const redirectUrl = new URL(targetBaseUrl);
            redirectUrl.searchParams.set('orderId', String(query.orderId || ''));
            redirectUrl.searchParams.set('status', result.success ? 'success' : 'failed');
            redirectUrl.searchParams.set('message', result.message || '');

            if (result.reference_id) {
                redirectUrl.searchParams.set('refId', String(result.reference_id));
            }

            return response.redirect(302, redirectUrl.toString());
        } catch (error: any) {
            const redirectUrl = new URL(failBaseUrl);
            redirectUrl.searchParams.set('orderId', String(query.orderId || ''));
            redirectUrl.searchParams.set('status', 'failed');
            redirectUrl.searchParams.set('message', error?.message || 'Payment callback processing failed');
            return response.redirect(302, redirectUrl.toString());
        }
    }
}