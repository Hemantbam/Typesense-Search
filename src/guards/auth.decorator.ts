import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth.guard';
import { AdminAuthGuard } from './admin.guard';
export const Auth = () => {
  return applyDecorators(UseGuards(JwtAuthGuard));
};

export const AdminAUth = () => {
  return applyDecorators(UseGuards(AdminAuthGuard));
};
