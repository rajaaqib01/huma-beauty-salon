(async () => {
  const path = require('path')
  const { signAdminSession } = require('../lib/adminSession')
  const adminStatsModule = await import(path.resolve(__dirname, '../pages/api/admin/stats.js'))
  const handler = adminStatsModule.default

  const token = signAdminSession({ user: 'tester' })
  const req = {
    method: 'GET',
    headers: {
      cookie: `admin_session=${encodeURIComponent(token)}`
    }
  }

  const res = {
    statusCode: 200,
    headers: {},
    _body: null,
    status(code){ this.statusCode = code; return this },
    setHeader(k,v){ this.headers[k]=v },
    json(obj){ this._body = obj; console.log('API response:', JSON.stringify(obj, null, 2)); return obj },
    end(){ return }
  }

  try{
    await handler(req, res)
  }catch(err){ console.error('Handler error:', err) }
})()
