import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CommentsPropsDto {
    @IsNotEmpty()
    @IsString()
    message: string;

    @ValidateIf(o => o.author)
    @IsString()
    author: number
}