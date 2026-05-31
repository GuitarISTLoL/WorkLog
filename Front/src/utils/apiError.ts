export type FieldErrors = Partial<Record<'user' | 'title' | 'type' | 'count', string>>

export class ApiError extends Error {
  readonly fieldErrors: FieldErrors

  constructor(message: string, fieldErrors: FieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.fieldErrors = fieldErrors
  }
}

function localizeUserMessage(message: string): string {
  if (message.includes('ФИО')) {
    return message
  }
  if (message.includes('longer than or equal to 5')) {
    return 'ФИО должно содержать не менее 5 символов'
  }
  if (message.includes('should not be empty')) {
    return 'Укажите ФИО'
  }
  if (message.includes('must be a string')) {
    return 'ФИО должно быть текстом'
  }
  return message
}

function localizeTitleMessage(message: string): string {
  if (message.includes('Наименование работы')) {
    return message
  }
  if (message.includes('should not be empty')) {
    return 'Укажите наименование работы'
  }
  if (message.includes('must be a string')) {
    return 'Наименование должно быть текстом'
  }
  return message
}

function assignFieldMessage(
  fieldErrors: FieldErrors,
  field: keyof FieldErrors,
  message: string,
) {
  if (!fieldErrors[field]) {
    fieldErrors[field] = message
  }
}

export async function parseApiError(
  response: Response,
  fallback: string,
): Promise<ApiError> {
  let body: unknown = null

  try {
    body = await response.json()
  } catch {
    return new ApiError(fallback)
  }

  const fieldErrors: FieldErrors = {}
  const general: string[] = []

  if (body && typeof body === 'object' && 'message' in body) {
    const raw = (body as { message: unknown }).message
    const messages = Array.isArray(raw) ? raw.map(String) : [String(raw)]

    for (const message of messages) {
      const lower = message.toLowerCase()

      if (lower.includes('фио') || lower.startsWith('user')) {
        assignFieldMessage(fieldErrors, 'user', localizeUserMessage(message))
        continue
      }

      if (lower.includes('наименование работы') || lower.startsWith('title')) {
        assignFieldMessage(
          fieldErrors,
          'title',
          localizeTitleMessage(message),
        )
        continue
      }

      if (lower.startsWith('type')) {
        assignFieldMessage(fieldErrors, 'type', 'Выберите наименование работы')
        continue
      }

      if (lower.startsWith('count')) {
        assignFieldMessage(fieldErrors, 'count', 'Укажите корректный объём')
        continue
      }

      if (lower.startsWith('complitedat')) {
        assignFieldMessage(fieldErrors, 'complitedAt', 'Укажите корректную дату')
        continue
      }

      general.push(message)
    }
  }

  const summary =
    general.join('. ') ||
    Object.values(fieldErrors).join('. ') ||
    fallback

  return new ApiError(summary, fieldErrors)
}

export async function ensureOk(
  response: Response,
  fallback: string,
): Promise<void> {
  if (!response.ok) {
    throw await parseApiError(response, fallback)
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
