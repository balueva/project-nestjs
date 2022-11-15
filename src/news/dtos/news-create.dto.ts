import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class NewsCreateDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @ValidateIf(o => o.authorId)
    @IsString()
    authorId: number

    @IsNotEmpty()
    @IsString()
    categoryId: number
}
