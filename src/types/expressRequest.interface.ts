import { Request } from 'express';

import { UserType } from '@app/auth/types/user.types';

export interface ExpressRequest extends Request {
  user?: UserType;
}
