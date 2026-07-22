import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
} from "class-validator";

export class ForgotPasswordDto {
  @IsNotEmpty({
    message: "Email is required.",
  })
  @IsEmail(
    {},
    {
      message:
        "Please enter a valid email address.",
    },
  )
  @MaxLength(255)
  email!: string;
}