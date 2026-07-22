import { useQuery } from "@tanstack/react-query"
import { fetchAvailableSlots } from "@/services/appointments.service"

export function useAvailableSlots(params: {
  procedureId?: string
  professionalId?: string
  date?: string
}) {
  const { procedureId, professionalId, date } = params

  return useQuery({
    queryKey: ["available-slots", procedureId, professionalId, date],
    queryFn: () =>
      fetchAvailableSlots({
        procedureId: procedureId!,
        professionalId: professionalId!,
        date: date!,
      }),
    enabled: Boolean(procedureId && professionalId && date),
  })
}
