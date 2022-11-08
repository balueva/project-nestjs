import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendTest() {

        return this.mailerService
            .sendMail({
                to: 'addr',
                subject:
                    'Первое тестовое письмо',
                template: './test',
            })
            .then((res) => {
                console.log('res', res);
            })
            .catch((err) => {
                console.log('err', err);
            });
    }

    async sendUpdatedNewsForAdmins(emails: string[], editedNews): Promise<void> {
        console.log('editedNews', editedNews);

        for (const email of emails) {
            await this.mailerService
                .sendMail({
                    to: email,
                    subject: 'Редактирование новости',
                    template: './news-update',
                    context: editedNews,
                })
                .then((res) => {
                    console.log('res', res);
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }
    }
}
