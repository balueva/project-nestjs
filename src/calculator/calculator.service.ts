import { Injectable } from '@nestjs/common';
import { OperationType } from './calculator.types';

const ERROR_TEXT1 = 'Хотя бы один операнд не является числом';
const ERROR_TEXT2 = 'Операци не поддерживается';
const ERROR_TEXT3 = 'На 0 делить нельзя';

@Injectable()
export class CalculatorService {

    public calc(operation: string, operand1: string, operand2: string): number | string {
        if (!(operand1 !== '' && !isNaN(Number(operand1))))
            return ERROR_TEXT1;

        if (!(operand2 !== '' && !isNaN(Number(operand2))))
            return ERROR_TEXT1;

        switch (operation) {
            case 'addition':
            case 'add':
                return this.addition(+operand1, +operand2);
            case 'subtraction':
            case 'sub':
                return this.subtraction(+operand1, +operand2);
            case 'multiplication':
            case 'mult':
                return this.multiplication(+operand1, +operand2);
            case 'division':
            case 'div':
                return this.division(+operand1, +operand2);
            default:
                return ERROR_TEXT2;
        }
    }

    private addition(operand1: number, operand2: number): number {
        return operand1 + operand2;
    }

    private subtraction(operand1: number, operand2: number): number {
        return operand1 - operand2;
    }

    private multiplication(operand1: number, operand2: number): number {
        return operand1 * operand2;
    }

    private division(operand1: number, operand2: number): number | string {
        return operand2 !== 0 ? operand1 / operand2 : ERROR_TEXT3;
    }
}
