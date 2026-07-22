import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty({
    message: "Student name is required.",
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

  @IsString()
  @IsNotEmpty({
    message:
      "Admission number is required.",
  })
  admissionNumber!: string;

  @IsString()
  @IsNotEmpty({
    message: "Class is required.",
  })
  className!: string;

  @IsString()
  @IsNotEmpty({
    message: "Section is required.",
  })
  section!: string;

  @IsString()
  @IsNotEmpty({
    message:
      "Roll number is required.",
  })
  rollNumber!: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        "Date of birth must be a valid date.",
    },
  )
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsOptional()
  @IsString()
  parentPhone?: string;
}