import { ApiProperty } from "@nestjs/swagger";

export class CreateFileDto {
    @ApiProperty({
    required:false
  })
  id: string;

    @ApiProperty({
    required:false
  })
  title: string;

    @ApiProperty({
    required:false
  })
  description: string;

    @ApiProperty({
    required:false
  })
  dateTimeCreated: string;
}
