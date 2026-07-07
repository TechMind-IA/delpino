'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, Edit, Trash2, User, Mail } from 'lucide-react'

interface AuditLogFeedProps {
  logs: any[]
  userNames?: Record<string, string>
}

const actionIcons: Record<string, React.ReactNode> = {
  create: <Plus className="h-4 w-4 text-green-600" />,
  update: <Edit className="h-4 w-4 text-blue-600" />,
  delete: <Trash2 className="h-4 w-4 text-red-600" />,
}

const actionLabels: Record<string, string> = {
  create: 'Adicionado',
  update: 'Atualizado',
  delete: 'Removido',
}

const entityLabels: Record<string, string> = {
  gallery_item: 'Item do Acervo',
  user: 'Usuário',
  category: 'Categoria',
  contact_message: 'Mensagem de Contato',
}

export function AuditLogFeed({ logs, userNames = {} }: AuditLogFeedProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-sm text-muted-foreground">Nenhum registro de mudança encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {[...logs].reverse().map((log) => (
        <div key={log.id} className="flex gap-4 rounded-lg border border-border p-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
            {log.entityType === 'contact_message'
              ? <Mail className="h-4 w-4 text-amber-600" />
              : actionIcons[log.action] || <User className="h-4 w-4" />
            }
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{actionLabels[log.action]}</span>
              <span className="text-sm text-muted-foreground">
                {entityLabels[log.entityType] || log.entityType}
                {log.entityName ? ` — "${log.entityName}"` : log.entityId ? ` #${log.entityId}` : ''}
              </span>
            </div>

            <div className="mt-1 text-sm text-muted-foreground">
              {log.userId ? (
                <>Por <span className="font-medium">{userNames[log.userId] || log.userId}</span></>
              ) : (
                <>Ação do sistema</>
              )}{' '}
              em{' '}
              {format(new Date(log.createdAt), "dd 'de' MMMM 'às' HH:mm", {
                locale: ptBR,
              })}
            </div>

            {log.changes && (
              <div className="mt-2 text-xs text-muted-foreground">
                <div className="space-y-1">
                  {Object.entries(log.changes).map(([key, value]: [string, any]) => (
                    <div key={key}>
                      <span className="font-mono">{key}:</span> {typeof value === 'string' ? value : JSON.stringify(value)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
