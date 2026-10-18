import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function createOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('nx-stack API DOC')
    .setDescription('The nx-stack API documentation')
    .setOpenAPIVersion('3.1.0')
    .build();

  return SwaggerModule.createDocument(app, config);
}
