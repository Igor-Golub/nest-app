import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class CookiesService {
  public write(res: Response, key: string, value: string) {
    res.cookie(key, value, {
      httpOnly: true,
      secure: true,
    });
  }

  public read(req: Request, key: string) {
    return req.cookies[key];
  }
}
