import { IsNotEmpty, IsString } from 'class-validator';

export class CommentsNewsidDto {
    @IsString()
    @IsNotEmpty()
    newsId: string;
}
