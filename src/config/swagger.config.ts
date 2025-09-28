import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Hotel Booking API')
    .setDescription('A comprehensive API for hotel booking management system')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Hotels', 'Hotel management operations')
    .addTag('Rooms', 'Room management operations')
    .addTag('Room Types', 'Room type management operations')
    .addTag('Reservations', 'Reservation management operations')
    .addTag('Payments', 'Payment processing operations')
    .addTag('Users', 'User management operations')
    .addTag('Hotel Staff', 'Hotel staff management operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
