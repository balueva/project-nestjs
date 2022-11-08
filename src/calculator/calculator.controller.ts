import { Controller, Headers, Put, Body } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { UserData } from './calculator.types';

@Controller('calculator')
export class CalculatorController {
    constructor(private calculatorService: CalculatorService) { }

    @Put('calc')
    async calc(@Headers('Type-Operation') typeOperation: string, @Body() data: UserData) {
        return this.calculatorService.calc(typeOperation, data.operand1, data.operand2);
    }
}
