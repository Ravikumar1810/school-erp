import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";

export class CreateMarkDto {
  @IsUUID(
    "4",
    {
      message:
        "Student ID must be a valid UUID.",
    },
  )
  @IsNotEmpty({
    message:
      "Student ID is required.",
  })
  studentId!: string;

  @IsString()
  @IsNotEmpty({
    message:
      "Subject is required.",
  })
  @MaxLength(
    100,
    {
      message:
        "Subject cannot exceed 100 characters.",
    },
  )
  subject!: string;

  @IsString()
  @IsIn(
    [
      "UNIT_TEST",
      "MID_TERM",
      "FINAL",
      "ASSIGNMENT",
    ],
    {
      message:
        "Exam type must be UNIT_TEST, MID_TERM, FINAL, or ASSIGNMENT.",
    },
  )
  examType!:
    | "UNIT_TEST"
    | "MID_TERM"
    | "FINAL"
    | "ASSIGNMENT";

  @IsInt({
    message:
      "Marks obtained must be an integer.",
  })
  @Min(
    0,
    {
      message:
        "Marks obtained cannot be negative.",
    },
  )
  marksObtained!: number;

  @IsInt({
    message:
      "Maximum marks must be an integer.",
  })
  @IsPositive({
    message:
      "Maximum marks must be greater than zero.",
  })
  maximumMarks!: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}