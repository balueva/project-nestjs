import { IsNotEmpty, IsNumber } from 'class-validator';

export class CommentsNewsidDto {
    @IsNumber()
    @IsNotEmpty()
    newsId: number;
}
