import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if ( !isValidObjectId(value) ) {//verificamos que sea un mongo id para poder eliminar 
      throw new BadRequestException(`${ value } is not a valid MongoID`);
    }

    return value;
  }
}
