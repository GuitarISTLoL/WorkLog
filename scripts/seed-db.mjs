const API_URL = (process.env.API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

const WORK_TYPES = [
  { title: 'Монтаж кабеля', unit: 'м' },
  { title: 'Покраска стен', unit: 'м2' },
  { title: 'Установка светильников', unit: 'ед' },
]

const USERS = [
  'Иванов Пётр',
  'Петрова Анна',
  'Сидоров Илья',
  'Смирнова Елена',
  'Кузнецов Олег',
  'Попова Мария',
  'Васильев Дмитрий',
  'Соколова Ольга',
  'Михайлов Алексей',
  'Новикова Дарья',
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForApi() {
  const maxAttempts = 45

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${API_URL}/work-type`)
      if (response.ok) {
        return
      }
    } catch {
      // API ещё не поднялся
    }

    console.log(`Ожидание API… (${attempt}/${maxAttempts})`)
    await sleep(2000)
  }

  throw new Error(`API недоступен: ${API_URL}`)
}

async function fetchJson(url, options) {
  const response = await fetch(url, options)

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${text}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

function randomCount() {
  return Math.floor(Math.random() * 50) + 1
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)]
}

async function main() {
  console.log(`Проверка базы через ${API_URL}`)

  await waitForApi()

  const existingWorkTypes = await fetchJson(`${API_URL}/work-type`)

  if (Array.isArray(existingWorkTypes) && existingWorkTypes.length > 0) {
    console.log('База уже содержит данные, сидирование пропущено.')
    return
  }

  console.log('Таблицы пустые, заполняем…')

  const createdWorkTypes = []

  for (const item of WORK_TYPES) {
    const created = await fetchJson(`${API_URL}/work-type`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    createdWorkTypes.push(created)
    console.log(`  + вид работ: ${created.title} (${created.unit})`)
  }

  for (const user of USERS) {
    const workType = pickRandom(createdWorkTypes)
    const count = randomCount()

    await fetchJson(`${API_URL}/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user,
        type: workType.id,
        count,
      }),
    })

    console.log(`  + запись: ${user}, ${workType.title}, ${count} ${workType.unit}`)
  }

  console.log('Сидирование завершено.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
