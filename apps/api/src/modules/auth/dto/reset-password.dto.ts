import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty({
    message:
      "Password reset token is required.",
  })
  @IsString()
  token!: string;

  @IsNotEmpty({
    message:
      "New password is required.",
  })
  @IsString()
  @MinLength(8, {
    message:
      "Password must be at least 8 characters long.",
  })
  @MaxLength(100)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    },
  )
  newPassword!: string;
}