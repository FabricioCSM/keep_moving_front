import { X } from 'lucide-react'
import { Button } from './ui/button'
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from './ui/radio-group'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGoal } from '../http/create-goal'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

const createGoalSchema = z.object({
  title: z.string().min(1, 'Specify the activity you wish to practice'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
})

type CreateGoalSchema = z.infer<typeof createGoalSchema>

export function CreateGoal() {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateGoalSchema>({
    resolver: zodResolver(createGoalSchema),
  })

  async function handleCreateGoal({
    title,
    desiredWeeklyFrequency,
  }: CreateGoalSchema) {
    try {
      await createGoal({
        title,
        desiredWeeklyFrequency,
      })

      reset()

      queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })

      toast.success('Goal created with success!')
    } catch {
      toast.error('Error creating the goal, please try again!')
    }
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Set goal</DialogTitle>

            <DialogClose>
              <X className="size-5 text-zinc-600" />
            </DialogClose>
          </div>

          <DialogDescription>
            Add activities that make you feel good and that you want to keep
            doing every week.
          </DialogDescription>
        </div>

        <form
          onSubmit={handleSubmit(handleCreateGoal)}
          className="flex-1 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Activity</Label>

              <Input
                id="title"
                autoFocus
                placeholder="Exercise, meditate, etc..."
                {...register('title')}
              />

              {errors.title && (
                <p className="text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="desiredWeeklyFrequency">
                How many times per week?
              </Label>

              <Controller
                control={control}
                name="desiredWeeklyFrequency"
                defaultValue={5}
                render={({ field }) => {
                  return (
                    <RadioGroup
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      {Array.from({ length: 7 }).map((_, index) => {
                        const frequency = String(index + 1)

                        return (
                          <RadioGroupItem key={index} value={frequency}>
                            <RadioGroupIndicator />
                            <span className="text-zinc-300 text-sm font-medium leading-none">
                              {frequency} times per week
                            </span>
                            <span className="text-lg leading-none">🥱</span>
                          </RadioGroupItem>
                        )
                      })}
                    </RadioGroup>
                  )
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-auto">
            <DialogClose asChild>
              <Button variant="secondary" className="flex-1">
                Close
              </Button>
            </DialogClose>

            <Button type="submit" className="flex-1">
              Save
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
