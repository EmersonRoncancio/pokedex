import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { envConfigs } from './common/configs/env.config';
import { JoiValidationSchema } from './common/configs/joi.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfigs],
      validationSchema: [JoiValidationSchema],
    }),
    PokemonModule,
    MongooseModule.forRoot(process.env.MONGODB),
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
