import { Webhook } from "../routes/webhook/entities/webhook.entity";
import { getRequiredSecret } from "../config/required-secret";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";

async function buildAdminJsModule() {
  // NestJS does not support ESM modules in the current CommonJS build.
  // Native dynamic imports preserve that boundary without executing generated code.
  const { AdminJS } = await import("adminjs");
  const { Resource, Database } = await import("@adminjs/typeorm");
  AdminJS.registerAdapter({
    Resource,
    Database,
  });
  const { AdminModule } = await import("@adminjs/nestjs");
  const basePath = (process.env.URL_BASE_PATH || "") + "/admin";

  return AdminModule.createAdminAsync({
    imports: [AuthModule],
    inject: [AuthService],
    useFactory: (authService: AuthService) => {
      const cookiePassword = getRequiredSecret(
        "ADMIN_COOKIE_PASSWORD",
        process.env.ADMIN_COOKIE_PASSWORD,
        32,
      );
      const sessionSecret = getRequiredSecret(
        "ADMIN_SESSION_SECRET",
        process.env.ADMIN_SESSION_SECRET,
        32,
      );

      return {
        adminJsOptions: {
          rootPath: basePath,
          loginPath: basePath + "/login",
          logoutPath: basePath + "/logout",
          resources: [Webhook],
        },
        auth: {
          authenticate: (email: string, password: string) =>
            authService.authenticate(email, password),
          cookieName: "adminjs",
          cookiePassword,
        },
        sessionOptions: {
          resave: false,
          saveUninitialized: false,
          secret: sessionSecret,
        },
      };
    },
  });
}

export const AdminJsModule = buildAdminJsModule();
