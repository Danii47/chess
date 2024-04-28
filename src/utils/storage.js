export const saveGameToStorage = (table, turn) => {
  window.localStorage.setItem('table', JSON.stringify(table))
  window.localStorage.setItem('turn', turn)
}

export const resetGameStorage = () => {
  window.localStorage.removeItem('table')
  window.localStorage.removeItem('turn')
}

export const updateTimeInStorage = (time) => {
  window.localStorage.setItem('time', JSON.stringify(time))
}