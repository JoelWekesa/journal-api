import { SetMetadata } from '@nestjs/common';

export const SetOwnershipModel = ({ model }: { model: string }) => SetMetadata('model', model);

