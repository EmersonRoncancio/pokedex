import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsString({ message: 'El nombre es requerido' })
  @MinLength(1, { message: 'Se requiere mas de un caracter' })
  nombre: string;

  @IsInt({ message: 'El numero es requerido' })
  @IsPositive()
  @Min(1, { message: 'Se requiere mas de un caracter' })
  no: number;
}
