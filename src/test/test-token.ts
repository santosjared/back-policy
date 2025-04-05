import { JwtService } from '@nestjs/jwt';

async function testToken() {
  const jwtService = new JwtService({ secret: 'mi_clave_secreta' });
  const token = jwtService.sign({ test: 'ok' });
  console.log('Token generado:', token);
}

testToken();
