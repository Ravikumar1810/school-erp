import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateAttendanceDto {
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

  @IsDateString(
    {},
    {
      message:
        "Attendance date must be a valid date.",
    },
  )
  date!: string;

  @IsString()
  @IsIn(
    [
      "PRESENT",
      "ABSENT",
      "LEAVE",
    ],
    {
      message:
        "Status must be PRESENT, ABSENT, or LEAVE.",
    },
  )
  status!:
    | "PRESENT"
    | "ABSENT"
    | "LEAVE";

  @IsOptional()
  @IsString()
  remarks?: string;
}