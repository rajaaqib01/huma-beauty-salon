const localDb = require('../lib/localDb')

async function run(){
  const booking = {
    customer_name: 'Automated Test',
    name: 'Automated Test',
    phone: '0000000000',
    email: 'auto@test.example',
    service_title: 'Test Service',
    service: 'Test Service',
    price: '0',
    date: '2026-06-10',
    time: '10:00',
    notes: 'Inserted by automated test',
    status: 'pending',
    created_at: new Date().toISOString()
  }

  const message = {
    name: 'Automated Tester',
    phone: '0000000000',
    email: 'auto-message@test.example',
    subject: 'Test Message',
    message: 'This is a test message inserted by automated script',
    created_at: new Date().toISOString(),
    status: 'new'
  }

  await localDb.insert('bookings', booking)
  await localDb.insert('messages', message)

  const bookings = await localDb.list('bookings')
  const messages = await localDb.list('messages')
  const services = await localDb.list('services')

  const total_bookings = bookings.length
  const pending = bookings.filter(b => String(b.status).toLowerCase() === 'pending').length
  const confirmed = bookings.filter(b => String(b.status).toLowerCase() === 'confirmed').length
  const cancelled = bookings.filter(b => String(b.status).toLowerCase() === 'cancelled').length
  const total_services = services.length
  const total_messages = messages.length

  console.log({ total_bookings, pending, confirmed, cancelled, total_services, total_messages })
}

run().catch(err => { console.error(err); process.exit(1) })
