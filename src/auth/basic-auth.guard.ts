import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { isUsableSecret } from "../config/required-secret";

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.configService.get<string>("SSE_AUTH_TOKEN");
    const authorization = request.headers.authorization;

    if (!isUsableSecret(token) || typeof authorization !== "string") {
      return false;
    }

    return authorization === `Basic ${token}`;
  }
}
