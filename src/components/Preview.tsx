import React, { useState, useCallback, useMemo } from 'react'
import { cn } from '@/lib/theme'
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  Tag,
  Info,
  AlertCircle,
  Loader2,
  Link,
  FileJson,
  Code,
  Server,
  Shield,
  BookOpen,
  Braces,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'
import { Button } from './ui/Button'
import { Tooltip } from './ui/Tooltip'
import { useToast } from '@/lib/toast-context'
import { EmptyState } from './ui/EmptyState'

interface PreviewProps {
  spec?: any
  error?: string | null
  onClose?: () => void
}

interface EndpointProps {
  method: string
  path: string
  operation: any
  onNavigate?: () => void
}

const methodColors: Record<string, { bg: string, text: string, border: string }> = {
  get: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/20',
  },
  post: {
    bg: 'bg-green-500/10 dark:bg-green-500/20',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-500/20',
  },
  put: {
    bg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-500/20',
  },
  delete: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-500/20',
  },
  patch: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/20',
  },
  options: {
    bg: 'bg-gray-500/10 dark:bg-gray-500/20',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-500/20',
  },
}

function Endpoint({ method, path, operation }: EndpointProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(path)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Path copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy path')
    }
  }, [path, toast])

  const colors = methodColors[method.toLowerCase()] || methodColors.options

  const badges = useMemo(() => {
    const result = []
    if (operation.deprecated) {
      result.push({
        label: 'Deprecated',
        className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      })
    }
    if (operation.security?.length) {
      result.push({
        label: 'Secured',
        className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
      })
    }
    return result
  }, [operation])

  return (
    <div className={cn(
      'group overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-200',
      'dark:bg-gray-800/50 dark:border-gray-700',
      isExpanded && 'ring-1 ring-blue-500/20'
    )}>
      <div
        className={cn(
          'flex flex-wrap items-center gap-3 p-4 cursor-pointer',
          'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={cn(
          'px-2 py-1 rounded-md border text-xs font-medium uppercase',
          colors.bg,
          colors.text,
          colors.border
        )}>
          {method}
        </div>
        <div className="flex-1 min-w-0 font-mono text-sm">
          <div className="truncate">
            {path}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {badges.map((badge, index) => (
            <span
              key={index}
              className={cn(
                'px-1.5 py-0.5 rounded-md text-xs font-medium border whitespace-nowrap',
                badge.className
              )}
            >
              {badge.label}
            </span>
          ))}
          <Tooltip content={copied ? 'Copied!' : 'Copy path'}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </Tooltip>
          <ChevronDown className={cn(
            'h-4 w-4 transition-transform duration-200',
            isExpanded && 'rotate-180'
          )} />
        </div>
      </div>

      <div className={cn(
        'grid transition-all duration-200',
        isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      )}>
        <div className="overflow-hidden">
          <div className="p-4 space-y-6 border-t">
            {/* Summary and Description */}
            <div className="space-y-4">
              {operation.summary && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    Summary
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                    {operation.summary}
                  </p>
                </div>
              )}
              {operation.description && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    Description
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
                    {operation.description}
                  </p>
                </div>
              )}
            </div>

            {/* Parameters */}
            {operation.parameters?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Code className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  Parameters
                </h3>
                <div className="space-y-2">
                  {operation.parameters.map((param: any, index: number) => (
                    <div
                      key={index}
                      className={cn(
                        'rounded-lg border p-3 transition-colors',
                        'bg-gray-50 dark:bg-gray-800/50',
                        'hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-sm break-all">
                          {param.name}
                        </span>
                        <span className={cn(
                          'px-1.5 py-0.5 rounded-md text-xs font-medium border whitespace-nowrap',
                          param.required
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                            : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
                        )}>
                          {param.required ? 'required' : 'optional'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-gray-500/10 text-xs text-gray-600 dark:text-gray-400 border border-gray-500/20 whitespace-nowrap">
                          {param.in}
                        </span>
                        {param.type && (
                          <span className="px-1.5 py-0.5 rounded-md bg-purple-500/10 text-xs text-purple-600 dark:text-purple-400 font-mono border border-purple-500/20 whitespace-nowrap">
                            {param.type}
                          </span>
                        )}
                      </div>
                      {param.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                          {param.description}
                        </p>
                      )}
                      {param.schema?.enum && (
                        <div className="mt-2">
                          <div className="text-xs font-medium text-gray-500 mb-1">Allowed values:</div>
                          <div className="flex flex-wrap gap-1">
                            {param.schema.enum.map((value: string, i: number) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded-md bg-gray-100 text-xs font-mono text-gray-600 dark:bg-gray-800 dark:text-gray-400 break-all"
                              >
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body */}
            {operation.requestBody && (
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Braces className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  Request Body
                </h3>
                <div className="space-y-2">
                  {Object.entries(operation.requestBody.content || {}).map(([mediaType, content]: [string, any]) => (
                    <div
                      key={mediaType}
                      className="rounded-lg border p-3 bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-sm break-all">
                          {mediaType}
                        </span>
                        {operation.requestBody.required && (
                          <span className="px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-xs border border-red-500/20 whitespace-nowrap">
                            required
                          </span>
                        )}
                      </div>
                      {content.schema && (
                        <div className="relative mt-2">
                          <pre className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-mono overflow-x-auto">
                            <code className="break-words whitespace-pre-wrap">
                              {JSON.stringify(content.schema, null, 2)}
                            </code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {operation.security && operation.security.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  Security
                </h3>
                <div className="space-y-2">
                  {operation.security.map((security: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-lg border p-3 bg-gray-50 dark:bg-gray-800/50"
                    >
                      {Object.entries(security).map(([scheme, scopes]: [string, any]) => (
                        <div key={scheme} className="space-y-2">
                          <div className="font-medium text-sm break-words">
                            {scheme}
                          </div>
                          {scopes.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {scopes.map((scope: string) => (
                                <span
                                  key={scope}
                                  className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs border border-blue-500/20 break-all"
                                >
                                  {scope}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Preview({ spec, error, onClose }: PreviewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const paths = spec?.paths || {}
  const tags = useMemo(() => 
    Array.from(new Set(
      Object.values(paths).flatMap((path: any) =>
        Object.values(path).flatMap((operation: any) => operation.tags || [])
      )
    )).sort()
  , [paths])

  const filteredPaths = useMemo(() => 
    Object.entries(paths).filter(([path, methods]: [string, any]) => {
      const matchesSearch = searchQuery === '' || 
        path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.values(methods).some((operation: any) => 
          operation.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          operation.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      const matchesTags = selectedTags.length === 0 || 
        Object.values(methods).some((operation: any) => 
          operation.tags?.some((tag: string) => selectedTags.includes(tag))
        )
      return matchesSearch && matchesTags
    })
  , [paths, searchQuery, selectedTags])

  if (error) {
    return (
      <div className="flex h-full flex-col bg-[#1e1e1e]">
        <div className="flex items-center justify-between p-4 bg-red-500/10">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error Parsing Specification</span>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex-1 overflow-auto p-4">
          <pre className="whitespace-pre-wrap text-sm text-red-400 font-mono break-words">
            {error}
          </pre>
        </div>
      </div>
    )
  }

  if (!spec) {
    return (
      <div className="flex h-full items-center justify-center bg-[#1e1e1e]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e] text-gray-300">
      {/* Header */}
      <div className="border-b border-[#2d2d2d] bg-[#1e1e1e]">
        <div className="p-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h2 className="text-base font-medium truncate text-gray-200">
                {spec.info?.title || 'API Documentation'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="whitespace-nowrap">v{spec.info?.version || '1.0.0'}</span>
                {spec.info?.description && (
                  <span className="truncate">{spec.info.description}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Server Selection */}
        {spec.servers?.length > 0 && (
          <div className="px-4 pb-2">
            <button className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded text-sm bg-[#252526] hover:bg-[#2d2d2d] text-left">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-gray-400" />
                <span className="font-mono text-sm truncate">
                  {spec.servers[0].url}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pb-1">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:bg-[#2d2d2d] rounded">
            <AlertTriangle className="h-4 w-4" />
            Validation
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#2d2d2d] text-gray-300 rounded">
            <Code className="h-4 w-4" />
            Endpoints
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:bg-[#2d2d2d] rounded">
            <FileJson className="h-4 w-4" />
            Schemas
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Categories */}
        <div className="p-4">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            OTHER
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#2d2d2d] text-xs">
              1
            </span>
          </div>

          <div className="space-y-1">
            {filteredPaths.map(([path, methods]) =>
              Object.entries(methods).map(([method, operation]) => (
                <div
                  key={`${method}-${path}`}
                  className="flex items-start gap-3 p-2 rounded hover:bg-[#2d2d2d] cursor-pointer group"
                >
                  <div className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium uppercase',
                    method.toLowerCase() === 'get' && 'bg-blue-500/10 text-blue-400',
                    method.toLowerCase() === 'post' && 'bg-green-500/10 text-green-400',
                    method.toLowerCase() === 'put' && 'bg-yellow-500/10 text-yellow-400',
                    method.toLowerCase() === 'delete' && 'bg-red-500/10 text-red-400',
                    method.toLowerCase() === 'patch' && 'bg-purple-500/10 text-purple-400',
                  )}>
                    {method}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm truncate text-gray-300">
                      {path}
                    </div>
                    {operation.summary && (
                      <div className="text-xs text-gray-500 truncate">
                        {operation.summary}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview; 