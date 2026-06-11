import { useState } from 'react'

export default function LiveChat() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="live-chat-toggle" onClick={() => setOpen(!open)} aria-label="Open chat">
        💬
      </button>
      {open ? (
        <div className="live-chat-panel">
          <p><strong>Need help?</strong></p>
          <p>Chat with us on WhatsApp for quick replies.</p>
          <a href="https://wa.me/923355462214?text=Hello%20Huma%20Beauty%20Saloon!" target="_blank" rel="noreferrer" className="btn-rose btn-rose-small">
            <span>Chat on WhatsApp</span>
          </a>
          <button type="button" className="live-chat-close" onClick={() => setOpen(false)}>Close</button>
        </div>
      ) : null}
    </>
  )
}
