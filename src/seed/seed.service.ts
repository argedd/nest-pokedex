import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {
 

  // despues de la v18 de node se puede usar fetch
  constructor(
    @InjectModel( Pokemon.name )//importamos para trabajar con loas insercion de datos 
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}

  
  async executeSeed() {

    await this.pokemonModel.deleteMany({}); // delete * from pokemons;

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=400');

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url }) => {//desestructuramos para obtener el no

      const segments = url.split('/');
      const no = +segments[ segments.length - 2 ];

      // const pokemon = await this.pokemonModel.create({ name, no });
      pokemonToInsert.push({ name, no }); // [{ name: bulbasaur, no: 1 }] cargamos el arreglo para insertar 

    });

    await this.pokemonModel.insertMany(pokemonToInsert);//insertamos de manera simultanea acelerando el proceso 


    return 'Seed Executed';
  }




}
