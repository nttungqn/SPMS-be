import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, Max } from "class-validator";

export class GetSyllabusFilterDto{
    @ApiProperty({required:false})
    @IsOptional()
    @IsNotEmpty()
    search:string;

    @ApiProperty({required:false})
    @IsOptional()
    @IsNumberString()
    page:number;

    @ApiProperty({required:false})
    @IsOptional()
    @IsNumberString()
    limit:number;
}