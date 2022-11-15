import { IsNotEmpty, IsNumber } from 'class-validator';

export class CommentsIdDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
}