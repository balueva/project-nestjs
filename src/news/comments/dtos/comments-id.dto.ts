import { IsNotEmpty, IsString } from 'class-validator';

export class CommentsIdDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}