import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from "class-validator";

export class UpdateMarkDto {
  @IsOptional()
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
  marksObtained?: number;

  @IsOptional()
  @IsInt({
    message:
      "Maximum marks must be an integer.",
  })
  @IsPositive({
    message:
      "Maximum marks must be greater than zero.",
  })
  maximumMarks?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}