interface PasswordResetTemplateOptions {
  name: string;
  resetUrl: string;
  expiresInMinutes?: number;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function passwordResetTemplate({
  name,
  resetUrl,
  expiresInMinutes = 15,
}: PasswordResetTemplateOptions): string {
  const safeName =
    escapeHtml(name);

  const safeResetUrl =
    escapeHtml(resetUrl);

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>Reset Your Password</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #020617;
          font-family: Arial, Helvetica, sans-serif;
          color: #e2e8f0;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            width: 100%;
            background-color: #020617;
          "
        >
          <tr>
            <td
              align="center"
              style="padding: 40px 16px;"
            >
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  max-width: 600px;
                  background-color: #0f172a;
                  border: 1px solid #1e293b;
                  border-radius: 16px;
                "
              >
                <tr>
                  <td
                    style="
                      padding: 40px;
                    "
                  >
                    <div
                      style="
                        margin-bottom: 28px;
                      "
                    >
                      <span
                        style="
                          display: inline-block;
                          padding: 8px 14px;
                          background-color: rgba(16, 185, 129, 0.1);
                          border: 1px solid rgba(16, 185, 129, 0.2);
                          border-radius: 999px;
                          color: #34d399;
                          font-size: 13px;
                          font-weight: 600;
                        "
                      >
                        School ERP
                      </span>
                    </div>

                    <h1
                      style="
                        margin: 0 0 16px;
                        color: #ffffff;
                        font-size: 28px;
                        line-height: 1.3;
                      "
                    >
                      Reset your password
                    </h1>

                    <p
                      style="
                        margin: 0 0 16px;
                        color: #94a3b8;
                        font-size: 16px;
                        line-height: 1.7;
                      "
                    >
                      Hello ${safeName},
                    </p>

                    <p
                      style="
                        margin: 0 0 28px;
                        color: #94a3b8;
                        font-size: 16px;
                        line-height: 1.7;
                      "
                    >
                      We received a request to reset the password
                      for your School ERP account. Click the button
                      below to create a new password.
                    </p>

                    <table
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                    >
                      <tr>
                        <td
                          style="
                            border-radius: 10px;
                            background-color: #10b981;
                          "
                        >
                          <a
                            href="${safeResetUrl}"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="
                              display: inline-block;
                              padding: 14px 24px;
                              color: #020617;
                              font-size: 15px;
                              font-weight: 700;
                              text-decoration: none;
                            "
                          >
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p
                      style="
                        margin: 28px 0 0;
                        color: #64748b;
                        font-size: 14px;
                        line-height: 1.6;
                      "
                    >
                      This password reset link will expire in
                      ${expiresInMinutes} minutes.
                    </p>

                    <p
                      style="
                        margin: 12px 0 0;
                        color: #64748b;
                        font-size: 14px;
                        line-height: 1.6;
                      "
                    >
                      If you did not request a password reset,
                      you can safely ignore this email. Your
                      password will remain unchanged.
                    </p>

                    <div
                      style="
                        height: 1px;
                        margin: 32px 0;
                        background-color: #1e293b;
                      "
                    ></div>

                    <p
                      style="
                        margin: 0;
                        color: #475569;
                        font-size: 12px;
                        line-height: 1.6;
                      "
                    >
                      If the button does not work, copy and paste
                      this link into your browser:
                    </p>

                    <p
                      style="
                        margin: 8px 0 0;
                        word-break: break-all;
                        color: #34d399;
                        font-size: 12px;
                        line-height: 1.6;
                      "
                    >
                      ${safeResetUrl}
                    </p>
                  </td>
                </tr>
              </table>

              <p
                style="
                  margin: 20px 0 0;
                  color: #475569;
                  font-size: 12px;
                "
              >
                © School ERP. Smart School Management.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}