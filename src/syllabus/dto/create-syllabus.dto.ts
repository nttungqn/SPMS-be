import { ApiProperty } from "@nestjs/swagger";
import { IsInt} from "class-validator";

export class CreateSyllabusDto {
    @ApiProperty()
    @IsInt()
    idSubject:number;

    @ApiProperty()
    @IsInt()
    idTypeOfEdu:number;

    @ApiProperty()
    @IsInt()
    idSchoolYear:number;

    idUser?:number;
}
