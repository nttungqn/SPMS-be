import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, min } from "class-validator";

export class CreateSchoolYearDto {
    @ApiProperty()
    @IsNotEmpty()
    code?:string;

    @ApiProperty()
    @Length(5)
    name?:string;
}
