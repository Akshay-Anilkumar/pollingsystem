import { IsString, IsArray, ArrayMinSize, IsBoolean, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreatePollDto {
  @IsString() title: string;
  @IsArray() @ArrayMinSize(2) options: string[];
  @IsBoolean() isPublic: boolean;
  @IsOptional() @IsArray() allowedUserIds?: number[];
  @IsInt() @Min(1) @Max(120) duration: number;
}