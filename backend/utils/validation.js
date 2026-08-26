export const isValidString = (str) => {
  if(!str || str.trim().length === 0) {
    return false
  }
  return true
}