import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'response_message' as const;

export const ResponseMessage = (message: string): CustomDecorator<string> =>
    SetMetadata(RESPONSE_MESSAGE_KEY, message);
