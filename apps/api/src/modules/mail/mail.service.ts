import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";

import {
  ConfigService,
} from "@nestjs/config";

import {
  Resend,
} from "resend";

import {
  passwordResetTemplate,
} from "./templates/password-reset.template";

@Injectable()
export class MailService {
  private readonly logger =
    new Logger(
      MailService.name,
    );

  private readonly resend:
    Resend;

  constructor(
    private readonly configService:
      ConfigService,
  ) {
    const apiKey =
      this.configService
        .get<string>(
          "RESEND_API_KEY",
        );

    if (!apiKey) {
      throw new Error(
        "RESEND_API_KEY is not configured.",
      );
    }

    this.resend =
      new Resend(
        apiKey,
      );
  }

  async sendPasswordResetEmail(
    to: string,
    name: string,
    resetUrl: string,
  ): Promise<void> {
    const fromEmail =
      this.configService
        .get<string>(
          "MAIL_FROM",
        );

    if (!fromEmail) {
      throw new Error(
        "MAIL_FROM is not configured.",
      );
    }

    try {
      const {
        data,
        error,
      } =
        await this.resend
          .emails
          .send({
            from:
              fromEmail,

            to: [
              to,
            ],

            subject:
              "Reset your School ERP password",

            html:
              passwordResetTemplate({
                name,
                resetUrl,
                expiresInMinutes:
                  15,
              }),
          });

      if (error) {
        this.logger.error(
          `Failed to send password reset email to ${to}: ${error.message}`,
        );

        throw new InternalServerErrorException(
          "Unable to send password reset email.",
        );
      }

      this.logger.log(
        `Password reset email sent successfully. Email ID: ${data?.id ?? "unknown"}`,
      );
    } catch (error) {
      if (
        error instanceof
        InternalServerErrorException
      ) {
        throw error;
      }

      this.logger.error(
        "Unexpected error while sending password reset email.",
        error instanceof Error
          ? error.stack
          : undefined,
      );

      throw new InternalServerErrorException(
        "Unable to send password reset email.",
      );
    }
  }
}