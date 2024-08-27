import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Controller('pokemon')
export class PokemonController {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly configService: ConfigService,
  ) {
    console.log(configService.get<number>('port'));
  }

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Post('/all')
  insertAll(@Body() createPokemonDto: CreatePokemonDto[]) {
    return this.pokemonService.insertAllPokemons(createPokemonDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDTO) {
    return this.pokemonService.findAll(pagination);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }

  @Patch(':term')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('term') term: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    return this.pokemonService.update(term, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
