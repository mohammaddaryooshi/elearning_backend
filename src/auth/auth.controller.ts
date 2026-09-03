import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CompleteRegisterDto } from './dto/complete-register.dto';
import { Public } from '@decorators/public.decorator';
import { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('otp/request')
  @ApiOperation({ summary: 'Request a 6-digit OTP for login or registration' })
  async requestOtp(
    @Body() body: RequestOtpDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.requestOtp(body, request, response);
  }

  @Public()
  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify OTP and either log in or move to registration' })
  async verifyOtp(
    @Body() body: VerifyOtpDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.verifyOtp(body, request, response);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Complete registration after OTP verification' })
  async completeRegister(
    @Body() body: CompleteRegisterDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.completeRegister(body, request, response);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Rotate refresh token and issue a fresh access token' })
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.refresh(request, response);
  }

  @Public()
  @Post('logout')
  @ApiOperation({ summary: 'Logout and revoke the current refresh session' })
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.logout(request, response);
  }

  @Public()
  @SkipThrottle()
  @Get('session')
  @ApiOperation({ summary: 'Check current authentication session' })
  async session(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.session(request, response);
  }
}
