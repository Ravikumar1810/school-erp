import {
  IsIn,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateAttendanceDto {
  @IsOptional()
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
  status?:
    | "PRESENT"
    | "ABSENT"
    | "LEAVE";

  @IsOptional()
  @IsString()
  remarks?: string;
}