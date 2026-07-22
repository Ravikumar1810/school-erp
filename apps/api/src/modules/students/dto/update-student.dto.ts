import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message:
        "Please enter a valid email address.",
    },
  )
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  admissionNumber?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  className?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  section?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  rollNumber?: string;

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