import { IsOptional, IsString, Length } from "class-validator";
import { IsSanitized } from "src/utils/decorators/isSanitized.decorator";

export class CreateTrackDto {
  @IsString()
  @IsSanitized({ message: 'Name contains unsafe content' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name: string;

  @IsString()
  @IsSanitized({ message: 'Text contains unsafe content' })
  @IsOptional()
  text?: string;
}
