import { COLORS } from '../constants/pieces'

export default function createTimeObject({ seconds = 0, minutes = 5 }) {
  return {
    [COLORS.WHITE]: {
      seconds,
      minutes
    },
    [COLORS.BLACK]: {
      seconds,
      minutes
    }
  }
}