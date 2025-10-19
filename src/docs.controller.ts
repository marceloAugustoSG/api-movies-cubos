import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Controller para documentação pública da API
 * 
 * Este controller fornece endpoints públicos para acessar informações
 * sobre a API sem necessidade de autenticação. Útil para desenvolvedores
 * que querem entender rapidamente as funcionalidades disponíveis.
 */
@ApiTags('documentation')
@Controller('docs')
export class DocsController {
  
  /**
   * Endpoint principal de documentação
   * 
   * Retorna informações básicas sobre a documentação da API
   * e links para acessar a interface Swagger
   */
  @Get()
  @ApiOperation({ 
    summary: 'Documentação da API',
    description: 'Retorna informações sobre a documentação Swagger da API Movie Cubos'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Informações da documentação retornadas com sucesso',
    schema: {
      example: {
        message: 'Documentação da API Movie Cubos',
        swaggerUrl: '/api/docs',
        description: 'Acesse a documentação interativa do Swagger',
        endpoints: {
          swagger: '/api/docs',
          alternative: '/docs',
          info: 'Ambos os endpoints levam à mesma documentação'
        }
      }
    }
  })
  getDocs() {
    return {
      message: 'Documentação da API Movie Cubos',
      swaggerUrl: '/api/docs',
      description: 'Acesse a documentação interativa do Swagger',
      endpoints: {
        swagger: '/api/docs',
        alternative: '/docs',
        info: 'Ambos os endpoints levam à mesma documentação'
      }
    };
  }

  /**
   * Endpoint de informações da API
   * 
   * Retorna informações detalhadas sobre as funcionalidades
   * e recursos disponíveis na API
   */
  @Get('info')
  @ApiOperation({ 
    summary: 'Informações da API',
    description: 'Retorna informações detalhadas sobre funcionalidades e recursos da API'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Informações da API retornadas com sucesso',
    schema: {
      example: {
        name: 'API Movie Cubos',
        version: '1.0',
        description: 'API para gerenciamento de filmes e usuários',
        documentation: 'Disponível em /api/docs',
        features: [
          'Autenticação JWT',
          'CRUD de usuários',
          'CRUD de filmes',
          'Upload de imagens',
          'Envio de emails',
          'Filtros e paginação'
        ]
      }
    }
  })
  getApiInfo() {
    return {
      name: 'API Movie Cubos',
      version: '1.0',
      description: 'API completa para gerenciamento de filmes e usuários com autenticação JWT, upload de imagens e envio de emails',
      documentation: 'Disponível em /api/docs',
      features: [
        'Autenticação JWT com registro e login',
        'CRUD completo de usuários',
        'CRUD completo de filmes com filtros e paginação',
        'Upload de imagens para Amazon S3',
        'Envio de emails personalizados',
        'Filtros avançados e paginação',
        'Documentação interativa com Swagger',
        'Validação de dados com class-validator',
        'CORS configurado para desenvolvimento'
      ],
      endpoints: {
        auth: 'Autenticação e autorização',
        users: 'Gerenciamento de usuários',
        movies: 'Gerenciamento de filmes',
        upload: 'Upload de arquivos',
        email: 'Envio de emails',
        docs: 'Documentação pública'
      }
    };
  }
}
