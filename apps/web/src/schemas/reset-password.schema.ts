import { z } from "zod";

export const resetPasswordSchema =
  z
    .object({
      password: z
        .string()
        .min(
          8,
          "Password must be at least 8 characters.",
        )
        .max(
          100,
          "Password is too long.",
        )
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
          "Password must contain uppercase, lowercase and a number.",
        ),

      confirmPassword:
        z
          .string()
          .min(
            1,
            "Confirm password is required.",
          ),
    })
    .refine(
      (data) =>
        data.password ===
        data.confirmPassword,
      {
        message:
          "Passwords do not match.",

        path: [
          "confirmPassword",
        ],
      },
    );

export type ResetPasswordSchema =
  z.infer<
    typeof resetPasswordSchema
  >;