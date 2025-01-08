import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

type CookiesKeys = 'accessToken' | 'refreshToken';

@Injectable()
export class CookiesService {
  public write(res: Response, key: CookiesKeys, value: string) {
    res.cookie(key, value, {
      httpOnly: true,
      secure: true,
    });
  }

  public read(req: Request, key: CookiesKeys) {
    return req.cookies[key];
  }
}
