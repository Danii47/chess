export default function comprobateMiddlePieces(table, oldCell, newCell, movementType) {

  if (movementType === 'vertical') {
    const minY = Math.min(oldCell.y, newCell.y)
    const maxY = Math.max(oldCell.y, newCell.y)
    for (let i = minY + 1; i < maxY; i++) {
      if (table[i][oldCell.x].piece) return true
    }
  } else if (movementType === 'horizontal') {
    const minX = Math.min(oldCell.x, newCell.x)
    const maxX = Math.max(oldCell.x, newCell.x)
    for (let i = minX + 1; i < maxX; i++) {
      if (table[oldCell.y][i].piece) return true
    }
  } else if (movementType === 'diagonal') {
    const minX = Math.min(oldCell.x, newCell.x)
    const maxX = Math.max(oldCell.x, newCell.x)
    const minY = Math.min(oldCell.y, newCell.y)
    const maxY = Math.max(oldCell.y, newCell.y)

    if (oldCell.x > newCell.x && oldCell.y > newCell.y) {


      for (let i = 1; i < maxX - minX; i++) {
        if (table[minY + i][minX + i].piece) return true
      }

    }
    else if (oldCell.x > newCell.x && oldCell.y < newCell.y) {
      for (let i = 1; i < maxX - minX; i++) {
        if (table[maxY - i][minX + i].piece) return true
      }
    }

    else if (oldCell.x < newCell.x && oldCell.y < newCell.y) {
      for (let i = 1; i < maxX - minX; i++) {
        if (table[maxY - i][maxX - i].piece) return true
      }

    }
    else if (oldCell.x < newCell.x && oldCell.y > newCell.y) {
      for (let i = 1; i < maxX - minX; i++) {
        if (table[minY + i][maxX - i].piece) return true
      }
    }
  }

  return false

}