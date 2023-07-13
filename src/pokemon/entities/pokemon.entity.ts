import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Pokemon extends Document {

    // id: string // Mongo me lo da
    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    no: number;
}

export const PokemonSchema=SchemaFactory.createForClass(Pokemon);
//agregar  MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'), en appModule para configurar la conexion a mongo 