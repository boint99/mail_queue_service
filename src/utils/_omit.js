module.exports = (obj, fields = []) => {
  const result = { ...obj }
  fields.forEach(field => delete result[field])
  return result
}