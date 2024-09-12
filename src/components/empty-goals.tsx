import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import logo from '../assets/logo-keep-moving.svg'
import letsstart from '../assets/lets-start.svg'

export function EmptyGoals() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={logo} alt="keep-moving-logo" />
      <img src={letsstart} alt="lets-start-image" />
      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        Opa, você ainda não cadastrou nenhuma meta, vamos cadastrar uma agora
        mesmo?!
      </p>

      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Cadastrar Meta
        </Button>
      </DialogTrigger>
    </div>
  )
}
