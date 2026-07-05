"use client"

import { useState, type FormEvent } from "react"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Sem backend: apenas feedback visual.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <h2 className="font-serif text-2xl text-foreground">
          Mensagem enviada
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Obrigado pelo seu contato. Retornaremos assim que possível.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Enviar outra mensagem
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40 focus:ring-2 focus:ring-ring/20"
          placeholder="Seu nome"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40 focus:ring-2 focus:ring-ring/20"
          placeholder="seu@email.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40 focus:ring-2 focus:ring-ring/20"
          placeholder="Como podemos ajudar?"
        />
      </div>

      <button
        type="submit"
        className="h-11 w-full rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:w-auto"
      >
        Enviar
      </button>
    </form>
  )
}
