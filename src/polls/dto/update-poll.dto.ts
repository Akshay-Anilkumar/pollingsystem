import { IsOptional, IsString, IsArray, ArrayMinSize, IsBoolean, IsInt, Min, Max } from 'class-validator';
export class UpdatePollDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsArray() @ArrayMinSize(2) options?: string[];
  @IsOptional() @IsBoolean() isPublic?: boolean;
  @IsOptional() @IsArray() allowedUserIds?: number[];
  @IsOptional() @IsInt() @Min(1) @Max(120) duration?: number;
}