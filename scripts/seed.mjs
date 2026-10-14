const api = (process.env.API_BASE_URL ?? 'http://localhost:8081/api/v1').replace(/\/$/, '')
const username = process.env.ADMIN_USERNAME
const password = process.env.ADMIN_PASSWORD
if (!username || !password) {
  console.error('Set ADMIN_USERNAME and ADMIN_PASSWORD in the environment before running the seeder.')
  process.exit(1)
}

async function call(path, { token, method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  if (body) headers['Content-Type'] = 'application/json'
  const response = await fetch(`${api}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  const result = response.status === 204 ? null : await response.json()
  if (!response.ok) throw new Error(`${method} ${path} failed (${response.status}): ${result?.message ?? 'request failed'}`)
  return result
}

const session = await call('/auth/login', { method: 'POST', body: { username, password } })
const token = session.access_token
const categories = await call('/categories', { token })
if (categories.length !== 5) throw new Error('Expected the five fixed book categories.')

const books = []
for (let index = 1; index <= 40; index++) {
  const title = `Demo Library Book ${String(index).padStart(2, '0')}`
  const existing = await call(`/books?q=${encodeURIComponent(title)}&size=50`, { token })
  let book = existing.items.find(item => item.title === title)
  if (!book) {
    const category = categories[(index - 1) % categories.length]
    book = await call('/books', { token, method: 'POST', body: {
      title, author: `Demo Author ${String(index).padStart(2, '0')}`,
      isbn: `978${String(index).padStart(10, '0')}`, category_id: category.id, total_copies: 5,
    } })
  }
  books.push(book)
}

const members = []
for (let index = 1; index <= 10; index++) {
  const suffix = String(index).padStart(3, '0')
  const existing = await call(`/members?q=LIB-DEMO-${suffix}&size=50`, { token })
  let member = existing.items.find(item => item.document_number === `LIB-DEMO-${suffix}`)
  if (!member) member = await call('/members', { token, method: 'POST', body: { full_name: `Demo Member ${suffix}`, document_number: `LIB-DEMO-${suffix}` } })
  members.push(member)
}

let loanCount = 0
for (let index = 0; index < 15; index++) {
  const member = members[index % members.length]
  const existing = await call(`/loans?member_id=${member.id}&size=50`, { token })
  const demoLoans = existing.items.filter(item => item.items.some(loanItem => loanItem.book_title.startsWith('Demo Library Book ')))
  if (demoLoans.length > (index < 10 ? 0 : 1)) continue
  await call('/loans', { token, method: 'POST', body: { member_id: member.id, items: [{ book_id: books[index].id }] } })
  loanCount++
}

console.log(`Demo data ready: ${books.length} books, ${members.length} members, ${loanCount} new loan(s).`)
console.log('The API assigns a 14-day loan period and does not accept historical loan dates, so overdue items cannot be generated immediately through this public API contract.')
