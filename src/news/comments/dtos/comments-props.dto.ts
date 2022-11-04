import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CommentsPropsDto {
    @IsNotEmpty()
    @IsString()
    text: string;

    @ValidateIf(o => o.avatar)
    @IsString()
    avatar: string
}