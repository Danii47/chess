import { COLORS } from '../constants/pieces'

export default function createTimeObject(seconds, minutes) {
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