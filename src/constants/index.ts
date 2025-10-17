
export const ERROR_MESSAGES = {
  USER: {
    NOT_FOUND: 'Usuário não encontrado',
    EMAIL_ALREADY_EXISTS: 'Email já está em uso',
    INVALID_EMAIL: 'Email inválido',
    INVALID_PASSWORD: 'Senha inválida',
  },
  MOVIE: {
    NOT_FOUND: 'Filme não encontrado',
    INVALID_RELEASE_DATE: 'Data de lançamento inválida',
    INVALID_DURATION: 'Duração deve ser maior que zero',
    INVALID_BUDGET: 'Orçamento deve ser maior ou igual a zero',
  },
  VALIDATION: {
    EMAIL_ALREADY_EXISTS: 'Email já está em uso',
    REQUIRED_FIELD: 'Campo obrigatório',
    INVALID_ID: 'ID inválido',
    INVALID_EMAIL: 'Email inválido',
    INVALID_PAGE: 'Página deve ser maior que zero',
    INVALID_LIMIT: 'Limite deve ser maior que zero',
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
