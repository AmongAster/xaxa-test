import { Injectable } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';

@Injectable()
export class InteractionService {
  create(createInteractionDto: CreateInteractionDto) {
    return  ;
  }

  findAll() {
    return  ;
  }

  findOne(id: number) {
    return  ;
  }

  update(id: number, updateInteractionDto: UpdateInteractionDto) {
    return  ;
  }

  remove(id: number) {
    return  ;
  }
}
