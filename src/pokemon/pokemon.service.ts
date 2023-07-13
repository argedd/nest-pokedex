import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class PokemonService {
  constructor(
    
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

  ) {} //inyeccion de dependencia del modelo para  interactuar con la bd

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
      
    } catch (error) {
      this.handleExceptions( error );
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {//term termino de busqueda id,no,name
    
    let pokemon: Pokemon;//variable que contienes mi modelo de pokemon no, name y es lo que voy a retornar 

    if ( !isNaN(+term) ) {
      pokemon = await this.pokemonModel.findOne({ no: term });//si es un numero 
    }

    // MongoID verificamos si es un mongo id
    if ( !pokemon && isValidObjectId( term ) ) {
      pokemon = await this.pokemonModel.findById( term );//id de mongo
    }

    // Name, verificamos si no hemos encontrado un pokemon 
    if ( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })//por nombre llevado a minusculas 
    }


    if ( !pokemon ) 
      throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);//regreso un error si no lo encuentro
    

    return pokemon;//retorno mis datos encontrados
  }

  async update( term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( term );//buscamos el pokemon a ver si existe llamando la funcion findOne
    if ( updatePokemonDto.name )//si tiene nombre lo devolvemos en minusculas 
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    
    try {
      await pokemon.updateOne( updatePokemonDto );// actualizamos el pokemon con la informacion 
      return { ...pokemon.toJSON(), ...updatePokemonDto };// regresamos el pokemon actualizado sobrescribiendo la informacion
      
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove( id: string) {
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();
    // return { id };
    // const result = await this.pokemonModel.findByIdAndDelete( id );
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });//desestructuramos la cantidad de elementos eliminados y devolvemos un error en caso de no encontrar el elemento
    if ( deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id "${ id }" not found`);

    return;
  }

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }
}
