import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports:[
    MongooseModule.forFeature([
      {
        name:Pokemon.name,// este name no es el name de los prop sino el name que extiende a documents
        schema:PokemonSchema
      }
    ])
  ]
})
export class PokemonModule {}


//nota ver importaciones de los modulos y como estan construidos los mismos 