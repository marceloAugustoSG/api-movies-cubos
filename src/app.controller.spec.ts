import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('deve estar definido', () => {
    expect(appController).toBeDefined();
  });

  describe('getHello', () => {
    it('deve retornar mensagem da API', () => {
      expect(appController.getHello()).toEqual({ message: "API de filmes está funcionando" });
    });
  });
});
