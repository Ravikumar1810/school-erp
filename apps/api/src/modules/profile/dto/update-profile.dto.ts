import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2, {
    message:
      "Name must contain at least 2 characters.",
  })
  @MaxLength(100, {
    message:
      "Name cannot exceed 100 characters.",
  })
  name?: string;

  @IsOptional()
  @IsString()
  @IsUrl(
    {},
    {
      message:
        "Avatar must be a valid URL.",
    },
  )
  avatar?: string;
}