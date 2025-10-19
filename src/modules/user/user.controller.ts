import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserResponse, UpdateUserResponse, FindUserResponse, UserListResponse, UserResponse } from './types/user.types';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Criar novo usuário',
    description: 'Cria um novo usuário no sistema'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        message: 'Usuário criado com sucesso',
        user: {
          id: 1,
          name: 'João Silva',
          email: 'joao@exemplo.com',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos'
  })
  create(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar todos os usuários',
    description: 'Retorna uma lista com todos os usuários cadastrados'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'João Silva' },
          email: { type: 'string', example: 'joao@exemplo.com' },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
        }
      }
    }
  })
  findAll(): Promise<UserListResponse[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar usuário por ID',
    description: 'Retorna os dados de um usuário específico'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do usuário',
    example: '1'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário encontrado',
    schema: {
      example: {
        id: 1,
        name: 'João Silva',
        email: 'joao@exemplo.com',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado'
  })
  findOne(@Param('id') id: string): Promise<FindUserResponse | null> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar usuário',
    description: 'Atualiza os dados de um usuário específico'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do usuário',
    example: '1'
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário atualizado com sucesso',
    schema: {
      example: {
        message: 'Usuário atualizado com sucesso',
        user: {
          id: 1,
          name: 'João Silva Atualizado',
          email: 'joao@exemplo.com',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado'
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UpdateUserResponse> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Deletar usuário',
    description: 'Remove um usuário do sistema'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do usuário',
    example: '1'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário deletado com sucesso',
    schema: {
      example: {
        message: 'Usuário deletado com sucesso',
        id: 1
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado'
  })
  remove(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.remove(id);
  }
}
