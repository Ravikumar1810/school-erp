import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty({
    message: "Teacher name is required.",
  })
  name!: string;

  @IsEmail(
    {},
    {
      message:
        "Please enter a valid email address.",
    },
  )
  @IsNotEmpty({
    message: "Email is required.",
  })
  email!: string;

  @IsString()
  @IsNotEmpty({
    message: "Password is required.",
  })
  @MinLength(8, {
    message:
      "Password must contain at least 8 characters.",
  })
  password!: string;
}