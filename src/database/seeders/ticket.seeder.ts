// src/common/database/seeds/ticket.seeder.ts
import { DataSource } from 'typeorm';
import { BaseSeeder } from './bootstrap/base.seeder';
import { TicketEntity } from '../../entities/ticket.entity';
import { TicketMessageEntity } from '../../entities/ticket-message.entity';
import { UserEntity } from '../../entities/user.entity';
import { seedTicketMessages, seedTickets } from './ticket-seed-data';


export class TicketSeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const ticketRepository = this.dataSource.getRepository(TicketEntity);
        const ticketMessageRepository = this.dataSource.getRepository(TicketMessageEntity);
        const userRepository = this.dataSource.getRepository(UserEntity);

        // 1) Seed Tickets
        for (const row of seedTickets) {
            const user = await userRepository.findOne({ where: { email: row.userEmail } });
            if (!user) {
                throw new Error(`User not found: ${row.userEmail}`);
            }

            const assignedAdmin = row.assignedAdminEmail
                ? await userRepository.findOne({ where: { email: row.assignedAdminEmail } })
                : null;

            if (row.assignedAdminEmail && !assignedAdmin) {
                throw new Error(`Assigned admin not found: ${row.assignedAdminEmail}`);
            }

            const existingTicket = await ticketRepository.findOne({
                where: {
                    subject: row.subject,
                    user_id: user.id as any, // بسته به تایپ id در Entity ممکنه نیاز به cast نباشه
                } as any,
            });

            if (!existingTicket) {
                await ticketRepository.save(
                    ticketRepository.create({
                        subject: row.subject,
                        status: row.status as any,
                        priority: row.priority as any,
                        category: row.category as any,
                        user_id: user.id as any,
                        assigned_admin_id: assignedAdmin?.id ?? null,
                        last_reply_at: row.last_reply_at ?? null,
                    } as any),
                );
                console.log(`  ✓ Created ticket: ${row.subject}`);
            }
        }

        // 2) Seed Ticket Messages
        for (const row of seedTicketMessages) {
            const ticket = await ticketRepository.findOne({
                where: { subject: row.ticketSubject } as any,
            });
            if (!ticket) {
                throw new Error(`Ticket not found by subject: ${row.ticketSubject}`);
            }

            const sender = await userRepository.findOne({ where: { email: row.senderEmail } });
            if (!sender) {
                throw new Error(`Sender not found: ${row.senderEmail}`);
            }

            const existingMessage = await ticketMessageRepository.findOne({
                where: {
                    ticket_id: ticket.id as any,
                    sender_id: sender.id as any,
                    content: row.content,
                } as any,
            });

            if (!existingMessage) {
                await ticketMessageRepository.save(
                    ticketMessageRepository.create({
                        ticket_id: ticket.id as any,
                        sender_id: sender.id as any,
                        content: row.content,
                        is_internal: row.is_internal,
                    } as any),
                );
                console.log(`  ✓ Created ticket message for: ${row.ticketSubject}`);
            }
        }
    }
}
