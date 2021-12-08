import { Field, Int, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";


@ObjectType()
@Entity("users")
export class User extends BaseEntity{

    @Field(() => Int)
    @PrimaryGeneratedColumn("identity")
    id: number;

    @Field() 
    @Column("text")
    email: string;

    @Column("text")
    password: string;

}
