import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemons = await this.PokemonModel.create(createPokemonDto);
      return pokemons;
    } catch (error) {
      this.HandleError(error);
    }
  }

  async insertAllPokemons(createPokemonDto: CreatePokemonDto[]) {
    try {
      await this.PokemonModel.deleteMany();
      const pokemons = await this.PokemonModel.insertMany(createPokemonDto);
      return pokemons;
    } catch (error) {
      this.HandleError(error);
    }
  }

  async findAll(paginationDto: PaginationDTO) {
    const { page = 1, limit = 10 } = paginationDto;
    try {
      const pokemons = await this.PokemonModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-__v');
      return pokemons;
    } catch (error) {
      throw new InternalServerErrorException('Internal server Error');
    }
  }

  async findOne(term: string) {
    let pokemon: Pokemon | never;

    if (!isNaN(+term)) {
      pokemon = await this.PokemonModel.findOne({ no: +term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.PokemonModel.findById(term);
    } else if (!pokemon) {
      pokemon = await this.PokemonModel.findOne({ nombre: term });
    }

    if (!pokemon) throw new NotFoundException('Pokemon no encontrado');

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const validatePokemon = await this.findOne(term);
    if (!validatePokemon) throw new NotFoundException('El porkemon no existe');

    try {
      await validatePokemon.updateOne(updatePokemonDto, {
        new: true,
      });

      return { ...validatePokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.HandleError(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    const pokemonDelete = await this.PokemonModel.deleteOne({ _id: id });
    if (pokemonDelete.deletedCount === 0)
      throw new BadRequestException('El pokemon no existe');

    return { message: 'Pokemon Eliminado' };
  }

  private HandleError(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Atributo existente en la DB ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException();
  }
}
