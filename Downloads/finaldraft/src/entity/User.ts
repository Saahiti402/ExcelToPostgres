import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryColumn()
    id: number

    @Column()
    task: string
}

